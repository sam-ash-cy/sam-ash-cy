# Profile tooling

Everything on the profile is driven by **`profile.config.ts`** in the repo root: name, role, header commands and headlines, theme colours, About Me, certifications, projects, tech stack and code rain.

`README.md` and everything in `assets/imgs/` are generated from it. Edit the config, not those files: they are overwritten on the next build.

## Build

```bash
bun run build
```

Add `--refresh-icons` to download the stack icons again (otherwise existing ones are reused, so builds work offline). The build prints a warning if something will not fit, such as a headline too long for the terminal or a project description longer than three lines.

## Type check

```bash
bun run typecheck
```

Catches config mistakes before they reach the build, such as a typo in a section name or text where a number belongs.

## Live preview

```bash
bun install
bun run dev
```

Open http://localhost:3030. Saving `profile.config.ts` or a generator rebuilds everything and reloads the page. Editing `README.md` or `assets/` directly also reloads, but those changes are lost on the next build.

With Docker:

```bash
docker compose up --build
```

## Layout

| Path | Purpose |
|---|---|
| `profile.config.ts` | All content and settings |
| `preview/config-types.ts` | Config shape, with notes on each field |
| `preview/build.ts` | Runs every generator, then writes `README.md` |
| `preview/generators/` | One generator per asset: header, code rain, badges, project cards, icons, README |
| `preview/server.ts` | Live-reload preview server |

## Sources

- Stack icons: [tandpfun/skill-icons](https://github.com/tandpfun/skill-icons) (MIT, licence in `assets/imgs/icons/`)
- Badge logos: [Simple Icons](https://simpleicons.org) (CC0)
- Streak card: [streak-stats.demolab.com](https://streak-stats.demolab.com), the only image loaded from a third party, because it needs live GitHub data

## How the preview differs from GitHub

- Markdown is rendered locally with `marked` (GFM, no soft line breaks), which matches how GitHub renders profile READMEs closely but not exactly.
- The server only serves `assets/`, so `.git` and other repo files are never exposed.
