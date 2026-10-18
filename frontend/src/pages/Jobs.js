import { useEffect, useState } from "react";
import API from "../api/axios";
import JobCard from "../components/JobCard";

const JOB_TYPES = ["Full-time", "Part-time", "Contract", "Internship", "Remote"];

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [filters, setFilters] = useState({ q: "", location: "", job_type: "", category: "" });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/jobs/categories").then((r) => setCategories(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => {
      API.get("/jobs", { params: filters })
        .then((r) => setJobs(r.data))
        .catch(() => setJobs([]))
        .finally(() => setLoading(false));
    }, 250);
    return () => clearTimeout(t);
  }, [filters]);

  const reset = () => setFilters({ q: "", location: "", job_type: "", category: "" });

  return (
    <div className="page">
      <section className="page-head">
        <h1>Browse <span className="gradient-text">Jobs</span></h1>
        <p className="muted">Find the role that fits you — filtered exactly how you like it.</p>
      </section>

      <div className="filter-bar">
        <input
          className="search"
          placeholder="🔍 Search title, company, keywords…"
          value={filters.q}
          onChange={(e) => setFilters({ ...filters, q: e.target.value })}
        />
        <input
          placeholder="📍 Location"
          value={filters.location}
          onChange={(e) => setFilters({ ...filters, location: e.target.value })}
        />
        <select value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}>
          <option value="">All Categories</option>
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={filters.job_type}
                onChange={(e) => setFilters({ ...filters, job_type: e.target.value })}>
          <option value="">All Types</option>
          {JOB_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <button className="btn btn-outline" onClick={reset}>Reset</button>
      </div>

      <p className="muted small results-count">
        {loading ? "Searching…" : `${jobs.length} job${jobs.length !== 1 ? "s" : ""} found`}
      </p>

      <div className="grid">
        {!loading && jobs.length === 0 && (
          <div className="empty">
            <h3>No jobs matched your filters 🔍</h3>
            <p className="muted">Try clearing filters or searching for something broader.</p>
            <button className="btn btn-primary" onClick={reset}>Clear filters</button>
          </div>
        )}
        {jobs.map((j) => <JobCard key={j.id} job={j} />)}
      </div>
    </div>
  );
}