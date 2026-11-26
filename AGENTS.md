## Product requirements

- PRDs live in `docs/prd/`. The index and naming guide are in `docs/prd/README.md`.
- Filenames are `NNNN-short-title.md`. Refer to a PRD as `PRD-NNNN`; that reference is stable and never reused.
- Cite a single requirement as `PRD-NNNN` plus its ID, for example `PRD-0001 REQ-4`.
- Every PRD starts with YAML front matter: `type`, `id`, `title`, `status`, `date`. Keep it in step with the index.
- When you add a PRD or change its title or status, update the index in `docs/prd/README.md` in the same change.
- `v1/` holds the v1 app and will be removed later.

## Architecture decisions

- ADRs live in `docs/adr/`. The index and naming guide are in `docs/adr/README.md`.
- Filenames are `NNNN-short-title.md`. Refer to an ADR as `ADR-NNNN`; that reference is stable and never reused. ADR and PRD numbers are separate series.
- A PRD says what to build. An ADR records how: one technical decision per file.
- When you add an ADR or change its title or status, update the index in `docs/adr/README.md` in the same change.
- Every ADR starts with YAML front matter: `type`, `id`, `title`, `status`, `date`. Keep it in step with the index.
- Do not reverse an accepted ADR by editing it. Write a new ADR and set the old one to `status: superseded`.

<!-- OPENWIKI:START -->

## OpenWiki

This repository has a generated `openwiki/` evidence index. It is optional just-in-time context, not required startup reading.

- Do not enumerate, preload, or search wikis at task start. Use retrieval when the user asks for it, when unfamiliar architecture or dependency behavior materially affects the task, or when source inspection leaves an important uncertainty. Stop once the question is grounded.
- When those conditions apply and OpenWiki retrieval tools are available, use `openwiki_search` for just-in-time context and `openwiki_read` for the relevant complete sections. If search returns `workspace_required`, ask which listed workspace to use and retry with its ID.
- Use `openwiki_list_workspaces` or `openwiki_list_wikis` when workspace membership itself needs to be discovered.
- If the retrieval tools are unavailable, read `openwiki/quickstart.md` and follow its links to the relevant pages.
- Treat source code and tests as authoritative. A brief's unknowns and review items are verification gaps, not automatic requirements.
- Prefer the narrowest quiet validation that proves the changed behavior. Preserve complete failure output.

Use the repository's documented maintenance process to refresh generated pages after source changes. Check its configuration and completed runs before relying on automatic updates. Do not hand-edit generated OpenWiki pages unless explicitly asked; prefer updating source code/docs and letting OpenWiki regenerate.

<!-- OPENWIKI:END -->
