# Product Requirements

Product requirement documents (PRDs) for Aurelius. A PRD says what to build and why. It does not choose a tech stack or an architecture; those decisions go in `docs/adr/`.

## Index

| ID | Title | Status | Date |
|---|---|---|---|
| — | No PRDs yet | — | — |

## Naming guide

**Filename:** `NNNN-short-title.md`

- `NNNN` is a four-digit number with leading zeros: `0001`, `0002`, `0013`.
- Take the next unused number. Never reuse a number, even if a PRD is withdrawn.
- `short-title` is lowercase, words joined by hyphens, two to five words.

**Stable reference:** `PRD-NNNN`

- Use `PRD-NNNN` everywhere a PRD is cited: code comments, commits, pull requests, ADRs, other PRDs.
- The reference never changes. A title or filename can change; the number cannot.
- To cite one requirement, add its ID: `PRD-0001 REQ-4`.

**Inside the file**

Every PRD starts with YAML front matter, then the title line:

```markdown
---
type: PRD
id: PRD-0001
title: "Short title"
status: draft
date: 2026-11-24
---

# PRD-0001: Short title
```

| Field | Value |
|---|---|
| `type` | Always `PRD`. |
| `id` | `PRD-NNNN`. Same number as the filename. |
| `title` | The title, in quotes. Same as the title line. |
| `status` | One of the status values below. |
| `date` | Date of the last revision, as `YYYY-MM-DD`. |
| `superseded_by` | Only on a superseded PRD: the `PRD-NNNN` that replaced it. |

**Status values**

| Status | Meaning |
|---|---|
| `draft` | Still changing. Do not build from it without checking with the owner. |
| `accepted` | Agreed. Build from it. |
| `superseded` | Replaced. `superseded_by` names the PRD that replaced it. |

The index row for a PRD shows the same `status` and `date` as its front matter.

## Adding a PRD

1. Take the next number from the index.
2. Create `NNNN-short-title.md` in this folder.
3. Add a row to the index above. Remove the "No PRDs yet" row when adding the first one.
