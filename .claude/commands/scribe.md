# Scribe - Extract and Document Learnings

Extract valuable learnings from the current conversation and save them to the knowledge base.
**Also updates PROJECT_STATUS.md and regenerates RESUME_CHECKLIST.md.**

## Usage

```
/scribe                              # Full session extraction + status update
/scribe problem                      # Document a specific problem solved
/scribe decision                     # Document a decision made
/scribe gotcha                       # Document a gotcha discovered
/scribe summary                      # Create session summary only
/scribe status                       # Update project status only (no extraction)
```

## Process

### Mode: Full Session (default)

When invoked without arguments, perform comprehensive extraction:

1. **Scan the conversation** for:
   - Error messages that were resolved (problems)
   - "tried X but..." patterns (dead ends)
   - "decided to..." or "chose X because..." (decisions)
   - "this works well..." (patterns)
   - "watch out for..." or surprising behaviors (gotchas)

2. **For each learning found**, create appropriate documentation:
   - Check `knowledge-base/` for duplicates first
   - Use templates from `knowledge-base/[category]/_template.md`
   - Save with proper naming convention

3. **Create session summary** in `knowledge-base/sessions/`

4. **Report** what was captured

### Mode: Problem (`/scribe problem`)

Focus extraction on the most recent problem solved:

1. Identify the problem (error messages, symptoms)
2. Extract the root cause
3. Document the solution
4. Add prevention advice
5. Save to `knowledge-base/problems-solutions/YYYY-MM-DD-description.md`

### Mode: Decision (`/scribe decision`)

Focus on documenting a decision:

1. Ask user to confirm which decision to document
2. Extract the context and alternatives considered
3. Document rationale and trade-offs
4. Save to `knowledge-base/decisions/adr-NNN-description.md`
5. Determine next ADR number by checking existing files

### Mode: Gotcha (`/scribe gotcha`)

Focus on documenting a non-obvious issue:

1. Identify the surprising behavior
2. Document why it's non-obvious
3. Explain how to handle it
4. Save to `knowledge-base/gotchas/gotcha-description.md`

### Mode: Summary (`/scribe summary`)

Create only a session summary:

1. List what was accomplished
2. Note any blockers hit
3. Capture key learnings
4. List next steps
5. Save to `knowledge-base/sessions/YYYY-MM-DD-session-summary.md`

## Output Format

After extraction, report:

```markdown
## Scribe Report

### Extracted
- [x] 2 problems-solutions
- [x] 1 decision (ADR-004)
- [x] 1 gotcha
- [x] Session summary

### Files Created
- `knowledge-base/problems-solutions/2025-12-23-auth-token-issue.md`
- `knowledge-base/decisions/adr-004-database-choice.md`
- `knowledge-base/gotchas/gotcha-timezone-handling.md`
- `knowledge-base/sessions/2025-12-23-session-summary.md`

### Tags Used
`auth` `database` `timezone`
```

## Quality Guidelines

When extracting, ensure:

1. **Standalone value** - Each entry useful without conversation context
2. **Searchable** - Use specific terms, good tags, clear titles
3. **Actionable** - Include enough detail to actually help
4. **Honest** - Document failures and dead ends too
5. **Concise** - Respect future readers' time

## Project Status Integration

### Automatic Updates

When running `/scribe` (full session mode), also:

1. **Update PROJECT_STATUS.md**:
   - Add session to Session History table
   - Update milestone status if work was completed
   - Adjust phase progress percentages
   - Add any new decisions to Key Decisions table
   - Update blockers if resolved or new ones found

2. **Regenerate RESUME_CHECKLIST.md**:
   - Parse PROJECT_STATUS.md for current state
   - Extract immediate priorities from current phase
   - List active blockers
   - Include recent decisions
   - Generate appropriate resume prompts

### Mode: Status Only (`/scribe status`)

Update project status without extracting learnings:

1. **Ask** what changed this session:
   - Milestones completed?
   - Progress made?
   - Blockers hit or resolved?
   - Decisions made?

2. **Update** `planning/PROJECT_STATUS.md`

3. **Regenerate** `planning/RESUME_CHECKLIST.md`

4. **Confirm** changes made

## Recommended Usage

1. **End of session** - Always run `/scribe` before ending
2. **After solving hard problem** - Run `/scribe problem` while fresh
3. **After making decision** - Run `/scribe decision` to capture rationale
4. **After hitting gotcha** - Run `/scribe gotcha` to warn future self
5. **Quick status update** - Run `/scribe status` mid-session if needed

## Session Lifecycle Integration

```
SESSION START
    |
    +-- Read planning/RESUME_CHECKLIST.md (or run /status)
    |
    v
ACTIVE DEVELOPMENT
    |
    +-- /scribe problem|decision|gotcha --> targeted capture
    |
    v
SESSION END
    |
    +-- /scribe --> full extraction + status update + checklist regeneration
    |
    v
NEXT SESSION
    |
    +-- Resume from RESUME_CHECKLIST.md
```
