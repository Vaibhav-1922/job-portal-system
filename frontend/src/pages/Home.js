import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";
import JobCard from "../components/JobCard";

export default function Home() {
  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState({ jobs: 0, companies: 0, seekers: 0 });

  useEffect(() => {
    API.get("/jobs", { params: { limit: 6 } })
      .then((r) => setJobs(r.data))
      .catch(() => {});
    API.get("/jobs").then((r) => {
      const data = r.data;
      setStats({
        jobs: data.length,
        companies: new Set(data.map((j) => j.company)).size,
        seekers: 1200 + data.length * 7,
      });
    }).catch(() => {});
  }, []);

  return (
    <div className="page">
      <section className="hero">
        <div className="hero-content">
          <span className="pill">🚀 Over {stats.jobs}+ live opportunities</span>
          <h1>
            Find Your <span className="gradient-text">Dream Job</span> with Easy&nbsp;Job
          </h1>
          <p>
            Discover thousands of curated roles from top companies. Apply in one click,
            track every application, and land your next big opportunity.
          </p>
          <div className="hero-actions">
            <Link to="/jobs" className="btn btn-primary btn-lg" id="br-job">Browse Jobs</Link>
            <Link to="/register" className="btn btn-outline btn-lg">Get Started Free</Link>
          </div>

          <div className="stats">
            <div><strong>{stats.jobs}</strong><span>Live Jobs</span></div>
            <div><strong>{stats.companies}</strong><span>Companies</span></div>
            <div><strong>{stats.seekers}+</strong><span>Job Seekers</span></div>
          </div>
        </div>

        <div className="hero-art" aria-hidden="true">
          <div className="orb orb-1" />
          <div className="orb orb-2" />
          <div className="orb orb-3" />
          <div className="glass-card floating">
            <div className="mini-row">
              <div className="mini-logo">N</div>
              <div>
                <strong>Frontend Developer</strong>
                <span className="muted small">NovaTech · Remote</span>
              </div>
            </div>
            <span className="tag tag-type">Full-time</span>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <h2>Latest Opportunities</h2>
          <Link to="/jobs" className="link">View all →</Link>
        </div>
        <div className="grid">
          {jobs.length === 0
            ? <p className="muted">Loading jobs…</p>
            : jobs.map((j) => <JobCard key={j.id} job={j} />)}
        </div>
      </section>

      <section className="cta">
        <h2>Ready to hire top talent?</h2>
        <p>Post a job in under 2 minutes and reach thousands of qualified candidates.</p>
        <Link to="/register" className="btn btn-primary btn-lg">Post a Job</Link>
      </section>
    </div>
  );
}