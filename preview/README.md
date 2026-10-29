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

## How it differs from GitHub

- Markdown is rendered locally with `marked` (GFM, no soft line breaks), which matches how GitHub renders profile READMEs closely but not exactly. GitHub also strips some HTML attributes that this preview keeps.
- `profile-3d-contrib/` only exists after the `GitHub-Profile-3D-Contrib` workflow has run. Until then the preview shows the tool's demo image.
- The server only serves `assets/` and `profile-3d-contrib/`, so `.git` and other repo files are never exposed.
