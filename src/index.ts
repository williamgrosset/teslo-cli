export { runDuel } from './commands/duel.js'
export { runFreeForAll } from './commands/free-for-all.js'
export { runTeamDuel } from './commands/team-duel.js'
export { runTeamFreeForAll } from './commands/team-free-for-all.js'

export type {
  DuelPayload,
  FreeForAllPayload,
  TeamDuelPayload,
  TeamFreeForAllPayload,
  PlayerInput,
  TeamInput
} from './lib/schemas.js'
