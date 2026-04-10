type ApiClientOptions = Omit<RequestInit, 'body'> & {
  body?: unknown;
  refreshOn401?: boolean;
  refreshEndpoint?: string;
  skipAuthRefresh?: boolean;
};

export class ApiClientError extends Error {
  status: number;
  details?: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = 'ApiClientError';
    this.status = status;
    this.details = details;
  }
}

function toPathname(url: string): string {
  try {
    return new URL(url, 'http://localhost').pathname;
  } catch {
    return url;
  }
}

function isRefreshRequest(input: string, refreshEndpoint: string): boolean {
  return toPathname(input) === toPathname(refreshEndpoint);
}

function getErrorMessage(payload: unknown): string {
  if (
    payload &&
    typeof payload === 'object' &&
    'error' in payload &&
    typeof (payload as { error?: unknown }).error === 'string'
  ) {
    return (payload as { error: string }).error;
  }

  return 'Request failed';
}

async function parseJsonSafely(response: Response): Promise<unknown> {
  return response.json().catch(() => null);
}

function toApiClientError(
  response: Response,
  payload: unknown,
): ApiClientError {
  return new ApiClientError(getErrorMessage(payload), response.status, payload);
}

export async function apiClient<T>(
  input: string,
  options: ApiClientOptions = {},
): Promise<T> {
  const {
    body,
    refreshOn401 = true,
    refreshEndpoint = '/api/auth/refresh',
    skipAuthRefresh = false,
    ...requestOptions
  } = options;

  const headers = new Headers(requestOptions.headers);

  if (!headers.has('content-type') && body !== undefined) {
    headers.set('content-type', 'application/json');
  }

  const serializedBody =
    body === undefined
      ? undefined
      : typeof body === 'string'
        ? body
        : JSON.stringify(body);

  const makeRequest = () =>
    fetch(input, {
      ...requestOptions,
      headers,
      body: serializedBody,
      credentials: 'include',
      cache: 'no-store',
    });

  let response = await makeRequest();
  let payload = await parseJsonSafely(response);

  if (
    response.status === 401 &&
    refreshOn401 &&
    !skipAuthRefresh &&
    !isRefreshRequest(input, refreshEndpoint)
  ) {
    try {
      const refreshResponse = await fetch(refreshEndpoint, {
        method: 'POST',
        credentials: 'include',
        cache: 'no-store',
      });

      if (refreshResponse.ok) {
        response = await makeRequest();
        payload = await parseJsonSafely(response);
      }
    } catch {
      throw toApiClientError(response, payload);
    }
  }

  if (!response.ok) {
    throw toApiClientError(response, payload);
  }

  return payload as T;
}
