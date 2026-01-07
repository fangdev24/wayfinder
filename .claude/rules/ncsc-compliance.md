# NCSC Cloud Security Compliance Rules

These rules ensure adherence to NCSC 14 Cloud Security Principles.

## Data Protection

### Principle 1: Data in Transit Protection
- **MUST** use TLS 1.2 or higher for all network communication
- **MUST NOT** transmit sensitive data over unencrypted channels
- **MUST** validate certificates properly (no certificate bypassing)

### Principle 2: Asset Protection and Resilience
- **MUST** encrypt data at rest using approved algorithms (AES-256)
- **MUST** use KMS or equivalent for key management
- **MUST NOT** store encryption keys alongside encrypted data

## Access Control

### Principle 6: Personnel Security
- **MUST** implement least privilege access
- **MUST** use role-based access control (RBAC)
- **MUST NOT** share credentials or API keys

### Principle 9: Secure User Management
- **MUST** enforce strong password policies (if password-based)
- **SHOULD** implement MFA for all user accounts
- **MUST** have secure password reset flows

### Principle 10: Identity and Authentication
- **MUST** use secure session management
- **MUST** implement proper session timeout
- **MUST NOT** expose session tokens in URLs

## Secure Development

### Principle 7: Secure Development
- **MUST** validate all input data
- **MUST** encode output to prevent XSS
- **MUST** use parameterized queries to prevent SQL injection
- **MUST NOT** use deprecated or vulnerable dependencies
- **MUST** run security scanning on dependencies (npm audit, etc.)

### Principle 8: Supply Chain Security
- **MUST** pin dependency versions
- **MUST** review dependencies for security issues
- **SHOULD** use lockfiles (package-lock.json, pubspec.lock)
- **MUST NOT** install dependencies from untrusted sources

## Infrastructure

### Principle 11: External Interface Protection
- **MUST** validate and sanitize all API inputs
- **MUST** implement rate limiting
- **SHOULD** use WAF for public endpoints
- **MUST NOT** expose internal services publicly

### Principle 13: Audit Information
- **MUST** log security-relevant events
- **MUST NOT** log sensitive data (passwords, tokens, PII)
- **MUST** use structured logging format
- **MUST** retain logs for compliance period

## Code Review Checklist

Before approving code:

- [ ] No hardcoded secrets or credentials
- [ ] All inputs validated and sanitized
- [ ] Proper error handling (no stack traces to users)
- [ ] Security headers configured (CSP, HSTS, etc.)
- [ ] Dependencies up to date and scanned
- [ ] Logging follows standards (no PII)
- [ ] Authentication/authorization properly implemented
- [ ] Encryption configured correctly

## References

- [NCSC Cloud Security Principles](https://www.ncsc.gov.uk/collection/cloud-security)
- [NCSC Secure Development](https://www.ncsc.gov.uk/collection/developers-collection)
