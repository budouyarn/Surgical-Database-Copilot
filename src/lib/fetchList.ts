export async function fetchList<T>(url: string, init?: RequestInit): Promise<T[]> {
  const res = await fetch(url, init);
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}
