---
type: research
title: "Aurelius v1 feature inventory"
ticket: 39
date: 2026-11-26
---

# Aurelius v1 feature inventory

Research note for issue #39 (map: issue #36). It lists what the v1 app in `v1/` does today, what each feature stores and whether it needs the network. It records facts only and makes no recommendation about v2.

## Method

- Read every source file under `v1/app/` except the generic UI primitives in `v1/app/components/ui/`. Also read `v1/vite.config.ts`, `v1/functions/[[path]].ts`, `v1/package.json`, `v1/bun.lock`, `v1/public/site.webmanifest` and `v1/README.md`.
- Read the 17 closed GitHub issues (numbered between #1 and #30) for history.
- Where behaviour lives inside a library (sync, encryption, storage, editor input rules), read the published source of the exact version pinned in `v1/bun.lock`. These facts are marked **(upstream)**. The files are listed under [Sources](#sources).
- The app was not installed or run. A statement that the sources above do not state directly is marked **(inferred)**.
- Paths are relative to the repository root.

## How to read the tables

**Status**

| Status | Meaning |
|---|---|
| Shipped | A user can reach and use it. |
| Partial | A user can set it, but nothing else in the app uses the value. |
| Dormant | Schema or code exists, but no screen reaches it. |
| Absent | Named in the README, the ticket or old issues, but not in the app. |

**Data stores**

| Store | Meaning |
|---|---|
| DB | The local SQLite database managed by Evolu. It is a file (`/evolu1.db`) in the browser's origin private file system, in a pool named `Aurelius` **(upstream)**. Every table syncs in encrypted form, except tables whose name starts with `_` **(upstream)**. |
| LS | Browser `localStorage`. It stays in that browser and never syncs. |
| Memory | React state. It is lost when the page reloads or closes. |

**Network**

| Value | Meaning |
|---|---|
| No | Works offline once the app has loaded. DB changes sync later, when the device is online. |
| Yes | Does not work without the network. |
| Part | The feature works offline but one part of it needs the network. The row says which part. |

## Summary

- 67 inventory entries in 19 areas: 61 shipped, 2 partial, 1 dormant, 3 absent.
- v1 has one kind of document: a **post**, inside one fixed **writing effort** called Posts. A post is a title plus a rich-text body stored as HTML.
- All user data is in the local DB. There is no account and no server database. The server only renders the HTML shell.
- **Not in v1, although named in the ticket:** data export, a what's-new page and a desktop wrapper. Writing goals exist only as a stored setting.
- **Features that need the network:** music playback, embedded YouTube videos, the sync exchange itself, restoring a device from a sync code, the first load or install, the analytics script and external links.

| Needs the network | Entries |
|---|---|
| Yes | V1-MUSIC-1, V1-MUSIC-2, V1-MUSIC-3 (playback); V1-SYNC-3 (restore); V1-SYNC-4 (the sync exchange); V1-PLAT-1 (first load); V1-PLAT-2 (analytics); V1-PWA-1 (install) |
| In part | V1-EDIT-8 (playing an embedded video); V1-TIMER-4 (session music); V1-MUSIC-4 and V1-NAV-1 (external links); V1-PWA-2 (first visit); V1-PWA-3 (full page load of a post, list or new-post address) |
| No | Every other entry |

| Area | Prefix | Entries | Shipped | Partial | Dormant | Absent |
|---|---|---|---|---|---|---|
| Writing efforts and post types | `V1-EFFORT` | 3 | 2 | | 1 | |
| Posts | `V1-POST` | 9 | 9 | | | |
| Editor | `V1-EDIT` | 9 | 9 | | | |
| Timed writing sessions | `V1-TIMER` | 5 | 5 | | | |
| Session history | `V1-HIST` | 1 | 1 | | | |
| Writing goals | `V1-GOAL` | 1 | | 1 | | |
| Focus mode | `V1-FOCUS` | 1 | 1 | | | |
| Music player | `V1-MUSIC` | 4 | 4 | | | |
| Sync | `V1-SYNC` | 5 | 5 | | | |
| Data export | `V1-EXPORT` | 1 | | | | 1 |
| Delete all data | `V1-DEL` | 2 | 2 | | | |
| Settings and themes | `V1-SET` | 4 | 3 | 1 | | |
| Keyboard shortcuts | `V1-KEY` | 3 | 3 | | | |
| Start page | `V1-START` | 2 | 2 | | | |
| Quick Start dialog and what's new | `V1-SPLASH` | 4 | 3 | | | 1 |
| Navigation | `V1-NAV` | 1 | 1 | | | |
| Help and static pages | `V1-HELP` | 4 | 4 | | | |
| PWA and offline | `V1-PWA` | 4 | 4 | | | |
| Platform | `V1-PLAT` | 4 | 3 | | | 1 |
| **Total** | | **67** | **61** | **2** | **1** | **3** |

## Data model

Source: `v1/app/services/evolu/schema.ts`, `v1/app/services/evolu/database.ts`, `v1/app/services/evolu/client.ts`.

Evolu adds `createdAt` and `updatedAt` to every table **(upstream)**. Every table also has an `isDeleted` flag: the app's own delete sets it and the app's read queries skip flagged rows (`v1/app/services/arls.tsx`, lines 65–113).

| Table | Columns | Used by the app |
|---|---|---|
| `posts` | `id`, `author` (nullable), `content` (HTML string), `effortId`, `slug` (1–100 characters), `title` (up to 1000 characters), `type`, `wordCount` | Yes. `author` and `type` are never written. |
| `writingEfforts` | `id`, `name`, `slug`, `type`, `description`, `days`, `time`, `targetWordCount` | One seeded row (Posts). `days`, `time`, `targetWordCount` and `description` are never read. |
| `writingSessions` | `id`, `contentId` (nullable), `effortId`, `duration` (milliseconds), `startingWordCount`, `endingWordCount` | Yes. |
| `settings` | `id`, `bodyFont`, `titleFont`, `toolbarMode`, `startPage`, `showSplashDialog`, `enableMusicPlayer`, `musicChannel`, `youtubeLink`, `writingDailyGoal`, `writingDailyTarget`, `userName`, `exportImageFooter`, `exportImageWatermark` | One seeded row. The last five columns are stored but never read outside Preferences. |
| `_help` | `id`, `content`, `slug`, `title`, `wordCount` | One seeded row: the Getting Started guide. Named as a non-syncing table in the schema. |
| `books`, `chapters`, `essays`, `journals` | Same shape as `posts` (`chapters` belongs to a book) | No. The tables and indexes exist. No screen reads or writes them. |

Seed data for a new owner (`v1/app/services/evolu/client.ts`, lines 46–93): body font Merriweather, title font Inter, toolbar Fixed, start page View All Posts, Quick Start dialog on, music player off, channel LoFi Hip Hop, daily goal Duration 30, and one writing effort named Posts (slug `posts`, Monday to Friday, 12:30, target 300 words).

`localStorage` keys:

| Key | Purpose | Source |
|---|---|---|
| `vite-ui-theme` | Chosen theme. | `v1/app/lib/providers/theme.tsx`, `v1/app/root.tsx` line 244 |
| `aurelius:firstTimeLoaded` | Marks that the first visit has happened. | `v1/app/lib/hooks/useFirstVisit.tsx` |
| `aurelius:isRestoring` | Marks that a restore from a sync code is in progress. | `v1/app/lib/constants.ts`, `v1/app/lib/providers/aurelius.tsx` |
| `evolu:reloadAllTabs` | Set by Evolu to reload other open tabs after a reset or restore **(upstream)**. | `@evolu/common-web` `src/PlatformLive.ts` |

## Inventory

### Writing efforts and post types

| ID | Feature | Status | Description | Data stored | Network | Source |
|---|---|---|---|---|---|---|
| V1-EFFORT-1 | Default writing effort "Posts" | Shipped | Each new owner gets one writing effort named Posts. Every post belongs to it. The user cannot rename it or add another. | DB `writingEfforts` (one row) | No | `v1/app/services/evolu/client.ts` lines 74–91 |
| V1-EFFORT-2 | Effort-scoped addresses | Shipped | Pages are addressed by effort slug: `/:effort` (list), `/:effort/:slug` (read), `/editor/:effort` (new), `/editor/:effort/:slug` (edit). In practice the effort is always `posts`, or `help` for help articles. | None | No | `v1/app/routes/$effort._index.tsx`, `$effort.$slug.tsx`, `editor.$effort_.tsx`, `editor.$effort.$slug.tsx` |
| V1-EFFORT-3 | Other effort types and effort schedule | Dormant | The schema defines four effort types (books, essays, journals, posts), tables for books, chapters, essays and journals, and per-effort `days`, `time` and `targetWordCount`. No screen creates, edits or shows any of them. Issue #8 "Writing Efforts" was closed as not planned. | DB tables exist and stay empty | No | `v1/app/services/evolu/schema.ts` lines 14–19, 78–121, 153–163; `v1/app/services/arls.tsx` lines 186–203 |

### Posts

| ID | Feature | Status | Description | Data stored | Network | Source |
|---|---|---|---|---|---|---|
| V1-POST-1 | Create a post | Shipped | `/editor/posts` opens an empty editor. The first save creates the post and moves to `/editor/posts/<slug>`. | DB `posts` (new row: content, title, slug, word count, effort) | No | `v1/app/routes/editor.$effort_.tsx`, `v1/app/lib/actions.ts` lines 23–49 |
| V1-POST-2 | Autosave | Shipped | Changes save 1 second after typing stops, and a 10-second timer saves anything still pending. Leaving the title field saves at once if the title is not empty. A "Saving..." label shows for 3 seconds. On a new post, typing only a title does not save until the title field loses focus. | DB `posts` (content, title, word count) | No | `v1/app/lib/hooks/useAutoSave.tsx`, `v1/app/components/common/editor.tsx` lines 73–81, 193–206, `v1/app/routes/editor.$effort.$slug.tsx` lines 47–107 |
| V1-POST-3 | Save now | Shipped | `Ctrl+S` saves at once, also from inside the title or body. | DB `posts` | No | `v1/app/lib/hooks/useKeyboardShortcuts.tsx` lines 25–31, `v1/app/components/common/editor.tsx` line 68 |
| V1-POST-4 | Post slug | Shipped | The slug comes from the title at first save, or from "Untitled" if the title is empty. It is made unique within the effort (`untitled`, `untitled-1`, and so on). It does not change when the title changes later. | DB `posts.slug` | No | `v1/app/lib/actions.ts` lines 16–48, `v1/app/lib/utils.ts` lines 46–66 |
| V1-POST-5 | Post list | Shipped | `/posts` shows a table of posts, newest first: title, relative creation date, and View, Edit and Delete buttons. It has a title filter ("Search Posts"), a sort toggle on the date column, a New Post button and an empty-state picture. The filter matches titles only, not body text. | Reads DB `posts`. Filter and sort are in Memory. | No | `v1/app/routes/$effort._index.tsx`, `v1/app/components/common/data-table.tsx`, `v1/app/lib/loaders.ts` lines 76–112 |
| V1-POST-6 | Reading view | Shipped | `/posts/<slug>` shows the post read-only, with the chosen title and body fonts and a link back to the list. | Reads DB `posts` and `settings` | No | `v1/app/routes/$effort.$slug.tsx`, `v1/app/layouts/view.tsx` |
| V1-POST-7 | Delete a post | Shipped | The Delete button in the list asks for confirmation, then hides the post and shows a "Post deleted" message. The row is flagged, not removed. There is no bin, no undo and no purge. | DB `posts.isDeleted` | No | `v1/app/routes/$effort._index.tsx` lines 74–127, 210–250; `v1/app/lib/actions.ts` lines 56–63; `v1/app/services/arls.tsx` lines 65–82 |
| V1-POST-8 | Reset editor | Shipped | "Reset Editor" (key `r`) asks for confirmation, saves the current post, then opens a new empty post. The menu item appears only on `/editor` pages. | None of its own | No | `v1/app/components/editor/reset-editor.tsx`, `v1/app/components/common/editor.tsx` lines 184–187 |
| V1-POST-9 | Word count | Shipped | The bottom-right corner shows "N words". The count is saved with the post and used by writing sessions. | DB `posts.wordCount`; live count in Memory | No | `v1/app/components/common/editor.tsx` lines 163–174, 293; `v1/app/lib/providers/aurelius.tsx` lines 123, 164–166 |

### Editor

| ID | Feature | Status | Description | Data stored | Network | Source |
|---|---|---|---|---|---|---|
| V1-EDIT-1 | Title and body editor | Shipped | A plain-text title field (placeholder "Untitled") sits above a rich-text body (placeholder "Start writing..."). The body is built on Tiptap 2.4 and is saved as an HTML string, not as Markdown. | DB `posts.title`, `posts.content` | No | `v1/app/components/editor/writer.tsx`, `v1/app/components/common/editor.tsx` lines 117–175 |
| V1-EDIT-2 | Formatting set | Shipped | Paragraph; headings 2, 3 and 4 (the title acts as heading 1); bold; italic; underline; strikethrough; highlight; link; inline code; code block; blockquote; bulleted list; numbered list; divider; line break. There are no images, tables or task lists: those Tiptap packages are in `v1/package.json` but the editor does not load them. | Inside `posts.content` | No | `v1/app/components/common/editor.tsx` lines 124–162 |
| V1-EDIT-3 | Markdown shortcuts | Shipped | Typing Markdown marks converts them as you type. See the table below. They are typing aids only. v1 cannot import or export Markdown. | Inside `posts.content` | No | `v1/app/lib/constants.ts` lines 110–181 |
| V1-EDIT-4 | Formatting toolbar | Shipped | Buttons for bold, italic and underline; a style menu (Normal, Heading 2, Heading 3, Heading 4); highlight; link; code block; blockquote. Each button has a tooltip. | None | No | `v1/app/components/editor/editor-toolbar.tsx` |
| V1-EDIT-5 | Toolbar modes | Shipped | Preferences > Editor offers Fixed (toolbar always at the top) or Floating (toolbar appears next to selected text). | DB `settings.toolbarMode` | No | `v1/app/components/common/editor.tsx` lines 246–261, `v1/app/components/common/preferences-dialog.tsx` lines 309–333 |
| V1-EDIT-6 | Links | Shipped | The link button opens an "Insert Link" dialog to set a link on the selection, or to remove an existing link. Clicking a link in the editor does not open it. Typed and pasted web addresses become links automatically **(upstream default)**. | Inside `posts.content` | No | `v1/app/components/editor/link-dialog.tsx`, `v1/app/components/editor/editor-toolbar.tsx` lines 115–141, `v1/app/components/common/editor.tsx` line 140 |
| V1-EDIT-7 | Code blocks with syntax colours | Shipped | Code blocks are coloured with lowlight's common language set, using one fixed colour scheme (Tokyo Night Dark) in both themes. | Inside `posts.content` | No | `v1/app/components/common/editor.tsx` lines 48, 130–135; `v1/app/styles/tokyo-night-dark.css` |
| V1-EDIT-8 | YouTube embed | Shipped | Pasting a YouTube address into the body inserts an embedded video, 762 by 432 pixels **(upstream default)**. There is no button for it. The embed uses the standard YouTube domain, not the no-cookie one **(upstream default)**. | Inside `posts.content` (the video address) | Part: playing the video needs the network | `v1/app/components/common/editor.tsx` lines 136–139 |
| V1-EDIT-9 | Undo and redo | Shipped | The editor's own undo history, for the current page visit only **(inferred from library defaults)**. There is no version history. | Memory | No | `v1/app/components/common/editor.tsx` lines 146–154 |

Markdown shortcuts listed in the help dialog:

| Type this | Result | Works |
|---|---|---|
| `##`, `###`, `####` then space | Heading 2, 3, 4 | Yes **(inferred from library defaults)** |
| `-` then space | Bulleted list | Yes **(inferred)** |
| `1.` then space | Numbered list | Yes **(inferred)** |
| `**text**` | Bold | Yes **(inferred)** |
| `*text*` | Italics | Yes **(inferred)** |
| `~~text~~` | Strikethrough | Yes **(inferred)** |
| `==text==` | Highlight | Yes **(inferred)** |
| `` `text` `` | Inline code | Yes **(inferred)** |
| `` ``` `` | Code block | Yes **(inferred)** |
| `>` then space | Blockquote | Yes **(inferred)** |
| `---` | Divider | Yes **(inferred)** |
| `[text](url)` | Hyperlink | No. The link extension at this version has no such typing rule **(upstream)**. |

### Timed writing sessions

| ID | Feature | Status | Description | Data stored | Network | Source |
|---|---|---|---|---|---|---|
| V1-TIMER-1 | Start a writing session | Shipped | The timer button (key `w`) opens "New Writing Session" with four options: writing time in minutes (default 30, minimum 1), focus mode (default on), play music (off unless the music player is enabled), and notify when the target time is reached (default on). Starting a session outside a post's editor page opens a new empty post. | Memory (session options) | No | `v1/app/components/editor/writing-session-timer.tsx` lines 156–190, 298–421; `v1/app/lib/providers/aurelius.tsx` lines 136–142 |
| V1-TIMER-2 | Timer controls | Shipped | The timer counts up as `hh:mm:ss` in the top-right corner, with Pause, Resume and Stop. It keeps running while the user moves between pages inside the app. It does not survive a reload. | Memory | No | `v1/app/components/editor/writing-session-timer.tsx` lines 134–154, 242–296; `v1/app/lib/providers/aurelius.tsx` line 148 |
| V1-TIMER-3 | Target-reached notice | Shipped | When the elapsed minutes equal the target, an in-app message appears for 10 seconds. It is not a system notification. The session carries on until the user presses Stop. See K18 for a fault in the check. | None | No | `v1/app/components/editor/writing-session-timer.tsx` lines 211–236 |
| V1-TIMER-4 | Session drives focus mode and music | Shipped | If chosen in the dialog, focus mode and music turn on at start and resume, and turn off at pause. Stop turns focus mode off. | Memory | Part: music needs the network | `v1/app/components/editor/writing-session-timer.tsx` lines 134–154; `v1/app/components/common/editor.tsx` lines 216–230 |
| V1-TIMER-5 | Session record | Shipped | Pressing Stop saves one record: the post (if any), the writing effort, the running time in milliseconds, and the word count at the start and at the end. The target time and the chosen options are not saved. The only date is the record's `createdAt`. | DB `writingSessions` | No | `v1/app/components/editor/writing-session-timer.tsx` lines 192–209 |

### Session history

| ID | Feature | Status | Description | Data stored | Network | Source |
|---|---|---|---|---|---|---|
| V1-HIST-1 | Writing sessions list | Shipped | `/sessions` (key `Alt+W`) shows a table: content title (a link to the post's editor), writing effort, words written (end count minus start count) and duration in rounded words such as "5 minutes". It shows "No Content Written" when the session had no post and "Unknown Content" when the post was deleted. There is no date column, sort, filter, total, streak or delete. | Reads DB `writingSessions`, `writingEfforts`, `posts` | No | `v1/app/routes/sessions._index.tsx`, `v1/app/lib/loaders.ts` lines 114–117 |

### Writing goals

| ID | Feature | Status | Description | Data stored | Network | Source |
|---|---|---|---|---|---|---|
| V1-GOAL-1 | Daily writing goal | Partial | Preferences > Writing lets the user pick a daily goal type (Duration in minutes, or Word Count) and a target number (default Duration, 30). Nothing reads the value: there is no progress display, reminder, streak or link to writing sessions. | DB `settings.writingDailyGoal`, `settings.writingDailyTarget` | No | `v1/app/components/common/preferences-dialog.tsx` lines 339–465 |

### Focus mode

| ID | Feature | Status | Description | Data stored | Network | Source |
|---|---|---|---|---|---|---|
| V1-FOCUS-1 | Focus mode | Shipped | Key `f`, or Main menu > Focus Mode. The menu button, session timer, music player, word count, encryption badge and help button fade to 5% opacity and return on hover. The fixed formatting toolbar and the "Saving..." label stay visible. It does not enter full screen. A writing session can switch it on and off (V1-TIMER-4). | Memory | No | `v1/app/components/common/editor.tsx` lines 67, 246–261, 291; `v1/app/components/editor/main-menu.tsx` line 56; `v1/app/components/editor/music-player.tsx` line 45; `v1/app/components/editor/writing-session-timer.tsx` line 240 |

### Music player

| ID | Feature | Status | Description | Data stored | Network | Source |
|---|---|---|---|---|---|---|
| V1-MUSIC-1 | Music player | Shipped | When enabled, a small player sits at the bottom-left of editor pages with play, pause and a volume slider (default 50). It plays audio from a hidden YouTube player, on a loop. It is not shown on the list, session, About or Privacy pages. | Play state and volume in Memory | Yes | `v1/app/components/editor/music-player.tsx`, `v1/app/components/common/editor.tsx` lines 281–289 |
| V1-MUSIC-2 | Music channels | Shipped | Four preset genres, each a fixed YouTube address: LoFi Hip Hop, Chill Synth, Chillstep, Post Rock. | DB `settings.musicChannel` | Yes | `v1/app/lib/constants.ts` lines 14–26; `v1/app/components/common/preferences-dialog.tsx` lines 626–667 |
| V1-MUSIC-3 | Own YouTube video or playlist | Shipped | The user can paste a YouTube video or playlist address. It replaces the chosen channel. | DB `settings.youtubeLink` | Yes | `v1/app/components/common/preferences-dialog.tsx` lines 669–685; `v1/app/components/editor/music-player.tsx` lines 95–98 |
| V1-MUSIC-4 | Opt-in and cookie warning | Shipped | The player is off by default. The switch in Preferences > Music carries a warning that YouTube will set cookies, and each channel has a button to open it in a separate tab instead. | DB `settings.enableMusicPlayer` | Part: the setting works offline, the external link does not | `v1/app/components/common/preferences-dialog.tsx` lines 596–625, 653–665 |

### Sync

| ID | Feature | Status | Description | Data stored | Network | Source |
|---|---|---|---|---|---|---|
| V1-SYNC-1 | Owner without an account | Shipped | There is no sign-up or sign-in. On first load the app creates an owner with a 12-word sync code **(upstream)**. | DB (the owner record, which holds the sync code) **(upstream)** | No | `v1/app/services/evolu/client.ts` lines 42–95; `@evolu/common` `dist/src/Owner.js`, `Crypto.js` |
| V1-SYNC-2 | View and copy the sync code | Shipped | Preferences > Sync > View Sync Code shows the words with a copy button and a warning to treat the code like a password. | None of its own (reads the owner; copies to the clipboard) | No | `v1/app/components/common/preferences-dialog.tsx` lines 690–799 |
| V1-SYNC-3 | Restore on another device | Shipped | Preferences > Sync > I have a Sync Code. The user pastes the code. The device's local data is replaced by the synced data. See [Sync in detail](#sync-in-detail). | LS `aurelius:isRestoring`, `aurelius:firstTimeLoaded`; DB replaced | Yes | `v1/app/components/common/preferences-dialog.tsx` lines 710–742, 801–840; `v1/app/lib/providers/aurelius.tsx` lines 211–243 |
| V1-SYNC-4 | Background encrypted sync | Shipped | Changes are sent to, and fetched from, a sync server without any user action. It runs for every owner from the first load. There is no switch to turn it off and no status display. | DB; encrypted copies on the sync server | Yes for the exchange; the app works without it | `v1/app/services/evolu/client.ts` lines 42–46; `@evolu/common` `dist/src/Sync.js`, `Evolu.js`, `Config.js` |
| V1-SYNC-5 | Encryption badge | Shipped | A shield icon at the bottom-right with a tooltip saying data is stored on the device and sync is end-to-end encrypted. It is a fixed label, not a live status. | None | No | `v1/app/components/editor/e2ee-indicator.tsx` |

### Data export

| ID | Feature | Status | Description | Data stored | Network | Source |
|---|---|---|---|---|---|---|
| V1-EXPORT-1 | Export | Absent | v1 has no working export. Three stubs are commented out: an "Export As" menu (Image, Markdown), a Preferences "Export" tab (image footer text and a watermark switch locked behind an "Upgrade to Plus" link), and an "Export your data" JSON button marked "Coming Soon". Issue #22 "Export Data" (Markdown files with front matter) was closed as not planned. The only ways to get writing out are copy and paste, or sync to another device. | DB `settings.exportImageFooter`, `settings.exportImageWatermark` exist and are unused | n/a | `v1/app/components/editor/main-menu.tsx` lines 195–240; `v1/app/components/common/preferences-dialog.tsx` lines 467–547, 885–900, 1027–1031 |

### Delete all data

| ID | Feature | Status | Description | Data stored | Network | Source |
|---|---|---|---|---|---|---|
| V1-DEL-1 | Delete all data | Shipped | Preferences > Advanced > Delete My Data. After confirmation and a 5-second message, the local database tables are dropped and the app reloads as a brand-new owner with a new sync code and default data **(upstream)**. It does not contact the sync server, so encrypted copies stay there **(upstream)**. | DB dropped; LS `aurelius:firstTimeLoaded` removed | No | `v1/app/components/common/preferences-dialog.tsx` lines 864–944; `@evolu/common` `dist/src/Db.js`, `Evolu.js` |
| V1-DEL-2 | Delete data from the error page | Shipped | The error page offers the same Delete My Data action, as a way out when the app cannot start. | DB dropped | No | `v1/app/root.tsx` lines 126–216 |

Deleting one post is V1-POST-7.

### Settings and themes

| ID | Feature | Status | Description | Data stored | Network | Source |
|---|---|---|---|---|---|---|
| V1-SET-1 | Preferences dialog | Shipped | Key `,`. Tabs: General (start page), Appearance (theme, fonts), Editor (Quick Start dialog, toolbar mode), Writing (daily goal), Music, Sync, Advanced (delete data), and Profile under "Account". Most changes save at once and show a "Saved" message. | DB `settings` (one row, synced) | No | `v1/app/components/common/preferences-dialog.tsx` lines 1001–1124 |
| V1-SET-2 | Theme | Shipped | Light, Dark or System. The default is Dark. The theme is per browser and does not sync. | LS `vite-ui-theme` | No | `v1/app/lib/providers/theme.tsx`; `v1/app/components/common/preferences-dialog.tsx` lines 176–206; `v1/app/styles/globals.css` |
| V1-SET-3 | Title font and body font | Shipped | Two separate choices from eight bundled fonts: Inter, Lato, Libre Baskerville, Merriweather, Noto Serif, Open Sans, PT Serif, Roboto. Defaults: Inter for the title, Merriweather for the body. They apply in the editor and the reading view. Font files ship with the app. | DB `settings.titleFont`, `settings.bodyFont` | No | `v1/app/lib/constants.ts` lines 38–56; `v1/app/styles/fonts.css`; `v1/public/fonts/` |
| V1-SET-4 | Profile name | Partial | A "Name" field described as "Your name to display in the app". No screen shows it. | DB `settings.userName` | No | `v1/app/components/common/preferences-dialog.tsx` lines 946–999 |

Other settings are listed with their feature: start page (V1-START-2), toolbar mode (V1-EDIT-5), Quick Start dialog (V1-SPLASH-2), daily goal (V1-GOAL-1), music (V1-MUSIC-2 to V1-MUSIC-4).

### Keyboard shortcuts

| ID | Feature | Status | Description | Data stored | Network | Source |
|---|---|---|---|---|---|---|
| V1-KEY-1 | App shortcuts | Shipped | Single keys for the main actions. See the table below. They are ignored while the cursor is in the title, the body or any input; `Esc` leaves the field first. They cannot be changed. | None | No | `v1/app/lib/hooks/useKeyboardShortcuts.tsx` |
| V1-KEY-2 | Formatting shortcuts | Shipped | The help dialog lists `Ctrl+B` bold, `Ctrl+I` italic, `Ctrl+U` underline, `Ctrl+Shift+H` highlight, `Ctrl+Alt+C` code block, `Ctrl+Shift+B` blockquote. They are the editor library's defaults **(inferred)**. | None | No | `v1/app/lib/constants.ts` lines 77–108 |
| V1-KEY-3 | Shortcut hints | Shipped | Menus, buttons and the Quick Start dialog show each action's key next to its label. The help dialog lists all of them. | None | No | `v1/app/components/editor/keyboard-shortcut.tsx`, `v1/app/components/editor/help-dialog.tsx` |

| Key | Action | Where it works |
|---|---|---|
| `p` | New post | Everywhere |
| `Alt+P` | View all posts | Everywhere |
| `w` | New writing session | Everywhere |
| `Alt+W` | View all writing sessions | Everywhere |
| `m` | Main menu | Everywhere |
| `,` | Preferences | Everywhere |
| `?` | Help | Everywhere |
| `q` | Quick Start dialog | Everywhere |
| `f` | Focus mode | Editor, list, session, About and Privacy pages |
| `r` | Reset editor | Editor pages |
| `Ctrl+S` | Save now | Editor pages, also while typing |
| `Esc` | Leave the title or body | Editor pages, also while typing |
| `F11` | Full screen | Listed in the help dialog; it is the browser's own key |

Source: `v1/app/lib/hooks/useKeyboardShortcuts.tsx` lines 12–78; `v1/app/lib/providers/aurelius.tsx` lines 99–111; `v1/app/components/common/editor.tsx` lines 65–71; `v1/app/lib/constants.ts` lines 69–75.

### Start page

| ID | Feature | Status | Description | Data stored | Network | Source |
|---|---|---|---|---|---|---|
| V1-START-1 | First-visit Getting Started page | Shipped | The very first visit to `/` in a browser shows the Getting Started guide inside the editor. The user can type in it, but nothing is saved. | LS `aurelius:firstTimeLoaded`; reads DB `_help` | No | `v1/app/routes/_index.tsx`, `v1/app/lib/hooks/useFirstVisit.tsx`, `v1/app/components/common/getting-started.tsx` |
| V1-START-2 | Start page choice | Shipped | Preferences > General > Start Page: View All Posts (default) or New Post. Every later visit to `/` goes to the chosen page. Added by issue #5. | DB `settings.startPage` | No | `v1/app/routes/_index.tsx` lines 61–72; `v1/app/components/common/preferences-dialog.tsx` lines 94–149 |

### Quick Start dialog and what's new

| ID | Feature | Status | Description | Data stored | Network | Source |
|---|---|---|---|---|---|---|
| V1-SPLASH-1 | Quick Start dialog | Shipped | A dialog (called the splash dialog in code) opens on load, if the setting is on, and with key `q`. It offers: Start a New Post, Start a Writing Session, View All Posts, View All Writing Sessions, Getting Started, Preferences, Help, About and Privacy. "Manual" and "Blog" are shown as "Coming Soon". A footer note says data is saved locally in the browser. | None of its own | No | `v1/app/components/editor/splash-dialog.tsx` |
| V1-SPLASH-2 | Show or hide the dialog on load | Shipped | A "Don't show this again" tick box in the dialog, and "Show quick start" in Preferences > Editor. | DB `settings.showSplashDialog` | No | `v1/app/components/editor/splash-dialog.tsx` lines 103–115, 411–439; `v1/app/components/common/preferences-dialog.tsx` lines 293–308 |
| V1-SPLASH-3 | Resume recent posts | Shipped | The dialog lists the two most recently created posts as "Resume: <title>" with their age. The list is read once, when the app loads. | Reads DB `posts` | No | `v1/app/lib/providers/aurelius.tsx` lines 211–223; `v1/app/components/editor/splash-dialog.tsx` lines 245–296 |
| V1-SPLASH-4 | What's new | Absent | v1 has no what's-new or changelog screen. A "Changelog" menu item is commented out. Issue #30 "What's New page" was closed as not planned. | None | n/a | `v1/app/components/editor/main-menu.tsx` lines 379–387 |

### Navigation

| ID | Feature | Status | Description | Data stored | Network | Source |
|---|---|---|---|---|---|---|
| V1-NAV-1 | Main menu | Shipped | A menu button at the top-left (key `m`): Posts (New Post, View All Posts), Writing Sessions (New Writing Session, View All Sessions), Focus Mode, Reset Editor, Preferences, Twitter, Instagram, Help, About, Privacy. | None | Part: the two social links need the network | `v1/app/components/editor/main-menu.tsx` |

### Help and static pages

| ID | Feature | Status | Description | Data stored | Network | Source |
|---|---|---|---|---|---|---|
| V1-HELP-1 | Help dialog | Shipped | Key `?`, or the help button at the bottom-right. It lists app, formatting and Markdown shortcuts and links to the Getting Started guide. | None | No | `v1/app/components/editor/help-dialog.tsx`, `v1/app/components/editor/help-button.tsx` |
| V1-HELP-2 | Help articles | Shipped | `/help` lists help articles and `/help/getting-started` shows the guide in the reading view. There is one article. It covers navigation, the editor, saving and sync, writing sessions, focus mode and preferences. | DB `_help` (seeded for a new owner) | No | `v1/app/services/evolu/migrations.ts`, `v1/app/components/common/getting-started.tsx`, `v1/app/routes/$effort._index.tsx` lines 61–64 |
| V1-HELP-3 | About page | Shipped | `/about`: why the app exists, a statement that data portability is being worked on, and credits. | None | No | `v1/app/routes/about.tsx` |
| V1-HELP-4 | Privacy page | Shipped | `/privacy`: local-first storage, end-to-end encrypted sync, and visitor counting with a self-hosted, cookie-free analytics tool. | None | No | `v1/app/routes/privacy.tsx` |

### PWA and offline

| ID | Feature | Status | Description | Data stored | Network | Source |
|---|---|---|---|---|---|---|
| V1-PWA-1 | Installable web app | Shipped | A web manifest (name, icons, theme colour, standalone display) lets a browser install Aurelius. It also declares a preferred width for the Microsoft Edge side panel. Added by issue #2. | Browser install record | Yes, to install | `v1/vite.config.ts` lines 23–86; `v1/public/site.webmanifest` |
| V1-PWA-2 | Offline app shell | Shipped | A service worker stores the app's scripts, styles, images, fonts and the SQLite WebAssembly file ahead of time, so the app can start without the network after one online visit **(inferred from the build settings)**. | Browser cache storage | Yes for the first visit; No after | `v1/app/sw.ts`, `v1/app/pwa.ts`, `v1/vite.config.ts` lines 31–40 |
| V1-PWA-3 | Offline page-load rules | Shipped | In production builds, a full page load of a fixed address (`/`, `/about`, `/privacy`, `/sessions`) is answered from the cache and refreshed in the background. A full page load of an address with a variable part (`/posts`, `/posts/<slug>`, `/editor/posts`, `/editor/posts/<slug>`, `/help/...`) always goes to the network; if that fails, the browser is sent to `/`. Which addresses count as fixed is **inferred** from the route file names. Moving between pages inside the running app needs no page load **(inferred)**. | Browser cache `static-pages` | Part: see description | `v1/app/sw-routes.ts` |
| V1-PWA-4 | Local-first data | Shipped | Every read and write goes to the local DB. All data loading runs in the browser; no route has a server loader. | DB | No | `v1/app/services/arls.tsx`, `v1/app/lib/loaders.ts` |

### Platform

| ID | Feature | Status | Description | Data stored | Network | Source |
|---|---|---|---|---|---|---|
| V1-PLAT-1 | Web hosting | Shipped | v1 is a web app deployed to Cloudflare Pages (issue #3). A Pages Function renders the HTML shell on the server. It holds no user data and offers no API. | None on the server | Yes for the first load | `v1/functions/[[path]].ts`, `v1/app/entry.server.tsx`, `v1/package.json` (scripts) |
| V1-PLAT-2 | Visitor analytics | Shipped | Every app load adds a script from `x.aurelius.ink`. The Privacy page describes it as a self-hosted Medama instance that counts visitors without cookies. | None in the app | Yes; the app works without it **(inferred)** | `v1/app/root.tsx` lines 51–61; `v1/app/routes/privacy.tsx` lines 46–61 |
| V1-PLAT-3 | Error page | Shipped | Shows "404 Not Found", "Server Error" or "Oops!" with Back to Home and Delete My Data buttons. | None | No | `v1/app/root.tsx` lines 126–238 |
| V1-PLAT-4 | Desktop wrapper | Absent | There is no desktop app. The repository history contains no Tauri, Electron or similar files. Issue #4 "Desktop App" was closed as not planned. Installing the PWA (V1-PWA-1) is the only app-like option. | None | n/a | `v1/package.json` |

## Sync in detail

v1 passes no sync settings to Evolu (`v1/app/services/evolu/client.ts` lines 42–46), so the library defaults apply. The facts below come from the published source of `@evolu/common` 5.4.4 and `@evolu/common-web` 8.2.1, the versions pinned in `v1/bun.lock`. They were not observed on a running app.

**What the sync code is**

- A 12-word BIP39 phrase made from 128 bits of randomness.
- An owner id and an encryption key are both derived from it. The id cannot be turned back into the code **(inferred from the one-way derivation)**.
- The Sync Code dialog states that anyone who holds the code can read and change the synced data.

**What is encrypted**

- Every change is one message: table name, row id, column name and new value.
- The whole message content is encrypted on the device with the key derived from the sync code, using a secret-box cipher with a random 24-byte nonce.
- So post titles, post bodies, word counts, settings, writing efforts and session records leave the device only in encrypted form.

**What is not encrypted**

- The owner id.
- A random device id.
- The timestamp of each message.
- A summary tree of timestamps used to work out what is missing.
- Message sizes and the time of each request **(inferred)**.
- The local database file on the device is not encrypted by the app **(inferred)**.

**Where it goes**

- Messages are sent by HTTPS POST to the library's default sync server, `https://evolu.world`. v1 does not set its own server address.
- Sync runs at start-up, after each change to a synced table, and when the browser comes back online, regains focus or becomes visible.

**How a device is restored**

1. On the source device, open Preferences > Sync > View Sync Code and copy the 12 words.
2. On the target device, open Preferences > Sync > I have a Sync Code, paste the words and press Start Sync. A "Sync started" message shows.
3. After 3 seconds the app checks the words. If they are not a valid phrase, a "Sync Failed" message shows and nothing changes.
4. If they are valid, the app clears the first-visit marker, sets the restoring marker, and asks Evolu to restore the owner.
5. Evolu drops every local table, creates the owner from the phrase and reloads the app at `/`, in all open tabs. Data that was on the target device before is gone; it is not merged.
6. The app shows "We're syncing your data. This may take a moment." while the data arrives.
7. When Evolu reports that sync is complete, the app shows "Sync successful. Reloading...", clears the restoring marker and reloads `/` after 3 seconds.
8. From then on both devices hold the same owner and keep each other up to date.

Source for the steps: `v1/app/components/common/preferences-dialog.tsx` lines 690–849; `v1/app/lib/providers/aurelius.tsx` lines 211–243; `v1/app/routes/_index.tsx` lines 42, 78–80; `@evolu/common` `dist/src/Db.js` and `Evolu.js`; `@evolu/common-web` `src/PlatformLive.ts`.

Default data is created only when a browser has no owner yet. A restored device does not get it again, so its settings row and its Posts effort arrive through sync **(upstream)**.

## Not in v1

Checked against the full source. v1 has none of these:

- Accounts, sign-in, sharing, collaboration, comments or suggestions.
- More than one writing effort, or any document type other than a post.
- Folders, tags, or search over body text.
- Images, tables or task lists in the editor.
- Markdown files, Markdown import or any export.
- Version history, a bin for deleted posts, or undo for delete.
- Goal progress, streaks, statistics or reminders.
- System notifications.
- A what's-new page.
- A desktop or mobile app.
- A choice of sync server, a sync status display, or a way to pause sync.
- Automated tests (`v1/package.json` has no test script).

## Known issues v2 must not carry over

### Listed in `v1/README.md`

| # | Issue | Evidence in code |
|---|---|---|
| K1 | On a synced device the Quick Start dialog does not open on load, because `showSplashDialog` reads as false at that moment. It works on the first device. | The open state is set once from settings that may not have loaded yet: `v1/app/lib/providers/aurelius.tsx` line 134. A to-do note says the same: `v1/app/components/editor/splash-dialog.tsx` line 117. |
| K2 | Changing the toolbar mode from Floating to Fixed crashes the app. | The floating toolbar is wrapped in an extra element with a link to a known Tiptap bubble-menu bug: `v1/app/components/common/editor.tsx` lines 247–260. The crash itself was not reproduced. |

### Confirmed by reading the code

**Data safety and privacy**

| # | Issue | Evidence |
|---|---|---|
| K3 | The delete-post confirmation says the action will "permanently delete your account and remove your data from our servers". It only flags one post as deleted. | `v1/app/routes/$effort._index.tsx` lines 227–235; `v1/app/services/arls.tsx` lines 65–82 |
| K4 | Deleted posts cannot be restored, and they are never purged. The flagged rows stay in the local database and in sync. | `v1/app/services/arls.tsx` lines 65–82, 91 |
| K5 | The app says "Aurelius servers can't read your data", but the client sets no sync server and so uses the library's default server **(upstream)**. | `v1/app/services/evolu/client.ts` lines 42–46; `v1/app/components/editor/e2ee-indicator.tsx`; `v1/app/components/common/preferences-dialog.tsx` lines 843–845; `@evolu/common` `dist/src/Config.js` |
| K6 | Sync starts for every user from the first load, with no consent step, no off switch and no status display. | `v1/app/services/evolu/client.ts`; `@evolu/common` `dist/src/Evolu.js` |
| K7 | Restoring from a sync code replaces everything on the target device **(upstream)**. There is no merge and the only warning is one sentence in the dialog. | `v1/app/components/common/preferences-dialog.tsx` lines 823–827; `@evolu/common` `dist/src/Db.js` |
| K8 | "Delete All Data" removes local data only. Encrypted copies stay on the sync server and the app offers no way to remove them **(upstream)**. | `@evolu/common` `dist/src/Db.js` |
| K9 | There is no export, while the About page says data portability is being worked on. A user's only copies are the browser's storage and the sync server. | `v1/app/routes/about.tsx` lines 44–51; V1-EXPORT-1 |
| K10 | The music player and embedded videos load YouTube, which sets cookies. The app warns about the player but not about embedded videos. Issue #13 records the same concern. | `v1/app/components/common/preferences-dialog.tsx` lines 608–616; `v1/app/components/common/editor.tsx` lines 136–139 |
| K11 | Saved HTML is put on the page as-is in the reading view, with no cleaning step. | `v1/app/routes/$effort.$slug.tsx` lines 69–76 |
| K12 | A running writing session exists only in memory. A reload or a closed tab loses it without a record. | `v1/app/lib/providers/aurelius.tsx` line 148; `v1/app/components/editor/writing-session-timer.tsx` lines 192–209 |

**Features that are stored but do nothing**

| # | Issue | Evidence |
|---|---|---|
| K13 | The daily writing goal is saved and never used. | V1-GOAL-1 |
| K14 | The profile name is saved and never shown. | V1-SET-4 |
| K15 | The writing effort's days, time and target word count are saved and never used. Tables for books, chapters, essays and journals exist with no screens. | V1-EFFORT-3 |
| K16 | Export settings columns exist with no export. | V1-EXPORT-1 |

**Wrong or misleading behaviour**

| # | Issue | Evidence |
|---|---|---|
| K17 | Stopping a writing session does not stop the music. The check is inverted: it only acts when music is already off. | `v1/app/components/editor/writing-session-timer.tsx` lines 199–201 |
| K18 | The target-reached notice compares the target with the minutes part of the clock (0 to 59). A target of 60 minutes or more never triggers it, and a shorter target triggers it again every hour. | `v1/app/components/editor/writing-session-timer.tsx` lines 78–85, 211–217; `v1/app/lib/utils.ts` lines 16–23 |
| K19 | The help dialog lists a `[text](url)` Markdown shortcut that the editor does not have **(upstream)**. | `v1/app/lib/constants.ts` lines 156–160; `@tiptap/extension-link` `src/link.ts` |
| K20 | The Getting Started guide says a session goal can be a time or a word count. The session dialog offers time only. | `v1/app/components/common/getting-started.tsx` lines 115–123; `v1/app/components/editor/writing-session-timer.tsx` lines 322–338 |
| K21 | The focus mode tooltip says it hides all interface elements. The fixed toolbar stays fully visible. | `v1/app/components/editor/writing-session-timer.tsx` lines 345–351; `v1/app/components/common/editor.tsx` lines 246–261 |
| K22 | Single-key shortcuts also fire when a modifier key is held, because only the modifiers a shortcut names are checked. Outside a text field, `Ctrl+P` also starts a new post and `Ctrl+F` also toggles focus mode, alongside the browser's own action. | `v1/app/lib/hooks/useKeyboardShortcuts.tsx` lines 129–135 |
| K23 | Save is bound to `Ctrl+S` only. `Cmd+S` on macOS is not handled. | `v1/app/lib/hooks/useKeyboardShortcuts.tsx` lines 25–31, 113–118 |
| K24 | The help articles list shows a Delete button. Pressing it fails, because the delete action looks for a writing effort called `help` and there is none. | `v1/app/routes/$effort._index.tsx` lines 74–85, 210–250 |
| K25 | A post's address never changes after creation. A post that starts without a title keeps `untitled` or `untitled-N` in its address for good. | `v1/app/lib/actions.ts` lines 23–48; `v1/app/routes/editor.$effort.$slug.tsx` lines 62–78 |
| K26 | The session history has no dates, although each record has a creation time. Durations are shown as rounded words, not exact times. | `v1/app/routes/sessions._index.tsx` lines 67–132 |
| K27 | The theme does not sync between devices, unlike every other setting. | `v1/app/lib/providers/theme.tsx` |

**Offline and installation**

| # | Issue | Evidence |
|---|---|---|
| K28 | Offline, reloading a post, the post list or the new-post page sends the user to `/` instead of the page they were on. | `v1/app/sw-routes.ts` lines 45–72 |
| K29 | The service worker is set to prompt before updating, but the app has no update prompt. A new version waits until every tab is closed **(inferred)**. | `v1/vite.config.ts` line 78; `v1/app/pwa.ts` |

**Minor**

| # | Issue | Evidence |
|---|---|---|
| K30 | The page links two web manifests: the static file and the generated one. | `v1/app/root.tsx` lines 88, 100 |
| K31 | The empty-list picture is colour-inverted whenever the theme is System, even if the system is in light mode. | `v1/app/components/common/data-table.tsx` lines 127–139 |
| K32 | Deleting data from the error page does not clear the first-visit marker, unlike the same action in Preferences. | `v1/app/root.tsx` lines 153–165; `v1/app/components/common/preferences-dialog.tsx` lines 868–881 |
| K33 | The "Libre Baskerville" font choice may fall back to a generic serif: the style class asks for "Libre Baskerville" but the bundled font is registered as "Baskervville". Code text asks for "JetBrainsMono", which is not bundled. The visible effect is **inferred**. | `v1/tailwind.config.ts` line 78; `v1/app/styles/fonts.css` lines 1–16; `v1/app/styles/writer.css` lines 107, 118 |

### Inferred from the code, not reproduced

These follow from how the code is written. None was confirmed on a running app.

| # | Issue | Evidence |
|---|---|---|
| K34 | Opening one post's editor straight from another post's editor (for example through "Resume" in the Quick Start dialog) may leave the first post's title and text in the editor. The next autosave would then write them into the second post. The editor takes its text only when it is first drawn, and the page is not redrawn when only the post address changes. | `v1/app/components/common/editor.tsx` lines 73–81, 117–118; `v1/app/routes/editor.$effort.$slug.tsx` lines 82–141; `v1/app/components/editor/splash-dialog.tsx` lines 286–291 |
| K35 | The live word count is kept in a value that does not trigger a screen update, so the shown count, and the end count saved with a session, can lag behind typing. | `v1/app/lib/providers/aurelius.tsx` lines 123, 164–166, 201 |
| K36 | A session's starting word count is read when the timer is first drawn, not when the session starts. It is reset to zero only when no post is open. Words written can be wrong for an existing post. | `v1/app/components/editor/writing-session-timer.tsx` lines 130, 182–189 |
| K37 | On a restored device the Getting Started guide may be missing, because it lives in a table that does not sync and default data is not created again. | `v1/app/services/evolu/schema.ts` lines 67–75; `v1/app/services/evolu/migrations.ts`; `@evolu/common` `dist/src/Db.js` |

## History from closed issues

| Issue | Title | Outcome | Seen in v1 |
|---|---|---|---|
| #2 | PWA | Completed | V1-PWA-1 to V1-PWA-3 |
| #3 | Deploy to Cloudflare Pages | Completed | V1-PLAT-1 |
| #4 | Desktop App | Not planned | V1-PLAT-4 |
| #5 | Allow users to set start page | Completed | V1-START-2 |
| #8 | Writing Efforts | Not planned | V1-EFFORT-3 |
| #12 | Custom Markdown Editor | Not planned | The editor still uses Tiptap (V1-EDIT-1) |
| #13 | Spotify and Apple Music | Not planned | Music still uses YouTube (V1-MUSIC-1) |
| #20 | Allow users to delete posts | Completed | V1-POST-7 |
| #21, #23 | Show default content only for the first time | Completed | V1-START-1 |
| #22 | Export Data | Not planned | V1-EXPORT-1 |
| #30 | What's New page | Not planned | V1-SPLASH-4 |

Issues #1, #6 and #10 are bug and improvement batches with empty descriptions. Issues #7 and #11 concern routing style and tooling, not features.

## Sources

**In this repository**

- `v1/app/` (all routes, layouts, components, hooks, providers, services and styles named above)
- `v1/vite.config.ts`, `v1/functions/[[path]].ts`, `v1/package.json`, `v1/bun.lock`, `v1/public/site.webmanifest`
- `v1/README.md` (feature list and known issues)
- The 17 closed GitHub issues numbered between #1 and #30

**Upstream package source, at the versions pinned in `v1/bun.lock`**

| Package and version | File | Used for |
|---|---|---|
| `@evolu/common` 5.4.4 | `dist/src/Config.js` | Default sync server address and reload address |
| `@evolu/common` 5.4.4 | `dist/src/Sync.js` | What a sync request contains; which parts are encrypted |
| `@evolu/common` 5.4.4 | `dist/src/Crypto.js`, `dist/src/Owner.js` | Sync code format; how the owner id and key are derived; cipher and nonce |
| `@evolu/common` 5.4.4 | `dist/src/Db.js` | Reset and restore; local-only tables; when default data is created; automatic columns |
| `@evolu/common` 5.4.4 | `dist/src/Evolu.js` | When sync runs; reload after reset or restore |
| `@evolu/common-web` 8.2.1 | `src/SqliteFactoryLive.ts` | Where the database file is stored |
| `@evolu/common-web` 8.2.1 | `src/PlatformLive.ts` | Browser events that trigger sync; reload of all tabs |
| `@tiptap/extension-link` 2.4.0 | `src/link.ts` | No `[text](url)` typing rule; automatic links |
| `@tiptap/extension-youtube` 2.4.0 | `src/youtube.ts` | Paste-to-embed and the cookie-domain default |

Each file was read from the package as published on npm, at `https://unpkg.com/<package>@<version>/<file>`.
