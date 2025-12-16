import { API_BASE_URL } from '../constants/app';

// Generic API request function
export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  });

  const text = await res.text();
  const data = text ? safeJson(text) : null;

  // Handle HTTP errors
  if (!res.ok) {
    const msg =
      (data && typeof data === 'object' && 'message' in data && String((data as any).message)) ||
      (typeof data === 'string' ? data : '') ||
      `Request failed (${res.status})`;
    throw new Error(msg);
  }

  return data as T;
}

// Safely parse JSON, returning the original text on failure
function safeJson(text: string) {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}
