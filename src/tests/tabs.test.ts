import { describe, it, expect } from 'vitest';
import { TABS } from '../data/tabs';

describe('TabNav TABS definition', () => {
  it('default first tab is Cost of Waiting', () => {
    expect(TABS[0].id).toBe('waiting');
    expect(TABS[0].label).toBe('Cost of Waiting');
  });

  it('has all five required tabs', () => {
    const ids = TABS.map((t) => t.id);
    expect(ids).toContain('waiting');
    expect(ids).toContain('everyday');
    expect(ids).toContain('build');
    expect(ids).toContain('year-by-year');
    expect(ids).toContain('assumptions');
  });

  it('has short tab labels (max 20 characters)', () => {
    for (const tab of TABS) {
      expect(tab.label.length).toBeLessThanOrEqual(20);
    }
  });
});
