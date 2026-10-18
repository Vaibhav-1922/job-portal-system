import { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";

const initialForm = { name: "", email: "", subject: "", message: "" };

const LIMITS = { name: 80, email: 120, subject: 120, message: 2000 };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Returns an object of { field: errorMessage } for any invalid field. */
function validate(form) {
  const errors = {};

  if (!form.name.trim()) {
    errors.name = "Please enter your full name.";
  } else if (form.name.trim().length < 2) {
    errors.name = "Name must be at least 2 characters.";
  } else if (form.name.length > LIMITS.name) {
    errors.name = `Name cannot exceed ${LIMITS.name} characters.`;
  }

  if (!form.email.trim()) {
    errors.email = "Please enter your email address.";
  } else if (!EMAIL_RE.test(form.email.trim())) {
    errors.email = "Please enter a valid email (e.g. you@example.com).";
  } else if (form.email.length > LIMITS.email) {
    errors.email = `Email cannot exceed ${LIMITS.email} characters.`;
  }

  if (!form.subject.trim()) {
    errors.subject = "Please add a subject.";
  } else if (form.subject.length > LIMITS.subject) {
    errors.subject = `Subject cannot exceed ${LIMITS.subject} characters.`;
  }

  if (!form.message.trim()) {
    errors.message = "Please write a message.";
  } else if (form.message.trim().length < 10) {
    errors.message = "Message must be at least 10 characters.";
  } else if (form.message.length > LIMITS.message) {
    errors.message = `Message cannot exceed ${LIMITS.message} characters.`;
  }

  return errors;
}

export default function Contact() {
  const [form, setForm] = useState(initialForm);
  const [touched, setTouched] = useState({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [status, setStatus] = useState({ type: "", msg: "" });
  const [sending, setSending] = useState(false);

  const formRef = useRef(null);

  const errors = useMemo(() => validate(form), [form]);
  const isValid = Object.keys(errors).length === 0;

  // Field is empty if every input is blank (used to disable the button)
  const isEmpty = Object.values(form).every((v) => !v.trim());

  // Show an error only after the user has touched the field OR tried to submit
  const showError = (field) => submitAttempted || touched[field];

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear server status while user edits
    if (status.msg) setStatus({ type: "", msg: "" });
  };

  const onBlur = (e) => {
    setTouched((prev) => ({ ...prev, [e.target.name]: true }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitAttempted(true);

    // Block submission if anything is invalid
    if (!isValid) {
      // Focus the first invalid field for accessibility
      const firstKey = ["name", "email", "subject", "message"].find(
        (k) => errors[k]
      );
      const el = formRef.current?.querySelector(`[name="${firstKey}"]`);
      el?.focus();
      return;
    }

    setSending(true);
    setStatus({ type: "", msg: "" });

    try {
      // 🔌 Wire to Flask when ready:
      //   await API.post("/contact", form);
      await new Promise((r) => setTimeout(r, 700)); // placeholder

      setStatus({
        type: "success",
        msg: "Thanks! Your message is on its way — we'll reply within 1 business day.",
      });
      setForm(initialForm);
      setTouched({});
      setSubmitAttempted(false);
    } catch (err) {
      setStatus({
        type: "error",
        msg: err.response?.data?.msg || "Couldn't send. Please try again.",
      });
    } finally {
      setSending(false);
    }
  };

  const fieldProps = (name) => ({
    name,
    id: `c-${name}`,
    value: form[name],
    onChange,
    onBlur,
    "aria-invalid": showError(name) && !!errors[name],
    "aria-describedby": errors[name] && showError(name) ? `err-${name}` : undefined,
  });

  return (
    <div className="page">
      {/* ---------- HEADER ---------- */}
      <section className="contact-header">
        <span className="pill">Get in touch</span>
        <h1>
          We'd love to hear from <span className="gradient-text">you</span>
        </h1>
        <p>Questions, feedback, or partnership ideas — our team is here to help.</p>
      </section>

      <div className="contact-grid">
        {/* ---------- FORM ---------- */}
        <form
          ref={formRef}
          className="contact-form-card"
          onSubmit={onSubmit}
          noValidate
        >
          <h2>Send us a message</h2>
          <p>Fill out the form and we'll get back within 1 business day.</p>

          {status.msg && (
            <div className={`alert ${status.type}`} role="status">
              {status.msg}
            </div>
          )}

          {/* NAME */}
          <label htmlFor="c-name">Full name *</label>
          <input
            {...fieldProps("name")}
            type="text"
            autoComplete="name"
            placeholder="Jane Doe"
            maxLength={LIMITS.name}
            className={showError("name") && errors.name ? "input-error" : ""}
          />
          {showError("name") && errors.name && (
            <p className="field-error" id="err-name">{errors.name}</p>
          )}

          {/* EMAIL */}
          <label htmlFor="c-email">Email *</label>
          <input
            {...fieldProps("email")}
            type="email"
            autoComplete="email"
            placeholder="jane@example.com"
            maxLength={LIMITS.email}
            className={showError("email") && errors.email ? "input-error" : ""}
          />
          {showError("email") && errors.email && (
            <p className="field-error" id="err-email">{errors.email}</p>
          )}

          {/* SUBJECT */}
          <label htmlFor="c-subject">Subject *</label>
          <input
            {...fieldProps("subject")}
            type="text"
            placeholder="How can we help?"
            maxLength={LIMITS.subject}
            className={showError("subject") && errors.subject ? "input-error" : ""}
          />
          {showError("subject") && errors.subject && (
            <p className="field-error" id="err-subject">{errors.subject}</p>
          )}

          {/* MESSAGE */}
          <label htmlFor="c-message">Message *</label>
          <textarea
            {...fieldProps("message")}
            rows={5}
            placeholder="Tell us a bit more..."
            maxLength={LIMITS.message}
            className={showError("message") && errors.message ? "input-error" : ""}
          />
          <div className="field-meta">
            {showError("message") && errors.message ? (
              <p className="field-error" id="err-message">{errors.message}</p>
            ) : (
              <span />
            )}
            <span className="char-count">
              {form.message.length}/{LIMITS.message}
            </span>
          </div>

          <button
            className="btn btn-primary btn-lg btn-block"
            type="submit"
            disabled={sending || isEmpty}
            title={isEmpty ? "Fill in the form to enable sending" : undefined}
          >
            {sending ? "Sending..." : "Send message"}
          </button>

          {!isValid && submitAttempted && (
            <p className="form-hint">Please fix the highlighted fields above.</p>
          )}
        </form>

        {/* ---------- INFO SIDEBAR ---------- */}
        <aside className="contact-info">
          <div className="contact-info-card">
            <div className="contact-icon">✉️</div>
            <div>
              <h3>Email us</h3>
              <p><a href="mailto:hello@easyjob.com">hello@easyjob.com</a></p>
              <p><a href="mailto:support@easyjob.com">support@easyjob.com</a></p>
            </div>
          </div>

          <div className="contact-info-card">
            <div className="contact-icon">📞</div>
            <div>
              <h3>Call us</h3>
              <p>+91XXXXXXXXXX</p>
              <p>Mon–Fri, 9am–6pm</p>
            </div>
          </div>

          <div className="contact-info-card">
            <div className="contact-icon">📍</div>
            <div>
              <h3>Visit us</h3>
              <p>Easy job</p>
              <p>Noida Sector-62, 201309, Uttar Pradesh</p>
            </div>
          </div>

          <div className="contact-info-card">
            <div className="contact-icon">💬</div>
            <div>
              <h3>Live chat</h3>
              <p>Available 24/7 in the app</p>
            </div>
          </div>

          <div className="social-row">
            <button className="social-btn" type="button" aria-label="Twitter">𝕏</button>
            <button className="social-btn" type="button" aria-label="LinkedIn">in</button>
            <button className="social-btn" type="button" aria-label="GitHub">gh</button>
            <button className="social-btn" type="button" aria-label="Instagram">ig</button>
          </div>
        </aside>
      </div>

      {/* ---------- FAQ ---------- */}
      <section className="section">
        <div className="section-head">
          <h2>Frequently asked</h2>
          <p className="muted small">Quick answers to the most common questions.</p>
        </div>
        <div className="faq-list">
          <details className="faq-item">
            <summary>How do I post a job?</summary>
            <p>
              Sign up as an employer, then click "Post Job" in the navbar. You
              can publish your first listing in under 2 minutes.
            </p>
          </details>
          <details className="faq-item">
            <summary>Is Easy Job free for job seekers?</summary>
            <p>
              Yes — searching, applying, and tracking applications is 100% free
              for candidates.
            </p>
          </details>
          <details className="faq-item">
            <summary>How do you handle my data?</summary>
            <p>
              We never sell your data. Read our privacy policy for full details
              on how applications and personal info are stored.
            </p>
          </details>
        </div>
      </section>
    </div>
  );
}