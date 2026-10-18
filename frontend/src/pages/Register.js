import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "", email: "", password: "", role: "jobseeker", company: "",
  });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError(""); setBusy(true);
    try {
      await register(form);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.msg || "Registration failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-wrap">
      <form className="auth-card" onSubmit={submit}>
        <h2>Create your account</h2>
        <p className="muted">Join Easy Job and start your journey</p>

        {error && <div className="alert error">{error}</div>}

        <div className="role-switch">
          <button type="button"
            className={form.role === "jobseeker" ? "active" : ""}
            onClick={() => setForm({ ...form, role: "jobseeker" })}>
            🎯 Job Seeker
          </button>
          <button type="button"
            className={form.role === "employer" ? "active" : ""}
            onClick={() => setForm({ ...form, role: "employer" })}>
            🏢 Employer
          </button>
        </div>

        <label>Full name</label>
        <input required value={form.name}
               onChange={(e) => setForm({ ...form, name: e.target.value })}
               placeholder="Jane Doe" />

        {form.role === "employer" && (
          <>
            <label>Company</label>
            <input value={form.company}
                   onChange={(e) => setForm({ ...form, company: e.target.value })}
                   placeholder="Acme Inc." />
          </>
        )}

        <label>Email</label>
        <input type="email" required value={form.email}
               onChange={(e) => setForm({ ...form, email: e.target.value })}
               placeholder="you@example.com" />

        <label>Password</label>
        <input type="password" required minLength={6} value={form.password}
               onChange={(e) => setForm({ ...form, password: e.target.value })}
               placeholder="Min 6 characters" />

        <button className="btn btn-primary btn-block" disabled={busy}>
          {busy ? "Creating…" : "Create Account"}
        </button>

        <p className="muted center small">
          Already have an account? <Link to="/login" className="link">Login</Link>
        </p>
      </form>
    </div>
  );
}