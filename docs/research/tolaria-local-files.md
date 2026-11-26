---
type: research
title: "Tolaria's local markdown file model"
date: 2026-11-26
ticket: 38
---

# Tolaria's local markdown file model

Research note for ticket #38 (map: #36). It reports how Tolaria behaves. It makes no decisions for Aurelius.

## Scope and sources

- **Source:** the Tolaria repository (`refactoringhq/tolaria`), checkout at commit `c811184` (22 November 2026).
- **Citations** are Tolaria repo-relative paths.
- **Order of trust:** source code and tests first, then the public user docs in `site/`, then ADRs in `docs/adr/`, then the generated wiki in `openwiki/`. Where an ADR and the source disagree, the source is reported and the difference is noted.
- **"Inferred"** marks a conclusion drawn from the code that no test or document states outright.
- **"Per ADR"** marks a statement taken from an ADR and not checked line by line against the source.
- The focus is the **desktop app**, which is where the local file model lives. The repository also holds an iOS app and a web build with a server; they are covered briefly in "Sync between devices".

## Summary

- A vault is an ordinary folder. Every note is one `.md` file with optional YAML front matter. There is no database; the files win.
- Tolaria keeps almost all note-level metadata in front matter, and vault-level definitions (types, saved views, agent guidance) as files in the vault. A cache, a vault list and some per-vault display settings live outside the vault.
- The title is the first H1. The filename is separate. Only brand-new "untitled" notes are renamed automatically, once.
- A desktop watcher picks up outside changes within about a third of a second and reloads. An open note with unsaved edits is never replaced, and its next save overwrites the outside change without a warning. This is a real last-write-wins gap.
- Delete is permanent. Recovery, history and device sync all rest on Git, which is optional.
- Agents work on the vault as plain files, guided by an `AGENTS.md` in the vault root, or through a small tool server with create, update and append tools.
- No comments, suggestions or chart blocks exist anywhere in the source. Live co-editing exists only in the web build with its server, not in the desktop app.

## 1. Vault and folder model

### What a vault is

- A vault is a folder on disk that Tolaria reads and writes. The filesystem is the source of truth; app state and cache are derived (`site/concepts/vaults.md`, `docs/adr/0002-filesystem-source-of-truth.md`).
- A vault may hold Markdown notes, attachments, type definitions, saved views and Git data (`site/start/open-or-create-vault.md`).

### Create and open

- **Create new:** the target must be a missing or empty folder. Tolaria creates it, initialises Git, makes a first commit, then writes its starter files: `AGENTS.md`, `CLAUDE.md`, `type.md` and `note.md` (`src-tauri/src/commands/vault/lifecycle_cmds.rs`, `src-tauri/src/vault/config_seed.rs`, `src-tauri/src/git/mod.rs`).
- **Open existing:** any folder can be opened, including an Obsidian-style vault or a plain folder of Markdown. Git is not required (`site/start/open-or-create-vault.md`, `docs/adr/0085-non-git-vault-support.md`).
- **Starter vault:** on first launch the user can clone a public "getting started" vault from GitHub. Its remote is removed after cloning, so it starts local-only (`docs/adr/0046-starter-vault-cloned-from-github.md`, `docs/adr/0070-starter-vaults-local-first-with-explicit-remote-connection.md`).
- **Repair Vault** is a manual command. It re-creates missing starter files, migrates old type metadata and adds a default `.gitignore` (`src-tauri/src/commands/vault/lifecycle_cmds.rs`).
- Opening an existing folder does not appear to write starter files by itself: the automatic startup seeding runs only for one legacy default folder (`src-tauri/src/desktop_runtime.rs`). Inferred. `docs/adr/0023-repair-vault-auto-bootstrap.md` describes seeding on every open, which the current source does not show.

### Multiple vaults

