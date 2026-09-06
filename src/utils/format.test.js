import { describe, it, expect } from 'vitest';
import { formatCurrency, formatCompact, formatPercent } from './format';

describe('formatCurrency', () => {
  it('formats a whole-dollar USD value', () => {
    expect(formatCurrency(23000, 'usd')).toBe('$23,000.00');
  });

  it('shows more precision for sub-$1 coins', () => {
    expect(formatCurrency(0.000123, 'usd')).toMatch(/^\$0\.000123/);
  });

  it('returns an em dash for missing values', () => {
    expect(formatCurrency(null)).toBe('—');
    expect(formatCurrency(undefined)).toBe('—');
    expect(formatCurrency(NaN)).toBe('—');
  });
});

describe('formatCompact', () => {
  it('compacts large market caps', () => {
    expect(formatCompact(197484)).toBe('197.48K');
    expect(formatCompact(1250000)).toBe('1.25M');
  });
});

describe('formatPercent', () => {
  it('prefixes positive changes with a plus sign', () => {
    expect(formatPercent(2.123)).toBe('+2.12%');
  });

  it('leaves negative changes with their own minus sign', () => {
    expect(formatPercent(-2.123)).toBe('-2.12%');
  });
});
