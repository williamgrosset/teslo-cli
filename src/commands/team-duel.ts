import { Player, Team, TeamDuel } from 'teslo'

import { parseTeamDuelPayload, type TeamDuelPayload } from '../lib/schemas.js'

export function runTeamDuel(value: unknown) {
  const payload = parseTeamDuelPayload(value)
  const match = new TeamDuel(createTeams(payload.teams), withOptionalKFactor(payload))

  return match.calculate(payload.winner)
}

function createTeams(teams: TeamDuelPayload['teams']) {
  return teams.map(team => new Team(team.id, team.players.map(player => new Player(player.id, player.elo))))
}

function withOptionalKFactor(payload: TeamDuelPayload) {
  return payload.kFactor === undefined ? undefined : { kFactor: payload.kFactor }
}
