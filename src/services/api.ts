const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

type RequestOptions = Omit<RequestInit, 'body'> & {
  params?: Record<string, string | number>;
  body?: unknown;
};

async function request(endpoint: string, options: RequestOptions = {}) {
  const { params, body, ...fetchOptions } = options;

  const url = new URL(`${API_URL}${endpoint}`);

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

  const response = await fetch(url, {
    ...fetchOptions,
    credentials: 'include',
    headers,
    body: body === undefined ? undefined : isFormData ? body : JSON.stringify(body),
  });

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