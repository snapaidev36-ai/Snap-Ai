export function cleanString(value: string) {
  return value.trim().replace(/\s+/g, ' ');
}

export function getFirstMessage(messages?: string[]) {
  return messages?.find(Boolean);
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
