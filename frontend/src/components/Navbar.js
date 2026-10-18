import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  useEffect(() => { setOpen(false); }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate("/");
  };

  return (
    <header className="navbar">
      <div className="nav-inner">
        <Link to="/" className="brand" onClick={() => setOpen(false)}>
          <span className="brand-mark">EJ</span>
          <span className="brand-text">Easy<span>Job</span></span>
        </Link>

        <button
          className={`nav-toggle ${open ? "open" : ""}`}
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle navigation menu"
          aria-expanded={open}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <nav className={`nav-links ${open ? "open" : ""}`}>
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/jobs">Jobs</NavLink>
           <NavLink to="/about">About</NavLink>           
          <NavLink to="/contact">Contact</NavLink> 

          {user && <NavLink to="/dashboard">Dashboard</NavLink>}
          {user?.role === "employer" && <NavLink to="/post-job">Post Job</NavLink>}
          {user?.role === "jobseeker" && (
            <NavLink to="/applications">My Applications</NavLink>
          )}

          <div className="nav-actions">
            {user ? (
              <>
                <span className="user-chip">
                  <span className="avatar">{user.name.charAt(0).toUpperCase()}</span>
                  {user.name.split(" ")[0]}
                </span>
                <button className="btn btn-outline" onClick={handleLogout}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-ghost" onClick={() => setOpen(false)}>
                  Login
                </Link>
               <Link to="/register" className="btn-signup" onClick={() => setOpen(false)}>
                Sign Up
                <svg className="btn-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}