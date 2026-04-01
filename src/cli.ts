#!/usr/bin/env node

import { cac } from 'cac'

import { runDuel } from './commands/duel.js'
import { runFreeForAll } from './commands/free-for-all.js'
import { runTeamDuel } from './commands/team-duel.js'
import { runTeamFreeForAll } from './commands/team-free-for-all.js'
import { loadJsonInput, type InputOptions } from './lib/input.js'
import { writeError, writeResult, type OutputFormat } from './lib/output.js'

const cli = cac('teslo')

const sharedOptions = (command: ReturnType<typeof cli.command>) => {
  return command
    .option('--input <json>', 'Inline JSON payload')
    .option('--file <path>', 'Read JSON payload from file')
    .option('--format <format>', 'Output format: pretty or json', {
      default: 'pretty'
    })
}

sharedOptions(cli.command('duel', 'Calculate a duel result')).action(options => executeCommand(options, runDuel))

sharedOptions(cli.command('free-for-all', 'Calculate a free-for-all result')).action(options =>
  executeCommand(options, runFreeForAll)
)

sharedOptions(cli.command('team-duel', 'Calculate a team duel result')).action(options =>
  executeCommand(options, runTeamDuel)
)

sharedOptions(cli.command('team-free-for-all', 'Calculate a team free-for-all result')).action(options =>
  executeCommand(options, runTeamFreeForAll)
)

cli.help()
cli.version('0.1.0')

try {
  cli.parse()
} catch (error) {
  writeError(error, 'pretty')
  process.exit(1)
}

async function executeCommand(
  options: InputOptions & { format?: string },
  handler: (value: unknown) => unknown
): Promise<void> {
  try {
    const format = normalizeFormat(options.format)
    const input = await loadJsonInput(options)
    const result = handler(input)
    writeResult(result, format)
  } catch (error) {
    writeError(error, 'pretty')
    process.exit(1)
  }
}

function normalizeFormat(value?: string): OutputFormat {
  if (value === undefined || value === 'pretty') {
    return 'pretty'
  }

  if (value === 'json') {
    return 'json'
  }

  throw new Error('format must be one of: pretty, json')
}