- The app keeps a list of registered vaults, each with a label, a short alias, a colour and a "mounted" flag, plus the active vault and the default vault for new notes. The list is stored with the app, not in any vault (`src-tauri/src/vault_list.rs`).
- By default one vault is active at a time. A setting, "Use multiple vaults at the same time", loads all mounted vaults into one combined graph: note lists, search, quick open, backlinks and wikilink navigation span them (`site/concepts/vaults.md`, `docs/adr/0114-mounted-workspaces-unified-graph.md`).
- Even then, Git status, commits, sync, the folder tree, saved views and repair stay tied to the active vault.
- Links between vaults use the target vault's alias as a prefix, for example `[[team/projects/alpha]]`. No machine path is written into a note.
- A vault can also be opened as a separate app instance with its own window and dock icon (`docs/adr/0171-separate-vault-application-instances.md`).
- A vault may be a subfolder of a larger Git repository. Tolaria then treats the vault folder as the content boundary: sibling files are not shown and app-made commits include only vault files (`docs/adr/0161-parent-git-workspace-context.md`, `site/concepts/git.md`).

### Folders

- Tolaria scans the whole vault recursively and indexes every file, not only Markdown. Folders whose name starts with a dot are skipped (`src-tauri/src/vault/mod.rs`, `docs/adr/0033-subfolder-scanning-and-folder-tree.md`, `docs/adr/0041-filekind-all-files-in-vault-scanner.md`).
- Each file has a kind: Markdown (full note behaviour), text (opens in a plain source editor) or binary (previewed where supported). The folder view shows all kinds; other lists show Markdown notes, with settings for PDFs and images (`site/reference/file-layout.md`).
- Tolaria is deliberately not folder-led. New notes go to the vault root by default, a note's type comes from front matter and never from its folder, and the user docs describe folders as optional, useful mainly so that other tools can work with the vault (`site/reference/file-layout.md`).
- Two folders have a set purpose: `views/` for saved views and `attachments/` for pasted images and files.
- Files ignored by Git are hidden from lists, search and folders by default. This is a per-installation setting (`docs/adr/0094-gitignored-content-visibility-boundary-filter.md`).
- **Correction to an earlier lead:** `docs/adr/0006-flat-vault-structure.md` is still marked active but its "root-level files only" scanning rule was replaced by ADR-0033. Subfolders are fully supported today.

## 2. One note per file, titles and renames

### Note and title

- One note is one `.md` file with optional YAML front matter (`site/concepts/notes.md`).
- The display title is resolved in this order: an H1 on the first non-empty body line, then a legacy `title:` front-matter field, then a title derived from the filename (`src-tauri/src/vault/parsing.rs`, `docs/adr/0044-h1-as-title-primary-source.md`).
- The H1 in the body is the only place the user edits the title. There is no separate title field (`docs/adr/0068-h1-only-title-surface-with-optional-untitled-auto-rename.md`).
- The filename is shown in the breadcrumb, so the user always sees the real file name.
- A note has no hidden ID. Its identity is its path. Inferred from the entry model (`src-tauri/src/vault/entry.rs`) and from the way links resolve.

### Filenames

- A new note is written to disk at once as `untitled-<type>-<unix time>.md`, with a numeric suffix if that name is taken (`src/hooks/noteCreationImmediate.ts`).
- **Automatic rename happens once only.** When an `untitled-…` note first gets an H1 and is saved, the file is renamed to a slug of that title (`src-tauri/src/vault/rename.rs`, function `auto_rename_untitled`). Later title changes do not rename the file.
- This automatic rename is a per-installation setting, on by default (`docs/adr/0068-…`).
- After that, title and filename are independent. The user can rename the file from the breadcrumb, including a "rename to match the title" action (`site/concepts/notes.md`).
- The slug is lower case, keeps Unicode letters and digits, and turns everything else into hyphens. Names are checked against rules that keep them valid on every desktop platform (`src-tauri/src/vault/rename.rs`, `src-tauri/src/vault/filename_rules.rs`).
- **Collisions:** a title-driven rename adds `-2`, `-3` and so on. An explicit filename rename fails with an error instead (`docs/adr/0075-crash-safe-note-rename-transactions.md`).
- **Correction to an earlier lead:** ADR-0044 reads as if every save renames the file to match the H1. The source limits this to untitled notes, once, and ADR-0068 made it optional. ADR-0007 (title in front matter, kept in step with the filename) is superseded.

### What a rename does

