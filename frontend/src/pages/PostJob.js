import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

const CATEGORIES = ["Engineering", "Design", "Marketing", "Data", "Sales", "Support", "Finance"];
const TYPES = ["Full-time", "Part-time", "Contract", "Internship", "Remote"];

export default function PostJob() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "", company: "", location: "", description: "", requirements: "",
    salary_min: "", salary_max: "", job_type: "Full-time", category: "Engineering",
  });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError(""); setBusy(true);
    try {
      const payload = {
        ...form,
        salary_min: form.salary_min ? Number(form.salary_min) : null,
        salary_max: form.salary_max ? Number(form.salary_max) : null,
      };
      await API.post("/jobs", payload);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to post job");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="page narrow">
      <section className="page-head">
        <h1>Post a <span className="gradient-text">New Job</span></h1>
        <p className="muted">Reach thousands of candidates in minutes.</p>
      </section>

      <form className="card form-grid" onSubmit={submit}>
        {error && <div className="alert error full">{error}</div>}

        <div className="full">
          <label>Job Title *</label>
          <input name="title" required value={form.title} onChange={change}
                 placeholder="e.g. Senior React Developer" />
        </div>

        <div>
          <label>Company</label>
          <input name="company" value={form.company} onChange={change} placeholder="Your company" />
        </div>
        <div>
          <label>Location *</label>
          <input name="location" required value={form.location} onChange={change}
                 placeholder="e.g. Remote / Berlin, DE" />
        </div>

        <div>
          <label>Category</label>
          <select name="category" value={form.category} onChange={change}>
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label>Job Type</label>
          <select name="job_type" value={form.job_type} onChange={change}>
            {TYPES.map((t) => <option key={t}>{t}</option>)}
          </select>
        </div>

        <div>
          <label>Salary Min ($)</label>
          <input type="number" name="salary_min" value={form.salary_min} onChange={change} placeholder="50000" />
        </div>
        <div>
          <label>Salary Max ($)</label>
          <input type="number" name="salary_max" value={form.salary_max} onChange={change} placeholder="90000" />
        </div>

        <div className="full">
          <label>Job Description *</label>
          <textarea name="description" rows="5" required value={form.description} onChange={change}
                    placeholder="Describe the role, team, and responsibilities…" />
        </div>

        <div className="full">
          <label>Requirements</label>
          <textarea name="requirements" rows="4" value={form.requirements} onChange={change}
                    placeholder="Skills, experience, nice-to-haves…" />
        </div>

        <div className="full">
          <button className="btn btn-primary btn-lg btn-block" disabled={busy}>
            {busy ? "Publishing…" : "🚀 Publish Job"}
          </button>
        </div>
      </form>
    </div>
  );
}