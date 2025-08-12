const API_URL = process.env.REACT_APP_API_URL || "http://localhost:4000";

function isJson(res: Response) {
  const ct = res.headers.get("content-type") || "";
  return ct.includes("application/json");
}

async function request(path: string, options: RequestInit = {}) {
  const token = localStorage.getItem("token");

  const baseHeaders: Record<string, string> = {
    Accept: "application/json",
    ...(options.body ? { "Content-Type": "application/json" } : {}), // не ставимо для GET без body
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  const mergedHeaders: HeadersInit = {
    ...baseHeaders,
    ...(options.headers || {}),
  };

  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, { ...options, headers: mergedHeaders, credentials: "omit" });
  } catch (e: any) {
    throw new Error(e?.message || "Network error");
  }

  if (res.status === 204) return null;

  const text = await res.text();
  const data = text && isJson(res) ? JSON.parse(text) : text || null;

  if (!res.ok) {
    const message =
      (data && typeof data === "object" && ("message" in data || "error" in data) && ((data as any).message || (data as any).error)) ||
      (typeof data === "string" && data) ||
      `Error ${res.status}`;
    throw new Error(message);
  }

  return data;
}

export const api = {
  projects: {
    list: () => request("/projects"),
    add: (repoPath: string) =>
      request("/projects", { method: "POST", body: JSON.stringify({ repoPath }) }),
    refresh: (id: string) =>
      request(`/projects/${id}/refresh`, { method: "PATCH" }),
    remove: (id: string) =>
      request(`/projects/${id}`, { method: "DELETE" }),
  },
};

export { API_URL, request };
