---
type: PRD
id: PRD-0001
title: "Aurelius v2"
status: draft
date: 2026-11-24
---

# PRD-0001: Aurelius v2

**Scope:** product requirements only. This document makes no tech stack or architecture decision.

**Inputs:** grilling session (Q1–Q59), v1 source inventory, Claude Docs feature inventory, Tolaria file-model review, agent-connection research.

## 1. Summary

Aurelius v1 is a local-first writing app for the web: a quiet editor with focus mode, timed writing sessions and a music player.

Aurelius v2 keeps that writer and adds what Claude Docs offers: structured docs with tabs, an agent that drafts and edits beside the writer, comments, suggestions, sharing and export. The agent is not tied to one vendor. The user connects the model they already pay for.

v2 ships as a desktop app and a web app. Both are local-first and work fully offline. Features that need the network turn on and off with connectivity and never block writing.

## 2. Background

### 2.1 Aurelius v1 today

- Web app and PWA only. No desktop build.
- Posts with create, edit, delete, reading view, search and sort.
- Focus mode, timed writing sessions with history, live word count, music player (YouTube streams), themes and fonts, single-key shortcuts, quick-start and help dialogs, autosave.
- Content is stored as HTML in a local database. Sync is end-to-end encrypted through a mnemonic code. There are no accounts and no Aurelius server.
- Present in the schema or settings but not working: efforts (only one exists and users cannot add more), daily goal (saved, never read), profile name (saved, never shown), export (commented out).

### 2.2 Why v2

- Writers now draft with AI agents. Claude Docs shows a good model for this, but it works only with Claude and only online.
- v1's best ideas for building a writing habit (efforts, goals) were never finished.
- A desktop app is needed for a writing tool people keep open all day.

### 2.3 References

- **Claude Docs** is the primary inspiration for the doc, agent, comment and sharing features.
- **Blurt's Writing Efforts** is the model for efforts, daily goals and streaks.
- **Tolaria** is the reference for working with local markdown files (milestone M4).

## 3. Goals and non-goals

### 3.1 Goals

1. Serve the focused writer first. Every v1 writing feature that works today keeps working.
2. Give that writer an agent collaborator that is vendor-neutral.
3. Reach parity with the Claude Docs doc product, with the exceptions listed in section 13.
4. Stay local-first. Everything that can work offline does work offline, with no account.
5. Ship on desktop (macOS, Windows, Linux) and web.

### 3.2 Non-goals for v2

- Mobile apps. Nothing in the doc format or the online features may block them later.
- Importing v1 user data.
- An Aurelius-provided model. The user always brings their own.
- Doc to slides, export to Google Docs or Notion, a templates gallery, scheduled agent runs.
- Organisation and group administration.
- End-to-end encryption of shared or synced docs.
- Agent-written code that draws charts (see M4 for the declarative replacement).

### 3.3 Success measures

Measures are named here with no targets. Targets are set once there is usage to learn from.

| Measure | First available |
|---|---|
| Weekly active writers | M1 |
| Share of efforts that have a daily goal | M1 |
| Share of writers with a streak of 7 days or more | M1 |
| Share of signed-in users who use the agent | M2 |
| Share of agent suggestions accepted | M2 |
| Docs shared | M3 |

## 4. Personas

**Primary — the focused writer.** Writes essays, posts, a journal or a book. Wants a bare page, a habit, and no distractions. Uses an agent as an editor and research helper, and does not want their prose changed without their say.

**Secondary — the small team.** Two to ten people who write specs, plans and reports with agents and review each other's drafts through comments and suggestions.

## 5. Product principles

1. **The page comes first.** After a one-time first-run step (LIB-4), the app opens to a bare editor. The agent panel, comments, tab list and outline stay closed until called. Focus mode hides everything.
2. **Local-first.** All data lives in a local database on the device. No account is needed for any feature that works offline.
3. **The writer's text is the writer's.** An agent's change to existing text arrives as a suggestion, not as a silent edit.
4. **Agent-agnostic.** No feature depends on one model vendor.
5. **Plain privacy line.** A local doc stays on the device. Its text passes through Aurelius only during an agent request the user starts, and is not stored. A shared or synced doc is readable by the Aurelius backend, and the app says so at the moment of sharing or turning sync on.
6. **Connectivity is a state, not an error.** Online features switch on and off automatically. Controls that need the network are shown disabled with the reason, not hidden. No dialog interrupts writing because the network dropped.
7. **Offline features are free.** Online features may need a paid plan. Which ones are paid is decided before M2 ships, so every online feature must be able to sit behind a plan. Prices are outside this document.

## 6. Glossary

| Term | Meaning |
|---|---|
| Effort | A named group of docs with a type and an optional daily goal. The library is a list of efforts. |
| Doc | One piece of writing. Belongs to exactly one effort. Has one or more tabs. |
| Tab | A page inside a doc. Tabs can nest one level as subtabs. |
| Agent | A model the user connected with their own provider key. Addressed as `@Aurelius`. |
| Suggestion | A proposed change to the text, shown as a card the owner accepts or rejects. |
| Pending block | A placeholder the agent puts in a new doc for a section it has not written yet. |
| Sync | Copying a doc or effort to the backend so it follows the user across devices. Off by default. |
| Share | Giving other people access to one doc. |
| Connector | The interface that lets an outside agent app (Claude, ChatGPT, Cursor, Codex and others) work on the user's synced docs. |
| Local doc | A doc that is neither synced nor shared. |

## 7. Milestones

| | Name | Backend | Account |
|---|---|---|---|
| M1 | Offline writer core | None | None |
| M2 | Agents | Minimal: accounts, key storage, agent relay | Needed for agent features only |
| M3 | Sync and sharing | Full | Needed for sync, sharing, connector |
| M4 | Later v2 | — | — |

