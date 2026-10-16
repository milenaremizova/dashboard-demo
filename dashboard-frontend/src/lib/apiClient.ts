const API_KEY = import.meta.env.VITE_API_KEY;

// обёртка над fetch, которая на каждый запрос добавляет секретный ключ.
// используется всеми api.ts метрик вместо обычного fetch
export async function authFetch(url: string, options: RequestInit = {}): Promise<Response> {
  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${API_KEY}`,
    },
  });
}