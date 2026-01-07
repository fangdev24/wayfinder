# The Manifesto

## Agent-Driven Development

*A methodology for building compliant, maintainable, and auditable software using AI agents with built-in governance.*

---

## Executive Summary

Manifesto captures a methodology - not as code to be ported, but as **a way of building software** that can be instantiated on any infrastructure.

**The Key Insight**: The code is disposable. The methodology is the value.

When rebuilding on enterprise infrastructure, you're not porting an application - you're **instantiating a proven methodology** in a compliant environment.

---

## Part 1: Philosophy

### Why Agent-Driven Development?

Traditional software development has a fundamental problem: **knowledge evaporates**.

| Traditional Development | Agent-Driven Development |
|------------------------|-------------------------|
| Developer leaves → knowledge lost | Agents retain institutional memory |
| Documentation decays | Agents ARE the documentation |
| Compliance is bolted on | Compliance is built in |
| Decisions are forgotten | Decisions are recorded and queryable |
| Onboarding takes months | Agents can explain the system |

### The Core Principles

#### 1. Agents as Team Members, Not Tools

Agents aren't code generators. They're **specialists with expertise**:
- Security Engineer knows security principles
- Governance Compliance knows WCAG and standards
- Business Analyst bridges requirements and implementation
- Each agent has domain knowledge that persists

#### 2. Compliance by Design, Not Inspection

Traditional: Build → Test → Fail compliance → Rework

Agent-Driven: Compliance agents participate in every decision → Built compliant

#### 3. Human Gates at Decision Points, Not Everywhere

Agents handle routine decisions autonomously. Humans approve:
- Policy exceptions
- Scope changes
- Budget impacts
- Novel situations

#### 4. Institutional Memory as First-Class Citizen

Every decision, pattern, and lesson learned is captured:
- `knowledge-base/decisions/` - Formal decisions with rationale
- `knowledge-base/agent-memory/patterns.yaml` - What works
- `knowledge-base/agent-memory/quick-answers.yaml` - Informal Q&A

---

## Part 2: The Agent Collaboration Model

### Team Structure

```
┌─────────────────────────────────────────────────────────────────┐
│                    GOVERNANCE & BUSINESS TEAM                    │
│         (Policy, Requirements, Scope - Review Gates)             │
│                                                                  │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐            │
│  │   product-   │ │   business-  │ │  governance- │            │
│  │   manager    │ │   analyst    │ │  compliance  │            │
│  │              │ │              │ │              │            │
│  │  Scope &     │ │ Requirements │ │  Standards & │            │
│  │  Priorities  │ │ & Criteria   │ │  Compliance  │            │
│  └──────────────┘ └──────────────┘ └──────────────┘            │
└─────────────────────────────────────────────────────────────────┘
                              │
                    Guidance & Review
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      ENGINEERING TEAM                            │
│            (Implementation - Build with Guidance)                │
│                                                                  │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐            │
│  │  solutions-  │ │   platform-  │ │    data-     │            │
│  │  architect   │ │   engineer   │ │   engineer   │            │
│  │              │ │              │ │              │            │
│  │  Design &    │ │  Cloud, IaC, │ │  Databases,  │            │
│  │  ADRs        │ │  Terraform   │ │  Prisma      │            │
│  └──────────────┘ └──────────────┘ └──────────────┘            │
│                                                                  │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐            │
│  │  frontend-   │ │   security-  │ │    devops-   │            │
│  │  developer   │ │   engineer   │ │   engineer   │            │
│  │              │ │              │ │              │            │
│  │  UI/UX,      │ │  IAM, Audit, │ │  CI/CD,      │            │
│  │  A11y        │ │  Encryption  │ │  Deployment  │            │
│  └──────────────┘ └──────────────┘ └──────────────┘            │
└─────────────────────────────────────────────────────────────────┘
```

### Communication Tiers

#### Tier 1: Informal (Agent-Comms)
Quick questions, pattern checks, precedent lookup.
- No human gate
- Builds knowledge base over time
- Fast resolution