### M1 — Offline writer core

Desktop and web apps with no account and no backend.

- Library organised by efforts, with the three type behaviours.
- Docs with tabs and subtabs, outline, the full editor (section 9, tier M1).
- Daily goal per effort, progress bar, streaks.
- All kept v1 features: focus mode, timed sessions and history, word count, reading view, music player, themes and fonts, shortcuts, quick-start and help dialogs, autosave, profile name.
- Local version history with restore. Trash with restore.
- Library search, in-doc find and replace.
- Images. Video by URL.
- Export to Word, PDF and Markdown. Markdown import.
- Anonymous usage data with opt-out.

**Done when:** a writer can install either app, never sign in, never go online, and do everything above; and the web app keeps working after the network is removed.

### M2 — Agents

- Aurelius account and sign-in.
- Connect agents by provider API key: Anthropic, OpenAI, Google, OpenRouter, and a custom endpoint at a public URL.
- Agent chat panel per doc. `@Aurelius` in comments.
- Comments (threads, replies, resolve). The owner can use them alone.
- Suggestions from the agent with accept and reject.
- Agent creates docs with pending blocks and fills them.
- Agent web search where the provider offers it.

**Done when:** a signed-in user with a key from any supported provider can ask the agent to draft a new doc, ask it to revise an existing one and review the result as suggestions, and summon it from a comment; and all of M1 still works signed out and offline.

### M3 — Sync and sharing

- Sync per doc or per effort, with merge of offline edits.
- Share one doc by link or invite. Roles: Viewer and Commenter.
- Commenters comment and suggest. Person mentions.
- Email notifications.
- Connector for outside agent apps.

**Done when:** a user can write on desktop, continue on web, share a draft by link with a person who has no account, receive comments and suggestions from a signed-in Commenter, and edit the same synced doc from Claude or another connected agent app.

### M4 — Later v2

Order inside M4 is not set.

- Local markdown files: linked folders on desktop, two-way.
- Reminders: device notification and email.
- Installed-agent picker on desktop (Claude Code, Codex and similar).
- Provider sign-in as a way to connect an agent.
- Local model endpoints.
- Video uploads.
- Diagrams, declarative charts, rendered previews (maths, CSV, markdown, mermaid).
- Real-time co-editing, presence, and the Editor role.
- Spotify as a second music source.

## 8. Functional requirements

Each requirement has an ID and a milestone.

### 8.1 Library and efforts

| ID | Requirement | M |
|---|---|---|
| LIB-1 | The library lists the user's efforts. Opening an effort lists its docs. | M1 |
| LIB-2 | The user can create, rename and delete efforts. | M1 |
| LIB-3 | A doc belongs to exactly one effort. The user can move a doc to another effort. | M1 |
| LIB-4 | On first run the app shows the five effort types and the user creates their first effort, with an optional goal. This is the only step before the bare editor, and it happens once. | M1 |
| LIB-5 | An effort has a type: journal, book, blog, newsletter or essays. The type sets the icon and a suggested starting goal. | M1 |
| LIB-6 | **Journal behaviour:** one dated entry per day. Opening the effort opens today's entry and creates it if absent. Entries list by date. | M1 |
| LIB-7 | **Book behaviour:** docs are chapters in an order the user sets and can change. The book has a total word target and a target date. The effort shows total words against the target. | M1 |
| LIB-8 | **Blog, newsletter, essays behaviour:** standalone docs sorted by date. The three differ only by label and icon. They have no total word target; only a book has one. | M1 |
| LIB-9 | Docs within an effort can be searched, sorted and pinned. | M1 |
| LIB-10 | Library search covers titles and full text of all local docs, and works offline. | M1 |
| LIB-11 | Deleting a doc or an effort moves it to Trash. The user can restore it or empty the trash. Items leave the trash on their own after 30 days. | M1 |

### 8.2 Goals, streaks and sessions

| ID | Requirement | M |
|---|---|---|
| GOAL-1 | Each effort can have a daily goal: a number of words, and the weekdays the user means to write. | M1 |
| GOAL-2 | While the user writes in an effort with a goal, the editor shows a quiet progress bar toward today's goal. Focus mode can hide it. | M1 |
| GOAL-3 | Each goal day on which the goal is met adds one to the effort's streak. Meeting the goal on an off day also adds one. | M1 |
| GOAL-4 | A goal day that ends with the goal unmet resets the streak to zero. Off days never reset it. The effort keeps its longest streak as a record. | M1 |
| GOAL-5 | Only words the user types count toward the goal. Text the agent writes, including accepted suggestions, does not count. | M2 |
| GOAL-6 | Goals, progress and streaks work fully offline. | M1 |
| GOAL-7 | Today's count is every word the user types that day in the effort. Deleting text never lowers it, so the progress bar never moves backwards. Pasted text does not count. | M1 |
| GOAL-8 | A day ends at local midnight in the device's time zone. The same rule dates journal entries. | M1 |
| SES-1 | Timed writing sessions as in v1: the user sets a length in minutes and can turn on automatic focus mode, automatic music, and a notification at the target. Sessions can be paused, resumed and stopped. | M1 |
| SES-2 | A finished session records duration, starting and ending word count, the doc and its effort. | M1 |
| SES-3 | A session history view lists past sessions with doc, effort, words written and duration. | M1 |
| REM-1 | Each effort can have a reminder time. The desktop app, and the installed web app where the browser allows it, show a local notification. Works offline. | M4 |
| REM-2 | Signed-in users can also get the reminder by email. Online only. | M4 |

### 8.3 Docs and tabs

