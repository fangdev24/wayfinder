# Session Summary - 2026-01-16

## Topic: AI Chat Security Review for Production

### Completed

1. **Codebase Analysis**
   - Explored Wayfinder's query architecture ([agent-query.ts](../../app/src/lib/agent-query.ts), [slack-bot query.ts](../../slack-bot/src/query.ts))
   - Identified current implementation uses local regex matching (NOT external LLM)
   - Mapped data assets requiring protection (services, people, teams, DSAs, agents)
   - Assessed current security controls (Pod proxy whitelisting, Slack signing validation)

2. **Research Conducted**
   - OWASP Top 10 for LLMs 2025 - Prompt injection is #1 risk
   - NCSC December 2025 advisory - Prompt injection "may never be properly mitigated"
   - EU AI Act 2026 requirements - Adversarial testing evidence mandatory
   - Industry best practices for LLM data leakage prevention
   - Red team testing methodologies and compliance frameworks

3. **Documents Created**
   - [AI Chat Security Recommendations](../planning/security/AI-Chat-Security-Recommendations.md) - Comprehensive 500+ line report
   - [ADR-005: AI Chat Security Controls](./decisions/ADR-005-ai-chat-security-controls.md) - Architecture decision record

### Key Findings

| Finding | Severity | Current State |
|---------|----------|---------------|
| No input sanitisation | HIGH | Not implemented |
| No RBAC/authentication | HIGH | Not implemented |
| No audit logging | MEDIUM | Not implemented |
| No output redaction | MEDIUM | Not implemented |
| Data classification | MEDIUM | Not documented |
| Pod proxy whitelisting | LOW | Implemented |
| Slack signing validation | LOW | Implemented |

### Recommendations Summary

**Immediate Priority:**
1. Input sanitisation with injection pattern detection
2. Query audit logging with integrity hashes
3. Automated security test suite in CI
4. Data classification matrix

**Short-term:**
1. RBAC implementation
2. Authentication layer
3. Output redaction by user role
4. Rate limiting

**Medium-term:**
1. Quarterly red team testing
2. SIEM integration
3. Incident response playbook

**Long-term:**
1. EU AI Act compliance (mandatory mid-2026)
2. Independent security audit
3. NCSC compliance certification

### Key Decisions Made

1. **Defence-in-depth model**: Four-layer security (input, access, output, audit)
2. **Risk management approach**: Per NCSC guidance, controls reduce but cannot eliminate risk
3. **Human oversight model**: Tiered approval based on operation risk level
4. **Compliance alignment**: NCSC, OWASP LLM Top 10, EU AI Act, GDS standards

### Research Sources Used

- [NCSC: Prompt Injection is Not SQL Injection](https://www.ncsc.gov.uk/blog-post/prompt-injection-is-not-sql-injection)
- [OWASP LLM01:2025 Prompt Injection](https://genai.owasp.org/llmrisk/llm01-prompt-injection/)
- [OWASP Prompt Injection Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html)
- [UK Code of Practice for AI Cyber Security](https://www.gov.uk/government/publications/ai-cyber-security-code-of-practice)
- [The 2026 State of LLM Security](https://brightsec.com/blog/the-2026-state-of-llm-security-key-findings-and-benchmarks/)
- [NCSC Guidelines for Secure AI System Development](https://www.ncsc.gov.uk/collection/guidelines-secure-ai-system-development)
- [LLM Red Teaming Playbook](https://hacken.io/discover/ai-red-teaming/)

### Next Steps

1. **Review & Approval**: ADR-005 requires stakeholder review and approval
2. **Prioritisation**: Determine which Phase 1 controls to implement first
3. **Resource Allocation**: Estimate effort for security implementation
4. **Testing Infrastructure**: Set up security test framework (garak, promptfoo)
5. **Compliance Gap Analysis**: Detailed mapping against NCSC 14 principles

### Blockers

None identified - recommendations ready for review.

### Files Modified/Created

| File | Action |
|------|--------|
| `planning/security/AI-Chat-Security-Recommendations.md` | Created |
| `knowledge-base/decisions/ADR-005-ai-chat-security-controls.md` | Created |
| `knowledge-base/sessions/session-2026-01-16-ai-security-review.md` | Created |

---

*Session duration: ~15 minutes*
*Next session: Implementation planning or security control development*
