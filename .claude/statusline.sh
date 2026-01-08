#!/bin/bash
# RSC Hub Statusline - Real-time Context & Cost Monitor
# Receives JSON context via stdin, outputs single status line

# Read all input
input=$(cat)

# Check if jq is available
if ! command -v jq &> /dev/null; then
    # Fallback: basic parsing with grep/sed
    MODEL=$(echo "$input" | grep -o '"display_name":"[^"]*"' | head -1 | sed 's/"display_name":"//;s/"$//')
    MODEL=${MODEL:-"Claude"}
    echo "[$MODEL] (install jq for full stats)"
    exit 0
fi

# Extract data with jq
MODEL=$(echo "$input" | jq -r '.model.display_name // "Claude"')
CONTEXT_SIZE=$(echo "$input" | jq -r '.context_window.context_window_size // 200000')
USAGE=$(echo "$input" | jq '.context_window.current_usage // null')
COST=$(echo "$input" | jq -r '.cost.total_cost_usd // 0')

# Calculate context usage if available
if [ "$USAGE" != "null" ] && [ -n "$USAGE" ]; then
    INPUT_TOKENS=$(echo "$USAGE" | jq -r '.input_tokens // 0')
    CACHE_CREATE=$(echo "$USAGE" | jq -r '.cache_creation_input_tokens // 0')
    CACHE_READ=$(echo "$USAGE" | jq -r '.cache_read_input_tokens // 0')

    # Total tokens in context
    TOTAL_TOKENS=$((INPUT_TOKENS + CACHE_CREATE + CACHE_READ))

    # Calculate percentage
    if [ "$CONTEXT_SIZE" -gt 0 ] 2>/dev/null; then
        PERCENT_USED=$((TOTAL_TOKENS * 100 / CONTEXT_SIZE))
    else
        PERCENT_USED=0
    fi

    # Format token count (K for thousands)
    if [ "$TOTAL_TOKENS" -gt 1000 ]; then
        TOKEN_DISPLAY="$((TOTAL_TOKENS / 1000))K"
    else
        TOKEN_DISPLAY="${TOTAL_TOKENS}"
    fi

    # Context status with colour coding
    # Reserve 15K tokens for /scribe headroom
    SCRIBE_RESERVE=15000
    EFFECTIVE_LIMIT=$((CONTEXT_SIZE - SCRIBE_RESERVE))

    if [ "$EFFECTIVE_LIMIT" -gt 0 ] 2>/dev/null; then
        EFFECTIVE_PERCENT=$((TOTAL_TOKENS * 100 / EFFECTIVE_LIMIT))
    else
        EFFECTIVE_PERCENT=0
    fi

    if [ "$EFFECTIVE_PERCENT" -gt 90 ] 2>/dev/null; then
        # Red - Critical, scribe NOW
        CONTEXT_STATUS="\033[0;31m[!] ${PERCENT_USED}%\033[0m"
    elif [ "$EFFECTIVE_PERCENT" -gt 75 ] 2>/dev/null; then
        # Yellow - Heavy, scribe soon
        CONTEXT_STATUS="\033[0;33m[~] ${PERCENT_USED}%\033[0m"
    elif [ "$EFFECTIVE_PERCENT" -gt 50 ] 2>/dev/null; then
        # Cyan - Warming
        CONTEXT_STATUS="\033[0;36m[-] ${PERCENT_USED}%\033[0m"
    else
        # Green - Fresh
        CONTEXT_STATUS="\033[0;32m[+] ${PERCENT_USED}%\033[0m"
    fi
else
    TOKEN_DISPLAY="--"
    CONTEXT_STATUS="\033[0;90m[?] --\033[0m"
fi

# Format cost
if command -v bc &> /dev/null && [ "$(echo "$COST > 0" | bc -l 2>/dev/null)" = "1" ]; then
    COST_DISPLAY="\$$(printf "%.3f" "$COST")"
else
    # Simple integer check fallback
    if [ "${COST%.*}" -gt 0 ] 2>/dev/null || [ "$COST" != "0" ]; then
        COST_DISPLAY="\$${COST}"
    else
        COST_DISPLAY="\$0.00"
    fi
fi

# Build status line
# Format: [Model] [+] XX% (XXK) | $X.XX
echo -e "[$MODEL] $CONTEXT_STATUS ($TOKEN_DISPLAY) | $COST_DISPLAY"