| ID | Requirement | M |
|---|---|---|
| DOC-1 | A doc has a title and at least one tab. | M1 |
| DOC-2 | The user can add, rename, reorder and delete tabs, and nest a tab under another as a subtab. Deleting a tab with subtabs asks whether to keep or remove them. | M1 |
| DOC-3 | A tab list shows tabs, subtabs and the heading outline of the open tab. It is closed by default. | M1 |
| DOC-4 | Changes save automatically. A manual save shortcut and a saving indicator remain, as in v1. | M1 |
| DOC-5 | Live word count for the open tab, as in v1. | M1 |
| DOC-6 | Reading view shows the doc without editing controls. | M1 |
| DOC-7 | In-doc find and replace. | M1 |
| DOC-8 | Every doc must export to Markdown with no lost text. This rule protects the M4 markdown-files feature and any later mobile app. | M1 |

### 8.4 Editing

The full editor capability list is section 9. Product-level requirements:

| ID | Requirement | M |
|---|---|---|
| ED-1 | Blocks: paragraph, headings 1–6, bullet, numbered and check lists (nested), blockquote, divider, table, code block with syntax colour, image, video by URL. | M1 |
| ED-2 | Inline formatting: bold, italic, underline, strikethrough, inline code, highlight (several colours), link, text colour. | M1 |
| ED-3 | Inline chips: mention of a tab or a doc, date, dropdown, emoji. | M1 |
| ED-4 | Mention of a person. Limited to people the doc is shared with. A mention in doc text notifies no one. | M3 |
| ED-5 | Insert menus: `/` for blocks, `@` for mentions and dates, `:` for emoji. | M1 |
| ED-6 | Markdown shortcuts while typing, as in v1. | M1 |
| ED-7 | Toolbar, fixed or floating, chosen in settings, as in v1. The v1 crash on switching mode must not return. | M1 |
| ED-8 | Tables: Tab adds a row; a cell menu adds and deletes rows and columns, merges cells and sorts a column; column widths, alignment and cell colours. | M1 |
| ED-9 | Collapsible heading sections. | M1 |
| ED-10 | Ticked checklist items show struck through and dimmed. | M1 |
| ED-11 | Undo and redo. Keyboard shortcuts for every mark and block type. | M1 |
| ED-12 | Code blocks show code with syntax colour only. Rendered previews are M4. | M1 |
| ED-13 | Rendered previews: LaTeX as maths, CSV as a table, markdown as formatted text, mermaid as a diagram. | M4 |
| ED-14 | Diagrams and declarative charts (the agent supplies data and a chart type; it writes no drawing code). Provided by the editor library. | M4 |

### 8.5 Media

| ID | Requirement | M |
|---|---|---|
| MED-1 | Images by paste, drag or file picker, with alt text. Stored on the device. | M1 |
| MED-2 | Images upload to the backend only when their doc is synced or shared. | M3 |
| MED-3 | Video by URL (YouTube, Vimeo and similar). The app saves the link; the editor library handles selection and rendering. Playback needs the network. | M1 |
| MED-4 | Video file uploads. | M4 |
| MED-5 | Data file uploads (CSV) as chart sources. | M4 |

### 8.6 Version history

| ID | Requirement | M |
|---|---|---|
| HIS-1 | Each doc keeps a local version history. The user can view an earlier version and restore it. Works offline on every platform with no extra tool. | M1 |
| HIS-2 | A restore point is recorded before each agent edit. | M2 |
| HIS-3 | A restore point is recorded before each sync merge. | M3 |
| HIS-4 | Desktop keeps every version for as long as the doc exists. The web app keeps versions from the last 90 days. | M1 |
| HIS-5 | Version history stays on the device where it was made and does not sync. A new device starts its history at first sync. | M3 |

### 8.7 Import and export

| ID | Requirement | M |
|---|---|---|
| EXP-1 | Export to Word, PDF and Markdown. | M1 |
| EXP-2 | The user can export the open tab, the whole doc (all tabs in order), or a whole effort. A book effort exports as one file with chapters in order. An effort exported to Markdown gives one file per doc. | M1 |
| EXP-3 | All exports are made on the device and work offline. | M1 |
| EXP-4 | Import a Markdown file as a new doc. | M1 |
| EXP-5 | Formatting that Markdown cannot hold (for example underline, text colour, merged cells, chips) degrades by a written rule. Text is never dropped. | M1 |

### 8.8 Writing environment (kept from v1)

| ID | Requirement | M |
|---|---|---|
| WR-1 | Focus mode fades all interface chrome; it returns on hover. | M1 |
| WR-2 | Music player: built-in YouTube stream channels and a custom YouTube URL, volume, play and pause. Off by default. Works only online. | M1 |
| WR-3 | Spotify account as a second music source. Online only. | M4 |
| WR-4 | Themes: light, dark, system. Title font and body font chosen from a set. | M1 |
| WR-5 | Single-key and modifier shortcuts as in v1, extended to the new features. | M1 |
| WR-6 | Quick-start dialog (recent docs and common actions) and help dialog (shortcut list). | M1 |
| WR-7 | Profile name: the author name shown on the user's docs, comments, suggestions and exports. Works with no account. On sign-in it becomes the account display name. | M1 |
| WR-8 | Settings keep the v1 groups (general, appearance, editor, writing, music, advanced, profile) and add agents, account, sync and privacy as those features arrive. | M1+ |

### 8.9 Accounts

| ID | Requirement | M |
|---|---|---|
| ACC-1 | No account is needed for any M1 feature, ever. | M1 |
| ACC-2 | An account is needed to use agents. | M2 |
| ACC-3 | An account is needed to sync, to share, to comment on another person's doc, and to use the connector. | M3 |
| ACC-4 | A signed-out user keeps full use of all local docs. Signing out removes nothing from the device. | M2 |
| ACC-5 | The user can delete their account and everything the backend holds for it. | M2 |
| ACC-6 | Sign-in must work on desktop and web, and a person with no password manager must be able to use it. The sign-in method is chosen in the tech phase. | M2 |

### 8.10 Agents

