import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";

export default function MyApplications() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    API.get("/applications/my")
      .then((r) => setApps(r.data))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const withdraw = async (id) => {
    if (!window.confirm("Withdraw this application?")) return;
    await API.delete(`/applications/${id}`);
    load();
  };

  return (
    <div className="page">
      <section className="page-head">
        <h1>My <span className="gradient-text">Applications</span></h1>
        <p className="muted">Track every application and its status.</p>
      </section>

      {loading && <p className="muted">Loading…</p>}

      <div className="table-wrap card">
        <table className="table">
          <thead>
            <tr>
              <th>Job</th><th>Company</th><th>Location</th>
              <th>Status</th><th>Applied</th><th></th>
            </tr>
          </thead>
          <tbody>
            {apps.length === 0 && !loading && (
              <tr>
                <td colSpan="6" className="center muted">
                  No applications yet.
                </td>
              </tr>
            )}
            {apps.map((a) => (
              <tr key={a.id}>
                <td data-label="Job">
                  <Link to={`/jobs/${a.job.id}`} className="link">{a.job.title}</Link>
                </td>
                <td data-label="Company">{a.job.company}</td>
                <td data-label="Location">{a.job.location}</td>
                <td data-label="Status">
                  <span className={`tag status-${a.status}`}>{a.status}</span>
                </td>
                <td data-label="Applied" className="muted small">
                  {new Date(a.created_at).toLocaleDateString()}
                </td>
                <td data-label="Actions">
                  <button className="btn btn-danger btn-sm" onClick={() => withdraw(a.id)}>
                    Withdraw
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}