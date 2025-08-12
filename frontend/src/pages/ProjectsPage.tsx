import { useEffect, useState } from "react";
import { api } from "../api/client";
import { logout } from "../api/auth";
import { useNavigate } from "react-router-dom";
import ProjectsCard, { Project } from "../components/ProjectsCard"; // ⬅️ нове
import "./styles/ProjectsPage.css";
import EmptyState from "../components/EmptyState";

export default function ProjectsPage() {
    const [items, setItems] = useState<Project[]>([]);
    const [repoPath, setRepoPath] = useState(""); // ⬅️ стартуємо з порожнього
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState<string | null>(null);
    const nav = useNavigate();

    async function load() {
        try {
            setLoading(true);
            setErr(null);
            const data = await api.projects.list();
            setItems(data);
        } catch (e: any) {
            const msg = String(e?.message || "");
            // якщо бек повертає 404 для порожнього списку — показуємо empty state
            if (msg.includes("404")) {
                setItems([]);
                setErr(null);
            } else {
                setErr(msg || "Load failed");
                if (msg.toLowerCase().includes("unauthorized")) {
                    logout();
                    nav("/login");
                }
            }
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        load();
    }, []);

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

            {items.length > 0 ? (
                <ProjectsCard
                    items={items}
                    onRefresh={async (id) => { await api.projects.refresh(id); await load(); }}
                    onDelete={async (id) => { await api.projects.remove(id); await load(); }}
                />
            ) : (
                <div className="card">
                    <EmptyState />
                </div>
            )}
        </div>
    );
}