**Connection**

| ID | Requirement | M |
|---|---|---|
| AGT-1 | The user connects an agent by entering a provider API key. Supported: Anthropic, OpenAI, Google, OpenRouter, and a custom endpoint at a public URL. | M2 |
| AGT-2 | Keys are stored encrypted in the user's Aurelius account and work on every device the user signs in to. | M2 |
| AGT-3 | The user can connect several agents and marks one as the default. | M2 |
| AGT-4 | `@Aurelius` always addresses the default agent. To use another agent, the user changes the default in settings. | M2 |
| AGT-5 | All agent requests go through the Aurelius backend. The apps make no direct call to a provider. | M2 |
| AGT-6 | The backend keeps request metadata only: who, when, which provider, how much was used. It keeps no doc text, no prompts and no agent replies. | M2 |
| AGT-7 | When the device is offline, all agent features are off and say why. Nothing is queued for later. | M2 |
| AGT-8 | Installed-agent picker on desktop: use an agent already on the machine (Claude Code, Codex and similar). | M4 |
| AGT-9 | Provider sign-in as a connection method, where the provider permits it. | M4 |
| AGT-10 | Custom endpoints at a local address (local models). | M4 |

**In-app surfaces**

| ID | Requirement | M |
|---|---|---|
| AGT-11 | A chat panel beside the doc. Closed by default. | M2 |
| AGT-12 | Chat history is kept per doc, on the device, private to the user. The user can clear it. It is not synced and collaborators never see it. | M2 |
| AGT-13 | Writing `@Aurelius` in a comment summons the agent. It replies in that thread and makes any requested change, linked to the thread. | M2 |
| AGT-14 | The agent can leave its own comments while drafting. | M2 |

**What the agent can do and see**

| ID | Requirement | M |
|---|---|---|
| AGT-15 | Doc tools: read the outline and any part of the open doc; search within it; insert, replace, delete and move content; create, rename and reorder tabs; create a new doc; comment and reply. | M2 |
| AGT-16 | Web search, using the provider's built-in search where the provider offers one. Where it does not, the agent works without search and the app says so. | M2 |
| AGT-17 | The agent sees the open doc, its comments and its images. It sees another doc only when the user mentions or attaches it. It has no silent access to the library. | M2 |
| AGT-18 | A doc the agent creates goes into the effort that is open. | M2 |
| AGT-19 | No user-added connectors or tools for the in-app agent. | — |

**How the agent changes text**

| ID | Requirement | M |
|---|---|---|
| AGT-20 | A change to existing text arrives as a suggestion. This is the default for every doc. | M2 |
| AGT-21 | The agent edits directly, with no suggestion step, only in sections it creates itself (new docs, pending blocks, new sections). | M2 |
| AGT-22 | The user can switch a doc to direct mode. The agent then edits all text directly. The switch is per doc and visible. | M2 |
| AGT-23 | When the agent creates a doc it first lays out a skeleton: title and one pending block per section, each with a line saying what will go there. It then fills the sections one at a time, and each appears when complete. | M2 |
| AGT-24 | If the user and the agent change the same place at the same moment, the user's change wins. | M2 |
| AGT-25 | The agent locks nothing. The user can keep typing while it works. | M2 |

**Shared docs**

| ID | Requirement | M |
|---|---|---|
| AGT-26 | In a shared doc, each person's `@Aurelius` runs on that person's own agent and key, with that person's access to the doc. A person with no agent connected cannot summon one. | M3 |

### 8.11 Comments

| ID | Requirement | M |
|---|---|---|
| COM-1 | A comment anchors to a text range, an inline chip, a table cell, or a suggestion; or is an unanchored note on the whole tab. | M2 |
| COM-2 | Threads have replies and can be resolved and reopened. | M2 |
| COM-3 | If the anchored text is removed, the thread detaches and stays in the comments list. | M2 |
| COM-4 | A comments panel lists threads for the open tab. Comments can be shown or hidden. The panel is closed by default. | M2 |
| COM-5 | The owner can comment on their own local doc with no account and no network. | M2 |
| COM-6 | Commenters on a shared doc can write, reply, resolve and mention people. | M3 |
| COM-7 | A comment written offline on a shared doc is sent on reconnect. | M3 |
| COM-8 | Anchors on chart and diagram parts. | M4 |
| COM-9 | Limits, copied from Claude Docs: 1,000 threads per doc, 100 comments per thread, about 4,000 characters (4,096 bytes) per comment. | M2 |

### 8.12 Suggestions

| ID | Requirement | M |
|---|---|---|
| SUG-1 | A suggestion shows the proposed insertion or deletion in place, and as a card with accept and reject. | M2 |
| SUG-2 | One agent change is one card, even when it touches several places. | M2 |
| SUG-3 | Each suggestion shows its author: the agent or a named person. | M2 |
| SUG-4 | The author can withdraw a suggestion. | M2 |
| SUG-5 | Only the doc owner accepts or rejects. | M2 |
| SUG-6 | A Commenter can suggest text changes on a shared doc. The owner sees them as the same cards. | M3 |
| SUG-7 | Reviewing suggestions already on the device works offline. | M2 |

### 8.13 Sync

| ID | Requirement | M |
|---|---|---|
| SYN-1 | Sync is off by default. The user turns it on for one doc, or for a whole effort so every doc in it and every new doc follows. | M3 |
| SYN-2 | Turning sync on tells the user plainly that the doc becomes readable by the Aurelius backend. | M3 |
| SYN-3 | Edits made offline on two devices merge on reconnect with no dialog and no lost text. If both devices changed the same sentence, both versions stay in the text for the user to tidy. | M3 |
| SYN-4 | Turning sync off stops further copying and lets the user remove the backend copy. | M3 |
| SYN-5 | Agent chat history, version history and device settings do not sync. | M3 |
| SYN-6 | Syncing an effort also syncs its goal, streak and session history, so one goal and one streak hold across devices. | M3 |

