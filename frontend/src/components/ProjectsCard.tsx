import React from "react";

export type Project = {
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

type Props = {
  items: Project[];
  onRefresh: (id: number) => void | Promise<void>;
  onDelete: (id: number) => void | Promise<void>;
};

export default function ProjectsCard({ items, onRefresh, onDelete }: Props) {
  return (
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

        {items.length > 0 ? (
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
                    <button className="act act-refresh" onClick={() => onRefresh(p.id)}>
                      Refresh
                    </button>
                    <button className="act act-del" onClick={() => onDelete(p.id)}>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        ) : (
          <tbody>
            <tr>
              <td colSpan={8}>
                <div className="empty-wrap">
                  <div className="empty-dot" />
                  <div className="empty-title">Nothing here yet</div>
                  <div className="empty-sub">
                    It’s empty for now — add a repository above (e.g. <code>facebook/react</code>) to see data.
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        )}
      </table>
    </div>
  );
}
