import { describe, it, expect } from 'vitest';
import { sortPortfolio } from './portfolio';

const makeItem = (overrides: Partial<{ featured: boolean; date: Date }>) =>
  ({ data: { featured: false, date: new Date('2024-01-01'), ...overrides } }) as any;

describe('sortPortfolio', () => {
  it('places featured items before non-featured', () => {
    const items = [makeItem({}), makeItem({ featured: true })];
    const result = sortPortfolio(items);
    expect(result[0].data.featured).toBe(true);
  });

  it('sorts non-featured items newest first', () => {
    const items = [
      makeItem({ date: new Date('2023-01-01') }),
      makeItem({ date: new Date('2024-06-01') }),
    ];
    const result = sortPortfolio(items);
    expect(result[0].data.date.getUTCFullYear()).toBe(2024);
  });

  it('sorts featured items newest first among themselves', () => {
    const items = [
      makeItem({ featured: true, date: new Date('2022-01-01') }),
      makeItem({ featured: true, date: new Date('2024-01-01') }),
    ];
    const result = sortPortfolio(items);
    expect(result[0].data.date.getUTCFullYear()).toBe(2024);
  });

  it('does not mutate the input array', () => {
    const items = [makeItem({}), makeItem({ featured: true })];
    const first = items[0];
    sortPortfolio(items);
    expect(items[0]).toBe(first);
  });
});
