'use server';

import { env } from '@/lib/env';
import { getSiteUrl } from '@/lib/server/site-url';
import { sendContactMessageEmail } from '@/lib/services/email';
import { contactSchema, type ContactInput } from '@/lib/validation/contact';

export type ContactActionState = {
  status: 'idle' | 'success' | 'error';
  message: string;
  fields?: Partial<Record<keyof ContactInput, string[]>>;
};

const initialErrorMessage = 'Please fix the highlighted fields and try again.';

function getFieldErrorPayload(
  fields: Partial<Record<keyof ContactInput, string[]>>,
) {
  return Object.fromEntries(
    Object.entries(fields).filter(([, values]) => values && values.length > 0),
  ) as Partial<Record<keyof ContactInput, string[]>>;
}

export async function sendContactMessageAction(
  _previousState: ContactActionState,
  formData: FormData,
): Promise<ContactActionState> {
  const parsed = contactSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    subject: formData.get('subject'),
    message: formData.get('message'),
  });

  if (!parsed.success) {
    return {
      status: 'error',
      message: initialErrorMessage,
      fields: getFieldErrorPayload(parsed.error.flatten().fieldErrors),
    };
  }

  if (!env.ADMIN_EMAIL) {
    return {
      status: 'error',
      message:
        'Contact email is not configured yet. Add ADMIN_EMAIL to your .env file.',
    };
  }

  try {
    const siteUrl = await getSiteUrl();

    await sendContactMessageEmail({
      siteUrl,
      to: env.ADMIN_EMAIL,
      name: parsed.data.name,
      email: parsed.data.email,
      subject: parsed.data.subject,
      message: parsed.data.message,
    });

    return {
      status: 'success',
      message:
        'Thanks. Your message has been sent and the team will get back to you shortly.',
    };
  } catch {
    return {
      status: 'error',
      message:
        'We could not send your message right now. Please try again in a moment.',
    };
  }
}
