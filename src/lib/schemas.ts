import { CliError } from './errors.js'

export interface PlayerInput {
  id: string
  elo: number
}

export interface TeamInput {
  id: string
  players: PlayerInput[]
}

export interface DuelPayload {
  players: PlayerInput[]
  winner: string
  kFactor?: number
}

export interface FreeForAllPayload {
  players: PlayerInput[]
  ranking: string[]
  kFactor?: number
  minPlayers?: number
  maxPlayers?: number
}

export interface TeamDuelPayload {
  teams: TeamInput[]
  winner: string
  kFactor?: number
}

export interface TeamFreeForAllPayload {
  teams: TeamInput[]
  ranking: string[]
  kFactor?: number
  minTeams?: number
  maxTeams?: number
}

export function parseDuelPayload(value: unknown): DuelPayload {
  const payload = expectRecord(value, 'Duel payload must be an object')

  return {
    players: parsePlayers(payload.players, 'players'),
    winner: expectString(payload.winner, 'winner must be a string'),
    kFactor: optionalNumber(payload.kFactor, 'kFactor must be a number')
  }
}

export function parseFreeForAllPayload(value: unknown): FreeForAllPayload {
  const payload = expectRecord(value, 'Free-for-all payload must be an object')

  return {
    players: parsePlayers(payload.players, 'players'),
    ranking: parseStringArray(payload.ranking, 'ranking'),
    kFactor: optionalNumber(payload.kFactor, 'kFactor must be a number'),
    minPlayers: optionalNumber(payload.minPlayers, 'minPlayers must be a number'),
    maxPlayers: optionalNumber(payload.maxPlayers, 'maxPlayers must be a number')
  }
}

export function parseTeamDuelPayload(value: unknown): TeamDuelPayload {
  const payload = expectRecord(value, 'Team duel payload must be an object')

  return {
    teams: parseTeams(payload.teams, 'teams'),
    winner: expectString(payload.winner, 'winner must be a string'),
    kFactor: optionalNumber(payload.kFactor, 'kFactor must be a number')
  }
}

export function parseTeamFreeForAllPayload(value: unknown): TeamFreeForAllPayload {
  const payload = expectRecord(value, 'Team free-for-all payload must be an object')

  return {
    teams: parseTeams(payload.teams, 'teams'),
    ranking: parseStringArray(payload.ranking, 'ranking'),
    kFactor: optionalNumber(payload.kFactor, 'kFactor must be a number'),
    minTeams: optionalNumber(payload.minTeams, 'minTeams must be a number'),
    maxTeams: optionalNumber(payload.maxTeams, 'maxTeams must be a number')
  }
}

function parsePlayers(value: unknown, fieldName: string): PlayerInput[] {
  if (!Array.isArray(value)) {
    throw new CliError(`${fieldName} must be an array`)
  }

  return value.map((player, index) => {
    const record = expectRecord(player, `${fieldName}[${index}] must be an object`)

    return {
      id: expectString(record.id, `${fieldName}[${index}].id must be a string`),
      elo: expectNumber(record.elo, `${fieldName}[${index}].elo must be a number`)
    }
  })
}

function parseTeams(value: unknown, fieldName: string): TeamInput[] {
  if (!Array.isArray(value)) {
    throw new CliError(`${fieldName} must be an array`)
  }

  return value.map((team, index) => {
    const record = expectRecord(team, `${fieldName}[${index}] must be an object`)

    return {
      id: expectString(record.id, `${fieldName}[${index}].id must be a string`),
      players: parsePlayers(record.players, `${fieldName}[${index}].players`)
    }
  })
}

function parseStringArray(value: unknown, fieldName: string): string[] {
  if (!Array.isArray(value)) {
    throw new CliError(`${fieldName} must be an array`)
  }

  return value.map((item, index) => expectString(item, `${fieldName}[${index}] must be a string`))
}

function expectRecord(value: unknown, message: string): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new CliError(message)
  }

  return value as Record<string, unknown>
}

function expectString(value: unknown, message: string): string {
  if (typeof value !== 'string' || value.length === 0) {
    throw new CliError(message)
  }

  return value
}

function expectNumber(value: unknown, message: string): number {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    throw new CliError(message)
  }

  return value
}

function optionalNumber(value: unknown, message: string): number | undefined {
  if (value === undefined) {
    return undefined
  }

  return expectNumber(value, message)
}
