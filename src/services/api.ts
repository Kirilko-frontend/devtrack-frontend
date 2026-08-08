const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

type RequestOptions = RequestInit & {
  params?: Record<string, string | number>;
};

export async function api<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { params, ...fetchOptions } = options;

  const url = new URL(`${API_URL}${endpoint}`);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, String(value));
    });
  }

  const response = await fetch(url, {
    ...fetchOptions,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...fetchOptions.headers,
    },
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

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}
