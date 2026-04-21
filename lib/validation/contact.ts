import { z } from 'zod';

const cleanString = (value: string) => value.trim().replace(/\s+/g, ' ');

export const contactSchema = z.object({
  name: z
    .string()
    .transform(cleanString)
    .pipe(z.string().min(1, 'Name is required').max(80, 'Name is too long')),
  email: z
    .string()
    .transform(value => value.trim().toLowerCase())
    .pipe(z.email('Invalid email address')),
  subject: z
    .string()
    .transform(cleanString)
    .pipe(
      z.string().min(1, 'Subject is required').max(120, 'Subject is too long'),
    ),
  message: z
    .string()
    .transform(value => value.trim())
    .pipe(
      z
        .string()
        .min(20, 'Message must be at least 20 characters')
        .max(4000, 'Message is too long'),
    ),
});

export type ContactInput = z.infer<typeof contactSchema>;
