import { z } from 'zod';

export const songSchema = z.object({
  title: z.string().trim().min(1, { message: 'Title is required' }),
  artist: z.string().trim().optional(),
  youtube_link: z.string().trim().url({ message: 'Invalid YouTube link format' }).optional().or(z.literal('')),
  audio_link: z.string().trim().url({ message: 'Invalid audio link format' }).optional().or(z.literal('')),
  lyrics: z.string().trim().optional(),
  composer: z.string().trim().optional(),
  language: z.string().trim().optional(),
  region: z.string().trim().optional(),
  category: z.string().trim().optional(),
  tags: z.string().trim().optional(),
  duration: z.number().int().positive({ message: 'Duration must be a positive number' }).optional(),
  is_featured: z.boolean().optional(),
  status: z.string().trim().optional(),
});