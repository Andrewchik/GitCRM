import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doLogin, doRegister } from '../api/auth';
import './styles/LoginPage.css';

export default function LoginPage() {
  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('password');
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  async function run(fn: () => Promise<void>) {
    try {
      setErr(null);
      setLoading(true);
      await fn();
      nav('/projects');
    } catch (e: any) {
      setErr(e?.message || 'Failed to fetch');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="center">
      <div className="card">
        <h1 className="h1">GitHub CRM</h1>
        <p className="sub">Sign in or create an account</p>

        {err && <div className="alert">{err}</div>}

        <label className="label">Email</label>
        <input
          className="input"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        <label className="label" style={{ marginTop: 14 }}>Password</label>
        <input
          className="input"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        <div className="row" style={{ marginTop: 14 }}>
          <button className="btn btn-primary" disabled={loading} onClick={() => run(() => doLogin(email, password))}>
            {loading ? 'Signing in…' : 'Login'}
          </button>
          <button className="btn btn-muted" disabled={loading} onClick={() => run(() => doRegister(email, password))}>
            Register
          </button>
        </div>
      </div>
    </div>
  );
}