### 8.14 Sharing

| ID | Requirement | M |
|---|---|---|
| SHR-1 | Docs are private by default. Sharing is always one doc at a time. | M3 |
| SHR-2 | Sharing a doc turns sync on for it, with the same notice as SYN-2. | M3 |
| SHR-3 | Roles: Viewer (read) and Commenter (read, comment, suggest). Only the owner edits the text. | M3 |
| SHR-4 | "Anyone with the link" gives view access with no account. | M3 |
| SHR-5 | Commenters are invited by email and need an account. | M3 |
| SHR-6 | Only the owner renames, deletes, shares, or changes roles. The owner can remove any person or switch the link off at any time. | M3 |
| SHR-7 | Moving a shared doc to Trash ends its sharing at once. | M3 |
| SHR-8 | A doc shared with a signed-in person stays readable offline on their device once opened. | M3 |
| SHR-9 | Editor role, real-time co-editing and presence. | M4 |

### 8.15 Notifications

| ID | Requirement | M |
|---|---|---|
| NOT-1 | Email for a new comment, reply, mention in a comment, or suggestion, sent to the owner and to invited people on that doc. | M3 |
| NOT-2 | Link-only viewers get no notifications. | M3 |
| NOT-3 | No in-app notifications list. The doc itself shows unread comments. | M3 |

### 8.16 Connector for outside agents

| ID | Requirement | M |
|---|---|---|
| CON-1 | The user can add Aurelius as a connector inside an outside agent app and work on their docs from there. The conversation happens in that app. | M3 |
| CON-2 | The connector needs an Aurelius account and the network. | M3 |
| CON-3 | It reaches only docs the user has synced or shared. Local docs are invisible to it. | M3 |
| CON-4 | An outside agent acts as the user, with the user's access. | M3 |
| CON-5 | It offers the same doc tools as the in-app agent (AGT-15) and follows the same rule: changes to existing text arrive as suggestions unless the doc is in direct mode. | M3 |

### 8.17 Local markdown files

| ID | Requirement | M |
|---|---|---|
| MDF-1 | Desktop only. The user links an effort to a folder on disk. Each doc is one `.md` file in that folder. | M4 |
| MDF-2 | The link is two-way. Edits in Aurelius write to the file. Edits made to the file by another tool are read back in. | M4 |
| MDF-3 | The database stays the store. Comments, suggestions, version history and chat stay in the database, so the files stay clean Markdown. | M4 |
| MDF-4 | The PRD for M4 must set: how a doc with several tabs maps to files, what happens when a file changes on disk while the doc has unsaved edits, and how renames and deletes on disk are handled. | M4 |

### 8.18 Privacy and usage data

| ID | Requirement | M |
|---|---|---|
| PRV-1 | The apps collect anonymous feature-use counts and crash reports, sent only when online. The counts must be enough to report the measures in section 3.3, and no more. | M1 |
| PRV-2 | Never collected: doc text, titles, comments, prompts, agent replies, API keys. | M1 |
| PRV-3 | One switch in settings turns collection off. Settings list exactly what is collected. | M1 |
| PRV-4 | The web app, when used with no account, warns that the browser can clear its storage, and points to export or sync. | M1 |

### 8.19 General

| ID | Requirement | M |
|---|---|---|
| GEN-1 | English only. | M1 |
| GEN-2 | Every feature is usable by keyboard. Screen-reader basics (roles, labels, focus order) are required. | M1 |
| GEN-3 | Desktop and web offer the same features, except where section 11 says otherwise. | M1 |
| GEN-4 | Doc size and image size limits are set by the product owner before each milestone ships, from measurement of what the editor and storage handle well. They are not guessed in advance. | M1+ |

## 9. Editor library requirements

This is the full list of what the rich-text markdown editor library must provide. The library is built separately; compare this list against it to find the missing pieces. Each item carries the milestone that first needs it.

### 9.1 Document schema — blocks

| # | Capability | M |
|---|---|---|
| E-1 | Paragraph; headings levels 1–6 | M1 |
| E-2 | Bullet list, ordered list (with start number), check list (with checked state); nesting; mixed nesting | M1 |
| E-3 | Blockquote; divider | M1 |
| E-4 | Table: header cells, column span and row span, column widths, cell alignment, a fixed set of cell colours | M1 |
| E-5 | Code block with a language attribute and syntax colour | M1 |
| E-6 | Image block: source, alt text, caption, width, alignment; selects as one object | M1 |
| E-7 | Video embed block from a URL (YouTube, Vimeo and similar); selects as one object | M1 |
| E-8 | Pending placeholder block carrying a line of intent text; visibly "being written"; replaceable as a unit | M2 |
| E-9 | Rendered preview blocks: LaTeX maths, CSV table, markdown, mermaid | M4 |
| E-10 | Diagram block and declarative chart block, with a spec agents can write as data | M4 |
| E-11 | Uploaded video block | M4 |

### 9.2 Document schema — inline

| # | Capability | M |
|---|---|---|
| E-12 | Marks: bold, italic, underline, strikethrough, inline code, link | M1 |
| E-13 | Highlight mark in several colours; text colour mark | M1 |
| E-14 | Inline atom nodes: mention (tab, doc), date chip, dropdown chip with an options list, emoji, soft line break | M1 |
| E-15 | Inline atom: mention of a person | M3 |

### 9.3 Input and interaction

