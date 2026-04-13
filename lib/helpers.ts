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
