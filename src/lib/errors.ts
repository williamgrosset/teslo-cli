export class CliError extends Error {
  readonly exitCode: number

  constructor(message: string, exitCode = 1) {
    super(message)
    this.name = 'CLI_ERROR'
    this.exitCode = exitCode
  }
}

export function normalizeError(error: unknown): { name: string; message: string } {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message
    }
  }

  return {
    name: 'UNKNOWN_ERROR',
    message: 'An unknown error occurred'
  }
}
