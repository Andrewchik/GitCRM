import { useEffect, useState } from "react";
import { api } from "../api/client";
import { logout } from "../api/auth";
import { useNavigate } from "react-router-dom";
import "./styles/ProjectsPage.css";

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
    try {
      await api.projects.add(repoPath.trim());
      setRepoPath("");
      await load();
    } catch (e: any) {
      setErr(e?.message || "Add failed");
    }
  }

  return (
    <div className="wrap">
      <div className="header">
        <h2 className="h2">Projects</h2>
        <div className="toolbar">
          <button className="btn btn-logout" onClick={() => { logout(); nav("/login"); }}>
            Logout
          </button>
        </div>
      </div>

      {err && <div className="alert">{err}</div>}

      <div className="row">
        <input
          className="input"
          placeholder="owner/name (e.g. facebook/react)"
          value={repoPath}
          onChange={(e) => setRepoPath(e.target.value)}
        />
        <button className="btn btn-add" onClick={add}>Add</button>
        <button className="btn btn-reload" onClick={load} disabled={loading}>
          {loading ? "Loading…" : "Reload"}
        </button>
      </div>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Owner</th>
              <th>Name</th>
              <th>URL</th>
              <th className="center">⭐</th>
              <th className="center">🍴</th>
              <th className="center">🐞</th>
              <th className="center">Created (UTC Unix)</th>
              <th className="center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((p) => (
              <tr key={p.id}>
                <td>{p.owner}</td>
                <td>{p.name}</td>
                <td>
                  <a href={p.url} target="_blank" rel="noreferrer" className="badge">
                    {p.url}
                  </a>
                </td>
                <td className="center">{p.stars}</td>
                <td className="center">{p.forks}</td>
                <td className="center">{p.openIssues}</td>
                <td className="center">{p.repoCreatedAtUnix}</td>
                <td className="center">
                  <div className="actions">
                    <button className="act act-refresh"
                      onClick={async () => { await api.projects.refresh(p.id); await load(); }}>
                      Refresh
                    </button>
                    <button className="act act-del"
                      onClick={async () => { await api.projects.remove(p.id); await load(); }}>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={8} className="empty">
                  No projects yet. Add one above (e.g. <code>facebook/react</code>).
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
