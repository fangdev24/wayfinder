---
name: session-continuity
description: Ensures smooth handoff between AI sessions by capturing context and next steps before session ends.
---

# Session Continuity Skill

Ensures smooth handoff between AI sessions.

## Purpose

AI sessions have context windows that eventually fill. This skill:
- Captures current state before session ends
- Creates handoff documents for next session
- Preserves momentum across sessions

## When to Activate

Activate when:
- User mentions "end of session" or "wrapping up"
- Context appears to be getting long
- User asks for a summary
- Major milestone completed

## Handoff Document

Create at session end:

**Location**: `knowledge-base/sessions/YYYY-MM-DD-handoff.md`

```markdown
# Session Handoff: {Date}

## Current State

### What We Built
- {Feature/component 1}
- {Feature/component 2}

### Key Files Modified
- `path/to/file1.ts` - {brief description}
- `path/to/file2.ts` - {brief description}

### Architecture Decisions Made
- {Decision 1}: {brief rationale}

## In Progress

### Current Task
{What was being worked on when session ended}

### Blockers
- {Blocker 1}
- {Blocker 2}

## Next Steps

1. **Immediate**: {Next thing to do}
2. **Soon**: {Follow-up task}
3. **Later**: {Future consideration}

## Context for Next Session

### Key Understanding
{Critical context the next session needs}

### Watch Out For
- {Gotcha or consideration}

### Commands to Run
```bash
{Any setup commands needed}
```

## Related Resources
- {Link to relevant doc}
- {Link to relevant code}
```

## Quick Handoff

For shorter sessions, use abbreviated format:

```markdown
# Quick Handoff: {Date}

**Working on**: {Current task}
**State**: {Ready to test | In progress | Blocked}
**Next**: {Immediate next step}
**Files**: `path/to/main/file.ts`
```

## Usage

### End of Session
```
/handoff
```

### Resume Session
Read the latest handoff document:
```
/resume
```

## Automatic Prompts

At natural breakpoints or when session is long:
> "We've covered a lot. Should I create a handoff document in case we need to continue later?"

## Integration with Scribe

Session continuity complements the scribe skill:
- **Scribe**: Captures permanent knowledge (patterns, decisions, solutions)
- **Session Continuity**: Captures temporary state (current work, next steps)

## Best Practices

1. **Create handoff before ending** - Don't wait until context is lost
2. **Be specific about state** - "In progress" is less useful than "Added component, need tests"
3. **Prioritize next steps** - Make it clear what to do first
4. **Include commands** - Reduce friction for next session
5. **Reference files** - Make it easy to find relevant code
