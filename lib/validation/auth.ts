import { z } from 'zod';

const cleanString = (value: string) => value.trim().replace(/\s+/g, ' ');

const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(72, 'Password is too long');

export const updateProfileSchema = z.object({
  firstName: z
    .string()
    .transform(cleanString)
    .pipe(
      z
        .string()
        .min(1, 'First name is required')
        .max(60, 'First name is too long'),
    ),
  lastName: z
    .string()
    .transform(cleanString)
    .pipe(
      z
        .string()
        .min(1, 'Last name is required')
        .max(60, 'Last name is too long'),
    ),
});

export const registerSchema = z.object({
  firstName: z
    .string()
    .transform(cleanString)
    .pipe(
      z
        .string()
        .min(1, 'First name is required')
        .max(60, 'First name is too long'),
    ),
  lastName: z
    .string()
    .transform(cleanString)
    .pipe(
      z
        .string()
        .min(1, 'Last name is required')
        .max(60, 'Last name is too long'),
    ),
  email: z
    .string()
    .transform(value => value.trim().toLowerCase())
    .pipe(z.email('Invalid email address')),
  password: z.string().pipe(passwordSchema),
});

export const loginSchema = z.object({
  email: z
    .string()
    .transform(value => value.trim().toLowerCase())
    .pipe(z.email('Invalid email address')),
  password: z.string().pipe(passwordSchema),
});

export const passwordUpdateRequestSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  newPassword: passwordSchema,
});

export const passwordUpdateFormSchema = z
  .object({
    newPassword: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine(values => values.newPassword === values.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const firebaseGoogleLoginSchema = z.object({
  idToken: z.string().min(1, 'Firebase ID token is required'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type PasswordUpdateRequestInput = z.infer<
  typeof passwordUpdateRequestSchema
>;
export type PasswordUpdateFormInput = z.infer<typeof passwordUpdateFormSchema>;
export type FirebaseGoogleLoginInput = z.infer<
  typeof firebaseGoogleLoginSchema
>;
