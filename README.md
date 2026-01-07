# Wayfinder

> knowledbase

## Quick Start

```bash
# Clone the repository
git clone https://github.com/fangdev24/wayfinder
cd wayfinder

# Start developing with Claude Code
claude
```

## Project Structure

```
wayfinder/
├── project.yaml              # Project configuration
├── CLAUDE.md                 # Claude Code instructions
├── .claude/
│   ├── subagents/            # Specialized AI agents
│   ├── rules/                # Coding standards
│   ├── skills/               # Workflows
│   └── commands/             # Custom commands
├── knowledge-base/
│   ├── decisions/            # Architecture Decision Records
│   ├── patterns/             # Documented patterns
│   └── sessions/             # Session notes
└── planning/
    ├── architecture/         # Design documents
    └── research/             # Research notes
```

## Development

### Prerequisites

- [Claude Code](https://claude.ai/code) CLI installed
- Git

### Getting Started

1. Review `project.yaml` for project configuration
2. Read `CLAUDE.md` for development guidelines
3. Run `claude` to start an AI-assisted development session

### Available Agents

Use `@agent-name` to invoke specialized agents:

- **@solutions-architect** - System design and architecture
- **@devops-engineer** - CI/CD and deployment

(Additional agents based on your tech stack and compliance requirements)

### Recording Decisions

For significant decisions, create an Architecture Decision Record:

```bash
knowledge-base/decisions/ADR-001-my-decision.md
```

## Tech Stack

- **Primary**: node
- See `project.yaml` for full configuration

## Contributing

1. Read `CLAUDE.md` for development guidelines
2. Follow coding rules in `.claude/rules/`
3. Use appropriate agents for domain expertise
4. Document significant decisions as ADRs

## License

[Add your license here]

---

*Project initialized from Manifesto template v1.0.0*
