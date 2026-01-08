# PDD Status Check

Check the current status of Prompt-Driven Development progress.

## Process

### 1. Check Planning Files

Read and report on:
- `planning/rough-idea.md` - Is there an active project?
- `planning/idea-honing.md` - Requirements status
- `planning/research/*.md` - Research completed
- `planning/design/detailed-design.md` - Design status
- `planning/implementation/prompt-plan.md` - Implementation progress

### 2. Report Status

Generate a status report:

```markdown
# PDD Status Report

## Current Project
{Project name from rough-idea.md or "No active project"}

## Phase
{Requirements | Research | Design | Implementation | Complete}

## Progress

### Requirements Clarification
- Status: {Complete | In Progress | Not Started}
- Questions answered: {N}
- Key decisions: {list}

### Research
- Status: {Complete | In Progress | Not Started}
- Topics researched: {list files in planning/research/}

### Design
- Status: {Complete | In Progress | Not Started}
- Design document: {exists/missing}
- ADRs created: {list}

### Implementation
- Status: {Complete | In Progress | Not Started}
- Prompts completed: {X of Y}
- Current prompt: {N}

## Next Actions
{What should be done next}

## Blockers
{Any issues or blockers identified}
```

### 3. Recommendations

Based on status, suggest:
- If early stage: Continue requirements with `/pdd-start`
- If requirements done: Move to design with `/pdd-design`
- If design done: Create implementation plan with `/pdd-implement`
- If implementing: Continue with next prompt

## Output

A clear status report showing:
- Current phase
- Completion percentage
- Recommended next action
