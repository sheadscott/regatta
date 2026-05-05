import type { CollectionEntry } from 'astro:content';

export function sortPortfolio(
  items: CollectionEntry<'portfolio'>[]
): CollectionEntry<'portfolio'>[] {
  return [...items].sort((a, b) => {
    if (a.data.featured && !b.data.featured) return -1;
    if (!a.data.featured && b.data.featured) return 1;
    return b.data.date.getTime() - a.data.date.getTime();
  });
}
