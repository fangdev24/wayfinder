# Context Monitor Skill

Real-time tracking of context window usage with intelligent preservation strategies.

## Philosophy

> "Context is precious. Spend it wisely, preserve what matters."

Claude Code operates within a context window. This skill helps manage that finite resource by tracking usage and ensuring critical content survives compaction.

## Core Functions

1. **Track** - Monitor context window utilization
2. **Reserve** - Maintain headroom for essential operations
3. **Prioritize** - Decide what to preserve vs. compact
4. **Alert** - Warn when approaching limits

## Context Zones

```
┌─────────────────────────────────────────────┐
│  0-70%: GREEN ZONE                          │
│  Normal operation, no constraints           │
├─────────────────────────────────────────────┤
│  70-85%: YELLOW ZONE                        │
│  Consider consolidation, avoid large reads  │
├─────────────────────────────────────────────┤
│  85-95%: ORANGE ZONE                        │
│  Active preservation, trigger scribe        │
├─────────────────────────────────────────────┤
│  95-100%: RED ZONE                          │
│  Compaction imminent, critical only         │
└─────────────────────────────────────────────┘
```

## Reserved Headroom

Always maintain headroom for:

| Purpose | Reserved | Priority |
|---------|----------|----------|
| Scribe extraction | 15K tokens | Critical |
| Session handoff | 10K tokens | Critical |
| Emergency response | 5K tokens | Critical |
| Agent communication | 5K tokens | High |
| Tool responses | 10K tokens | High |

**Total Reserved**: ~45K tokens

## Zone-Based Behavior

### Green Zone (0-70%)

Normal operation:
- Read files freely
- Full agent spawning
- No consolidation pressure

### Yellow Zone (70-85%)

Caution mode:
- Prefer targeted reads over full files
- Consider consolidating recent work
- Start identifying compaction candidates

```yaml
yellow_zone_actions:
  - "Summarize recent tool outputs"
  - "Identify low-value context"
  - "Prepare preservation priorities"
```

### Orange Zone (85-95%)

Active preservation:
- Trigger auto-scribe for uncaptured value
- Compress verbose outputs
- Avoid non-essential reads

```yaml
orange_zone_actions:
  - "Run silent extraction"
  - "Capture key decisions"
  - "Prepare session handoff"
  - "Alert user of context pressure"
```

### Red Zone (95-100%)

Compaction imminent:
- Complete active captures immediately
- Generate session continuity summary
- Preserve only critical state

```yaml
red_zone_actions:
  - "Force scribe completion"
  - "Generate handoff document"
  - "Preserve working state"
  - "Prepare for restart"
```

## Preservation Priorities

When compaction is needed, preserve in order:

### Priority 1: Critical (Always Preserve)
- Current task and requirements
- Uncaptured decisions
- Active conflict resolutions
- Working file states

### Priority 2: High (Preserve if Space)
- Recent tool outputs
- Key conversation turns
- Pattern discoveries
- Error resolutions

### Priority 3: Medium (Summarize)
- File contents (keep paths, summarize content)
- Verbose command outputs
- Research results

### Priority 4: Low (Discard)
- Duplicate information
- Superseded states
- Debugging artifacts
- Exploratory dead ends

## Integration Points

### With Auto-Scribe

When context hits 85%:
```yaml
trigger_scribe:
  action: silent_extraction
  priority: immediate
  reserve_tokens: 15000
  message: "Context pressure - capturing valuable content"
```

### With Session Continuity

When context hits 90%:
```yaml
prepare_handoff:
  action: generate_summary
  include:
    - current_task
    - decisions_made
    - files_modified
    - next_steps
  output: "session-handoff.md"
```

### With Long-Running Tasks

During autonomous work:
```yaml
checkpoint_trigger:
  at_context_level: 80
  action: save_checkpoint
  include:
    - progress_summary
    - remaining_work
    - known_issues
```

## User Notifications

### Context Status Updates

When requested or at key thresholds:
```
## Context Status

Current: 72% (Yellow Zone)
Headroom: 28% (~56K tokens)

Reserved for:
- Scribe: 15K ✓
- Handoff: 10K ✓
- Emergency: 5K ✓

Recommendation: Consider consolidating recent work
```

### Compaction Warnings

At 85%:
```
⚠️ Context at 85%

Triggering knowledge capture...
- 3 decisions captured
- 2 patterns logged
- Session handoff prepared

Safe to continue, but consider:
- Targeted file reads
- Completing current task
- Starting fresh session for new work
```

## Anti-Patterns

### Don't Do This

```yaml
anti_patterns:
  - "Reading entire codebases at once"
  - "Keeping verbose error logs in context"
  - "Repeating full file contents on each edit"
  - "Ignoring context warnings"
```

### Do This Instead

```yaml
best_practices:
  - "Read specific functions, not entire files"
  - "Summarize error patterns, don't log verbatim"
  - "Reference files by path, read only changed sections"
  - "Heed context warnings, preserve proactively"
```

## Estimation Heuristics

Rough token estimates:

| Content Type | Tokens/Line | Example |
|--------------|-------------|---------|
| Code | ~10 | 100 lines ≈ 1K tokens |
| Prose | ~20 | 50 lines ≈ 1K tokens |
| YAML/JSON | ~8 | 125 lines ≈ 1K tokens |
| Tool output | ~15 | Varies widely |

## Configuration

```yaml
context_monitor:
  thresholds:
    yellow: 70
    orange: 85
    red: 95

  reservations:
    scribe: 15000
    handoff: 10000
    emergency: 5000
    agent_comms: 5000
    tool_responses: 10000

  auto_actions:
    at_orange: trigger_scribe
    at_red: force_handoff

  notifications:
    show_status: on_request
    warn_at: yellow
    alert_at: orange
```

## Benefits

1. **Prevents data loss** - Critical content preserved before compaction
2. **Enables long sessions** - Intelligent management extends useful context
3. **Supports handoffs** - Sessions can continue across compactions
4. **Reduces waste** - Focus context on high-value content
5. **Improves reliability** - No surprise context exhaustion
