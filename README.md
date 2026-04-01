# teslo-cli

JSON-first CLI wrapper for [`teslo`](https://www.npmjs.com/package/teslo).

It is designed to be easy to use from a terminal, scripts, and AI agents:
- one command per match type
- JSON in, JSON out
- stable machine-readable errors
- minimal runtime dependencies

## Install

```bash
npm install -g teslo-cli
```

Run without installing globally:

```bash
npx teslo-cli duel --input '{"players":[{"id":"1","elo":1000},{"id":"2","elo":900}],"winner":"1"}'
```

## Quickstart

### Duel

```bash
teslo duel --input '{"players":[{"id":"1","elo":1000},{"id":"2","elo":900}],"winner":"1"}'
```

### Free-for-All

```bash
teslo free-for-all --input '{"players":[{"id":"1","elo":1000},{"id":"2","elo":950},{"id":"3","elo":900}],"ranking":["1","2","3"]}'
```

### Team Duel

```bash
teslo team-duel --input '{"teams":[{"id":"red","players":[{"id":"r1","elo":1000},{"id":"r2","elo":950}]},{"id":"blue","players":[{"id":"b1","elo":980},{"id":"b2","elo":970}]}],"winner":"red"}'
```

### Team Free-for-All

```bash
teslo team-free-for-all --input '{"teams":[{"id":"red","players":[{"id":"r1","elo":1000}]},{"id":"blue","players":[{"id":"b1","elo":980}]},{"id":"green","players":[{"id":"g1","elo":960}]}],"ranking":["red","blue","green"]}'
```

## Input Modes

`teslo-cli` accepts exactly one input source:
- `--input <json>`
- `--file <path>`
- stdin

### File input

```bash
teslo duel --file ./match.json
```

### Stdin input

```bash
echo '{"players":[{"id":"1","elo":1000},{"id":"2","elo":900}],"winner":"1"}' | teslo duel
```

## Commands

### `teslo duel`

Payload:

```json
{
  "players": [
    { "id": "1", "elo": 1000 },
    { "id": "2", "elo": 900 }
  ],
  "winner": "1",
  "kFactor": 32
}
```

### `teslo free-for-all`

Payload:

```json
{
  "players": [
    { "id": "1", "elo": 1000 },
    { "id": "2", "elo": 950 },
    { "id": "3", "elo": 900 }
  ],
  "ranking": ["1", "2", "3"],
  "kFactor": 32,
  "minPlayers": 2,
  "maxPlayers": 256
}
```

### `teslo team-duel`

Payload:

```json
{
  "teams": [
    {
      "id": "red",
      "players": [
        { "id": "r1", "elo": 1000 },
        { "id": "r2", "elo": 950 }
      ]
    },
    {
      "id": "blue",
      "players": [
        { "id": "b1", "elo": 980 },
        { "id": "b2", "elo": 970 }
      ]
    }
  ],
  "winner": "red",
  "kFactor": 32
}
```

### `teslo team-free-for-all`

Payload:

```json
{
  "teams": [
    { "id": "red", "players": [{ "id": "r1", "elo": 1000 }] },
    { "id": "blue", "players": [{ "id": "b1", "elo": 980 }] },
    { "id": "green", "players": [{ "id": "g1", "elo": 960 }] }
  ],
  "ranking": ["red", "blue", "green"],
  "kFactor": 32,
  "minTeams": 2,
  "maxTeams": 256
}
```

## Output

Default output is pretty-printed JSON.

```bash
teslo duel --input '{"players":[{"id":"1","elo":1000},{"id":"2","elo":900}],"winner":"1"}'
```

```json
[
  {
    "id": "1",
    "elo": 1012
  },
  {
    "id": "2",
    "elo": 888
  }
]
```

Compact JSON:

```bash
teslo duel --format json --input '{"players":[{"id":"1","elo":1000},{"id":"2","elo":900}],"winner":"1"}'
```

## Errors

Errors are emitted as JSON to stderr.

```json
{
  "error": {
    "name": "MATCH_ERROR",
    "message": "Player not found"
  }
}
```

## AI Agent Usage

The simplest integration pattern is stdin plus JSON output:

```bash
echo '{"players":[{"id":"1","elo":1000},{"id":"2","elo":900}],"winner":"1"}' | teslo duel --format json
```

That makes the CLI easy to call from automation without parsing human-oriented text.

## Development

This project uses Bun for local development.

```bash
bun install
bun run build
bun test
```

Watch mode:

```bash
bun run dev --help
```

## Programmatic API

`teslo-cli` also exports thin programmatic wrappers:
- `runDuel`
- `runFreeForAll`
- `runTeamDuel`
- `runTeamFreeForAll`

## License

MIT
