import { useEffect, useState } from "react";
import { api } from "../api/client";
import { logout } from "../api/auth";
import { useNavigate } from "react-router-dom";

type Project = {
  id: number;
  repoFullName: string;
  owner: string;
  name: string;
  url: string;
  stars: number;
  forks: number;
  openIssues: number;
  repoCreatedAtUnix: number;
};

export default function ProjectsPage() {
  const [items, setItems] = useState<Project[]>([]);
  const [repoPath, setRepoPath] = useState("facebook/react");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const nav = useNavigate();

  async function load() {
    try {
      setLoading(true); setErr(null);
      const data = await api.projects.list();
      setItems(data);
    } catch (e: any) {
      setErr(e?.message || "Load failed");
      if (String(e?.message).toLowerCase().includes("unauthorized")) {
        logout(); nav("/login");
      }
    } finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);

  async function add() {
    if (!repoPath.trim()) return;
    try { await api.projects.add(repoPath.trim()); setRepoPath(""); await load(); }
    catch (e: any) { setErr(e?.message || "Add failed"); }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Projects</h2>
          <button
            onClick={() => { logout(); nav("/login"); }}
            className="rounded-lg bg-slate-200 px-3 py-1.5 text-sm hover:bg-slate-300"
          >
            Logout
          </button>
        </div>

        {err && <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded p-3">{err}</div>}

        <div className="flex gap-3 mb-4">
          <input
            className="flex-1 rounded-xl border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="owner/name (e.g. facebook/react)"
            value={repoPath}
            onChange={(e) => setRepoPath(e.target.value)}
          />
          <button onClick={add} className="rounded-xl bg-indigo-600 text-white px-4 py-2 hover:bg-indigo-700">
            Add
          </button>
          <button
            onClick={load}
            className="rounded-xl bg-slate-200 px-4 py-2 hover:bg-slate-300"
            disabled={loading}
          >
            {loading ? "Loading…" : "Reload"}
          </button>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="text-left p-3">Owner</th>
                <th className="text-left p-3">Name</th>
                <th className="text-left p-3">URL</th>
                <th className="p-3">⭐</th>
                <th className="p-3">🍴</th>
                <th className="p-3">🐞</th>
                <th className="p-3">Created (UTC Unix)</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((p) => (
                <tr key={p.id} className="border-t border-slate-100">
                  <td className="p-3">{p.owner}</td>
                  <td className="p-3">{p.name}</td>
                  <td className="p-3">
                    <a className="text-indigo-600 hover:underline" href={p.url} target="_blank" rel="noreferrer">
                      {p.url}
                    </a>
                  </td>
                  <td className="p-3 text-center">{p.stars}</td>
                  <td className="p-3 text-center">{p.forks}</td>
                  <td className="p-3 text-center">{p.openIssues}</td>
                  <td className="p-3 text-center">{p.repoCreatedAtUnix}</td>
                  <td className="p-3">
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={async () => { await api.projects.refresh(p.id); await load(); }}
                        className="rounded-lg bg-emerald-100 text-emerald-800 px-3 py-1.5 hover:bg-emerald-200"
                      >
                        Refresh
                      </button>
                      <button
                        onClick={async () => { await api.projects.remove(p.id); await load(); }}
                        className="rounded-lg bg-rose-100 text-rose-800 px-3 py-1.5 hover:bg-rose-200"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-6 text-center text-slate-500">
                    No projects yet. Add one above (e.g. <code>facebook/react</code>).
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
