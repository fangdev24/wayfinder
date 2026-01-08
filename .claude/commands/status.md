# Project Status - View and Update

View current project status or update phase progress.

## Usage

```
/status                    # View current status summary
/status update             # Interactive status update
/status phase <N> <action> # Update specific phase
/status milestone <name>   # Mark milestone complete
```

## Process

### Mode: View (default)

Display a concise status summary:

1. **Read** `project.yaml` and `planning/PROJECT_STATUS.md`
2. **Display** summary:

```
## Project Status

**Stage:** [current stage from project.yaml]
**Phase:** [current phase] (X%)

### Phase Progress
[##########] Phase 0: Foundation (90%)
[          ] Phase 1: Core Features (0%)
[          ] Phase 2: Advanced Features (0%)
[          ] Phase 3: Polish & Deploy (0%)

### Current Focus
- [Active tasks from PROJECT_STATUS.md]

### Blockers
- [Any blockers]
```

### Mode: Update (`/status update`)

Interactive status update:

1. **Read** current `planning/PROJECT_STATUS.md`
2. **Ask** what changed:
   - Phase progress?
   - Milestone completed?
   - New blocker?
   - Blocker resolved?
   - Decision made?
3. **Update** the PROJECT_STATUS.md file
4. **Confirm** changes made

### Mode: Phase Update (`/status phase <N> <action>`)

Quick phase updates:

```
/status phase 0 complete     # Mark Phase 0 as DONE
/status phase 1 start        # Mark Phase 1 as IN_PROGRESS
/status phase 1 progress 50  # Set Phase 1 to 50%
```

Actions:
- `start` - Set status to IN_PROGRESS
- `complete` - Set status to DONE, progress to 100%
- `progress <N>` - Set progress percentage
- `block <reason>` - Add blocker
- `unblock` - Remove blockers

### Mode: Milestone (`/status milestone <name>`)

Mark a milestone as complete:

```
/status milestone "User authentication"
```

1. **Find** the milestone in PROJECT_STATUS.md
2. **Update** status to DONE
3. **Add** completion date
4. **Recalculate** phase progress

## Auto-Integration

The /status command integrates with:

- **`/scribe`** - Scribe updates PROJECT_STATUS.md when capturing session summary
- **RESUME_CHECKLIST.md** - Auto-generated from PROJECT_STATUS.md

## Status Values

### Phase Status
- `NOT_STARTED` - Work hasn't begun
- `IN_PROGRESS` - Currently being worked on
- `BLOCKED` - Cannot proceed due to blocker
- `DONE` - Completed

### Milestone Status
- `NOT_STARTED` - Not begun
- `IN_PROGRESS` - Partially complete
- `DONE` - Completed

## Example Workflow

```
# Start of session - check where we are
/status

# After completing work
/status milestone "API endpoints complete"

# Update phase progress
/status phase 1 progress 75

# Before ending session
/scribe   # This also updates status
```

## File Location

Status is stored in: `planning/PROJECT_STATUS.md`

This file is:
- **Persistent** - Survives across sessions
- **Human-readable** - Can be edited manually
- **Machine-parseable** - Structured for automation
