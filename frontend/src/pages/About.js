import { Link } from "react-router-dom";

const stats = [
  { value: "10K+", label: "Active jobs" },
  { value: "250K+", label: "Job seekers" },
  { value: "8K+", label: "Companies" },
  { value: "98%", label: "Satisfaction" },
];

const values = [
  { icon: "🎯", title: "Transparency", desc: "Real salaries, real companies, real feedback — no black-box hiring." },
  { icon: "⚡", title: "Speed", desc: "From first click to first interview in days, not weeks." },
  { icon: "🤝", title: "Human-first", desc: "Hiring is a human decision. We build tools that respect that." },
  { icon: "🚀", title: "Innovation", desc: "We ship weekly and listen to every piece of feedback we get." },
];

const team = [
  { initials: "S", name: "Shivam", role: "Co-founder & CEO", bio: "Ex-recruiter turned builder. Obsessed with making hiring less painful." },
  { initials: "V", name: "Vaibhav", role: "Head of Design", bio: "Designs experiences people actually want to use." },
  { initials: "NSK", name: "Nikit Singh Kanyal", role: "Lead Engineer", bio: "Full-stack architect. Keeps the platform fast and reliable." },
  { initials: "TK", name: "Tarun Kumar", role: "Head of Growth", bio: "Turns curiosity into community. Loves a good story." },
];

export default function About() {
  return (
    <div className="page">
      {/* ---------- HERO ---------- */}
      <section className="about-hero">
        <span className="pill">About Easy Job</span>
        <h1>
          Connecting talent with <span className="gradient-text">opportunity</span>
        </h1>
        <p>
          We're on a mission to make hiring faster, fairer, and more human —
          for every company and every candidate.
        </p>
      </section>

      {/* ---------- STATS ---------- */}
      <section className="about-stats">
        {stats.map((s) => (
          <div key={s.label}>
            <strong>{s.value}</strong>
            <span>{s.label}</span>
          </div>
        ))}
      </section>

      {/* ---------- STORY ---------- */}
      <section className="about-story">
        <div>
          <h2>Our story</h2>
          <p>
            Easy Job started in 2020 as a simple idea: what if finding a job felt
            less like a numbers game and more like a real conversation?
          </p>
          <p>
            Today we're a team of 40+ engineers, designers, and recruiters
            building the tools that connect people to work they love — without
            the noise, spam, and endless forms.
          </p>
          <p>
            We're funded by people who believe the same thing: that meaningful
            work deserves a meaningful platform.
          </p>
        </div>

        <div className="about-visual" aria-hidden="true">
          <div className="orb orb-1" />
          <div className="orb orb-2" />
          <div className="orb orb-3" />
          <div className="glass-card floating">
            <div className="mini-row">
              <div className="mini-logo">E</div>
              <div>
                <strong>Built for humans</strong>
                <span className="muted small">Since 2020</span>
              </div>
            </div>
            <div className="mini-row" style={{ marginBottom: 0 }}>
              <div className="mini-logo">✦</div>
              <div>
                <strong>Trusted worldwide</strong>
                <span className="muted small">60+ countries</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- VALUES ---------- */}
      <section className="section">
        <div className="section-head">
          <h2>What we value</h2>
          <p className="muted small">Four principles that guide everything we build.</p>
        </div>
        <div className="values-grid">
          {values.map((v) => (
            <div className="value-card" key={v.title}>
              <div className="value-icon">{v.icon}</div>
              <h3>{v.title}</h3>
              <p>{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- TEAM ---------- */}
      <section className="section">
        <div className="section-head">
          <h2>Meet the team</h2>
          <p className="muted small">A small team with a big mission.</p>
        </div>
        <div className="team-grid">
          {team.map((m) => (
            <div className="team-card" key={m.name}>
              <div className="team-avatar">{m.initials}</div>
              <h3>{m.name}</h3>
              <p className="role">{m.role}</p>
              <p>{m.bio}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- CTA ---------- */}
      <div className="cta">
        <h2>Ready to find your next role?</h2>
        <p>Join thousands of professionals who found work they love.</p>
        <Link to="/jobs" className="btn btn-primary btn-lg">
          Browse jobs
        </Link>
      </div>
    </div>
  );
}