| # | Capability | M |
|---|---|---|
| E-16 | Markdown shortcuts while typing (headings, lists, quote, code, divider, marks) | M1 |
| E-17 | `/` insert menu, `@` mention and date menu, `:` emoji menu, each with a pluggable item source | M1 |
| E-18 | Keyboard shortcut for every mark and block type; shortcut map can be replaced by the app | M1 |
| E-19 | Toolbar hooks for a fixed toolbar and a floating selection toolbar; switching between them at run time | M1 |
| E-20 | Link create and edit dialog hook | M1 |
| E-21 | Paste and drop: rich text, plain text, Markdown, image files; image paste and drop hand the file to the app for storage | M1 |
| E-22 | Undo and redo that treat one programmatic change as one step | M1 |
| E-23 | Collapsible heading sections | M1 |
| E-24 | Table editing: Tab adds a row; cell menu to add and delete rows and columns, merge and split cells, sort a column | M1 |
| E-25 | Ticked check-list items render struck through and dimmed | M1 |
| E-26 | Input method editor and full Unicode support | M1 |
| E-27 | In-place text editing of diagram and chart labels | M4 |

### 9.4 Modes

| # | Capability | M |
|---|---|---|
| E-28 | Editable mode and read-only mode (reading view, Viewer role) | M1 |
| E-29 | Comment-only mode: the person can select text and attach comments but cannot change text | M3 |
| E-30 | Suggesting mode: a person's typing creates suggestions, not edits | M3 |
| E-31 | Theming: fonts for title and body, light and dark colours, set by the app at run time | M1 |

### 9.5 Reading the document

| # | Capability | M |
|---|---|---|
| E-32 | Stable identifier on every block that survives edits, saves and merges | M1 |
| E-33 | Outline: headings with level and block identifier | M1 |
| E-34 | Word count for the whole document and for the selection, updated live | M1 |
| E-35 | Find and replace across the document | M1 |
| E-36 | Change events suited to autosave, word count and goal progress, with the origin of each change (person, agent, sync) | M1 |
| E-37 | Read a subtree by block identifier; search by text and return positions | M2 |
| E-38 | A revision marker for the document and a content fingerprint per block, so a caller can tell whether what it read is still current | M2 |
| E-39 | Read what changed since a given revision | M2 |

### 9.6 Programmatic edit API (used by agents and the connector)

| # | Capability | M |
|---|---|---|
| E-40 | Insert, replace, delete and move blocks; set block attributes; wrap, unwrap and join blocks | M2 |
| E-41 | Replace content from plain text, from Markdown, from structured blocks, or from inline runs | M2 |
| E-42 | Table operations: add, delete and move rows and columns; set a cell | M2 |
| E-43 | Targets: a block identifier, text found in the document (with "nth match" and "within this cell"), a character range, a table cell, the document root | M2 |
| E-44 | Atomic batch: several operations apply together or not at all | M2 |
| E-45 | Guards: apply only if the block fingerprint or document revision still matches; otherwise refuse and report | M2 |
| E-46 | A person's concurrent edit wins over a programmatic edit to the same place | M2 |
| E-47 | Programmatic edits never move the person's cursor, selection or scroll position | M2 |
| E-48 | Every change carries an author (a person or an agent) | M2 |

### 9.7 Suggestions (tracked changes)

| # | Capability | M |
|---|---|---|
| E-49 | Represent insert, delete, attribute change and structure change (wrap, join) as suggestions layered on the text | M2 |
| E-50 | Any programmatic edit can be applied as a suggestion instead of a direct change | M2 |
| E-51 | Group the changes of one operation into one card; accept, reject or withdraw the whole card | M2 |
| E-52 | Author and time on each suggestion | M2 |
| E-53 | Inline rendering of proposed insertions and deletions; a way for the app to list all open suggestions | M2 |
| E-54 | Correct behaviour when the text under a suggestion is edited or when suggestions overlap | M2 |

### 9.8 Comment anchors

| # | Capability | M |
|---|---|---|
| E-55 | Anchor on a text range, an inline atom, a table cell, or a suggestion | M2 |
| E-56 | Anchors follow their text through edits and merges | M2 |
| E-57 | Report when an anchor's text is gone, so the app can detach the thread | M2 |
| E-58 | Highlight decoration for anchors; show and hide; active-thread state | M2 |
| E-59 | Anchors on parts of a diagram or chart | M4 |

### 9.9 Markdown and export

| # | Capability | M |
|---|---|---|
| E-60 | Markdown import and export covering every M1 block and mark | M1 |
| E-61 | A written degrade rule for each feature Markdown lacks; text is never dropped | M1 |
| E-62 | A serialisable document model the app can turn into Word and PDF, and a print-quality rendering | M1 |
| E-63 | Round trip to Markdown files without churn: a region the user did not touch keeps its exact bytes; front matter is kept as written | M4 |

### 9.10 History and merge

| # | Capability | M |
|---|---|---|
| E-64 | Snapshot the document and restore a snapshot | M1 |
| E-65 | Merge two edit histories made apart (two devices, both offline) into one document with no lost text; block identifiers, comment anchors and suggestions survive the merge | M3 |
| E-66 | Live merge of several people's edits, with presence and cursors | M4 |

### 9.11 Quality

| # | Capability | M |
|---|---|---|
| E-67 | Runs in the desktop app and in current browsers with no network resource | M1 |
| E-68 | Stays responsive on a book-length chapter (size target to be set) | M1 |
| E-69 | Keyboard access to every action; screen-reader roles and labels | M1 |

## 10. Online and offline