- An in-app rename or move rewrites wikilinks in every Markdown file in the vault. It matches the old title, the old path and the old filename, and keeps any `|display text` (`src-tauri/src/vault/rename.rs`).
- The result reports how many files were updated and how many failed, so the app can warn about a partial update.
- Renames are crash-safe. The old file is first moved to a hidden `.tolaria-rename-txn/` folder inside the vault with a small record of the move. If the app dies mid-rename, the next scan puts the file back (`src-tauri/src/vault/rename_transaction.rs`, `docs/adr/0075-…`).
- A note can be moved to another folder (the filename is kept) or to another vault. Changing a note's type is a front-matter edit, not a move (`docs/adr/0076-note-retargeting-separates-type-and-folder-moves.md`).

## 3. Where each kind of metadata lives

### In the note's own front matter

| Data | Field |
|---|---|
| Type, status, date, URL, user properties | `type`, `status`, `date`, `url`, any custom key |
| Relationships | any field whose value contains a `[[wikilink]]`, for example `belongs_to`, `related_to` |
| Favourite and its order | `_favorite`, `_favorite_index` |
| Archived, organised (inbox) | `_archived`, `_organized` |
| Per-note look | `_icon`, `_color`, `_width` |
| Display as a spreadsheet, and its layout | `_display: sheet`, `_sheet` |

- Any field starting with `_` is a system field. It is hidden from the normal properties panel but stays plain YAML, visible and editable in source mode (`site/reference/frontmatter-fields.md`, `docs/adr/0008-underscore-system-properties.md`, `src-tauri/src/frontmatter/keys.rs`, `src/utils/systemMetadata.ts`).
- Relationships are not declared anywhere. Any front-matter field holding a wikilink becomes a relationship (`docs/adr/0010-dynamic-wikilink-relationship-detection.md`, `src-tauri/src/vault/parsing.rs`).
- There is no required schema and no validation. Types are aids for finding notes, not rules that are enforced (`README.md`).

### As files inside the vault

| File or folder | Purpose | Source |
|---|---|---|
| A note with `type: Type` | Type definition: icon, colour, order, sidebar label, template, default sort and view, pinned properties | `docs/adr/0096-root-created-type-documents.md` |
| `views/*.yml` | Saved views: name, icon, colour, sort, filter tree | `src-tauri/src/vault/views.rs`, `docs/adr/0040-custom-views-yml-filter-engine.md` |
| `attachments/` | Pasted images and attached files, named `<timestamp>-<name>` | `src-tauri/src/vault/image.rs` |
| `AGENTS.md`, `CLAUDE.md`, `GEMINI.md` | Guidance for AI agents | `src-tauri/src/vault/config_seed.rs` |
| `type.md`, `note.md` | Default type definitions | `src-tauri/src/vault/config_seed.rs` |
| `.gitignore`, `.git/` | Written only when Git is initialised | `src-tauri/src/git/mod.rs` |
| `.tolaria-rename-txn/` | Hidden, short-lived, only during a rename | `src-tauri/src/vault/rename_transaction.rs` |

- ADR-0040 places views in a hidden `.laputa/views/` folder. The source uses a visible `views/` folder and migrates the old location (`src-tauri/src/vault/view_migration.rs`).
- Apart from the rename folder, `.gitignore` and Git's own data, no hidden files written into the vault were found in the current source. Older versions used a hidden `.laputa/` folder inside the vault; the scanner still skips it and the default `.gitignore` still names it.
- The option of a sidecar file per note was considered and rejected (`docs/adr/0008-…`).

### Outside the vault

| State | Where | Rebuildable from the vault? |
|---|---|---|
| Scan cache of all entries | A cache folder in the user's home directory, one file per vault | Yes. "Reload Vault" deletes and rebuilds it (`src-tauri/src/vault/cache.rs`, `docs/adr/0024-cache-outside-vault.md`) |
| Search results, backlinks, word counts, note list | In memory | Yes |
| Created and modified dates | Read from Git history when the note is committed, otherwise from the filesystem | Yes, but the value differs between a Git and a non-Git vault (`docs/adr/0039-git-history-for-note-dates.md`) |
| Vault list: labels, aliases, colours, mounted flags, active vault | App settings | No |
| App settings: pull interval, AutoGit, auto-rename of untitled notes, hide ignored files, AI target and similar preferences | App settings | No (`src-tauri/src/settings.rs`) |
| Per-vault display settings: tag colours, status colours, property display modes, note-list columns, zoom, view and editor mode, the agent permission mode | App local storage, keyed by the vault's path | No (`src/hooks/useVaultConfig.ts`, `src/utils/vaultConfigStore.ts`) |
| Registration of Tolaria's tool server in other AI tools | Those tools' own config files, written only on request | No (`docs/adr/0074-explicit-external-ai-tool-setup-and-least-privilege-desktop-scope.md`) |

