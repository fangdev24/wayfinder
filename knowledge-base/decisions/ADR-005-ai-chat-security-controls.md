# ADR-005: AI Chat Security Controls

## Status

**Proposed**

## Context

Wayfinder provides natural language query capabilities through:
1. A web-based query interface
2. A Slack bot (@wayfinder mentions and slash commands)
3. Future potential LLM integration for enhanced understanding

The NCSC (December 2025) has warned that prompt injection attacks against LLMs "may never be properly mitigated" due to the fundamental inability of LLMs to distinguish instructions from data. Additionally, the system handles sensitive government data including:

- Service architecture and API endpoints
- Employee directory (names, emails, roles)
- Cross-departmental data flows
- Agent capabilities and permissions
- Data Sharing Agreements with legal basis

Regulatory requirements are increasing:
- **EU AI Act (2026)**: Mandates adversarial testing evidence for high-risk systems
- **NCSC Guidelines**: Require alignment to ETSI TS 104 223
- **OWASP LLM Top 10 2025**: Lists prompt injection as #1 vulnerability

### Current State

The current implementation uses **local regex-based processing** (not external LLM calls), which significantly reduces prompt injection risk. However:
- No input sanitisation for injection patterns
- No output redaction based on user role
- No authentication or RBAC
- No audit logging of queries
- Data classification not implemented

## Decision

We will implement a **defence-in-depth security model** for all chat/query functionality with four layers:

### Layer 1: Input Controls

1. **Sanitisation**: All user queries sanitised before processing
2. **Pattern Detection**: Known injection patterns flagged and logged
3. **Length Limits**: Maximum query length enforced
4. **Encoding Validation**: Character encoding validated to prevent bypass

```typescript
interface QuerySanitiser {
  sanitiseInput(input: string): string;
  detectInjectionAttempt(input: string): InjectionDetectionResult;
  enforceMaxLength(input: string, maxLength: number): string;
}
```

### Layer 2: Access Controls

1. **Authentication**: Required for all non-public queries
2. **RBAC**: Role-based access with department boundaries
3. **Data Classification**: Four-tier classification (PUBLIC, OFFICIAL, OFFICIAL-SENSITIVE, SECRET)
4. **Rate Limiting**: Per-user query limits to prevent bulk extraction

```typescript
interface AccessPolicy {
  role: string;
  allowedClassifications: DataClassification[];
  departmentScope: string[] | 'all';
}
```

### Layer 3: Output Controls

1. **Redaction**: Sensitive fields masked based on user role
2. **Schema Validation**: Responses validated against expected format
3. **Leak Detection**: System prompt and internal data leak detection
4. **Size Limits**: Maximum response size enforced

### Layer 4: Audit & Monitoring

1. **Immutable Audit Log**: All queries logged with integrity hashes
2. **Security Alerting**: Real-time detection of suspicious patterns
3. **Compliance Reporting**: Evidence generation for regulatory requirements

```typescript
interface QueryAuditEntry {
  queryId: string;
  userId: string;
  rawQuery: string;
  sanitisedQuery: string;
  securityFlags: SecurityFlag[];
  dataClassificationsAccessed: DataClassification[];
  requestHash: string;
  responseHash: string;
}
```

### Human Oversight Model

| Risk Level | Oversight Requirement |
|------------|----------------------|
| Low | Audit log only |
| Medium | Approval workflow |
| High | Per-request approval |
| Critical | Dual-approval + senior oversight |

## Consequences

### Positive

- **Regulatory Compliance**: Meets NCSC, OWASP, and EU AI Act requirements
- **Defence in Depth**: No single point of failure
- **Audit Trail**: Full evidence for compliance reviews
- **Risk Management**: Acknowledges NCSC position that prompt injection requires ongoing management
- **Future-Proof**: Controls apply whether using regex or LLM processing

### Negative

- **Implementation Effort**: Significant development work required
- **Performance Impact**: Additional processing for sanitisation and logging
- **User Experience**: Rate limiting and authentication add friction
- **Operational Overhead**: Monitoring and alert triage required

### Neutral

- **No Silver Bullet**: Per NCSC guidance, these controls reduce but cannot eliminate prompt injection risk
- **Ongoing Commitment**: Security posture requires continuous testing and updates

## Implementation Plan

### Phase 1: Foundation (Immediate)
- Input sanitisation
- Query audit logging
- Automated security test suite
- Data classification documentation

### Phase 2: Access Control (Short-term)
- RBAC implementation
- Authentication layer
- Output redaction by role
- Rate limiting

### Phase 3: Advanced Protection (Medium-term)
- Red team testing programme
- SIEM integration
- Incident response playbook

### Phase 4: Compliance (Long-term)
- NCSC compliance review
- EU AI Act readiness assessment
- Independent security audit

## Related Documents

- [AI Chat Security Recommendations](../../planning/security/AI-Chat-Security-Recommendations.md)
- [ADR-003: Agent Architecture](./ADR-003-agent-architecture.md) - Agent permission model
- [NCSC Cloud Security Principles](../../.claude/rules/ncsc-compliance.md)

## References

- [NCSC: Prompt Injection is Not SQL Injection](https://www.ncsc.gov.uk/blog-post/prompt-injection-is-not-sql-injection)
- [OWASP LLM Top 10 2025](https://owasp.org/www-project-top-10-for-large-language-model-applications/)
- [UK Code of Practice for AI Cyber Security](https://www.gov.uk/government/publications/ai-cyber-security-code-of-practice)
- [NCSC Guidelines for Secure AI System Development](https://www.ncsc.gov.uk/collection/guidelines-secure-ai-system-development)
