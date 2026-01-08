# Code Verify Skill

Code verification and evidence logging for quality gates and governance compliance.

## Philosophy

> "Quality is not an act, it is a habit." - Aristotle
> "Evidence of quality is not optional for enterprise software."

Code verification provides auditable proof that quality gates passed at key development milestones.

## When to Activate

This skill should activate when:
- User mentions "verify", "check", "validate" in code context
- A feature or section is completed
- User is about to commit changes
- User asks about code quality or testing
- Discussion of governance requirements or evidence

## Trigger Phrases

### Immediate Verification Triggers

| Phrase | Action |
|--------|--------|
| "verify this" | Run full verification |
| "verify that" | Run full verification |
| "check this" | Run full verification |
| "check the code" | Run full verification |
| "run checks" | Run full verification |
| "run verification" | Run full verification |
| "validate code" | Run full verification |
| "validate this" | Run full verification |

### Quick Check Triggers

| Phrase | Action |
|--------|--------|
| "quick check" | Run analysis only |
| "quick verify" | Run analysis only |
| "lint check" | Run analysis only |
| "analyze this" | Run analysis only |

### Pre-commit Triggers

| Phrase | Action |
|--------|--------|
| "pre-commit check" | Run analysis + tests |
| "before commit" | Run analysis + tests |
| "ready to commit" | Suggest pre-commit check |
| "about to commit" | Suggest pre-commit check |

### Section/Feature Complete Triggers

| Phrase | Action |
|--------|--------|
| "section complete" | Prompt for verification |
| "feature done" | Prompt for verification |
| "finished the" | Prompt for verification |
| "completed the" | Prompt for verification |

## Verification Levels

### Full Verification
All checks with evidence logging:
1. Static analysis (lint, type check)
2. Format verification
3. Unit tests
4. Build verification

### Quick Verification
Fast feedback during development:
1. Static analysis
2. Format check

### Pre-commit Verification
Balance of speed and safety:
1. Static analysis
2. Format check
3. Tests

## Technology-Specific Commands

### Flutter/Dart
```bash
flutter analyze --fatal-infos --fatal-warnings
dart format --set-exit-if-changed .
flutter test
flutter build web
```

### TypeScript/React
```bash
npm run lint
npm run type-check
npm run format:check
npm run test
npm run build
```

### Python
```bash
ruff check .
mypy .
black --check .
pytest
```

### Node.js
```bash
npm run lint
npm run test
npm run build
```

## Evidence Logging

All verification runs produce:

### Verification Report
`planning/verification-logs/YYYY-MM-DD_HHMM_[feature].md`

```markdown
# Verification Report: {feature}

**Date**: {date}
**Time**: {time}
**Trigger**: {what triggered verification}

## Summary

| Check | Status | Details |
|-------|--------|---------|
| Analysis | ✅/❌ | {count} issues |
| Format | ✅/❌ | {changed files} |
| Tests | ✅/❌ | {pass}/{total} |
| Build | ✅/❌ | {build status} |

## Details

### Static Analysis
{analysis output}

### Tests
{test output summary}

### Build
{build output summary}

## Files in Scope
- {file1}
- {file2}
```

### Raw Log
`planning/verification-logs/raw/YYYY-MM-DD_HHMM_[feature].log`
- Complete stdout/stderr
- Timestamps for each step
- Exit codes

### Index Entry
`planning/verification-logs/index.md`
- Running table of all verification runs
- Quick reference for auditors

## Integration Points

### With Feature Workflow
When a feature is completed, prompt:
> "Feature complete! Should I run verification and log evidence?"

### With Commits
When about to commit, suggest:
> "Run pre-commit verification first?"

### With Scribe
At session end, if code was written:
> "Run verification before wrapping up?"

### With Stage Review
Pre/post build gates include verification:
- Pre-build: Baseline verification
- Post-build: Full verification with evidence

## Graceful Degradation

If tooling is not set up:
1. Note which checks couldn't run
2. Log what was attempted
3. Still create evidence record
4. Suggest setup steps

```markdown
## Verification Attempted

| Check | Status | Note |
|-------|--------|------|
| Analysis | ⚠️ Skipped | Flutter not installed |
| Format | ⚠️ Skipped | Flutter not installed |
| Tests | ⚠️ Skipped | Flutter not installed |
| Build | ⚠️ Skipped | Flutter not installed |

**Setup Required**: Run `flutter doctor` to configure Flutter
```

## Example Flow

```
User: "I've finished the user profile widget, verify this"

Claude:
1. Detects "verify this" trigger
2. Identifies context: user profile widget
3. Runs full verification:
   - flutter analyze → ✅ 0 issues
   - dart format → ✅ no changes
   - flutter test → ✅ 24/24
   - flutter build → ✅ compiled
4. Generates report
5. Updates index
6. Reports summary to user

Response:
"## Verification Complete ✅

Feature: user-profile-widget

| Check | Status |
|-------|--------|
| Analysis | ✅ Clean |
| Format | ✅ Clean |
| Tests | ✅ 24/24 |
| Build | ✅ OK |

📄 Evidence logged: planning/verification-logs/2026-01-05_1430_user-profile-widget.md"
```

## Gentle Prompts

At natural breakpoints, consider suggesting:
> "That feature looks complete. Want me to run verification and log evidence?"

But don't be pushy - verification is user-triggered by design.

## Why This Matters

For enterprise/governance sign-off, you need to demonstrate:
1. **Systematic quality** - Not random testing, structured verification
2. **Evidence trail** - Timestamped proof, not just claims
3. **Tool-based validation** - Automated analysis, not just eyeballing
4. **Natural integration** - Quality as part of workflow, not afterthought

This skill ensures verification is easy to do and always documented.

## Related Files

- `library/skills/verification-loop/` - The verification pattern itself
- `library/patterns/verification-loop.md` - Documentation
- `planning/verification-logs/` - Evidence storage
