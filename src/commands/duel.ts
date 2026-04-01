import { Duel, Player } from 'teslo'

import { parseDuelPayload, type DuelPayload } from '../lib/schemas.js'

export function runDuel(value: unknown) {
  const payload = parseDuelPayload(value)
  const match = new Duel(createPlayers(payload.players), withOptionalKFactor(payload))

  return match.calculate(payload.winner)
}

function createPlayers(players: DuelPayload['players']) {
  return players.map(player => new Player(player.id, player.elo))
}

function withOptionalKFactor(payload: DuelPayload) {
  return payload.kFactor === undefined ? undefined : { kFactor: payload.kFactor }
}
