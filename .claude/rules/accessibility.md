# Accessibility Rules (WCAG 2.1 AA)

All public-facing government services must meet WCAG 2.1 AA.

## Perceivable

### Text Alternatives (1.1)
- **MUST** provide alt text for all images
- **MUST** use empty alt="" for decorative images
- **MUST** provide text alternatives for icons

### Time-Based Media (1.2)
- **MUST** provide captions for video content
- **MUST** provide transcripts for audio content
- **SHOULD** provide audio descriptions for video

### Adaptable (1.3)
- **MUST** use semantic HTML elements
- **MUST** use proper heading hierarchy (h1 → h2 → h3)
- **MUST** associate labels with form inputs
- **MUST NOT** rely solely on visual formatting to convey meaning

### Distinguishable (1.4)
- **MUST** meet color contrast ratios:
  - Regular text: 4.5:1 minimum
  - Large text (18pt+): 3:1 minimum
  - UI components: 3:1 minimum
- **MUST NOT** use color as the only indicator
- **MUST** allow text resize up to 200% without loss
- **MUST** allow text spacing adjustment

## Operable

### Keyboard Accessible (2.1)
- **MUST** support keyboard-only navigation
- **MUST NOT** create keyboard traps
- **MUST** have visible focus indicators
- **SHOULD** support standard keyboard shortcuts

### Enough Time (2.2)
- **MUST** allow users to extend time limits
- **MUST** warn before session timeout
- **SHOULD** allow pausing auto-updating content

### Seizures and Physical Reactions (2.3)
- **MUST NOT** use content that flashes more than 3 times/second
- **SHOULD** provide warnings for motion effects

### Navigable (2.4)
- **MUST** provide skip navigation links
- **MUST** have descriptive page titles
- **MUST** have logical focus order
- **MUST** use descriptive link text (not "click here")
- **MUST** provide multiple navigation methods

### Input Modalities (2.5)
- **MUST** support pointer gestures with single-pointer alternatives
- **SHOULD** support motion-activated features with alternatives

## Understandable

### Readable (3.1)
- **MUST** declare page language (`<html lang="en">`)
- **SHOULD** declare language changes in content
- **SHOULD** explain unusual words/abbreviations

### Predictable (3.2)
- **MUST NOT** change context on focus
- **MUST NOT** change context on input without warning
- **MUST** use consistent navigation
- **MUST** use consistent identification

### Input Assistance (3.3)
- **MUST** identify input errors clearly
- **MUST** provide labels and instructions
- **MUST** provide error suggestions when possible
- **MUST** allow error review before submission

## Robust

### Compatible (4.1)
- **MUST** use valid HTML
- **MUST** use proper name, role, value for components
- **MUST** communicate status messages programmatically

## Implementation Checklist

### Forms
- [ ] All inputs have visible labels
- [ ] Required fields clearly marked
- [ ] Error messages specific and helpful
- [ ] Form validates accessibly
- [ ] Tab order logical

### Navigation
- [ ] Skip link provided
- [ ] Landmark regions used (nav, main, footer)
- [ ] Focus visible on all interactive elements
- [ ] No keyboard traps

### Content
- [ ] Headings in logical order
- [ ] Images have alt text
- [ ] Color contrast meets requirements
- [ ] Content reflows at 320px width

### Interactive Elements
- [ ] Buttons and links distinguishable
- [ ] Custom widgets keyboard accessible
- [ ] ARIA used correctly (if needed)
- [ ] Status changes announced

## Testing

### Automated Testing
- Run axe-core or similar
- Run WAVE browser extension
- Validate HTML

### Manual Testing
- Test with keyboard only
- Test with screen reader (VoiceOver, NVDA)
- Test at 200% zoom
- Test in high contrast mode

## References

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [GOV.UK Accessibility Requirements](https://www.gov.uk/guidance/accessibility-requirements-for-public-sector-websites-and-apps)
- [Public Sector Bodies Regulations](https://www.legislation.gov.uk/uksi/2018/952/contents/made)
