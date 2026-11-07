export const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://127.0.0.1:8000/api/v1";

export async function fetchFromApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options?.headers || {}),
      },
    });

    if (!res.ok) {
      throw new Error(`API error ${res.status}: ${res.statusText}`);
    }

    return await res.json();
  } catch (err) {
    console.warn(`API call failed for ${endpoint}:`, err);
    throw err;
  }
}
