import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function JobDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [cover, setCover] = useState("");
  const [msg, setMsg] = useState({ type: "", text: "" });
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    API.get(`/jobs/${id}`).then((r) => setJob(r.data)).catch(() => setJob(null));
  }, [id]);

  const apply = async () => {
    if (!user) return navigate("/login");
    setBusy(true); setMsg({ type: "", text: "" });
    try {
      await API.post("/applications", { job_id: job.id, cover_letter: cover });
      setMsg({ type: "success", text: "🎉 Application submitted successfully!" });
      setCover("");
    } catch (err) {
      setMsg({ type: "error", text: err.response?.data?.msg || "Failed to apply" });
    } finally {
      setBusy(false);
    }
  };

  if (!job) return <div className="page"><p className="muted">Loading…</p></div>;

  return (
    <div className="page">
      <div className="detail-grid">
        <div className="detail-main card">
          <div className="job-card-top">
            <div className="company-logo lg">{job.company.charAt(0)}</div>
            <div>
              <h1>{job.title}</h1>
              <p className="muted">{job.company} · {job.location}</p>
            </div>
          </div>

          <div className="tags">
            <span className="tag tag-type">{job.job_type}</span>
            <span className="tag">{job.category}</span>
            <span className="tag">
              💰 {job.salary_min && job.salary_max
                ? `$${(job.salary_min / 1000).toFixed(0)}k – $${(job.salary_max / 1000).toFixed(0)}k`
                : "Negotiable"}
            </span>
          </div>

          <h3>Job Description</h3>
          <p className="pre">{job.description}</p>

          {job.requirements && (
            <>
              <h3>Requirements</h3>
              <p className="pre">{job.requirements}</p>
            </>
          )}
        </div>

        <aside className="detail-side card">
          <h3>Apply for this role</h3>
          {msg.text && <div className={`alert ${msg.type}`}>{msg.text}</div>}

          {!user && (
            <p className="muted">Please <a className="link" href="/login">log in</a> as a job seeker to apply.</p>
          )}

          {user?.role === "employer" && (
            <p className="muted">You're logged in as an employer — switch to a job-seeker account to apply.</p>
          )}

          {user?.role === "jobseeker" && (
            <>
              <label>Cover letter (optional)</label>
              <textarea rows="6" value={cover}
                        onChange={(e) => setCover(e.target.value)}
                        placeholder="Tell the employer why you're a great fit…" />
              <button className="btn btn-primary btn-block" onClick={apply} disabled={busy}>
                {busy ? "Submitting…" : "🚀 Apply Now"}
              </button>
            </>
          )}

          <div className="side-meta">
            <p><strong>{job.applicants_count}</strong> applicants</p>
            <p className="muted small">Posted {new Date(job.created_at).toLocaleDateString()}</p>
          </div>
        </aside>
      </div>
    </div>
  );
}