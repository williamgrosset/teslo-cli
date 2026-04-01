import { Player, Team, TeamFreeForAll } from 'teslo'

import { parseTeamFreeForAllPayload, type TeamFreeForAllPayload } from '../lib/schemas.js'

export function runTeamFreeForAll(value: unknown) {
  const payload = parseTeamFreeForAllPayload(value)
  const match = new TeamFreeForAll(createTeams(payload.teams), {
    kFactor: payload.kFactor,
    minTeams: payload.minTeams,
    maxTeams: payload.maxTeams
  })

  return match.calculate(payload.ranking)
}

function createTeams(teams: TeamFreeForAllPayload['teams']) {
  return teams.map(team => new Team(team.id, team.players.map(player => new Player(player.id, player.elo))))
}
