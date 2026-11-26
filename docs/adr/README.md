# Architecture Decision Records

Architecture decision records (ADRs) for Aurelius. An ADR records one technical decision: what was chosen, why, and what was rejected. Product scope goes in `docs/prd/`; an ADR says how to build it.

## Index

| ID | Title | Status | Date |
|---|---|---|---|
| — | No ADRs yet | — | — |

## Naming guide

**Filename:** `NNNN-short-title.md`

- `NNNN` is a four-digit number with leading zeros: `0001`, `0002`, `0013`.
- Take the next unused number. Never reuse a number, even if an ADR is withdrawn.
- `short-title` is lowercase, words joined by hyphens, two to five words.
- ADR numbers and PRD numbers are separate series.

**Stable reference:** `ADR-NNNN`

- Use `ADR-NNNN` everywhere an ADR is cited: code comments, commits, pull requests, PRDs, other ADRs.
- The reference never changes. A title or filename can change; the number cannot.
- When an ADR answers a requirement, cite it: `PRD-0001 REQ-4`.

**Inside the file**

Every ADR starts with YAML front matter, then the title line, then four sections in this order:

```markdown
---
type: ADR
id: ADR-0001
title: "Short statement of the decision"
status: proposed
date: 2026-11-24
---

# ADR-0001: Short statement of the decision

## Context

## Decision

## Alternatives considered

## Consequences
```

| Field | Value |
|---|---|
| `type` | Always `ADR`. |
| `id` | `ADR-NNNN`. Same number as the filename. |
| `title` | The title, in quotes. Same as the title line. |
| `status` | One of the status values below. |
| `date` | Date of the decision or of the last status change, as `YYYY-MM-DD`. |
| `superseded_by` | Only on a superseded ADR: the `ADR-NNNN` that replaced it. |

One decision per ADR. Keep it short.

**Status values**

| Status | Meaning |
|---|---|
| `proposed` | Under discussion. Not yet a rule. |
| `accepted` | Agreed. Code must follow it. |
| `superseded` | Replaced. `superseded_by` names the ADR that replaced it. |

An accepted ADR is not edited to reverse its decision. Write a new ADR, and set the old one to `status: superseded`.

The index row for an ADR shows the same `status` and `date` as its front matter.

## Adding an ADR

1. Take the next number from the index.
2. Create `NNNN-short-title.md` in this folder.
3. Add a row to the index above. Remove the "No ADRs yet" row when adding the first one.
