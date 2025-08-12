// Node 18+ має глобальний fetch; якщо в тебе старіше — встанови node-fetch.
type RepoDTO = {
  repoFullName: string;
  owner: string;
  name: string;
  url: string;
  stars: number;
  forks: number;
  openIssues: number;
  repoCreatedAtUnix: number;
};

export async function fetchRepo(repoPath: string): Promise<RepoDTO> {
  const [owner, repo] = (repoPath || '').split('/');
  if (!owner || !repo) throw new Error('Invalid repo path. Expected "owner/name".');

  const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
    headers: {
      'Accept': 'application/vnd.github+json',
      'User-Agent': 'github-crm-demo',
      ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GitHub ${res.status}: ${text}`);
  }
  const r: any = await res.json();

  return {
    repoFullName: `${owner}/${repo}`,
    owner: r?.owner?.login ?? owner,
    name: r?.name ?? repo,
    url: r?.html_url,
    stars: r?.stargazers_count ?? 0,
    forks: r?.forks_count ?? 0,
    openIssues: r?.open_issues_count ?? 0,
    repoCreatedAtUnix: Math.floor(new Date(r?.created_at).getTime() / 1000),
  };
}
