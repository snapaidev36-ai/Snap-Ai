import { z } from 'zod';

import { ASPECT_RATIO_VALUES, STYLE_VALUES } from '@/lib/generation/options';

const cleanString = (value: string) => value.trim().replace(/\s+/g, ' ');

export const generateImageSchema = z.object({
  prompt: z
    .string()
    .transform(cleanString)
    .pipe(
      z.string().min(1, 'Prompt is required').max(2000, 'Prompt is too long'),
    ),
  aspectRatio: z.enum(ASPECT_RATIO_VALUES),
  style: z.enum(STYLE_VALUES),
});

export type GenerateImageInput = z.infer<typeof generateImageSchema>;
