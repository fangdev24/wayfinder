---
name: stage-review
description: Governance gates for staged development. Provides pre-build and post-build review checklists before proceeding to next stage.
---

# Stage Review Skill

Implements governance gates for staged development.

## Purpose

Ensure each development stage:
- Meets requirements before starting (pre-build)
- Meets quality standards before completing (post-build)
- Has proper documentation
- Gets appropriate sign-offs

## Usage

### Pre-Build Review
```
/stage-review pre
```

Run BEFORE starting work on a stage to verify:
- Requirements are clear
- Dependencies are ready
- Approach is approved

### Post-Build Review
```
/stage-review post
```

Run AFTER completing a stage to verify:
- All acceptance criteria met
- Quality standards achieved
- Documentation updated

## Pre-Build Review Template

```markdown
# Pre-Build Review: {Stage Name}

**Date**: {YYYY-MM-DD}
**Reviewer**: {Agent/Human}

## Requirements Check

- [ ] User stories defined and approved
- [ ] Acceptance criteria clear and testable
- [ ] Dependencies identified and ready
- [ ] Design/architecture reviewed

## Scope Validation

- [ ] Work items in scope
- [ ] No scope creep from previous stages
- [ ] Complexity appropriate for timeline

## Technical Readiness

- [ ] Environment set up
- [ ] Access to required systems
- [ ] Test data available

## Compliance Check

- [ ] Security requirements identified
- [ ] Accessibility requirements clear
- [ ] Data handling requirements documented

## Sign-off

- [ ] Product Owner approval
- [ ] Technical Lead approval
- [ ] Ready to proceed

## Notes
{Any relevant notes or caveats}
```

## Post-Build Review Template

```markdown
# Post-Build Review: {Stage Name}

**Date**: {YYYY-MM-DD}
**Reviewer**: {Agent/Human}

## Acceptance Criteria

- [ ] Criterion 1: {Description} - {Pass/Fail}
- [ ] Criterion 2: {Description} - {Pass/Fail}

## Quality Gates

- [ ] Code review completed
- [ ] Tests passing ({X}% coverage)
- [ ] Static analysis clean
- [ ] Build successful

## Verification

- [ ] Verification loop passed
- [ ] Manual testing completed
- [ ] Edge cases handled

## Documentation

- [ ] Code comments where needed
- [ ] API documentation updated
- [ ] Architecture decisions recorded

## Compliance

- [ ] Security review passed
- [ ] Accessibility tested
- [ ] No hardcoded secrets

## Demo Readiness

- [ ] Feature demo-able
- [ ] Demo script prepared
- [ ] Known limitations documented

## Sign-off

- [ ] Ready for next stage
- [ ] Requires remediation (see notes)

## Notes
{Any issues, observations, or recommendations}
```

## Stage Types

### Feature Stage
Full review with all checks.

### Bug Fix
Abbreviated review:
- Root cause identified
- Fix verified
- Regression tests added
- No new issues introduced

### Refactoring
Focus on:
- Behaviour unchanged
- Tests still passing
- Performance not degraded
- Code quality improved

## Integration with Agents

### Governance Agent
The governance/compliance agent should be invoked for:
- Security-related stages
- Data handling changes
- Authentication/authorization changes

### Product Manager Agent
Should review:
- Scope alignment
- Value delivery
- Demo readiness

### Solutions Architect Agent
Should review:
- Architecture decisions
- Integration points
- Technical approach

## Workflow

```
┌─────────────────────────────────────────────────────────────────┐
│                    STAGED DEVELOPMENT                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   STAGE N                                                       │
│   ────────                                                      │
│   1. /stage-review pre ──────→ Issues? → Resolve → Re-review    │
│      ↓ Approved                                                 │
│   2. Implement                                                  │
│      ↓                                                          │
│   3. Verify (verification loop)                                 │
│      ↓                                                          │
│   4. /stage-review post ─────→ Issues? → Fix → Re-review        │
│      ↓ Approved                                                 │
│   5. Proceed to Stage N+1                                       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Benefits

1. **Quality Gates**: Catch issues before they compound
2. **Clear Expectations**: Everyone knows what's required
3. **Audit Trail**: Reviews document decisions and state
4. **Momentum**: Clear gates prevent scope creep