#### Tier 2: Formal (Conflict Resolution)
Policy exceptions, compliance blockers, novel situations.
- Human decision gate
- Auditable trail
- Decision record created

---

## Part 3: Knowledge Persistence

### The Problem with Traditional Projects

```
Project starts → Team builds knowledge → Project ends → Knowledge lost
                                                              ↓
New project starts → Repeat mistakes → Rediscover solutions
```

### The Agent-Driven Solution

```
Project starts → Agents accumulate knowledge → Knowledge persists
                         ↓
                  patterns.yaml
                  quick-answers.yaml
                  decisions/
                         ↓
New project starts → Agents already know → Faster, better
```

### Knowledge Artifacts

| Artifact | Purpose | Survives |
|----------|---------|----------|
| `patterns.yaml` | What works, what doesn't | Forever |
| `quick-answers.yaml` | Informal Q&A precedent | Forever |
| `decisions/` | Formal decisions with rationale | Forever |
| Agent definitions | Domain expertise | Forever |
| Codebase | One instantiation | Can be rebuilt |

---

## Part 4: Transferable Components

When rebuilding on new infrastructure, these transfer directly:

### 1. Agent Definitions
- Domain expertise encoded
- Escalation paths defined
- Conflict detection rules

### 2. Collaboration Protocols
- Conflict resolution workflow
- Agent communication formats
- Decision record templates

### 3. Knowledge Structure
- Decision templates
- Pattern format
- Memory architecture

### 4. Skills and Commands
- Stage review workflow
- Verification protocol
- Module setup process

### What Doesn't Transfer (And That's OK)

- Application code (rebuild from requirements)
- Infrastructure modules (adapt to target platform)
- Environment-specific configuration

---

## Part 5: Lessons Learned

### What Works Well

1. **Agent collaboration feels natural** - Routing questions to specialists mimics real teams
2. **Compliance built-in** - Governance agents catch issues early
3. **Knowledge accumulates** - Quick answers become patterns
4. **Human gates where needed** - Not everything needs approval
5. **Informal channel reduces friction** - Not every question is an escalation

### What Surprised Us

1. **Agents as documentation** - The agents know why decisions were made
2. **Hub-and-spoke enables collaboration** - Main agent as message bus works
3. **Methodology > Code** - The approach is more valuable than the implementation
4. **Security considerations are nuanced** - Context matters for security decisions

### What to Watch

1. **Context limits** - Large codebases challenge context windows
2. **Agent consistency** - Same question should get same answer
3. **Security of Agent Space** - If you build it, secure it properly

---

## Part 6: The Vision

### Today: Manifesto Library

A curated library of agents, skills, and patterns that compose into project configurations.

### Tomorrow: Enterprise Deployment

The methodology instantiated on any infrastructure with:
- Enterprise auth (whatever the organization uses)
- Enterprise cloud (whatever the platform)
- Enterprise compliance (pre-approved patterns)
- Same agent collaboration model

### Future: Agent Space

Developers don't read code to understand systems - they talk to the agents who built them.

---

## Conclusion

Manifesto produces two artifacts:

1. **A configuration** - Demonstrates the approach, can be rebuilt
2. **A methodology** - Transferable, valuable, this document

The methodology ensures:
- **Compliance by design** - Not inspection
- **Knowledge persistence** - Not evaporation
- **Human oversight** - Where it matters
- **Agent collaboration** - For everything else

When you rebuild on enterprise infrastructure, you're not starting over.
You're instantiating a proven methodology in a new environment.

The agents remember everything. The patterns transfer. The governance works.

---

*"We didn't just build software - we built a way of building software."*

---

## Quick Reference

### Key Concepts

| Concept | Meaning |
|---------|---------|
| Agent-Comms | Informal agent-to-agent communication |
| Conflict Resolution | Formal escalation with human gates |
| Decision Record | Auditable record of significant decisions |
| Pattern | Proven approach captured for reuse |
| Quick Answer | Informal Q&A that becomes precedent |
| Verification Loop | Code quality gates with evidence |
| Knowledge Base | Persistent institutional memory |

---

*Methodology developed during reference implementation, generalized for Manifesto library.*