- The stated rule is: if the user would want it to follow the vault to every installation, store it in the vault; otherwise in app settings (`docs/adr/0004-vault-vs-app-settings-storage.md`).
- One consequence of the table: tag colours and status colours do not travel with the vault, and because they are keyed by the vault's path they are also lost if the folder is moved. Inferred from `src/hooks/useVaultConfig.ts`.

## 4. What another markdown editor sees, and what it loses

### What it sees

Everything is plain text in standard or widely used forms:

| Tolaria feature | On disk |
|---|---|
| Title | First `# H1` line |
| Properties | YAML front matter |
| Links between notes | `[[target]]` or `[[target\|display text]]`, in the body and in front matter |
| Images | Files in `attachments/`, linked by path |
| Callouts | Blockquotes with a `[!type]` marker, the Obsidian and GitHub alert form (`src/utils/calloutMarkdown.ts`) |
| Highlights | `==text==` (`src/utils/markdownHighlightMarkdown.ts`) |
| Maths | `$…$` and `$$…$$` (`docs/adr/0082-markdown-durable-math-notes.md`) |
| Diagrams | A fenced `mermaid` code block (`docs/adr/0088-markdown-durable-mermaid-diagrams.md`) |
| Whiteboards | A fenced `tldraw` code block holding the board as JSON (`src/utils/tldrawMarkdown.ts`) |
| HTML blocks | A fenced `html` code block (`docs/adr/0154-sandboxed-fenced-html-blocks.md`) |
| Spreadsheet notes | Front matter plus a CSV-like body, formulas as text such as `=SUM(B2:D2)` (`site/reference/spreadsheet-format.md`) |
| Saved views | Readable YAML files |

### What it loses

- **Structure built from front matter:** types as sidebar sections, templates, relationships, backlinks and saved views. Another editor shows the YAML but does nothing with it.
- **System fields:** `_favorite`, `_archived`, `_sheet` and the rest appear as odd-looking YAML keys with no meaning.
- **Rendering of rich blocks:** a whiteboard is a block of JSON, an HTML block is source code, a spreadsheet note is comma-separated text with unevaluated formulas. Mermaid and maths render only where the other editor supports them.
- **Wikilinks:** editors without wikilink support show the brackets as text. Editors with it may resolve differently. Tolaria tries a path-suffix match first, then filename, then title (`docs/adr/0035-path-suffix-wikilink-resolution.md`). Links to another vault by alias mean nothing elsewhere.
- **Images in subfolder notes:** image links are written as vault-root paths such as `attachments/x.png` (`src/utils/vaultAttachments.ts`). An editor that resolves image paths from the note's own folder may not find them for notes in subfolders. Inferred; not tested.
- **History and dates:** these come from Git, not from the file.

### What can go wrong when another editor writes

- A rename or move done outside Tolaria does not update links in other notes (see section 5).
- Tolaria's own serialiser does not reproduce a file byte for byte: in one measurement only 1 unedited note in 33 came back identical (`docs/adr/0187-yjs-collaboration-with-markdown-as-canonical-form.md`). To limit this, the rich editor saves by patching only the edited regions of the original text and leaves the rest untouched (`src/utils/richEditorMarkdown.ts`, `openwiki/workflows/editing-and-saving.md`).
- A source mode is always available for exact edits, including the front matter (`site/concepts/editor.md`).

## 5. Outside changes: detection and reconciliation

### Detection (desktop only)

