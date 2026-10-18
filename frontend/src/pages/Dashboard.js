import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      if (user.role === "employer") {
        const r = await API.get("/jobs/mine");
        setJobs(r.data);
      } else {
        const r = await API.get("/applications/my");
        setApps(r.data);
      }
    } catch { /* ignore */ }
    setLoading(false);
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, []);

  const removeJob = async (id) => {
    if (!window.confirm("Delete this job posting?")) return;
    await API.delete(`/jobs/${id}`);
    load();
  };

  return (
    <div className="page">
      <section className="page-head">
        <h1>Hi, <span className="gradient-text">{user.name}</span> 👋</h1>
        <p className="muted">
          {user.role === "employer"
            ? "Manage your job postings and applicants."
            : "Track all your job applications in one place."}
        </p>
      </section>

      {loading && <p className="muted">Loading…</p>}

      {user.role === "employer" && !loading && (
        <>
          <div className="dashboard-actions">
            <Link to="/post-job" className="btn btn-primary">＋ Post a New Job</Link>
          </div>
          <div className="grid">
            {jobs.length === 0 && (
              <div className="empty">
                <h3>No jobs posted yet</h3>
                <p className="muted">Create your first job posting to start receiving applications.</p>
                <Link to="/post-job" className="btn btn-primary">Post Job</Link>
              </div>
            )}
            {jobs.map((j) => (
              <div className="job-card" key={j.id}>
                <div className="job-card-top">
                  <div className="company-logo">{j.company.charAt(0)}</div>
                  <div>
                    <h3>{j.title}</h3>
                    <p className="muted">{j.location} · {j.job_type}</p>
                  </div>
                </div>
                <div className="tags">
                  <span className="tag tag-type">{j.applicants_count} applicants</span>
                  <span className="tag">{j.category}</span>
                </div>
                <div className="row-actions">
                  <Link to={`/jobs/${j.id}`} className="btn btn-outline btn-sm">View</Link>
                  <button className="btn btn-danger btn-sm" onClick={() => removeJob(j.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {user.role === "jobseeker" && !loading && (
        <div className="grid">
          {apps.length === 0 && (
            <div className="empty">
              <h3>No applications yet</h3>
              <p className="muted">Start applying to jobs and track their status here.</p>
              <Link to="/jobs" className="btn btn-primary">Browse Jobs</Link>
            </div>
          )}
          {apps.map((a) => (
            <div className="job-card" key={a.id}>
              <div className="job-card-top">
                <div className="company-logo">{a.job.company.charAt(0)}</div>
                <div>
                  <h3>{a.job.title}</h3>
                  <p className="muted">{a.job.company} · {a.job.location}</p>
                </div>
              </div>
              <div className="tags">
                <span className={`tag status-${a.status}`}>{a.status}</span>
                <span className="tag">{a.job.job_type}</span>
              </div>
              <Link to={`/jobs/${a.job.id}`} className="btn btn-outline btn-block">View Job</Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}