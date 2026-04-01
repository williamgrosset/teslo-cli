import { describe, expect, test } from 'bun:test'

import { runDuel, runFreeForAll, runTeamDuel, runTeamFreeForAll } from '../src/index.js'

describe('runDuel', () => {
  test('calculates duel results', () => {
    expect(
      runDuel({
        players: [
          { id: '1', elo: 1000 },
          { id: '2', elo: 900 }
        ],
        winner: '1'
      })
    ).toEqual([
      { id: '1', elo: 1012 },
      { id: '2', elo: 888 }
    ])
  })
})

describe('runFreeForAll', () => {
  test('calculates free-for-all results', () => {
    expect(
      runFreeForAll({
        players: [
          { id: '1', elo: 1000 },
          { id: '2', elo: 950 },
          { id: '3', elo: 900 }
        ],
        ranking: ['1', '2', '3']
      })
    ).toEqual([
      { id: '1', elo: 1013 },
      { id: '2', elo: 950 },
      { id: '3', elo: 887 }
    ])
  })
})

describe('runTeamDuel', () => {
  test('calculates team duel results', () => {
    expect(
      runTeamDuel({
        teams: [
          {
            id: 'red',
            players: [
              { id: 'r1', elo: 1000 },
              { id: 'r2', elo: 950 }
            ]
          },
          {
            id: 'blue',
            players: [
              { id: 'b1', elo: 980 },
              { id: 'b2', elo: 970 }
            ]
          }
        ],
        winner: 'red'
      })
    ).toEqual([
      {
        id: 'red',
        players: [
          { id: 'r1', elo: 1015 },
          { id: 'r2', elo: 967 }
        ]
      },
      {
        id: 'blue',
        players: [
          { id: 'b1', elo: 964 },
          { id: 'b2', elo: 954 }
        ]
      }
    ])
  })
})

describe('runTeamFreeForAll', () => {
  test('calculates team free-for-all results', () => {
    expect(
      runTeamFreeForAll({
        teams: [
          {
            id: 'red',
            players: [{ id: 'r1', elo: 1000 }]
          },
          {
            id: 'blue',
            players: [{ id: 'b1', elo: 980 }]
          },
          {
            id: 'green',
            players: [{ id: 'g1', elo: 960 }]
          }
        ],
        ranking: ['red', 'blue', 'green']
      })
    ).toEqual([
      {
        id: 'red',
        players: [{ id: 'r1', elo: 1014 }]
      },
      {
        id: 'blue',
        players: [{ id: 'b1', elo: 980 }]
      },
      {
        id: 'green',
        players: [{ id: 'g1', elo: 945 }]
      }
    ])
  })
})

describe('validation', () => {
  test('throws on invalid payload shape', () => {
    expect(() =>
      runDuel({
        players: [{ id: '1', elo: '1000' }],
        winner: '1'
      })
    ).toThrow('players[0].elo must be a number')
  })
})
