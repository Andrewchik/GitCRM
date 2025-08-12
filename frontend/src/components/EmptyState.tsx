export default function EmptyState() {
  return (
    <div className="empty-wrap" style={{padding:'28px 24px'}}>
      <div className="empty-dot" />
      <div className="empty-title">Nothing here yet</div>
      <div className="empty-sub">
        It’s empty for now — add a repository above (e.g. <code>facebook/react</code>) to see data.
      </div>
    </div>
  );
}
