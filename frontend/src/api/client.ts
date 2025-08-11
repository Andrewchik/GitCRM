const API_URL = process.env.REACT_APP_API_URL || "http://localhost:4000";

async function request(path: string, options: RequestInit = {}) {
  const token = localStorage.getItem("token");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });
  if (!res.ok) {
    let message = `Error ${res.status}`;
    try {
      const data = await res.json();
      message = data?.message || message;
    } catch {}
    throw new Error(message);
  }
  return res.status === 204 ? null : res.json();
}

export const api = {
  projects: {
    list: () => request("/projects"),
    add: (repoPath: string) =>
      request("/projects", { method: "POST", body: JSON.stringify({ repoPath }) }),
    refresh: (id: number) => request(`/projects/${id}/refresh`, { method: "PUT" }),
    remove: (id: number) => request(`/projects/${id}`, { method: "DELETE" }),
  },
};

export { API_URL, request };
