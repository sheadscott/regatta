import { defineCollection, z } from 'astro:content';

const portfolio = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    category: z.enum(['Recreational', 'Medical', 'Oil & Gas', 'Consumer', 'Automotive']),
    featured: z.boolean().default(false),
    date: z.coerce.date(),
    images: z.array(z.string()),
  }),
});

const team = defineCollection({
  type: 'data',
  schema: z.object({
    name: z.string(),
    role: z.string(),
    bio: z.string().optional(),
    email: z.string().optional(),
    photo: z.string(),
    order: z.number(),
  }),
});

export const collections = { portfolio, team };
