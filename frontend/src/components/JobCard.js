import { Link } from "react-router-dom";

const timeAgo = (iso) => {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

export default function JobCard({ job }) {
  const salary =
    job.salary_min && job.salary_max
      ? `$${(job.salary_min / 1000).toFixed(0)}k – $${(job.salary_max / 1000).toFixed(0)}k`
      : "Negotiable";

  return (
    <div className="job-card">
      <div className="job-card-top">
        <div className="company-logo">{job.company.charAt(0)}</div>
        <div>
          <h3>{job.title}</h3>
          <p className="muted">{job.company} · {job.location}</p>
        </div>
      </div>

      <div className="tags">
        <span className="tag tag-type">{job.job_type}</span>
        <span className="tag">{job.category}</span>
      </div>

      <p className="job-desc">{job.description.slice(0, 110)}…</p>



      <div className="job-card-foot">
        <span className="salary">{salary}</span>
        <span className="muted small">{timeAgo(job.created_at)}</span>
      </div>
      <h5 className="pre">Will be Added soon!</h5>

      <Link to={`/jobs/${job.id}`} className="btn btn-primary btn-block">
        View & Apply →
      </Link>
    </div>
  );
}