# Aurelius

Aurelius is a local-first writing app for focused writers. It offers a quiet page and the tools to build a writing habit. Your work stays on your device.

## Status

- **v2** is in planning. Its scope is [PRD-0001: Aurelius v2](docs/prd/0001-aurelius-v2.md). There is no v2 code yet.
- **v1** is the current web app. Its code is in [`v1/`](v1/) and will be removed once v2 replaces it.

## v2 in brief

- Desktop and web apps. Local-first, fully usable offline, no account needed for offline features.
- Efforts, daily goals and streaks, with the v1 writing tools: focus mode, timed sessions, music.
- Docs with tabs, comments, suggestions, version history and export.
- An AI agent that works beside the writer. You bring your own model; no vendor lock-in.
- Sync and sharing are optional and off by default.

The PRD has the full requirements, milestones, and what is online-only.

## Repository layout

| Path | Contents |
|---|---|
| [`v1/`](v1/) | The v1 web app. See [`v1/README.md`](v1/README.md) to run it. |
| [`docs/prd/`](docs/prd/) | Product requirements. Start at the [index and naming guide](docs/prd/README.md). |
| [`docs/adr/`](docs/adr/) | Architecture decision records. Start at the [index and naming guide](docs/adr/README.md). None written yet. |
| [`openwiki/`](openwiki/) | Generated code wiki. Do not edit by hand. |
| [`AGENTS.md`](AGENTS.md) | Instructions for coding agents. |
