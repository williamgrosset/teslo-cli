import { FreeForAll, Player } from 'teslo'

import { parseFreeForAllPayload, type FreeForAllPayload } from '../lib/schemas.js'

export function runFreeForAll(value: unknown) {
  const payload = parseFreeForAllPayload(value)
  const match = new FreeForAll(createPlayers(payload.players), {
    kFactor: payload.kFactor,
    minPlayers: payload.minPlayers,
    maxPlayers: payload.maxPlayers
  })

  return match.calculate(payload.ranking)
}

function createPlayers(players: FreeForAllPayload['players']) {
  return players.map(player => new Player(player.id, player.elo))
}
