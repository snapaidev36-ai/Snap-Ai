import mime from 'mime-types';

export function cleanString(value: string) {
  return value.trim().replace(/\s+/g, ' ');
}

export function getFirstMessage(messages?: string[]) {
  return messages?.find(Boolean);
}

export function getInitials(
  firstName?: string,
  lastName?: string,
  fallback = 'AI',
) {
  const first = firstName?.trim().charAt(0) ?? '';
  const last = lastName?.trim().charAt(0) ?? '';
  const initials = `${first}${last}`.toUpperCase();

  return initials || fallback;
}

export function getFileExtensionFromContentType(contentType: string) {
  const normalizedContentType = contentType
    .split(';', 1)[0]
    .trim()
    .toLowerCase();
  const extension = mime.extension(normalizedContentType);

  if (typeof extension === 'string' && extension.length > 0) {
    return `.${extension}`;
  }

  return '.png';
}

export function getErrorMessage(error: unknown) {
  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message;
  }

  return 'Unable to sign in with Google. Please try again.';
}

export function formatDate(
  value: string,
  options: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  },
) {
  return new Intl.DateTimeFormat('en', options).format(new Date(value));
}