- A filesystem watcher runs on each open vault. It ignores Git's internal folder, `node_modules`, temporary and editor swap files, and Tolaria's rename folder (`src-tauri/src/vault_watcher.rs`).
- Pure "file was read" events are dropped. A "modified" event counts only if the file's size or modified time really changed.
- Changes are batched for 350 ms, then handled together (`src/hooks/useVaultWatcher.ts`).
- Tolaria ignores watcher events for a file it saved itself in the last 4 seconds, so autosave does not trigger a reload loop.
- There is also a manual "Reload Vault" command.
- The mobile app has no watcher (`docs/adr/0089-active-vault-filesystem-watcher.md`, superseded by `docs/adr/0165-window-owned-vault-watchers-and-main-window-git-background-work.md`, which keeps the watcher and adds per-window ownership).

### Reconciliation

One shared routine handles watcher batches, Git pulls and agent runs (`src/utils/pulledVaultRefresh.ts`, with tests in `src/utils/pulledVaultRefresh.test.ts`):

1. Reload the note list, the folder tree and the saved views.
2. If the open note has **unsaved edits**, keep the editor as it is.
3. If the open note's file was **not** in the changed batch, keep the editor as it is.
4. If the open note is clean and its file **changed**, reload it from disk at once, even while the cursor is in it, then put focus back. If the editor already holds the same text as the file, nothing is reloaded.
5. If the open note's file is **gone**, close it. Exception: if exactly one changed file elsewhere has the same filename, treat it as moved and follow it.

The rule in step 4 is the current one (`docs/adr/0135-clean-active-note-refresh-after-external-edit.md`). Two earlier versions are superseded: ADR-0071 reloaded the open note after any change, and ADR-0111 refused to reload while the editor had focus, which could leave stale text on screen for a whole session.

### The unsaved-edits case and the last-write-wins gap

- Autosave writes 1.5 seconds after the last keystroke. Switching notes, a manual save and destructive actions save at once (`src/hooks/useEditorSave.ts`, `docs/adr/0102-low-end-safe-autosave-idle-window.md`).
- The desktop save is an unconditional overwrite. It does not check whether the file changed on disk since it was loaded (`src-tauri/src/vault/file.rs`, `src/hooks/useSaveNote.ts`).
- So if another program changes a note while Tolaria holds unsaved edits to it, Tolaria keeps its own text (step 2) and the next autosave replaces the other program's version. Nothing is merged.
- No warning, banner or "file changed on disk" prompt for this case was found in the source. Stated as "not found", after searching the app's source and strings.
- The outside version survives only if it had been committed to Git.
- A second, smaller window: an outside change to a file within 4 seconds of Tolaria's own save of that file is filtered out as if it were Tolaria's own write, so the editor is not refreshed. Inferred from `src/hooks/useVaultWatcher.ts`.
- Other parts of Tolaria do guard against this, which shows the gap is specific to the desktop editor's save:
  - the agent tool `update_note` accepts the file's last-known modified time and refuses to write if it changed (`mcp-server/vault.js`);
  - the web server requires every write to name the revision it was based on, and turns a stale write into a "conflict copy" file (`docs/adr/0186-tolaria-remote-file-service-and-protocol.md`);
  - the iOS folder sync stops and asks when both sides changed (per ADR, `docs/adr/0217-mobile-linked-folder-reconciliation.md`).

### Renames made outside the app

- When the window regains focus, Tolaria asks Git for renamed Markdown files since the last commit. If it finds any, it shows a banner offering to update wikilinks; the user can accept or dismiss (`src/hooks/useVaultRenameDetection.ts`, `src-tauri/src/vault/rename.rs`, `docs/adr/0036-external-rename-detection-via-git-diff.md`).
- This works only in a Git vault and only for renames Git can see. A rename in a file manager that Git has not been told about is not detected, and neither is any rename in a non-Git vault. The note list still updates through the watcher, but links to the old name break. Per ADR-0036, consistent with the source.

### Changes arriving through Git

- A Git vault with a remote is pulled automatically on a timer, every 5 minutes by default (`src/hooks/useAutoSync.ts`).
- A pull is a merge, not a rebase (`src-tauri/src/git/remote.rs`).
- Conflicting files are listed in a conflict resolver. For each file the user keeps the local side, keeps the remote side, or opens the file to fix it by hand; Tolaria then commits the result (`src/hooks/useConflictResolver.ts`, `openwiki/workflows/git-sync.md`, `site/troubleshooting/sync-conflicts.md`).

## 6. Delete and recovery

