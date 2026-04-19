type EmailLayoutInput = {
  siteUrl: string;
  previewText: string;
  title: string;
  bodyHtml: string;
  ctaLabel?: string;
  ctaUrl?: string;
  footerText: string;
};

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export function renderEmailLayout({
  siteUrl,
  previewText,
  title,
  bodyHtml,
  ctaLabel,
  ctaUrl,
  footerText,
}: EmailLayoutInput) {
  const logoUrl = new URL('/logo.png', siteUrl).toString();

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charSet="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(title)}</title>
  </head>
  <body style="margin:0;background:#f6f7fb;padding:0;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${escapeHtml(previewText)}</div>
    <table role="presentation" width="100%" cellPadding="0" cellSpacing="0" style="border-collapse:collapse;background:#f6f7fb;width:100%;">
      <tr>
        <td align="center" style="padding:40px 16px;">
          <table role="presentation" width="100%" cellPadding="0" cellSpacing="0" style="border-collapse:collapse;max-width:620px;background:#ffffff;border:1px solid #e5e7eb;border-radius:24px;overflow:hidden;box-shadow:0 18px 60px rgba(15,23,42,0.08);">
            <tr>
              <td style="padding:28px 32px 18px;border-bottom:1px solid #eef2f7;">
                <table role="presentation" cellPadding="0" cellSpacing="0" style="border-collapse:collapse;">
                  <tr>
                    <td style="vertical-align:middle;padding-right:10px;">
                      <img src="${logoUrl}" width="32" height="32" alt="Snap AI" style="display:block;border-radius:8px;" />
                    </td>
                    <td style="font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.2;font-weight:700;color:#0f172a;vertical-align:middle;">
                      Snap AI
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:32px 32px 12px;font-family:Arial,Helvetica,sans-serif;color:#0f172a;">
                <h1 style="margin:0 0 12px;font-size:24px;line-height:1.25;font-weight:700;">${escapeHtml(title)}</h1>
                <div style="font-size:15px;line-height:1.7;color:#334155;">
                  ${bodyHtml}
                </div>
                ${
                  ctaLabel && ctaUrl
                    ? `
                  <table role="presentation" cellPadding="0" cellSpacing="0" style="border-collapse:collapse;margin-top:24px;">
                    <tr>
                      <td style="border-radius:9999px;background:#0f172a;">
                        <a href="${ctaUrl}" style="display:inline-block;padding:12px 20px;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:700;line-height:1;color:#ffffff;text-decoration:none;">
                          ${escapeHtml(ctaLabel)}
                        </a>
                      </td>
                    </tr>
                  </table>
                `
                    : ''
                }
              </td>
            </tr>
            <tr>
              <td style="padding:0 32px 28px;font-family:Arial,Helvetica,sans-serif;color:#64748b;font-size:12px;line-height:1.6;">
                ${footerText}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}
