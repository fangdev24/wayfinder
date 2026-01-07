# Wayfinder - Claude Code Instructions

> **Project**: Wayfinder
> **Stage**: development
> **Tech Stack**: node

## Project Overview

knowledbase

**Repository**: https://github.com/fangdev24/wayfinder

## Development Guidelines

### Working in This Project

1. **Read `project.yaml`** for project configuration
2. **Check agents** in `.claude/subagents/` for domain expertise
3. **Follow rules** in `.claude/rules/` for coding standards
4. **Use skills** in `.claude/skills/` for workflows

### Key Directories

```
wayfinder/
├── project.yaml              # Project configuration (single source of truth)
├── CLAUDE.md                 # This file - project instructions
├── .claude/
│   ├── subagents/            # Specialized agents
│   ├── rules/                # Coding standards
│   ├── skills/               # Workflows and skills
│   └── commands/             # Custom commands
├── knowledge-base/
│   ├── decisions/            # Architecture Decision Records
│   ├── patterns/             # Documented patterns
│   └── sessions/             # Session handoff notes
└── planning/
    ├── architecture/         # Design documents
    └── research/             # Research notes
```

## Available Agents

The following specialized agents are available. Invoke with `@agent-name`:

### Core Agents
- **@solutions-architect** - System design, architecture decisions, ADRs
- **@devops-engineer** - CI/CD, deployment, infrastructure

### Stack-Specific Agents
(Enabled based on your tech stack selection during setup)

### Compliance Agents
(Enabled based on compliance requirements)

## Coding Standards

See `.claude/rules/` for specific coding rules. General principles:

1. **Clarity over cleverness** - Write readable code
2. **Single responsibility** - Each component does one thing well
3. **Document decisions** - Record why, not just what
4. **Test appropriately** - Unit tests for logic, integration tests for flows

## Skills & Workflows

### Knowledge Capture
Use `/scribe` or `@scribe` to capture important decisions and learnings.

### Verification Loop
Before presenting code, verify it builds and tests pass.

### Stage Review
Use `/stage-review` for pre/post implementation compliance checks.

## Recording Decisions

For significant decisions, create an ADR (Architecture Decision Record):

```
knowledge-base/decisions/
├── ADR-001-auth-strategy.md
├── ADR-002-database-choice.md
└── ...
```

Template:
```markdown
# ADR-{number}: {Title}

## Status
Proposed | Accepted | Deprecated | Superseded

## Context
What is the issue that we're seeing?

## Decision
What change are we making?

## Consequences
What are the positive, negative, and neutral outcomes?
```

## Git Workflow

This project uses **continuous development** with feature branches and iterative releases.

### Branching Strategy
- `main` branch is always deployable
- Feature branches: `feature/{description}`
- Bug fixes: `fix/{description}`
- Releases tagged as `v{major}.{minor}.{patch}`

### Feature Workflow
1. Create feature branch from `main`
2. Implement and test locally
3. Open Pull Request
4. Review and merge to `main`
5. Deploy (automatically or manually)

### Versioning
- Releases: `v1.2.3`
- Pre-releases: `v1.2.3-beta.1`

### Release Process
```bash
# Tag a release
git tag v1.2.3 -m "Release 1.2.3"
git push origin v1.2.3
```


## Session Continuity

At end of session, capture context for handoff:

```markdown
## Session Summary - {date}

### Completed
- [What was done]

### In Progress
- [What's partially done]

### Next Steps
- [What to do next]

### Key Decisions
- [Important decisions made]

### Blockers
- [What's blocked and why]
```

Save to `knowledge-base/sessions/session-{date}.md`

## Quick Reference

| Task | Command/Action |
|------|----------------|
| Architecture question | `@solutions-architect` |
| Record decision | Create ADR in `knowledge-base/decisions/` |
| Capture pattern | Add to `knowledge-base/patterns/` |
| Session handoff | Create session note |
| Verify code | Run build + test before presenting |

---

*Generated from template v1.0.0 on 2026-01-07*