| Feature | Offline | Needs network | Needs account | M |
|---|---|---|---|---|
| Write and edit; tabs; outline | Yes | — | No | M1 |
| Efforts; goals; progress bar; streaks | Yes | — | No | M1 |
| Focus mode; timed sessions; session history; word count; reading view | Yes | — | No | M1 |
| Themes; fonts; shortcuts; settings | Yes | — | No | M1 |
| Version history and restore | Yes | — | No | M1 |
| Trash and restore | Yes | — | No | M1 |
| Library search; find and replace | Yes | — | No | M1 |
| Add and view images | Yes | — | No | M1 |
| Add a video link | Yes | Playback only | No | M1 |
| Music player | No | Yes | No | M1 |
| Export Word, PDF, Markdown; import Markdown | Yes | — | No | M1 |
| Send usage data | No | Yes | No | M1 |
| Write and read own comments | Yes | — | No | M2 |
| Review, accept, reject suggestions already received | Yes | — | No | M2 |
| Read past agent chat | Yes | — | No | M2 |
| Sign in; manage agent keys | No | Yes | Yes | M2 |
| Agent chat; `@Aurelius`; agent drafting and edits; web search | No | Yes | Yes | M2 |
| Edit a synced doc | Yes; merges on reconnect | To sync | Yes | M3 |
| Turn sync on or off | No | Yes | Yes | M3 |
| Share a doc; change roles; switch a link off | No | Yes | Yes | M3 |
| Open a shared link as a viewer | No | Yes | No | M3 |
| Read a shared doc opened before | Yes | — | Yes | M3 |
| Comment or suggest on a shared doc | Yes; sent on reconnect | To send | Yes | M3 |
| Email notifications | No | Yes | Yes | M3 |
| Connector for outside agents | No | Yes | Yes | M3 |
| Linked markdown folders (desktop) | Yes | — | No | M4 |
| Reminder as device notification | Yes | — | No | M4 |
| Reminder by email | No | Yes | Yes | M4 |
| Spotify | No | Yes | Spotify account | M4 |
| Real-time co-editing | No | Yes | Yes | M4 |

**Behaviour on change of connectivity**

- The app detects the change and switches features with no restart.
- A small indicator shows the offline state. No dialog appears.
- Controls that need the network stay visible, disabled, with a one-line reason.
- Work in progress is never lost. An agent request cut off by a drop ends with a clear message; what the agent already wrote stays, and version history holds the state before it began.

## 11. Platform differences

| | Desktop | Web |
|---|---|---|
| Operating systems | macOS, Windows, Linux. macOS first if a sequence is needed. | Current browsers; installable; works offline after first load |
| Storage | Local database on disk | Local database in browser storage; warn that the browser can clear it (PRV-4) |
| Version history kept | Every version, as long as the doc exists | Last 90 days |
| Linked markdown folders (M4) | Yes | No |
| Installed-agent picker (M4) | Yes | No |
| Reminder notifications (M4) | Yes | Only when installed and the browser allows |
| Everything else | Same | Same |

## 12. Deferred and out of scope

**Deferred to M4** — listed in section 7.

**Outside v2**

- Mobile apps.
- v1 data import.
- Doc to slides; Google Docs and Notion export; templates gallery.
- Scheduled agent runs.
- User-added tools or connectors for the in-app agent.
- An in-app picker to choose an agent per request.
- An in-app notifications list.
- Sharing a whole effort.
- Organisation and group administration.
- End-to-end encryption for shared or synced docs.
- Agent-written chart code.
- v1's books, chapters, essays and journals tables (replaced by effort types).

## 13. Claude Docs parity map

| Claude Docs feature | Aurelius v2 | M |
|---|---|---|
| Docs with tabs and subtabs | Same | M1 |
| Text blocks, lists, tables, code, images | Same | M1 |
| Inline marks, chips (date, dropdown, tab and doc mention, emoji) | Same | M1 |
| `/`, `@`, `:` menus; collapsible headings; outline; autosave | Same | M1 |
| Version history | Same, and it works offline | M1 |
| Export to Word, PDF, Markdown | Same, plus whole-doc and whole-effort export | M1 |
| Agent drafts a doc from a skeleton of pending sections | Same | M2 |
| Agent edits text directly by default | **Differs:** suggestions by default; direct mode is a per-doc switch | M2 |
| Suggestions with accept and reject | Same | M2 |
| Comment threads, replies, resolve, detach | Same | M2 |
| `@Claude` in a comment | `@Aurelius` | M2 |
| "Send to Claude" checkbox on a comment | Not copied; the mention is the only trigger | — |
| Claude's own context (memory, projects, skills, connectors) | Not copied; the agent has doc tools and web search | M2 |
| One agent (Claude) | **Beyond parity:** any provider, several agents, one default | M2 |
| Use from Claude's other surfaces through the Docs connector | Connector for any agent app that supports one | M3 |
| Sharing roles Viewer, Commenter, Editor | Viewer and Commenter; Editor later | M3 / M4 |
| "Anyone with the link" needs sign-in | **Differs:** no account to view | M3 |
| Person mentions; email notifications for comments | Same | M3 |
| Human suggesting mode | Same, for Commenters | M3 |
| Edits appear in real time | Later | M4 |
| Video | By URL first; uploads later | M1 / M4 |
| Rendered previews (LaTeX, CSV, markdown, mermaid) | Later | M4 |
| Charts and diagrams | Later, declarative only | M4 |
| Comment on a chart part | Later, with charts | M4 |
| Data file uploads | Later, with charts | M4 |
| Permanent deletion, no trash | **Differs:** trash with restore | M1 |
| Docs cannot be grouped | **Differs:** efforts | M1 |
| Organisation and group sharing; external-invite limits | Out | — |
| Export to Google Docs, Notion; doc to slides; templates; scheduled runs | Out | — |
| Mobile apps | Out of v2 | — |

## 14. Open items

**To verify before the milestone that depends on it**

| # | Item | Blocks |
|---|---|---|
| O-1 | Which providers offer built-in web search through their API, and what a custom endpoint can offer. | M2 |
| O-2 | Claude Docs version history: the help article and the connector guide say it exists; one search snippet said it does not yet. Check by hand. Does not change AGT or HIS requirements. | — |
| O-3 | Whether Anthropic's terms allow a Claude subscription to be used through an installed agent hosted by a third-party app. | M4 (AGT-8) |
| O-4 | OpenAI "Sign in with ChatGPT" access for a hosted, paid app (waitlist). | M4 (AGT-9) |
| O-5 | Connector limits in outside apps at the time of M3: ChatGPT allowed write actions only on Business plans and above; the Gemini app allowed custom connectors only for US personal accounts. | M3 |

