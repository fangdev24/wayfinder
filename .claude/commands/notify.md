---
name: notify
description: Send a notification to configured channels
arguments:
  - name: message
    description: The message to send
    required: true
  - name: type
    description: "Notification type: info, success, warning, error, escalation"
    required: false
    default: "info"
---

# Send Notification

Send a notification message to configured channels (Slack, Teams, email, etc.).

## Usage

```
/notify "<message>" [type]
```

## Types

| Type | When to Use |
|------|-------------|
| `info` | General updates |
| `success` | Task completed, milestone reached |
| `warning` | Needs attention but not urgent |
| `error` | Something broke |
| `escalation` | Human decision needed |

## Examples

```
/notify "Feature complete: user authentication" success
/notify "Need decision on API design approach" escalation
/notify "Build failing on main branch" error
/notify "Starting deployment to staging" info
```

## Configuration

Notifications are sent via hooks configured in `.claude/hooks/`.

To enable notifications:

1. Create a notification hook script (e.g., `.claude/hooks/notify-slack.sh`)
2. Configure the hook in your project settings

### Example Slack Hook

```bash
#!/bin/bash
TYPE="$1"
MESSAGE="$2"

WEBHOOK_URL="${SLACK_WEBHOOK_URL}"

case "$TYPE" in
  success) EMOJI=":white_check_mark:" ;;
  warning) EMOJI=":warning:" ;;
  error)   EMOJI=":x:" ;;
  escalation) EMOJI=":rotating_light:" ;;
  *)       EMOJI=":information_source:" ;;
esac

curl -X POST -H 'Content-type: application/json' \
  --data "{\"text\":\"$EMOJI $MESSAGE\"}" \
  "$WEBHOOK_URL"
```

## Process

When `/notify` is invoked:

1. Parse the message and type from arguments
2. Look for notification hooks in `.claude/hooks/`
3. Execute the hook with type and message parameters
4. Report success or failure to user

If no notification hook is configured, display the message locally and suggest setting up notifications.

## Integration

The notify command can be called by other commands:
- `/verify` can notify on build failures
- `/scribe` can notify on session end
- `/stage-review` can notify on review completion
