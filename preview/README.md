# Profile preview

Local preview of the profile `README.md`, with live reload. Edit `README.md` or anything in `assets/` and the open page refreshes by itself.

## Run with Bun

```bash
bun install
bun run dev
```

Open http://localhost:3030. Use the button in the top-right corner to switch between GitHub dark and light mode.

## Run with Docker

```bash
docker compose up --build
```

The repo is mounted into the container, so edits on your machine still trigger a reload.

## Regenerating assets

Everything the README shows, except the streak card, lives in `assets/imgs/`:

| Script | Writes |
|---|---|
| `bun preview/fetch-icons.ts` | `assets/imgs/icons/*.svg` from skill-icons (MIT, licence in that folder) |
| `bun preview/generate-badges.ts` | `assets/imgs/badges/*.svg`: LinkedIn button, certification badges, tech pills |
| `bun preview/generate-code-rain.ts` | `assets/imgs/code-rain.svg` |

The terminal header (`assets/imgs/terminal-header.svg`) is hand-written; edit it directly.

## How it differs from GitHub

- Markdown is rendered locally with `marked` (GFM, no soft line breaks), which matches how GitHub renders profile READMEs closely but not exactly. GitHub also strips some HTML attributes that this preview keeps.
- The server only serves `assets/`, so `.git` and other repo files are never exposed.
