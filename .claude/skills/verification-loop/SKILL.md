---
name: verification-loop
description: Antigravity-inspired verification loop that ensures code passes all quality gates before being presented as complete.
---

# Verification Loop Skill

Ensures code meets quality standards before presenting as complete.

## Purpose

Implement a verification loop where the agent iterates until all quality gates pass, inspired by Google Antigravity's verification-first philosophy.

## The Loop

```
┌─────────────────────────────────────────────────────────────────┐
│                    VERIFICATION LOOP                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   1. WRITE CODE                                                 │
│      ↓                                                          │
│   2. RUN ANALYSIS ──────────────→ Issues? → Fix → Loop          │
│      ↓ Clean                                                    │
│   3. RUN FORMATTER ─────────────→ Changed? → Commit → Continue  │
│      ↓ Consistent                                               │
│   4. RUN TESTS ─────────────────→ Failed? → Fix → Loop          │
│      ↓ Passing                                                  │
│   5. RUN BUILD ─────────────────→ Error? → Fix → Loop           │
│      ↓ Compiles                                                 │
│   6. PRESENT AS COMPLETE                                        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Stack-Specific Commands

### Flutter/Dart
```bash
flutter analyze --fatal-infos --fatal-warnings
dart format --set-exit-if-changed .
flutter test
flutter build web
```

### React/TypeScript
```bash
npm run lint
npm run typecheck
npm test
npm run build
```

### Python
```bash
ruff check .
mypy src/
pytest
ruff format --check .
```

### Node.js
```bash
npm run lint
npm run typecheck
npm test
npm run build
```

## Loop Rules

1. **Maximum 3 iterations** before asking user for help
2. **Fix root cause**, not symptoms
3. **If tests fail for unrelated code**: note in artifact, don't block
4. **Never present incomplete work as done**

## Verification Levels

| Scenario | Verification Level |
|----------|-------------------|
| New component/module | Full loop (all steps) |
| Bug fix | Analysis + Tests + Build |
| Refactoring | Analysis + Tests |
| Documentation only | Skip verification |
| Config change | Build only |

## Verification Artifact

When completing a task, generate this artifact:

```markdown
## Verification Report

| Check | Status | Details |
|-------|--------|---------|
| Analysis | ✅ Pass | 0 warnings, 0 errors |
| Format | ✅ Pass | No changes needed |
| Tests | ✅ Pass | X/Y tests passing |
| Build | ✅ Pass | Compiled successfully |

### Files Modified
- `path/to/file1.ts`
- `path/to/file2.ts`

### Notes
{Any relevant observations}
```

## Usage

### Automatic
The verification loop should run automatically when the frontend-developer, react-developer, flutter-developer, python-developer, or node-developer agent completes code changes.

### Manual Trigger
```
/verify
```

## Integration with Subagents

Add to relevant developer agents:

```markdown
## Verification Protocol

After writing code, ALWAYS run the verification loop:

1. Run static analysis - Fix ALL warnings, not just errors
2. Check formatting - Ensure consistent style
3. Run tests - All tests must pass
4. Run build - Confirm it compiles

Do NOT present code as complete until all steps pass.

If a step fails:
- Read the error message
- Fix the issue
- Re-run from step 1
- Maximum 3 iterations before asking user for help
```

## Benefits

1. **Higher Quality**: Code is verified before user sees it
2. **Faster Iteration**: Issues caught immediately
3. **Trust**: "Complete" means actually complete
4. **Audit Trail**: Verification artifacts document quality

## Anti-Patterns

| Don't | Do Instead |
|-------|------------|
| Skip analysis because "it's just a warning" | Treat warnings as errors |
| Ignore failing tests for unrelated code | Fix or document with explanation |
| Present code without building | Always confirm it compiles |
| Run verification once | Loop until clean |
