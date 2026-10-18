import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError(""); setBusy(true);
    try {
      await login(form.email, form.password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.msg || "Login failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-wrap">
      <form className="auth-card" onSubmit={submit}>
        <h2>Welcome back 👋</h2>
        <p className="muted">Log in to continue to Easy Job</p>

        {error && <div className="alert error">{error}</div>}

        <label>Email</label>
        <input type="email" required value={form.email}
               onChange={(e) => setForm({ ...form, email: e.target.value })}
               placeholder="you@example.com" />

        <label>Password</label>
        <input type="password" required value={form.password}
               onChange={(e) => setForm({ ...form, password: e.target.value })}
               placeholder="••••••••" />

        <button className="btn btn-primary btn-block" disabled={busy}>
          {busy ? "Logging in…" : "Login"}
        </button>

        <p className="muted center small">
          No account? <Link to="/register" className="link">Sign up</Link>
        </p>
        <p className="muted center small demo">
          Demo: employer@easyjob.com / password123
        </p>
      </form>
    </div>
  );
}