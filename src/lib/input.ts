import { readFile } from 'node:fs/promises'
import { stdin } from 'node:process'

import { CliError } from './errors.js'

export interface InputOptions {
  input?: string
  file?: string
}

export async function loadJsonInput<T>(options: InputOptions): Promise<T> {
  if (options.input && options.file) {
    throw new CliError('Provide only one input source: --input, --file, or stdin')
  }

  if (options.input) {
    return parseJson<T>(options.input, '--input')
  }

  if (options.file) {
    const content = await readFile(options.file, 'utf8')
    return parseJson<T>(content, options.file)
  }

  if (hasPipedInput()) {
    const content = await readStdin()

    if (content.trim().length === 0) {
      throw new CliError('Missing input. Use --input, --file, or pipe JSON via stdin')
    }

    return parseJson<T>(content, 'stdin')
  }

  throw new CliError('Missing input. Use --input, --file, or pipe JSON via stdin')
}

function hasPipedInput(): boolean {
  return !stdin.isTTY
}

async function readStdin(): Promise<string> {
  const chunks: string[] = []

  for await (const chunk of stdin) {
    chunks.push(String(chunk))
  }

  return chunks.join('')
}

function parseJson<T>(value: string, source: string): T {
  try {
    return JSON.parse(value) as T
  } catch {
    throw new CliError(`Invalid JSON from ${source}`)
  }
}
