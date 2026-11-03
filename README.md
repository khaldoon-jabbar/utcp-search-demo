# UTCP search demo

A small public [Next.js](https://nextjs.org/) app that exposes a mock vacation search and a [UTCP](https://utcp.io/) manual so an agent can discover the tool and call it directly.

There is no authentication. Every route is public.

## Endpoints

### `GET /llms.txt`

Plain-text guide for agents. It points them at the UTCP manual and the search example. It does not describe an MCP server.

```bash
curl -s "$ORIGIN/llms.txt"
```

### `GET /utcp`

Returns a UTCP manual (`Content-Type: application/json`) with one tool, `search_listings`.

The tool call template is an HTTP GET. Its `url` is built from the incoming request host:

`https://` + `Host` + `/api/search`

`body_field` is `null`, so `query`, `adults`, `children`, and `destination` are query-string parameters.

```bash
curl -s "$ORIGIN/utcp"
```

### `GET /api/search?query=...&destination=...&adults=2&children=1`

Returns mock travel listings as JSON. The catalog has 10 hard-coded places. Filters are optional:

| Param | Type | Behavior |
| --- | --- | --- |
| `query` | string | Substring match on title, summary, place, and tags |
| `destination` | string | Substring match on destination or country |
| `adults` | number | Non-negative integer. With `children`, drops listings smaller than the party |
| `children` | number | Non-negative integer |

```bash
curl -s "$ORIGIN/api/search?query=beach&destination=Greece&adults=2&children=1"
```

`$ORIGIN` is the site origin, for example `http://localhost:3000` or your Vercel URL.

## Local

```bash
npm install
npm run dev
```

Typecheck and production build:

```bash
npm run typecheck
npm run build
```
