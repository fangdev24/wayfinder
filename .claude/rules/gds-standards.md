# GDS Service Standards Rules

These rules ensure compliance with Government Digital Service standards.

## Technology Code of Practice

### 1. Define User Needs
- **MUST** document user needs before building
- **MUST** base decisions on user research evidence
- **MUST NOT** build features without clear user need

### 2. Make Things Accessible
- **MUST** meet WCAG 2.1 AA standards
- **MUST** test with assistive technologies
- **MUST** support keyboard-only navigation
- See `accessibility.md` for detailed rules

### 3. Be Open and Use Open Source
- **SHOULD** use open source components where possible
- **MUST** publish code openly (where appropriate)
- **MUST** document licensing clearly

### 4. Use Open Standards
- **MUST** use open data formats (JSON, not proprietary)
- **MUST** use open authentication standards (OAuth, OIDC)
- **SHOULD** follow REST API conventions

### 5. Use Cloud First
- **MUST** consider cloud hosting first
- **MUST** use approved cloud services
- **MUST** follow NCSC cloud security principles

### 6. Make Things Secure
- **MUST** follow NCSC guidance
- **MUST** implement defense in depth
- **MUST** have security review before production
- See `ncsc-compliance.md` for detailed rules

### 7. Make Privacy Integral
- **MUST** conduct Privacy Impact Assessment
- **MUST** minimize data collection
- **MUST** have clear retention policies
- **MUST** implement data subject rights

## Service Design

### Naming and Language
- **MUST** use plain English (avoid jargon)
- **MUST** follow GOV.UK style guide
- **SHOULD** use active voice
- **MUST NOT** use Latin abbreviations (e.g., etc., i.e.)

### URLs
- **MUST** use lowercase URLs
- **MUST** use hyphens (not underscores)
- **SHOULD** keep URLs short and descriptive
- **MUST NOT** include file extensions

### Error Messages
- **MUST** be clear about what went wrong
- **MUST** explain how to fix the problem
- **MUST NOT** use technical jargon
- **MUST NOT** blame the user

## API Design

### RESTful Conventions
```
GET    /api/v1/resources           # List
POST   /api/v1/resources           # Create
GET    /api/v1/resources/{id}      # Read
PUT    /api/v1/resources/{id}      # Update
DELETE /api/v1/resources/{id}      # Delete
```

### Response Format
- **MUST** return JSON
- **MUST** use consistent error format
- **MUST** include appropriate HTTP status codes
- **SHOULD** support pagination for lists

### Versioning
- **MUST** version APIs (in URL or header)
- **MUST** document breaking changes
- **SHOULD** maintain backwards compatibility

## Documentation

- **MUST** document all APIs
- **MUST** keep documentation up to date
- **MUST** include examples
- **SHOULD** use OpenAPI/Swagger

## Code Review Checklist

- [ ] Follows GDS service standards
- [ ] Plain English used
- [ ] Accessible to all users
- [ ] Privacy considered
- [ ] Security reviewed
- [ ] API follows conventions
- [ ] Documentation updated

## References

- [GDS Service Manual](https://www.gov.uk/service-manual)
- [Technology Code of Practice](https://www.gov.uk/guidance/the-technology-code-of-practice)
- [GOV.UK Style Guide](https://www.gov.uk/guidance/style-guide)
- [GOV.UK Design System](https://design-system.service.gov.uk/)
