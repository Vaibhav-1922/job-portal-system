import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div>
          <h4 className="brand-text">Easy<span>Job</span></h4>
          <p>Connecting talent with opportunity — faster, smarter, easier.</p>
        </div>

        <div className="footer-links">
          <Link to="/jobs">Browse Jobs</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
        </div>

        <p className="copyright">
          © {new Date().getFullYear()} Easy Job. All rights reserved.
        </p>
      </div>
    </footer>
  );
}