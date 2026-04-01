import { stderr, stdout } from 'node:process'

import { normalizeError } from './errors.js'

export type OutputFormat = 'json' | 'pretty'

export function writeResult(result: unknown, format: OutputFormat): void {
  const space = format === 'pretty' ? 2 : 0
  stdout.write(`${JSON.stringify(result, null, space)}\n`)
}

export function writeError(error: unknown, format: OutputFormat): void {
  const payload = {
    error: normalizeError(error)
  }

  const space = format === 'pretty' ? 2 : 0
  stderr.write(`${JSON.stringify(payload, null, space)}\n`)
}
