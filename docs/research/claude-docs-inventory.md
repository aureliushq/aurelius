# Claude Docs feature inventory (as of 2026-11-26)

Research note for issue #37 (map: issue #36). It lists what Claude Docs can do today, for people and for agents, as the parity baseline for Aurelius v2. It records facts only. It makes no product or technical decision.

## How to read this

- **ID.** `CD-<AREA>-<n>`. An ID is stable: later tickets cite it and give it a verdict of match, adapt or drop. Do not renumber; add new rows at the end of an area.
- **Who.** `person`, `agent` (Claude working through the Claude Docs connector) or `both`.
- **Server.** What the capability needs from Anthropic's service in Claude Docs:
  - `yes`: the service does the work, or the capability only exists between accounts (storage, live sync, access control, connector calls, uploads, rendering, notifications).
  - `save`: an action in the open editor. The sources show the service only saving and syncing the result.
  - `view`: display behaviour in the open doc. Nothing is saved.
  - `save` and `view` are **inferred in every row**: no source says where editor actions run.
- **(inferred)** marks anything the sources do not state outright.
- **"where open"** is the connector guide's phrase for a feature that is switched on for some docs and not for others. The sources do not say what decides it.

### Baseline: Claude Docs is a hosted product

Every doc is stored in its owner's Claude account, changes save automatically, and a doc opens only for a person who is signed in to Claude, even through a public link (H-docs, H-share). So Claude Docs as a whole depends on the service; the Server column only separates the degree.

### Offline behaviour

**No source states any offline behaviour for Claude Docs.** None of the guide topics or public pages read for this note describes editing, reading or queueing changes without a connection. The tables therefore carry no offline column. The one use of the word "offline" in the pages read concerns artifacts installed as desktop apps, and docs cannot be installed that way (H-app).

## Sources

Read on 2026-11-26. Pages were opened in full; no search snippet is used as a source.

