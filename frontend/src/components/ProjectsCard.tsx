import React from "react";

export type Project = {
    id: string;              // <= лише string
    repoFullName: string;
    owner: string;
    name: string;
    url: string;
    stars: number;
    forks: number;
    openIssues: number;
    repoCreatedAtUnix: number;
};

type Props = {
    items: Project[];
    onRefresh: (id: string) => void | Promise<void>;
    onDelete: (id: string) => void | Promise<void>;
};

const k = (n: number) => (n >= 1_000_000 ? (n / 1_000_000).toFixed(n % 1_000_000 ? 1 : 0) + "m"
    : n >= 1_000 ? (n / 1_000).toFixed(n % 1_000 ? 1 : 0) + "k" : String(n));

export default function ProjectsCard({ items, onRefresh, onDelete }: Props) {
    if (!items.length) return null;

    return (
        <div className="card-item list-card">
            <ul className="repo-list">
                {items.map(p => (
                    <li key={p.id} className="repo-row">
                        {/* ЛІВА ЧАСТИНА */}
                        <div className="repo-main">
                            <a className="repo-title" href={p.url} target="_blank" rel="noreferrer">
                                <span className="repo-name">{p.owner}</span>
                                <span className="slash">/</span>
                                <span className="repo-name repo-strong">{p.name}</span>
                            </a>
                            <div className="repo-url" title={p.url}>{p.url}</div>
                            <div
                                className="repo-created"
                                title={`UNIX: ${p.repoCreatedAtUnix} / UTC: ${new Date(p.repoCreatedAtUnix * 1000).toUTCString()}`}
                            >
                                created:{" "}
                                <span className="mono">
                                    {new Date(p.repoCreatedAtUnix * 1000).toLocaleString("en-GB", {
                                        year: "numeric",
                                        month: "short",
                                        day: "2-digit",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        second: "2-digit",
                                        timeZone: "UTC"
                                    })}
                                </span>
                            </div>
                        </div>

                        {/* ПРАВА ЧАСТИНА */}
                        <div className="repo-side">
                            <div className="stats">
                                <span className="chip" title={`${p.stars} stars`}>⭐ {k(p.stars)}</span>
                                <span className="chip" title={`${p.forks} forks`}>🍴 {k(p.forks)}</span>
                                <span className="chip warn" title={`${p.openIssues} open issues`}>🐞 {k(p.openIssues)}</span>
                            </div>
                            <div className="row-actions">
                                <button className="act act-refresh" onClick={() => onRefresh(p.id)}>Refresh</button>
                                <button className="act act-del" onClick={() => onDelete(p.id)}>Delete</button>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