**To decide**

| # | Item | Needed by |
|---|---|---|
| D-1 | Doc size and image size limits, from measurement (GEN-4). | Each milestone |
| D-2 | Sign-in method for accounts (ACC-6). Chosen in the tech phase. | M2 |
| D-3 | Which online features need a paid plan, and prices. | Before M2 ships |
| D-4 | Targets for the success measures in section 3.3. | After M1 has usage |

## 15. Decision log

| Q | Decision |
|---|---|
| 1 | Primary persona is the focused writer; agent collaboration enhances it. Individuals and small teams. |
| 2, 17 | The agent works inside Aurelius as in Claude Docs, and Aurelius is also a connector for outside agent apps. |
| 3, 23, 54 | All data in a local database. Local markdown files are M4: linked folder per effort, desktop only, two-way. |
| 4, 56 | No account for offline features. Agents need an account. |
| 5, 51 | Local by default. Sync per doc or per effort. Share one doc at a time. |
| 6 | The web app works fully offline. |
| 7 | macOS, Windows, Linux; macOS first if sequenced. |
| 8, 55 | Full scope in four milestones. |
| 9 | No v1 data import. |
| 10 | Mobile is a non-goal that nothing may block. Offline free; online may be paid. |
| 11 | Keep all working v1 features plus efforts, daily goal and profile name. Drop the books/chapters/essays/journals tables. |
| 12 | Parity covers the doc product, not the Anthropic ecosystem features. |
| 13, 43 | Real-time co-editing deferred. Roles are Viewer and Commenter until then. |
| 14, 50 | Charts, diagrams and rendered previews deferred; declarative when they come. |
| 15 | Local version history with restore, offline. |
| 16 | This document lists the full editor requirement set (section 9). |
| 18, 28, 30, 59 | Connect by API key: Anthropic, OpenAI, Google, OpenRouter, custom public URL. Installed agents, provider sign-in and local endpoints are M4. |
| 19, 29 | Many agents, one default. `@Aurelius` goes to the default; changed in settings. |
| 20 | Agent changes to existing text are suggestions by default. |
| 21, 31, 59 | Offline means all agent features are off. |
| 22 | The agent sees the open doc; other docs only when mentioned or attached. |
| 24, 37–39 | Library organised by efforts. Five types, three behaviours. |
| 25 | Bare editor on open. |
| 26 | No account to view a shared link; an account to comment. |
| 27, 58 | Local docs stay on the device; text passes through Aurelius only during an agent request and is not stored. Shared and synced docs are readable by the backend. |
| 32, 57 | Keys stored encrypted in the account. |
| 33 | In a shared doc each person uses their own agent. |
| 34 | Agent has doc tools and provider web search. |
| 35 | Chat kept per doc, private, on the device. |
| 36 | Connector reaches synced docs only. |
| 40 | Daily goal per effort: words per day on chosen weekdays, progress bar, streak. |
| 41, 47 | Reminders in M4: device notification and email. |
| 42 | Profile name is the author name everywhere. |
| 44 | Commenters can suggest. |
| 45 | Offline edits on two devices merge with no lost text. |
| 46 | Email notifications only. |
| 48 | Images on device; video by URL; video uploads in M4. |
| 49 | Trash with restore, 30 days. |
| 52 | Export a tab, a doc or an effort. |
| 53 | Anonymous usage data with opt-out. |
| — | M2 has a minimal backend; the apps make no direct provider calls. Spotify is M4. |
| — | First run: the user picks a type and creates their first effort. A missed goal day resets the streak. Only typed words count toward a goal. A synced effort syncs its goal, streak and session history. |
| — | Goal counts typed words; deletions and pasted text are ignored. A day ends at local midnight. History: every version on desktop, last 90 days on web, never synced. Comment limits copied from Claude Docs; size limits set from measurement. Only a book has a total target. Sign-in method and paid features left open. Success measures named, no targets. |

## 16. Sources

**Claude Docs**

- https://support.claude.com/en/articles/16923645-get-started-with-claude-docs
- https://support.claude.com/en/articles/17458093-claude-docs-keyboard-shortcuts
- https://support.claude.com/en/articles/9547008-publish-and-share-artifacts
- https://claude.com/resources/articles/cowork-is-now-claude
- The Claude Docs connector guide (read through the connector on 23 November 2026).

**Efforts**

- https://blurt.app/@coreygwin/introducing-writing-efforts-from-blurt/5c26cf60d7773b010df41168

**Agent connection (checked 23 November 2026)**

- Anthropic, third-party use of subscription sign-in not permitted: https://code.claude.com/docs/en/legal-and-compliance
- OpenAI Sign in with ChatGPT: https://developers.openai.com/siwc/quickstart
- Google, Gemini CLI sign-in not for third-party software: https://www.geminicli.com/docs/resources/tos-privacy
- OpenRouter sign-in: https://openrouter.ai/docs/guides/overview/auth/oauth
- Claude custom connectors: https://support.claude.com/en/articles/11175166-getting-started-with-custom-connectors-using-remote-mcp
- ChatGPT connectors: https://help.openai.com/en/articles/12584461-developer-mode-and-mcp-apps-in-chatgpt
- Gemini app custom apps: https://support.google.com/gemini/answer/17209137
- Agents that can be hosted by another app: https://agentclientprotocol.com/get-started/agents

**Code references**

- Aurelius v1: `v1/app/` in this repository.
- Tolaria: its `docs/adr/` folder, for the M4 markdown-files work.