- Delete is permanent and immediate, behind one confirmation dialog. There is no trash and no soft delete (`src-tauri/src/vault/trash.rs`, `docs/adr/0045-permanent-delete-no-trash.md`).
- An earlier trash design with 30-day retention was built and then removed (ADR-0042, superseded). Old `_trashed` flags in existing files are ignored.
- Deleting a folder removes the folder and everything in it, also permanently (`src-tauri/src/vault/folders.rs`).
- **Archive** is the soft alternative: it sets `_archived: true` in front matter and hides the note from normal lists. The file stays.
- **Recovery depends on Git:**
  - A deleted note that had been committed shows up in the Changes list. The user can open a preview of its last content and discard the change, which restores the file (`src/hooks/useGitFileWorkflows.ts`, `src-tauri/src/git/status.rs`).
  - Once the deletion itself is committed, no in-app action to restore an old version was found. Recovery then needs Git outside the app. ADR-0045 accepts that this suits technical users only.
  - A note that was never committed, or any note in a non-Git vault, cannot be recovered by Tolaria.
- Discarding the change on a new, never-committed file deletes that file.

## 7. Version history (Git)

- **Git is optional.** An earlier rule that blocked non-Git folders (ADR-0034) is superseded. Opening a plain folder now works; Tolaria asks once whether to initialise Git and, if declined, shows a permanent "Git disabled" note in the status bar (`docs/adr/0085-non-git-vault-support.md`).
- Without Git: no history, no changes list, no commits, no sync, no conflict handling. Browsing, editing and search work as normal.
- Tolaria avoids initialising Git in broad personal folders such as Desktop or Documents (`site/concepts/vaults.md`).
- With Git, the app offers (`site/concepts/git.md`, `src-tauri/src/commands/git.rs`):
  - history for one note, and a history of the whole vault;
  - the current diff for a note, and the diff at any past commit;
  - a list of changed files;
  - manual commit with a message, which also pushes if a remote exists and commits locally if not (`docs/adr/0059-local-only-git-commits-without-remote.md`);
  - pull, push, conflict resolution and connecting a remote.
- **AutoGit** is opt-in. When on, it commits (and pushes) saved changes after an idle pause (90 seconds by default) or after the app loses focus (30 seconds by default). It never commits unsaved text. Messages are generic, for example "Updated 3 notes" (`docs/adr/0067-autogit-idle-and-inactive-checkpoints.md`, `src/components/SettingsPanel.tsx`).
- History is for viewing. Restoring an old version from inside the app was not found (see section 6).
- Tolaria uses the Git already installed and signed in on the machine. It has no account system of its own (`docs/adr/0056-system-git-cli-auth-no-provider-oauth.md`).

## 8. How agents work on a vault

There are three routes (`site/concepts/ai.md`, `site/guides/use-ai-panel.md`):

1. **Coding agents inside the app.** The AI panel drives command-line agents already installed on the machine (Claude Code, Codex, GitHub Copilot, OpenCode, Pi, Antigravity, Kiro, Hermes). The agent reads and edits the vault's files directly. Each agent keeps its own sign-in.
2. **Direct model chat.** A local or hosted model answers from the open note and linked notes. It has no tools and cannot change files.
3. **Outside tools through Tolaria's tool server** (MCP). Any compatible tool can connect.

### Guidance files in the vault

- `AGENTS.md` in the vault root is the shared instruction file. It explains the vault's conventions: one note per file, H1 as title, wikilinks, leave `_` fields alone (`src-tauri/src/vault/getting_started.rs`).
- `CLAUDE.md` and `GEMINI.md` are short files that point to `AGENTS.md`, for tools that look for their own filename (`docs/adr/0065-root-managed-ai-guidance-files.md`).
- Tolaria tells its own managed versions apart from a user's custom file. It restores only managed ones and never overwrites a custom file (`src-tauri/src/vault/config_seed.rs`).
- These files are ordinary notes in the vault and are visible to the user and to other editors.

### Permissions

- Each vault has a mode: **Vault Safe** (file, search and edit tools only) or **Power User** (may also run shell commands, for agents that support it). Safe is the default. The exact effect differs by agent (`docs/adr/0092-vault-ai-agent-permission-modes.md`).
- Connecting outside tools is an explicit, reversible step. Tolaria does not touch other tools' configuration until the user confirms (`docs/adr/0074-…`).
- The connection is not tied to one vault: the tool server follows whichever vaults are currently mounted (`docs/adr/0119-vault-neutral-mcp-registration-with-mounted-workspace-guidance.md`).

