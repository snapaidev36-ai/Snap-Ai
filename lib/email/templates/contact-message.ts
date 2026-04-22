import { renderEmailLayout } from '@/lib/email/templates/layout';

type ContactMessageEmailInput = {
  siteUrl: string;
  name: string;
  email: string;
  subject: string;
  message: string;
};

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function formatBodyText(message: string) {
  return escapeHtml(message).replaceAll('\n', '<br />');
}

export function buildContactMessageEmail({
  siteUrl,
  name,
  email,
  subject,
  message,
}: ContactMessageEmailInput) {
  const previewText = `New contact message from ${name}`;

  return {
    subject: `Contact request: ${subject}`,
    text: [
      `Name: ${name}`,
      `Email: ${email}`,
      `Subject: ${subject}`,
      '',
      message,
    ].join('\n'),
    html: renderEmailLayout({
      siteUrl,
      previewText,
      title: `New contact request: ${subject}`,
      bodyHtml: `
        <p style="margin:0 0 12px;">Name: <strong>${escapeHtml(name)}</strong></p>
        <p style="margin:0 0 12px;">Email: <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>
        <p style="margin:0 0 16px;">Subject: <strong>${escapeHtml(subject)}</strong></p>
        <div style="padding:16px;border-radius:16px;background:#f8fafc;border:1px solid #e2e8f0;line-height:1.7;white-space:normal;">${formatBodyText(message)}</div>
      `,
      ctaLabel: 'Reply by email',
      ctaUrl: `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(`Re: ${subject}`)}`,
      footerText:
        'This message was sent from the Snap AI contact form. Reply directly to continue the conversation.',
    }),
  };
}
