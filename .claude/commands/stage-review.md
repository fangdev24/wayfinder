# Stage Review: Pre/Post Build Governance Gate

Orchestrate a comprehensive review using governance and business agents to ensure alignment before or after a build stage.

## Purpose

This command ensures that:
1. **Pre-build**: Engineers have clear guidance on patterns, requirements, and compliance before writing code
2. **Post-build**: Deliverables meet business requirements, compliance standards, and policy alignment

## Usage

```
/stage-review [pre|post] [stage-name]
```

**Examples:**
- `/stage-review pre core-platform` - Review before building Core Platform
- `/stage-review post user-auth` - Review after completing User Authentication
- `/stage-review pre` - Interactive mode, will ask for stage details

## Arguments

$ARGUMENTS

## Process

### Step 1: Determine Review Type

Parse arguments to identify:
- **Review type**: `pre` (before build) or `post` (after build)
- **Stage name**: Which stage to review

If not provided, ask:
1. Is this a PRE-build or POST-build review?
2. Which stage? (List from config/stages.yaml or project.yaml)

### Step 2: Gather Context

Read relevant project context:
- `planning/` - Product requirements and designs
- `project.yaml` - Project configuration
- `CLAUDE.md` - Project standards
- Recent git changes (for post-build)

### Step 3: Orchestrate Review Team

Launch the review agents in sequence. Each agent provides their specialist perspective.

#### PRE-BUILD Review Sequence

```
+------------------------------------------------------------------+
|  1. PRODUCT/BUSINESS REVIEW                                       |
|     "Is this in scope? What value does it deliver?"               |
|     "Are requirements clear? Acceptance criteria testable?"       |
|     |                                                             |
|  2. GOVERNANCE & COMPLIANCE                                       |
|     "What compliance patterns must be followed?"                  |
|     |                                                             |
|  3. CONSOLIDATE                                                   |
|     Compile guidance for engineering agents                       |
+------------------------------------------------------------------+
```

#### POST-BUILD Review Sequence

```
+------------------------------------------------------------------+
|  1. REQUIREMENTS VERIFICATION                                     |
|     "Do deliverables meet acceptance criteria?"                   |
|     |                                                             |
|  2. VALUE ASSESSMENT                                              |
|     "Does this deliver the expected value?"                       |
|     |                                                             |
|  3. COMPLIANCE AUDIT                                              |
|     "Are all compliance requirements satisfied?"                  |
|     |                                                             |
|  4. SECURITY REVIEW (if applicable)                               |
|     "Security review of implementation"                           |
|     |                                                             |
|  5. CONSOLIDATE                                                   |
|     Final sign-off or remediation list                            |
+------------------------------------------------------------------+
```

### Step 4: Generate Review Questions

#### Pre-build Questions:
1. Is every planned feature within scope?
2. What is the core value each feature delivers?
3. What should definitely NOT be built this stage?
4. What's the minimum viable deliverable?
5. Are all requirements documented with testable acceptance criteria?
6. What compliance patterns must be followed?
7. What anti-patterns should be avoided?

#### Post-build Questions:
1. Does each requirement have passing acceptance criteria?
2. Is there evidence of testing for each feature?
3. Are security requirements satisfied?
4. Is the code accessible (if applicable)?
5. Is data handled properly?
6. Is this demo-ready?

### Step 5: Consolidate Output

Compile all reviews into a single document:

```markdown
# Stage Review Report
**Stage**: [Stage Name]
**Type**: [Pre-build / Post-build]
**Date**: [Date]

## Executive Summary
[APPROVED TO PROCEED / REQUIRES REMEDIATION / BLOCKED]

---

## Requirements Review
[Summary of requirements findings]

### Requirements Status
| Req ID | Status | Notes |
|--------|--------|-------|
| ... | ... | ... |

---

## Compliance Review
[Summary of compliance findings]

### Compliance Status
- [ ] Security: [PASS/FAIL]
- [ ] Accessibility: [PASS/FAIL]
- [ ] Data Protection: [PASS/FAIL]

---

## Consolidated Actions

### Blockers (Must Fix)
1. [Critical issues]

### Recommendations (Should Fix)
1. [Important but non-blocking]

### Suggestions (Could Consider)
1. [Nice to have]

---

## Guidance for Engineering (Pre-build only)

### Patterns to Follow
- [Required patterns]

### Anti-patterns to Avoid
- [What NOT to do]

### Compliance Checklist
- [ ] [Specific items to verify]

---

## Sign-off

| Role | Status | Notes |
|------|--------|-------|
| Requirements | PASS/FAIL | |
| Compliance | PASS/FAIL | |
| Security | PASS/FAIL | (Post-build only) |

**Overall Status**: [APPROVED / CONDITIONAL / BLOCKED]
```

### Step 6: Save and Communicate

1. Save report to `planning/reviews/[stage]-[pre|post]-review-[date].md`
2. Create `planning/reviews/` directory if it doesn't exist
3. Summarize key findings for the user
4. If pre-build: Confirm engineers have guidance before proceeding
5. If post-build: Confirm stage completion or remediation needed

## Notes

- Pre-build reviews should happen BEFORE any code is written
- Post-build reviews should happen BEFORE moving to next stage
- Engineering agents should receive the consolidated guidance
- Any BLOCKED status requires human decision before proceeding
