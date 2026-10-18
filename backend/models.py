from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from extensions import db


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), default="jobseeker")   # jobseeker | employer
    company = db.Column(db.String(120))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    jobs = db.relationship("Job", backref="employer", lazy=True,
                           cascade="all, delete-orphan")
    applications = db.relationship("Application", backref="applicant", lazy=True,
                                   cascade="all, delete-orphan")

    def set_password(self, pwd: str):
        self.password_hash = generate_password_hash(pwd)

    def check_password(self, pwd: str) -> bool:
        return check_password_hash(self.password_hash, pwd)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "role": self.role,
            "company": self.company,
        }


class Job(db.Model):
    __tablename__ = "jobs"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(160), nullable=False)
    company = db.Column(db.String(120), nullable=False)
    location = db.Column(db.String(120), nullable=False)
    description = db.Column(db.Text, nullable=False)
    requirements = db.Column(db.Text)
    salary_min = db.Column(db.Integer)
    salary_max = db.Column(db.Integer)
    job_type = db.Column(db.String(40), default="Full-time")
    category = db.Column(db.String(60), default="Engineering")
    employer_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    applications = db.relationship("Application", backref="job", lazy=True,
                                   cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "company": self.company,
            "location": self.location,
            "description": self.description,
            "requirements": self.requirements,
            "salary_min": self.salary_min,
            "salary_max": self.salary_max,
            "job_type": self.job_type,
            "category": self.category,
            "employer_id": self.employer_id,
            "created_at": self.created_at.isoformat(),
            "applicants_count": len(self.applications),
        }


class Application(db.Model):
    __tablename__ = "applications"
    __table_args__ = (
        db.UniqueConstraint("job_id", "applicant_id", name="uq_job_applicant"),
    )

    id = db.Column(db.Integer, primary_key=True)
    job_id = db.Column(db.Integer, db.ForeignKey("jobs.id"), nullable=False)
    applicant_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    cover_letter = db.Column(db.Text)
    status = db.Column(db.String(30), default="pending")  # pending | reviewed | accepted | rejected
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "job_id": self.job_id,
            "applicant_id": self.applicant_id,
            "cover_letter": self.cover_letter,
            "status": self.status,
            "created_at": self.created_at.isoformat(),
            "job": {
                "id": self.job.id,
                "title": self.job.title,
                "company": self.job.company,
                "location": self.job.location,
                "job_type": self.job.job_type,
            },
            "applicant": {
                "id": self.applicant.id,
                "name": self.applicant.name,
                "email": self.applicant.email,
            },
        }