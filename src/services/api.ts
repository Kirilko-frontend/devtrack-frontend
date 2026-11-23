const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

type RequestOptions = Omit<RequestInit, 'body'> & {
  params?: Record<string, string | number>;
  body?: unknown;
};

export const AUTH_EXPIRED_EVENT = 'auth:expired';

const SKIP_REFRESH_ENDPOINTS = ['/auth/login', '/auth/register', '/auth/refresh', '/auth/logout'];

let refreshPromise: Promise<boolean> | null = null;

/**
 * Refreshes the session once, even if several requests get 401 at the same time:
 * all of them wait for the same refresh request.
 */
function refreshSession() {
  refreshPromise ??= fetch(new URL(`${API_URL}/auth/refresh`, window.location.origin), {
    method: 'POST',
    credentials: 'include',
  })
    .then((response) => response.ok)
    .catch(() => false)
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
}

async function request(endpoint: string, options: RequestOptions = {}) {
  const { params, body, ...fetchOptions } = options;

  const url = new URL(`${API_URL}${endpoint}`, window.location.origin);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, String(value));
    });
  }

  const headers = new Headers(fetchOptions.headers);
  const isFormData = body instanceof FormData;

  if (isFormData) {
    headers.delete('Content-Type');
  } else if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const send = () =>
    fetch(url, {
      ...fetchOptions,
      credentials: 'include',
      headers,
      body: body === undefined ? undefined : isFormData ? body : JSON.stringify(body),
    });

  let response = await send();

  if (response.status === 401 && !SKIP_REFRESH_ENDPOINTS.includes(endpoint)) {
    const isRefreshed = await refreshSession();

    if (isRefreshed) {
      response = await send();
    } else {
      window.dispatchEvent(new Event(AUTH_EXPIRED_EVENT));
    }
  }

  if (!response.ok) {
    let error: unknown;

    try {
      error = await response.json();
    } catch {
      error = null;
    }

    throw {
      status: response.status,
      data: error,
    };
  }

  return response;
}

export async function api<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const response = await request(endpoint, options);

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export async function apiFile(endpoint: string): Promise<{ blob: Blob; filename: string | null }> {
  const response = await request(endpoint);
  const contentDisposition = response.headers.get('Content-Disposition');
  const encodedFilename = contentDisposition?.match(/filename\*=UTF-8''([^;]+)/i)?.[1];
  const quotedFilename = contentDisposition?.match(/filename="([^"]+)"/i)?.[1];
  const plainFilename = contentDisposition?.match(/filename=([^;]+)/i)?.[1]?.trim();
  let filename = encodedFilename ?? quotedFilename ?? plainFilename ?? null;

  if (encodedFilename) {
    try {
      filename = decodeURIComponent(encodedFilename);
    } catch {
      filename = encodedFilename;
    }
  }

  return {
    blob: await response.blob(),
    filename,
  };
}