Connector guide (agent-facing reference served by the Claude Docs connector's `guide` tool; not a public page):

| Key | Guide topic |
|---|---|
| G-instr | `topic.instructions` |
| G-index | `topic.index` (`topic.skill` now redirects here) |
| G-editing | `topic.editing` |
| G-tabs | `topic.tabs` |
| G-comments | `topic.comments` |
| G-charts | `topic.charts` |
| G-chartdef | `topic.chart-definition` |
| G-diagram | `topic.diagram` |
| G-uploads | `topic.uploads` |
| G-sharing | `topic.sharing` |
| G-suggest | `topic.suggestions` |
| T | The connector's tool list and tool descriptions (`batch`, `guide`, `update`, `create`, `read`, `query`, `delete`, `export`) |

Anthropic public pages:

| Key | Page |
|---|---|
| H-docs | Get started with Claude Docs: https://support.claude.com/en/articles/16923645-get-started-with-claude-docs |
| H-keys | Claude Docs keyboard shortcuts: https://support.claude.com/en/articles/17458093 |
| H-share | Share artifacts: https://support.claude.com/en/articles/9547008 |
| H-artifacts | What are artifacts and how do I use them?: https://support.claude.com/en/articles/17153992 |
| H-a11y | Use artifacts with a keyboard or screen reader: https://support.claude.com/en/articles/17457950 |
| H-admin | Artifacts admin guide for Team and Enterprise plans: https://support.claude.com/en/articles/16994751 |
| H-notes | Release notes: https://support.claude.com/en/articles/12138966-release-notes |
| H-code | Claude Code docs, "Share session output as artifacts": https://code.claude.com/docs/en/artifacts |
| H-platform | Claude Platform release notes: https://platform.claude.com/docs/en/release-notes/overview |
| H-app | Install an artifact as an app: https://support.claude.com/en/articles/18516354 |
| H-meet | Use Claude Meetings: https://support.claude.com/en/articles/18325154-use-claude-meetings |

Trust order used when sources disagree: the connector guide first, then the public pages. Disagreements are listed under "Conflicts between sources".

## 1. Document structure (docs, tabs, nesting)

| ID | Capability | Who | Server | Source |
|---|---|---|---|---|
| CD-STRUCT-1 | Doc: a rich-text document saved to its creator's Claude account. The creator is its owner. | both | yes | H-docs |
| CD-STRUCT-2 | Doc title, held apart from the body. Only the owner renames a doc in the app; the connector can rename a doc when asked. | both | yes | H-docs, H-keys, T |
| CD-STRUCT-3 | Tabs: a doc holds one or more tabs, each with its own body. A doc always keeps at least one tab, and a tab at least one block. | both | yes | H-docs, G-tabs, G-editing |
| CD-STRUCT-4 | Add a tab. The agent creates the tab, its body and its placement in one batch; a tab that is not placed exists but is not shown. A person's control for adding a tab is inferred from the tab menu. | both | yes | G-tabs |
| CD-STRUCT-5 | Rename a tab. The display name is separate from the tab's internal file name. | both | yes | H-keys, G-tabs |
| CD-STRUCT-6 | Order tabs. Each tab can carry an order key; tabs with a key are listed first, sorted by it. Reordering by a person is inferred. | both | yes | G-tabs |
| CD-STRUCT-7 | Nest tabs: a tab can sit under a parent tab as a sub-tab, and be moved back out. No depth limit is stated. | both | yes | G-tabs, H-keys |
| CD-STRUCT-8 | Delete a tab. When the agent deletes one, its sub-tabs stay and move to the top level; a person chooses in the tab's menu whether the sub-tabs go too. | both | yes | G-tabs, T |
| CD-STRUCT-9 | Tab list: opened from a button, or shown beside the text. Rows expand to show sub-tabs and, for the open tab, its headings (when it has two or more). Choosing a heading jumps to it. | person | view | H-keys, H-docs |
| CD-STRUCT-10 | Collapse or expand the section under a heading. Works in a view-only doc too. Whether the state is saved is not stated. | person | view | H-keys |
| CD-STRUCT-11 | Link to a heading inside the same doc. Stated for the agent; for a person, inferred. | both | save | G-editing |
| CD-STRUCT-12 | Page width setting ("Wide" is one value). | person | save | H-docs |
| CD-STRUCT-13 | Delete a doc. In the app: owner only, permanent, no trash, gone for everyone it was shared with. Through the connector: described as restorable. | both | yes | H-docs, T |
| CD-STRUCT-14 | Doc link: each doc has a claude.ai artifact URL that carries its id, optionally with its title. | both | yes | G-index |

## 2. Text and block types

| ID | Capability | Who | Server | Source |
|---|---|---|---|---|
| CD-TEXT-1 | Paragraph (normal text). | both | save | H-keys, G-index |
| CD-TEXT-2 | Headings, levels 1 to 6. | both | save | H-keys, G-suggest |
| CD-TEXT-3 | Inline styles: bold, italic, underline, strikethrough, inline code. | both | save | H-keys, G-suggest |
| CD-TEXT-4 | Highlight and text colour. Highlight has no colour choice for the agent; text colour exists in the editor but the agent cannot propose it in a suggestion. | both | save | G-suggest |
| CD-TEXT-5 | Links on text, with actions to open, copy, edit and remove. | both | save | H-keys, G-index |
| CD-TEXT-6 | Bulleted and numbered lists, with nested items (indent, outdent) and a settable first number. | both | save | H-keys, G-suggest |
| CD-TEXT-7 | Block quote. | both | save | H-keys, G-suggest |
| CD-TEXT-8 | Divider (horizontal rule). | both | save | G-suggest |
| CD-TEXT-9 | Code block with a language setting. | both | save | H-keys, G-suggest |
| CD-TEXT-10 | Soft line break inside a block. | both | save | H-keys, G-suggest |
| CD-TEXT-11 | Insert an emoji by name (type `:`). | person | save | H-keys |
| CD-TEXT-12 | Insert menu (type `/`) for blocks such as a table, code block, checklist or date. | person | save | H-keys |
| CD-TEXT-13 | Formatting toolbar on selected text: text style, list type, comment, link. | person | save | H-docs, H-keys |
| CD-TEXT-14 | Undo and redo. | person | save | H-keys |
| CD-TEXT-15 | Change a block's kind in place: heading to paragraph and back, paragraphs into a list or quote, a list or quote back into paragraphs, two blocks joined into one. The words keep their identity, so comments stay attached. | both | save | H-keys, G-editing |
| CD-TEXT-16 | Move blocks to another place in the tab. Stated for the agent; for a person, inferred. | both | save | G-editing |

## 3. Tables

| ID | Capability | Who | Server | Source |
|---|---|---|---|---|
| CD-TABLE-1 | Table with an optional header row. People type in cells; cells hold paragraphs, links and chips. | both | save | G-index, G-editing |
| CD-TABLE-2 | Add, delete and change rows. A person uses the cell menu, or Tab in the last cell; the agent inserts, deletes, replaces or reorders rows. | both | save | H-keys, G-editing |
| CD-TABLE-3 | Add and delete columns. | both | save | H-keys, G-editing |
| CD-TABLE-4 | Merge cells across columns or rows, and split them again. | both | save | H-keys, G-editing |
| CD-TABLE-5 | Sort the table by a column, ascending or descending. Offered when the table has at least two rows under its header and no cells merged across rows. | person | save | H-keys |
| CD-TABLE-6 | Cell background colour, from a fixed set of seven. | both | save | G-editing |
| CD-TABLE-7 | Cell alignment, header-cell flag and column width. | both | save | G-suggest, G-editing |
| CD-TABLE-8 | Table "More actions" menu: comment on, react to or delete the table. A single cell can be commented on. | person | yes | H-keys, G-index |
| CD-TABLE-9 | A wide table scrolls sideways. | person | view | H-keys |
| CD-TABLE-10 | Repeat the last table action (for example, insert another row). | person | save | H-keys |

## 4. Task lists

| ID | Capability | Who | Server | Source |
|---|---|---|---|---|
| CD-TASK-1 | Checklist: items a person ticks off. A ticked item's first paragraph shows struck through and dimmed; further paragraphs under the item stay readable. | both | save | G-index, H-keys |
| CD-TASK-2 | Switch a list between bulleted, numbered and checklist in place. Items, their identity and their comment threads are kept. | both | save | G-editing, H-keys |
| CD-TASK-3 | The agent ticks or unticks an item by setting an attribute, without rewriting the list. | agent | yes | G-editing |

## 5. Chips (mentions, dates, dropdowns, links, embeds)

| ID | Capability | Who | Server | Source |
|---|---|---|---|---|
| CD-CHIP-1 | Person mention chip in the text. A mention in the text notifies no one. | both | yes | G-index, H-keys |
| CD-CHIP-2 | Choosing whom to mention. A person picks from the `@` menu. The agent may mention the user, anyone already mentioned in the doc, or someone by exact email address when the user asks; one new address per call. | both | yes | G-index, H-keys |
| CD-CHIP-3 | Date chip: a date someone may act on or move (as-of, due, review). | both | save | G-index, H-keys |
| CD-CHIP-4 | Dropdown chip: one pick from a named option list. A list is shared by every chip that uses it, typically one list per table column. People pick the value in place. | both | save | G-index |
| CD-CHIP-5 | Option lists: the agent creates a named list of options and can pre-pick a value per chip. A new list is created at once, even inside a suggestion. | agent | yes | G-index, G-suggest |
| CD-CHIP-6 | Link-to-tab chip: opens another tab of the same doc. | both | save | G-index, G-tabs, H-keys |
| CD-CHIP-7 | Link-to-doc chip: opens another doc. | both | yes | G-index, H-keys |
| CD-CHIP-8 | Embed chip: places a chart, diagram or other widget on its own line, with a caption, width and alignment. | both | save | G-index, G-suggest |
| CD-CHIP-9 | Insert chips from the `@` menu (person, date, tab, another doc) and the `/` menu (date). | person | save | H-keys |

## 6. Charts

| ID | Capability | Who | Server | Source |
|---|---|---|---|---|
| CD-CHART-1 | Chart: a widget shown in the text where an embed points at it, drawn as SVG by code from attached data rows. Any chart form can be drawn; there is no fixed chart-type list for new charts. People get one by asking Claude. | agent | yes | G-charts, H-docs |
| CD-CHART-2 | Chart data: rows typed inline in the chart, or an uploaded CSV cited by reference with typed columns. Limits: 2,000 rows and 256 KiB per source, 8 file references per widget, 1 MiB of code; the code cannot import or fetch. | agent | yes | G-charts, G-uploads |
| CD-CHART-3 | Reader interaction: hover a value for its details, open the chart's data, comment on a single mark, a named group (a series, an axis) or a label. | person | yes | G-index, G-charts |
| CD-CHART-4 | Typed words on a chart (title, notes) are edited in place by a person, or by the agent by label id. Numbers and data labels change only through the rows. | both | yes | G-charts |
| CD-CHART-5 | Caption under the chart, used as its source line (the file or origin, and the extent). | both | save | G-charts |
| CD-CHART-6 | Charts follow the light and dark themes through named colour tokens. | both | view | G-charts |
| CD-CHART-7 | Accessible name: a chart is exposed to screen readers as one image named by its title. | both | view | G-charts |
| CD-CHART-8 | Several pictures in one widget. | agent | yes | G-charts |
| CD-CHART-9 | No automatic refresh: a chart is a snapshot. To update it, a person asks Claude to pull the latest data; an uploaded data file is immutable, so new data means a new upload. | both | yes | H-docs, G-uploads |
| CD-CHART-10 | Definition charts: an older, declarative kind still shown and editable but no longer created. Forms: bar, line, area, point or bubble, heat map, single-number stat with deltas, pivot table with sparklines; small multiples, a second y-axis, annotations, range whiskers, good/bad tones. | agent | yes | G-chartdef |

## 7. Diagrams and mock-ups

| ID | Capability | Who | Server | Source |
|---|---|---|---|---|
| CD-DIAG-1 | Diagram: a widget that draws a fixed SVG picture with no data, such as a flow, tree, 2x2, pillars, roadmap or map. It draws the same every time. | agent | yes | G-diagram |
| CD-DIAG-2 | Label words in a diagram are edited in place by a person, and each label can be commented on. | both | yes | G-diagram, G-index |
| CD-DIAG-3 | Named parts of a diagram (a box, a lane, the connectors) can be commented on. | person | yes | G-diagram |
| CD-DIAG-4 | Data-placed diagrams (a to-scale timeline, a funnel): marks and their printed values come from rows, so a reader can comment on them but not edit them in place. | both | yes | G-diagram |
| CD-DIAG-5 | Mock-up: a widget that looks interactive. A person can edit its label words and comment on its parts, but anything else done in it (a box ticked, a value typed) is lost on reload. | both | yes | G-index |
| CD-DIAG-6 | Widget frame: a fixed-width drawing scaled to the text column (672 px in a laptop window, about half that on a phone); height is free; anything outside the frame is cut off. | both | view | G-diagram |

## 8. Uploads

| ID | Capability | Who | Server | Source |
|---|---|---|---|---|
| CD-UPLOAD-1 | Upload a file into the doc's own file store. The doc records it as an immutable blob that tabs and widgets cite. | agent | yes | G-uploads |
| CD-UPLOAD-2 | Image in the text, with alt text a person can edit. An image is selected as one object with its own actions. | both | yes | G-uploads, H-keys |
| CD-UPLOAD-3 | Video in the text, with a play button. | person | yes | H-keys, H-share |
| CD-UPLOAD-4 | File block in the text. The guide names it beside images; no detail is given. | both | yes | G-suggest |
| CD-UPLOAD-5 | CSV upload as chart data, read through a column description. Guidance: aggregate above about 5,000 rows. | agent | yes | G-uploads |
| CD-UPLOAD-6 | Origin record: a blob made from a tool call can carry that call (connector, tool, arguments). Everyone the doc is shared with can read it beside the chart's data. | both | yes | G-uploads |
| CD-UPLOAD-7 | Upload approval: in some chats each agent upload first shows the person an approval card. | both | yes | G-uploads |
| CD-UPLOAD-8 | Upload check: an uploaded file is checked; while the check runs, or if it fails, the doc cannot be shared outside the organisation. | person | yes | H-share |
| CD-UPLOAD-9 | Who may upload: people with edit access. Editors invited from outside the organisation may upload only images and videos. | person | yes | H-share |

## 9. Code-style display blocks (formula, CSV, markdown)

| ID | Capability | Who | Server | Source |
|---|---|---|---|---|
| CD-CODE-1 | Formula block: a code block of TeX shown as a display formula. There are no inline formulas. | both | save | G-index, G-suggest |
| CD-CODE-2 | CSV block: a code block of comma-separated text shown as a read-only grid over text that stays editable. | both | save | G-index |
| CD-CODE-3 | Markdown block: a code block of markdown shown rendered, as an exhibit (a template, a changelog). | both | save | G-index |
| CD-CODE-4 | Mermaid block: a code block of Mermaid source with a drawn preview. Existing ones are kept and edited in place; the guide steers new diagrams to widgets. | both | save | G-diagram, G-suggest |

## 10. Comments and threads

| ID | Capability | Who | Server | Source |
|---|---|---|---|---|
| CD-COMMENT-1 | Comment on selected words. The comment is anchored to those words. | both | yes | H-docs, G-comments |
| CD-COMMENT-2 | Threads: replies under a first comment. Limits: 1,000 threads a doc (resolved ones count), 100 comments a thread, 4,096 bytes a comment. | both | yes | G-comments |
| CD-COMMENT-3 | Resolve a thread. The agent may resolve only when the user asks in chat, and not a thread a person wrote in otherwise. | both | yes | G-comments |
| CD-COMMENT-4 | Whole-tab note: a comment with no anchor, shown under a "Whole document" heading above the tab's comments. | both | yes | G-comments |
| CD-COMMENT-5 | Comment on things other than words: a table or a cell, a single chip, and (for a person) a part of a chart or diagram. | both | yes | G-index, G-suggest, H-keys |
| CD-COMMENT-6 | Mention someone in a comment with `@`. People invited from outside the organisation cannot mention people. | person | yes | H-docs, H-share |
| CD-COMMENT-7 | Email notifications about comments. Stated only indirectly (outside invitees do not get them); what triggers one is inferred. | person | yes | H-share |
| CD-COMMENT-8 | Send a comment to Claude: a "Send to Claude" checkbox on the comment box, or an @Claude mention. Claude replies in the thread and makes the change. | person | yes | H-docs, H-a11y, G-comments |
| CD-COMMENT-9 | Claude leaves its own comments while drafting, to explain a choice or ask a question. | agent | yes | H-docs |
| CD-COMMENT-10 | Comment layout: beside the text in a wide panel; as margin icons in a narrow panel, with Wide page width or beside the tab list; on a phone, an icon or highlight until opened. Long comments and older replies fold. | person | view | H-docs, G-comments |
| CD-COMMENT-11 | Show or hide comments, and a list of all comments opened from the panel header. | person | view | H-keys, H-a11y |
| CD-COMMENT-12 | Detached threads: when the words a comment hangs on are removed, the thread stays open in the comments list, off the page. | both | yes | G-editing |
| CD-COMMENT-13 | Edit and delete a posted comment. | both | yes | H-a11y, G-comments, T |
| CD-COMMENT-14 | React to a block. Stated for tables only. | person | yes | H-keys |
| CD-COMMENT-15 | Author identity on each comment: display name, a stable account identity, a guest flag for people outside the organisation, and whether it came from the app or from an agent. | both | yes | G-comments |
| CD-COMMENT-16 | Access: viewers read comments; commenters and editors add them; people who have only a public link neither see nor add comments. | person | yes | H-share |
| CD-COMMENT-17 | Several comments on the same words, stepped through one by one. | person | view | H-keys |

## 11. Suggesting mode

The public help pages read for this note do not mention suggestions; everything here comes from the connector guide.

| ID | Capability | Who | Server | Source |
|---|---|---|---|---|
| CD-SUGGEST-1 | Suggesting mode: a mode of the person's editor. While it is on, the agent must make every change as a suggestion. People also make suggestions on the page (inferred: by editing in this mode). | person | yes | G-index, G-suggest |
| CD-SUGGEST-2 | Suggested changes show in the text: added words marked as proposed, removed words struck but still in the doc. Each suggestion has a card. | both | yes | G-suggest |
| CD-SUGGEST-3 | Accept or reject on the card, by anyone with edit access. A card is decided whole. | person | yes | G-suggest |
| CD-SUGGEST-4 | Suggesting takes comment access, not edit access. Stated for the agent acting for a commenter; for a person on the page, inferred. | both | yes | G-suggest |
| CD-SUGGEST-5 | What can be suggested: adding blocks; adding, deleting or replacing words; turning a style on or off; a block's settings (heading level, list kind, first number, tick, code language, cell alignment, colour, header); removing a block, including a chart. | both | yes | G-suggest |
| CD-SUGGEST-6 | Suggested table changes: a row or column more, fewer or changed, where open; elsewhere the whole table is proposed again. | both | yes | G-suggest |
| CD-SUGGEST-7 | Suggested chips (date, person, link to a tab, dropdown pick) and suggested changes inside code, formula, CSV, markdown and Mermaid blocks, where open. A block's preview shows the saved version until the suggestion is accepted. | both | yes | G-suggest |
| CD-SUGGEST-8 | The agent suggests: the same edit call with a flag. One call makes one card; up to 64 cards in one batch. | agent | yes | G-suggest |
| CD-SUGGEST-9 | The agent changes or withdraws its own open suggestions. It cannot change anyone else's. | agent | yes | G-suggest |
| CD-SUGGEST-10 | The agent accepts or rejects a suggestion only on the user's word in chat, and only one that is the user's own, has no other contributors and deletes nothing typed since. A decision cannot be undone by the agent. | agent | yes | G-suggest |
| CD-SUGGEST-11 | List open suggestions for a tab, with author, time, other contributors and origin. Needs comment access. | agent | yes | G-suggest |
| CD-SUGGEST-12 | Discussion on a suggestion: a comment thread attached to the suggestion, closed by the decision and not by a resolve. | both | yes | G-comments |
| CD-SUGGEST-13 | Protection of other people's suggestions: a block that holds someone else's open suggestion cannot be deleted or replaced whole. | both | yes | G-suggest |
| CD-SUGGEST-14 | Suggestions and comments interact: accepting a suggestion that removes commented words detaches that comment thread. | both | yes | G-suggest |

## 12. Version history

| ID | Capability | Who | Server | Source |
|---|---|---|---|---|
| CD-HIST-1 | Version history view, opened from the doc's name menu where listed. It shows beside the text, or over it in a narrow panel. What a person can do in it is not described. | person | yes | G-sharing, H-docs |
| CD-HIST-2 | Revision numbers: every write moves the tab to a new revision. The agent can read the tab as it stood at an earlier revision. | agent | yes | G-editing |
| CD-HIST-3 | Restore: the agent rewinds a whole tab to an earlier revision, only if nothing else has changed since its read. | agent | yes | G-editing |
| CD-HIST-4 | Bring back deleted text: the agent reads it from an earlier revision and inserts it again. | agent | yes | G-editing |
| CD-HIST-5 | Attribution: every change is attributed to whoever made it, a person or Claude. | both | yes | H-docs |

## 13. Sharing and roles

| ID | Capability | Who | Server | Source |
|---|---|---|---|---|
| CD-SHARE-1 | Docs start private to their owner. | person | yes | H-docs |
| CD-SHARE-2 | Share dialog: add people from the organisation by name, a group (Enterprise) or the whole organisation, and copy the link. No agent tool shares a doc or shows who has access. | person | yes | H-share, G-sharing |
| CD-SHARE-3 | Access levels: view (read the doc and its comments), comment (also comment), edit (also change and export). | person | yes | H-docs, H-share |
| CD-SHARE-4 | Owner: only the owner renames or deletes the doc. Editors can add people. | person | yes | H-docs, H-share, G-sharing |
| CD-SHARE-5 | "Anyone with the link": for a doc, the visitor must sign in to Claude and can only view. | person | yes | H-docs, H-share |
| CD-SHARE-6 | Email invitations (beta) to named people outside the organisation, with an access level. Up to 50 per doc; a pending invitation expires after 30 days; the invitee needs a Claude account. | person | yes | H-share |
| CD-SHARE-7 | Manage access: change a person's level, remove a person, see pending invitations, stop sharing. The owner is notified of sharing changes others make. | person | yes | H-share |
| CD-SHARE-8 | Limits on outside invitees: no mentions, no comment emails, uploads of images and videos only, no delete. Those with edit access can ask Claude in a comment. | person | yes | H-share |
| CD-SHARE-9 | Real-time co-editing: several people and Claude edit the same doc at once, and each edit appears at once for everyone who has it open. Nothing is locked while Claude works. | both | yes | H-docs |
| CD-SHARE-10 | Presence: people see who else in their organisation has the doc open, with live activity. Stated for artifacts in general; an organisation setting. | person | yes | H-admin |
| CD-SHARE-11 | Autosave: changes save as they are made. | both | yes | H-docs |
| CD-SHARE-12 | Claude acts with the access of the person who asked, and only when a signed-in person asks. | agent | yes | H-docs |
| CD-SHARE-13 | Organisation controls: turn Docs on or off, limit it to groups (Enterprise), allow or block link sharing and outside invitations, list shared artifacts, stop sharing or delete one, remove access when someone leaves. | person | yes | H-admin, H-share |
| CD-SHARE-14 | Compliance records: events for the doc itself are recorded; edits and comments inside it are not yet. Admins can download docs as Word files through the Compliance API (beta). | person | yes | H-admin, H-platform |
| CD-SHARE-15 | Retention: on Enterprise, a custom retention period can permanently delete a doc nobody has opened for that period. | person | yes | H-admin |

## 14. Export and import

| ID | Capability | Who | Server | Source |
|---|---|---|---|---|
| CD-EXPORT-1 | Export to Word (.docx). | both | yes | H-docs, T |
| CD-EXPORT-2 | Export to PDF. The agent tool takes a paper size (Letter or A4). | both | yes | H-docs, T |
| CD-EXPORT-3 | Export to Markdown. | both | yes | H-docs, T |
| CD-EXPORT-4 | Copy to Google Docs. | person | yes | H-docs, G-sharing |
| CD-EXPORT-5 | Copy to Notion. In the guide and the agent tool (as Notion-flavoured markdown); not on the public help page. | both | yes | G-sharing, T |
| CD-EXPORT-6 | Export to HTML and to plain text. Agent tool only. | agent | yes | T |
| CD-EXPORT-7 | Scope: an export covers the open tab only, one tab per call for the agent. | both | yes | G-sharing, T |
| CD-EXPORT-8 | The agent can save an exported tab into the doc's own files instead of receiving it. The inline result is capped at about 11 MB, with an option to drop pictures that do not fit. | agent | yes | T |
| CD-EXPORT-9 | Who may export: editors (the owner too, inferred). Someone with view-only access may not have it. | person | yes | H-docs, G-sharing |
| CD-EXPORT-10 | Turn a doc into a presentation by asking Claude (Claude Slides). | person | yes | H-docs |

**Import.** No source describes an import function that turns a Word, Markdown or Google Docs file into a doc. What the sources do describe: the agent creates a doc from markdown it writes (CD-AGENT-2); Claude can draw on the person's files, memory, projects, skills and connected apps when drafting (CD-APP-5); images, videos and CSV files can be uploaded into a doc (section 8).

## 15. Agent tooling

The connector exposes eight tools: `batch`, `guide` and `update` are always listed; `create`, `read`, `query`, `delete` and `export` load on demand (G-index, T). In Claude Code the connector appears as `claude.ai Claude Docs` (H-code). No source says whether an agent other than Claude can use it.

| ID | Capability | Who | Server | Source |
|---|---|---|---|---|
| CD-AGENT-1 | Create a doc in one call: a name plus the first tab's content. The reply gives the doc's link and the ids of its tab and body. The agent can also build on a blank doc the person hands it. | agent | yes | G-index, G-instr |
| CD-AGENT-2 | Write content as markdown: paragraphs, headings, lists, tasks, tables, links, quotes, dividers, code blocks. Chips ride in a side map and are placed by tokens in the text. | agent | yes | G-index, G-suggest |
| CD-AGENT-3 | Write content as structured blocks or styled runs when markdown cannot carry it (cell attributes, underline, highlight). | agent | yes | G-editing, G-suggest |
| CD-AGENT-4 | Batch: several operations in one atomic call, all or nothing, with local aliases so a later member can cite something an earlier one creates. | agent | yes | G-index, G-tabs |
| CD-AGENT-5 | Read a doc: lists its tabs and each tab's body. | agent | yes | G-index, T |
| CD-AGENT-6 | Outline read: a tab's blocks with their ids and content hashes, long runs folded. | agent | yes | G-index |
| CD-AGENT-7 | Partial reads: one table or list in full, a text search, and paged reads that continue from where the last stopped. | agent | yes | G-index, G-editing |
| CD-AGENT-8 | Delta read: only the blocks changed since a given revision, with markers for removed blocks. | agent | yes | G-index, G-editing |
| CD-AGENT-9 | Stable ids: every block and character has an id; a write's reply shows what it wrote with its ids, so the next call needs no read. | agent | yes | G-index |
| CD-AGENT-10 | Edit targets: quoted words (with an occurrence number or a containing block), whole blocks by id, a table cell by row and column, a character range, or the tab's root. | agent | yes | G-index, G-editing |
| CD-AGENT-11 | Edit operations: insert, replace, delete, move, set an attribute, join, wrap, unwrap, restore. Several per call, applied in order. | agent | yes | G-editing |
| CD-AGENT-12 | Re-word in place: replacing words as text keeps the chips, breaks, formatting and comments around them. | agent | yes | G-index, G-editing |
| CD-AGENT-13 | Guards against overwriting others' edits: replacing or deleting a whole block must carry the hash and the revision the agent last read. If the block changed since, the call is refused and shows the block as it stands; the person's edit wins. A force flag exists for when the user says to overwrite. | agent | yes | G-index, G-editing |
| CD-AGENT-14 | Stale quotes are refused too: if quoted words are no longer there, nothing is written and the agent must read again. A refused call changes nothing and names a code and a fix. | agent | yes | G-index, G-editing |
| CD-AGENT-15 | Comment protection: an edit that would remove all the words a comment hangs on is refused and lists the threads; a flag allows it when a person asked for the change. | agent | yes | G-editing |
| CD-AGENT-16 | Pending sections: the agent plants a placeholder block per planned section, each with a line saying what will come, then replaces each with its heading and body. A fill needs no guard. | agent | yes | G-index, G-instr |
| CD-AGENT-17 | What people see of a pending section: a line in square brackets, or an ellipsis. A person can delete it or start a line under it; if it is deleted, the agent drops that section. | both | yes | H-keys, G-editing |
| CD-AGENT-18 | Live filling: each call shows in the open doc as it lands, so the agent fills one section per call while the person watches. | both | yes | G-index, H-docs |
| CD-AGENT-19 | Comment tools: add a comment on quoted words, reply in a thread, add a whole-tab note, list threads for a tab, body or thread, and page or fetch only newer entries. | agent | yes | G-comments, T |
| CD-AGENT-20 | A comment sent to the agent arrives as its own turn, with the doc link, the place in the doc and the thread id. The agent makes the change marked as answering that thread, then replies in the thread. | agent | yes | G-index, G-comments, G-instr |
| CD-AGENT-21 | Answered state: a thread sent to Claude shows whether a Claude reply followed, so a second session does not answer again. The agent acts only on the request its own turn was sent. | agent | yes | G-comments |
| CD-AGENT-22 | Suggestions by the agent: see CD-SUGGEST-8 to CD-SUGGEST-11. A plain edit refused for lack of edit access falls back to a suggestion. | agent | yes | G-suggest |
| CD-AGENT-23 | Tab tools: create, place, order, nest, rename and delete tabs. | agent | yes | G-tabs |
| CD-AGENT-24 | Widget tools: create a chart, diagram or mock-up as code. The service validates the code; invalid code is staged with errors and not shown. | agent | yes | G-charts, G-diagram |
| CD-AGENT-25 | Widget changes by the smallest road: one label by id; a quoted code edit that is staged and then published; or the whole code again against the version last read. Definition charts take path-based patches. | agent | yes | G-charts, G-diagram, G-chartdef |
| CD-AGENT-26 | Widget screenshot: the agent asks for a picture of a widget as the page draws it (light theme), with any reported errors, including labels drawn over each other. | agent | yes | G-charts, G-diagram |
| CD-AGENT-27 | Upload path: the agent uploads a file through its artifact tool, records it in the doc as a blob, then cites it from an image or a chart. | agent | yes | G-uploads |
| CD-AGENT-28 | Export tool: see CD-EXPORT-1 to CD-EXPORT-8. | agent | yes | T |
| CD-AGENT-29 | Delete tool: a tab, a comment or a whole doc; a doc only when the user asks. | agent | yes | T |
| CD-AGENT-30 | Suggesting-mode awareness: the agent is told when the person is in Suggesting mode and then proposes every change. | agent | yes | G-index |
| CD-AGENT-31 | Identity in reads: a read marks which mention is the person the agent acts for; comment entries mark which were written by that person. | agent | yes | G-editing, G-comments |
| CD-AGENT-32 | Finding a doc: by link only. The connector has no lookup by name; the agent uses the person's artifact list or asks. Docs tools open nothing on the person's screen; the client's artifact tool does. | agent | yes | G-index |
| CD-AGENT-33 | Built-in reference: the `guide` tool serves the usage topics and a help entry for each refusal code. | agent | yes | G-index, T |
| CD-AGENT-34 | Retry key: write calls take an optional operation id; inferred to make a re-sent call safe. | agent | yes | T, G-suggest |
| CD-AGENT-35 | Claude Code watches an artifact it published and can reply to comments sent to Claude without being asked, subject to the session's permission mode, up to 60 an hour per artifact. Stated for artifacts in general. | agent | yes | H-code |

## 16. The app around a doc

| ID | Capability | Who | Server | Source |
|---|---|---|---|---|
| CD-APP-1 | Where docs are listed: in the Artifacts tab of the sidebar, by title, among all other artifacts. There is no separate Docs list. | person | yes | H-docs, G-sharing |
| CD-APP-2 | Start a doc from any conversation: ask in words, type `/docs`, or choose Output then Docs in the message box. | person | yes | H-docs |
| CD-APP-3 | Start a doc from the Artifacts tab: pick a Docs template from the gallery and describe the doc. | person | yes | H-docs |
| CD-APP-4 | Claude asks a few questions first, then drafts the doc on screen. | both | yes | H-docs |
| CD-APP-5 | Claude drafts from context it already has: the person's files, memory, projects, skills and connected apps. | agent | yes | H-docs |
| CD-APP-6 | The doc opens in a panel beside the conversation, or on its own page from the Artifacts tab. | person | yes | H-a11y, H-artifacts |
| CD-APP-7 | Ask Claude for changes in the conversation; Claude edits the doc and says what changed. | person | yes | H-docs |
| CD-APP-8 | "Edit with Claude": select text in the doc, click the button and type a request; Claude edits that spot. | person | yes | H-artifacts |
| CD-APP-9 | Claude Code: ask for a doc in a session. On desktop it opens in the side panel; in the terminal Claude gives a link to open on the web. | person | yes | H-docs, H-code |
| CD-APP-10 | Mobile apps (iOS, Android): ask for a doc, open it full screen from the Artifacts tab, and edit it. Sharing settings cannot be changed there; Export sits under Share where offered. | person | yes | H-docs, H-share, G-sharing |
| CD-APP-11 | Projects: a doc cannot be put in a Project (a chat can). Claude can still draw on projects as context. | person | yes | G-sharing, H-docs |
| CD-APP-12 | The doc's name menu holds Export and, where listed, Version history. There is no File menu. | person | yes | G-sharing |
| CD-APP-13 | Outside invitees can start their own chat with Claude from a button at the top of the doc; Claude then works within their access. | person | yes | H-share, H-admin |
| CD-APP-14 | Keyboard and screen-reader operation of the whole editor, with an in-doc list of shortcuts. | person | view | H-docs, H-keys, H-a11y |
| CD-APP-15 | Availability: every plan including Free, on by default; work in Docs counts toward the plan's usage limits. Some specially configured organisations are excluded or limited. | person | yes | H-docs, H-admin |
| CD-APP-16 | Claude Meetings (beta): Claude builds docs live during a call and attaches them to the meeting page. | both | yes | H-notes, H-meet |

## Stated absences

Things a source says Claude Docs does not have or do. They are not capabilities and carry no ID.

- No automatic refresh of charts and diagrams (H-docs).
- No trash for deleted docs in the app (H-docs).
- No Docs list, no File menu, no way to put a doc in a Project (G-sharing).
- No agent tool to share a doc or to see who has access (G-sharing).
- No lookup of a doc by name through the connector (G-index).
- No notification from a mention in the doc's text (G-index).
- No inline formulas (G-index).
- No saving of what a person does inside a mock-up, beyond label edits (G-index).
- No record of how a past suggestion was decided, by whom or when; only open suggestions are listed (G-suggest).
- Not yet suggestible: a new chart, widget, image, file or embed, or changes to one (caption, size, data, position); removing an image or file; a link-to-doc chip; text colour (G-suggest).
- No logging of in-doc edits and comments in the Compliance API yet (H-docs, H-admin).
- No change of sharing settings in the mobile apps (H-docs).
- No install as a desktop app (H-app).
- No import function and no offline behaviour described anywhere (see above).

## Conflicts between sources

- **Suggesting mode.** The connector guide describes it in detail. The public help pages read do not mention it.
- **Version history.** The guide says it is in the doc's name menu "where listed". The public page mentions it only in a note on keyboard access. Neither says what a person can do in it.
- **Copy to Notion.** The guide and the export tool have it. The public help page lists only Word, PDF, Markdown and Google Docs.
- **Deleting a doc.** The public page says deletion is permanent with no trash. The connector's delete tool describes its own delete as restorable, unlike the app's.
- **Link sharing on the Free plan.** The Docs page says Free plans can share with anyone who has the link. The table on the sharing page does not tick that option for Free.
- **Renaming.** The public page says only the owner renames a doc. The connector's `update` tool can rename a doc; the guide does not say how the two relate (inferred: the agent is bound by the asking person's access).

## Capabilities that plainly need the service

This grouping is this note's reading of the sources, not a statement any source makes. As the sources describe them, these exist only through Anthropic's service: storage in the account and the Artifacts list (CD-STRUCT-1, CD-APP-1); live co-editing, presence and autosave (CD-SHARE-9 to CD-SHARE-11); sharing, roles, link access and invitations (CD-SHARE-1 to CD-SHARE-8); organisation controls, compliance and retention (CD-SHARE-13 to CD-SHARE-15); comments between people, notifications and comments sent to Claude (section 10); suggestions between people (section 11); version history as revisions held by the service (section 12); uploads and their checks (section 8); validation and screenshots of widgets (CD-AGENT-24, CD-AGENT-26); export conversions and copies to other products (section 14); every connector call (section 15); mention lookup (CD-CHIP-2).

## Open questions

- What can a person do in the version history view (browse, compare, restore, name versions)?
- What decides whether a suggestion feature is "open" on a doc?
- How deep can tabs nest, and can a person reorder and nest tabs by hand?
- Which block types take reactions besides tables?
- What triggers a comment notification, and through which channel besides email?
- Can a person paste or upload a Word or Markdown file to start a doc?