### The tool server's tools

Listed in `mcp-server/index.js`:

- **Read:** `search_notes`, `get_note`, `get_vault_context` (includes each vault's `AGENTS.md`), `list_vaults`.
- **Write:** `create_note` (never overwrites an existing file), `update_note` (replaces a whole note; optional "fail if the file changed since I read it" guard; written so a crash cannot leave half a file), `append_to_note` (`docs/adr/0158-vault-write-mcp-tools-update-and-append.md`, `mcp-server/vault.js`).
- **App control:** `open_note`, `highlight_editor`, `refresh_vault`.
- **Vault list:** `attach_vault`, `clone_vault`.
- There is no delete tool and no rename tool. Every path is checked to be inside a registered vault.

### How agent edits reach the user

- An agent edit is a plain file edit. The app picks it up through the same reconciliation as any outside change (section 5), so the same unsaved-edits rule applies.
- There is no accept or reject step, no marking of which text an agent wrote, and no per-edit undo. The user docs treat agent edits as ordinary file edits and point to Git diffs and history as the review tool (`site/guides/use-ai-panel.md`).

## 9. Sync between devices

- **Desktop has no sync service of its own.** Sync means a Git remote the user owns: timed pull, manual or AutoGit push, and the conflict resolver (sections 5 and 7). The project states that the app needs no account, subscription or cloud service (`README.md`).
- A vault can sit in a folder synced by a file service such as iCloud or Dropbox, and the code handles one such setup detail (`src-tauri/src/vault_watcher.rs`). No handling of that service's own conflict files was found. Inferred.
- **iOS app (beta, per `README.md`).** Per ADRs, not checked in depth against source:
  - It keeps its own working copy of the vault and can sync it with Git over HTTPS. It never force-pushes and never picks a side silently (`docs/adr/0194-mobile-git-vaults.md`, `docs/adr/0218-mobile-conflict-free-git-merge.md`).
  - It can link a folder from the Files app (including iCloud). It compares three versions of each file (last synced, local, folder). One-sided changes are copied across; two-sided changes stop and wait (`docs/adr/0217-mobile-linked-folder-reconciliation.md`).
  - Conflicts go to a review screen with "local", "remote" and "keep both" (`docs/adr/0223-mobile-conflict-review-and-publication.md`).
- **Web build and server (present in the repository under `apps/web` and `apps/server`; not mentioned in `README.md`; release status unknown).** Per ADRs, with spot checks in `apps/server/src`:
  - A server holds a Git copy of one vault. Every save is a commit; pushes to the user's Git remote follow within about 2 seconds (`docs/adr/0186-…`, `docs/adr/0280-debounced-push-and-background-fetch.md`).
  - A stale write is saved beside the original as `<name> (conflict YYYY-MM-DD HHMM)<ext>` (`apps/server/src/paths.ts`).
  - Notes can be edited by several people at once, with avatars and named cursors. The Markdown file in Git stays the canonical form; the live document is rebuilt from it (`docs/adr/0187-…`, `docs/adr/0291-presence-in-the-web-note-view.md`).
  - A vault or a single note can be shared with another user as viewer or editor, and access can be revoked at once (`docs/adr/0296-sharing-enforced-in-the-server-with-signed-access-tickets.md`).
  - Offline, the web app opens the last vault read-only (`openwiki/architecture/web-and-collaboration.md`).
  - The desktop app does not take part in live editing; it sees the results as ordinary Git commits (`docs/adr/0291-…`).

## Earlier leads: confirmed or corrected

| Lead | ADR status | Verdict |
|---|---|---|
| Files win, no database (ADR-0002) | active | Confirmed in source |
| Folder tree (ADR-0033) | active | Confirmed. It overrides the "flat only" scanning rule of ADR-0006, which is still marked active |
| Title-to-filename rename (ADR-0044, ADR-0075) | active | Partly corrected. Only untitled notes are renamed, once, and the behaviour is optional (ADR-0068). Crash-safe renames confirmed |
| System fields with `_` prefix (ADR-0008) | active | Confirmed. The list has grown (`_display`, `_sheet`, `_width`, `_organized`); `_trashed` is no longer used |
| Wikilink relationships (ADR-0010) | active | Confirmed |
| Outside-change watcher (ADR-0089, ADR-0071, ADR-0135) | 0089 and 0071 superseded; 0135 active | Confirmed in source as ADR-0135 describes. ADR-0165 replaces 0089 without changing the user-facing behaviour |
| Outside renames (ADR-0036) | active | Confirmed, with the limit that only renames visible to Git are detected |
| Delete and recovery through Git (ADR-0045) | active | Confirmed. In-app recovery exists only for a deletion not yet committed |
| Agent files in the vault (ADR-0065) | active | Confirmed |
| Optional Git (ADR-0085) | active | Confirmed. It supersedes ADR-0034 |

## Behaviours worth borrowing for Aurelius

Observations only.

- The vault is a plain folder that opens in any editor, with no export step and no database to keep in step.
- Metadata that should travel with the content is written into the content: front matter per note, and readable files for vault-level definitions.
- One naming rule (`_` prefix) separates app-owned fields from the user's own, while keeping them visible in source.
- The title comes from the first heading, and the filename is shown honestly as a separate thing. Automatic renaming is limited to the first title of a new note.
- A rename updates links across the vault, reports partial failure, and survives a crash.
- Everything outside the vault is either rebuildable (cache) or clearly machine-specific (window size, zoom).
- Outside changes appear in the app in well under a second, through one shared routine used for file changes, Git pulls and agent runs alike.
- Unsaved text in the editor is never replaced by an outside change.
- Rich blocks are stored as fenced code blocks or established Markdown extensions, so another editor shows readable source instead of failing.
- Saving patches only the edited parts of the file, so opening a note does not reformat it.
- An `AGENTS.md` in the vault tells any agent the vault's rules, so agents need no Tolaria-specific integration.
- The agent write tool can refuse to write when the file changed since it was read, and note creation never overwrites.
- Stale writes on the server become a clearly named "conflict copy" beside the original, so no version is lost.
- Git is offered, not forced, and the app says plainly when it is off.

## Gaps Aurelius must solve that Tolaria does not

Observations only.

- **Comments.** No comment threads or inline comments exist in the source (searched). A plain Markdown file has no place for them in Tolaria's model.
- **Suggestions.** No suggestion or track-changes mode exists (searched). Review of someone else's or an agent's edit is a Git diff after the fact.
- **Real-time sharing.** The desktop app has none. Live co-editing, presence and sharing exist only in the web build, and need a server that holds a Git copy of the vault. There is no live editing directly between local folders.
- **Rich blocks such as charts.** No chart block exists (searched). The nearest features are Mermaid diagrams, spreadsheet notes, whiteboards and free-form HTML blocks. Rich blocks that are stored as JSON or CSV-like text are unreadable in practice in another editor.
- **Outside change during unsaved edits.** The desktop save overwrites without checking, and gives no warning (section 5).
- **Recovery without Git.** A deleted note or an overwritten version in a non-Git vault is gone. Even with Git, restoring an old version is not offered in the app.
- **Stable note identity.** A note is known only by its path. A rename outside the app breaks links unless Git can see it, and nothing ties a moved file back to its comments, shares or history.
- **Agent edits.** No attribution of agent-written text, no accept or reject step, no undo of one agent run, and coarse permissions (two modes per vault).
- **Settings that should follow the vault.** Tag colours, status colours and list layouts sit in app storage keyed by the folder's path.
- **Sync without Git.** Device sync assumes a Git remote and a user who can resolve merge conflicts by choosing a whole file from one side.
- **Offline on the web.** The web build is read-only when offline.
- **Access control on local files.** Sharing roles exist only on the server. A local vault folder has no notion of viewer or editor.

## Open questions

- Is the web build with live co-editing released, or still internal? The repository does not say.
- How do the iOS linked-folder sync and conflict review behave in practice? This note relies on ADRs for them.
- How does the desktop app behave with conflict files made by iCloud or Dropbox themselves? Nothing was found; it was not tested.
- Do image links in subfolder notes resolve in other common editors? Inferred as a risk; not tested.
