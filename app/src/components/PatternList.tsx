import type { Pattern } from '@/lib/data';
import { PatternCard } from '@/components/cards/PatternCard';

interface PatternListProps {
  patterns: Pattern[];
}

export function PatternList({ patterns }: PatternListProps) {
  if (patterns.length === 0) {
    return (
      <div className="govuk-!-padding-6 govuk-!-text-align-centre">
        <p className="govuk-body">No patterns found matching your criteria.</p>
      </div>
    );
  }

  return (
    <div className="wayfinder-grid wayfinder-grid--2-col">
      {patterns.map((pattern) => (
        <PatternCard key={pattern.id} pattern={pattern} />
      ))}
    </div>
  );
}
