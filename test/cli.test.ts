import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

import { describe, expect, test } from 'bun:test'

const testDir = dirname(fileURLToPath(import.meta.url))
const repoRoot = resolve(testDir, '..')
const cliPath = join(repoRoot, 'src/cli.ts')

describe('cli integration', () => {
  test('accepts inline JSON input', () => {
    const result = runCli([
      'duel',
      '--input',
      '{"players":[{"id":"1","elo":1000},{"id":"2","elo":900}],"winner":"1"}'
    ])

    expect(result.status).toBe(0)
    expect(JSON.parse(result.stdout)).toEqual([
      { id: '1', elo: 1012 },
      { id: '2', elo: 888 }
    ])
    expect(result.stderr).toBe('')
  })

  test('accepts file JSON input', async () => {
    const dir = await mkdtemp(join(tmpdir(), 'teslo-cli-'))
    const file = join(dir, 'payload.json')

    try {
      await writeFile(file, '{"players":[{"id":"1","elo":1000},{"id":"2","elo":900}],"winner":"1"}')

      const result = runCli(['duel', '--file', file])

      expect(result.status).toBe(0)
      expect(JSON.parse(result.stdout)).toEqual([
        { id: '1', elo: 1012 },
        { id: '2', elo: 888 }
      ])
    } finally {
      await rm(dir, { recursive: true, force: true })
    }
  })

  test('accepts piped stdin input', () => {
    const result = runCli(['duel'], '{"players":[{"id":"1","elo":1000},{"id":"2","elo":900}],"winner":"1"}')

    expect(result.status).toBe(0)
    expect(JSON.parse(result.stdout)).toEqual([
      { id: '1', elo: 1012 },
      { id: '2', elo: 888 }
    ])
  })

  test('supports json output format', () => {
    const result = runCli([
      'duel',
      '--format',
      'json',
      '--input',
      '{"players":[{"id":"1","elo":1000},{"id":"2","elo":900}],"winner":"1"}'
    ])

    expect(result.status).toBe(0)
    expect(result.stdout).toBe('[{"id":"1","elo":1012},{"id":"2","elo":888}]\n')
  })

  test('fails when input sources conflict', () => {
    const result = runCli([
      'duel',
      '--input',
      '{"players":[{"id":"1","elo":1000},{"id":"2","elo":900}],"winner":"1"}',
      '--file',
      'payload.json'
    ])

    expect(result.status).toBe(1)
    expect(JSON.parse(result.stderr)).toEqual({
      error: {
        name: 'CLI_ERROR',
        message: 'Provide only one input source: --input, --file, or stdin'
      }
    })
  })

  test('fails when JSON is invalid', () => {
    const result = runCli(['duel', '--input', '{'])

    expect(result.status).toBe(1)
    expect(JSON.parse(result.stderr)).toEqual({
      error: {
        name: 'CLI_ERROR',
        message: 'Invalid JSON from --input'
      }
    })
  })

  test('fails when input is missing', () => {
    const result = runCli(['duel'])

    expect(result.status).toBe(1)
    expect(JSON.parse(result.stderr)).toEqual({
      error: {
        name: 'CLI_ERROR',
        message: 'Missing input. Use --input, --file, or pipe JSON via stdin'
      }
    })
  })
})

function runCli(args: string[], input?: string) {
  return spawnSync(process.execPath, [cliPath, ...args], {
    cwd: repoRoot,
    encoding: 'utf8',
    input
  })
}
