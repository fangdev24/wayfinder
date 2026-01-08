#!/bin/bash
# Session Scribe Hook
# Detects knowledge capture triggers and session-ending patterns

# Get the user prompt from environment
PROMPT="${CLAUDE_PROMPT:-}"

# Convert prompt to lowercase for matching
PROMPT_LOWER=$(echo "$PROMPT" | tr '[:upper:]' '[:lower:]')

# =============================================================================
# PRIORITY 0: Context health check requests
# =============================================================================
CONTEXT_CHECK_PATTERNS=(
    "context check"
    "how's our context"
    "hows our context"
    "context health"
    "should we wrap"
    "running low on context"
    "context status"
    "how much context"
)

for pattern in "${CONTEXT_CHECK_PATTERNS[@]}"; do
    if [[ "$PROMPT_LOWER" == *"$pattern"* ]]; then
        echo "CONTEXT_CHECK_REQUESTED: User wants to check session context health"
        exit 0
    fi
done

# =============================================================================
# PRIORITY 1: Explicit "grab" commands - user wants to capture RIGHT NOW
# =============================================================================
GRAB_PATTERNS=(
    "grab that"
    "grab this"
    "capture that"
    "capture this"
    "save that"
    "save this"
    "note that"
    "note this"
    "remember that"
    "remember this"
    "document that"
    "document this"
    "scribe that"
    "scribe this"
    "log that"
    "log this"
    "record that"
    "record this"
    "keep that"
    "keep this"
    "store that"
    "store this"
)

for pattern in "${GRAB_PATTERNS[@]}"; do
    if [[ "$PROMPT_LOWER" == *"$pattern"* ]]; then
        echo "GRAB_TRIGGERED: Capturing the recent insight/learning to knowledge base"
        exit 0
    fi
done

# =============================================================================
# PRIORITY 1.5: Verification triggers - user wants to run code checks
# =============================================================================
VERIFY_PATTERNS=(
    "verify this"
    "verify that"
    "check this"
    "check the code"
    "run checks"
    "run verification"
    "validate code"
    "validate this"
    "pre-commit check"
    "before commit"
    "quick check"
    "quick verify"
    "lint check"
    "analyze this"
)

for pattern in "${VERIFY_PATTERNS[@]}"; do
    if [[ "$PROMPT_LOWER" == *"$pattern"* ]]; then
        echo "VERIFY_TRIGGERED: Running code verification and logging evidence"
        exit 0
    fi
done

# Section/feature complete - suggest verification
SECTION_COMPLETE_PATTERNS=(
    "section complete"
    "feature done"
    "feature complete"
    "finished the"
    "completed the"
    "that's done"
    "thats done"
    "all done with"
)

for pattern in "${SECTION_COMPLETE_PATTERNS[@]}"; do
    if [[ "$PROMPT_LOWER" == *"$pattern"* ]]; then
        echo "SECTION_COMPLETE: Consider running /verify to log evidence for DDA"
        exit 0
    fi
done

# Pre-commit detection - suggest verification
COMMIT_PATTERNS=(
    "ready to commit"
    "about to commit"
    "going to commit"
    "let's commit"
    "lets commit"
    "time to commit"
)

for pattern in "${COMMIT_PATTERNS[@]}"; do
    if [[ "$PROMPT_LOWER" == *"$pattern"* ]]; then
        echo "COMMIT_PENDING: Run /verify --pre-commit before committing"
        exit 0
    fi
done

# =============================================================================
# PRIORITY 1.6: Session continuation / handoff requests
# =============================================================================
CONTINUATION_PATTERNS=(
    "continue.md"
    "pick up later"
    "pick this up"
    "resume later"
    "continuation"
    "handoff"
    "hand off"
    "pause here"
    "break here"
    "stopping point"
    "bookmark"
    "save state"
    "mid flow"
    "mid-flow"
)

for pattern in "${CONTINUATION_PATTERNS[@]}"; do
    if [[ "$PROMPT_LOWER" == *"$pattern"* ]]; then
        echo "CONTINUATION_REQUESTED: Creating CONTINUE.md for session handoff"
        exit 0
    fi
done

# =============================================================================
# PRIORITY 2: Session-ending patterns
# =============================================================================
SESSION_END_PATTERNS=(
    "wrap up"
    "wrapping up"
    "end of session"
    "ending session"
    "that's all"
    "thats all"
    "done for now"
    "done for today"
    "signing off"
    "goodbye"
    "bye for now"
    "let's stop"
    "lets stop"
    "finish up"
    "call it a day"
)

# Decision-making patterns
DECISION_PATTERNS=(
    "decided to"
    "decision is"
    "going with"
    "chose to"
    "we'll use"
    "let's go with"
)

# Problem-solved patterns
SOLVED_PATTERNS=(
    "fixed it"
    "working now"
    "that solved"
    "problem solved"
    "got it working"
    "finally works"
)

# Gotcha patterns
GOTCHA_PATTERNS=(
    "watch out"
    "be careful"
    "gotcha"
    "heads up"
    "trap"
    "pitfall"
    "surprising"
    "unexpectedly"
)

# Check for session end
for pattern in "${SESSION_END_PATTERNS[@]}"; do
    if [[ "$PROMPT_LOWER" == *"$pattern"* ]]; then
        echo "SESSION_END_DETECTED: Consider running /scribe to capture session learnings"
        exit 0
    fi
done

# Check for decisions (prompt gently)
for pattern in "${DECISION_PATTERNS[@]}"; do
    if [[ "$PROMPT_LOWER" == *"$pattern"* ]]; then
        echo "DECISION_DETECTED: A decision may be worth documenting as an ADR"
        exit 0
    fi
done

# Check for problem solved
for pattern in "${SOLVED_PATTERNS[@]}"; do
    if [[ "$PROMPT_LOWER" == *"$pattern"* ]]; then
        echo "PROBLEM_SOLVED: This solution may be worth capturing for future reference"
        exit 0
    fi
done

# Check for gotchas
for pattern in "${GOTCHA_PATTERNS[@]}"; do
    if [[ "$PROMPT_LOWER" == *"$pattern"* ]]; then
        echo "GOTCHA_DETECTED: This gotcha should be documented to save future time"
        exit 0
    fi
done

# No patterns matched - silent success
echo "Success"
