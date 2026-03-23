// Typed fetch wrapper — use in TanStack Query queryFn
export async function customFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json", ...options?.headers },
    ...options,
  });
  if (!res.ok) throw new Error(`Fetch error: ${res.status} ${res.statusText}`);
  return res.json() as Promise<T>;
}
