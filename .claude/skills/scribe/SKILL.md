---
name: scribe
description: Institutional knowledge capture. Activates when discussing session wrap-up, documenting learnings, or preserving decisions for future reference.
---

# Scribe Skill - Knowledge Capture

This skill ensures valuable learnings are captured during development conversations.

## Purpose

Prevent knowledge loss by capturing:
- Problem solutions
- Architecture decisions
- Discovered patterns
- Non-obvious gotchas
- Session summaries

## When to Activate

This skill should activate when:
- User mentions "end of session" or "wrapping up"
- A significant problem has been solved
- An architecture decision has been made
- A non-obvious gotcha has been discovered
- User asks to "document" or "capture" something

## Trigger Phrases

| Trigger | Action |
|---------|--------|
| "Let's wrap up" | Suggest running `/scribe` |
| "Finally got it working" | Offer to document the solution |
| "We should remember this" | Offer to capture as knowledge |
| "That was tricky" | Ask if it should be documented |
| "Decided to go with X" | Offer to create decision record |

## Knowledge Categories

### Problems & Solutions
**Location**: `knowledge-base/problems-solutions/YYYY-MM-DD-description.md`

Capture when:
- An error was debugged
- A workaround was found
- A configuration issue was resolved

**Template**:
```markdown
# Problem: {Title}

**Date**: {YYYY-MM-DD}
**Tags**: `{tag1}`, `{tag2}`

## Symptoms
{What was observed}

## Root Cause
{Why it happened}

## Solution
{How it was fixed}

## Prevention
{How to avoid in future}
```

### Architecture Decisions (ADRs)
**Location**: `knowledge-base/decisions/adr-NNN-description.md`

Capture when:
- Technology choice made
- Architecture pattern chosen
- Trade-off accepted

**Template**:
```markdown
# ADR-{NNN}: {Title}

**Status**: {Proposed | Accepted | Deprecated}
**Date**: {YYYY-MM-DD}

## Context
{What prompted this decision?}

## Decision
{What was decided?}

## Consequences
### Positive
- {Benefit}

### Negative
- {Trade-off}

## Alternatives Considered
- {Alternative 1}: Rejected because {reason}
```

### Patterns
**Location**: `knowledge-base/patterns/pattern-description.md`

Capture when:
- A reusable approach discovered
- A best practice identified
- A code pattern works well

**Template**:
```markdown
# Pattern: {Title}

**Category**: {Category}
**Tags**: `{tag1}`, `{tag2}`

## Problem
{What problem does this solve?}

## Solution
{The pattern}

## When to Use
{Applicable situations}

## Example
{Code or implementation example}
```

### Gotchas
**Location**: `knowledge-base/gotchas/gotcha-description.md`

Capture when:
- Something behaves unexpectedly
- Documentation was misleading
- Hidden requirement discovered

**Template**:
```markdown
# Gotcha: {Title}

**Date**: {YYYY-MM-DD}
**Tags**: `{tag1}`, `{tag2}`

## What Happened
{The unexpected behaviour}

## Why
{Root cause or explanation}

## Workaround
{How to handle it}
```

### Session Summaries
**Location**: `knowledge-base/sessions/YYYY-MM-DD-session-summary.md`

Capture at end of sessions:
- What was accomplished
- Blockers encountered
- Next steps

**Template**:
```markdown
# Session Summary: {Date}

## Accomplished
- {Task 1}
- {Task 2}

## Blockers
- {Blocker 1}

## Decisions Made
- {Decision 1}

## Next Steps
1. {Next step 1}
2. {Next step 2}
```

## Usage

### Manual Invocation
```
/scribe
```

### Automatic Prompts
At natural breakpoints, the assistant may gently ask:
> "Should I capture that solution/decision/gotcha for future reference?"

## RAG Preparation

When capturing, format for future retrieval:
- Use consistent markdown headings
- Include searchable tags
- Write self-contained entries
- Use specific, technical terms

## Directory Setup

Ensure these directories exist:
```
knowledge-base/
├── problems-solutions/
├── decisions/
├── patterns/
├── gotchas/
└── sessions/
```
