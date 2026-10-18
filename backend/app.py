from flask import Flask, jsonify
from config import Config
from extensions import db, jwt, cors
from models import User, Job
from routes.auth import auth_bp
from routes.jobs import jobs_bp
from routes.applications import apps_bp


SEED_JOBS = [
    {"title": "Frontend Developer (React)", "company": "NovaTech",
     "location": "Remote", "job_type": "Full-time", "category": "Engineering",
     "salary_min": 60000, "salary_max": 95000,
     "description": "Build beautiful, accessible interfaces with React and TypeScript.",
     "requirements": "2+ years React, HTML/CSS, Git. Bonus: Next.js."},
    {"title": "Backend Engineer (Python)", "company": "DataForge",
     "location": "Berlin, DE", "job_type": "Full-time", "category": "Engineering",
     "salary_min": 70000, "salary_max": 110000,
     "description": "Design REST APIs and data pipelines using Flask / FastAPI.",
     "requirements": "Strong Python, SQL, Docker, REST design."},
    {"title": "Product Designer", "company": "PixelLabs",
     "location": "Remote", "job_type": "Contract", "category": "Design",
     "salary_min": 40000, "salary_max": 70000,
     "description": "Own end-to-end design for mobile & web products.",
     "requirements": "Figma, design systems, user research."},
    {"title": "Digital Marketing Specialist", "company": "GrowthHive",
     "location": "London, UK", "job_type": "Part-time", "category": "Marketing",
     "salary_min": 25000, "salary_max": 45000,
     "description": "Drive growth via SEO, SEM and content marketing.",
     "requirements": "Analytics, copywriting, Google Ads."},
    {"title": "DevOps Engineer", "company": "CloudCore",
     "location": "Remote", "job_type": "Full-time", "category": "Engineering",
     "salary_min": 80000, "salary_max": 120000,
     "description": "Automate CI/CD and manage cloud infrastructure.",
     "requirements": "AWS, Kubernetes, Terraform, Linux."},
    {"title": "Data Scientist", "company": "InsightAI",
     "location": "New York, US", "job_type": "Full-time", "category": "Data",
     "salary_min": 90000, "salary_max": 140000,
     "description": "Build ML models for product recommendations.",
     "requirements": "Python, pandas, scikit-learn, SQL."},
]


def seed_data():
    if Job.query.count() > 0:
        return
    employer = User.query.filter_by(email="employer@easyjob.com").first()
    if not employer:
        employer = User(name="EasyJob Recruiter", email="employer@easyjob.com",
                        role="employer", company="EasyJob Inc.")
        employer.set_password("password123")
        db.session.add(employer)
        db.session.commit()

    for j in SEED_JOBS:
        db.session.add(Job(employer_id=employer.id, **j))
    db.session.commit()


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    jwt.init_app(app)
    cors.init_app(app, resources={r"/api/*": {"origins": "*"}})

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(jobs_bp, url_prefix="/api/jobs")
    app.register_blueprint(apps_bp, url_prefix="/api/applications")

    @app.get("/api/health")
    def health():
        return jsonify(status="ok", service="Easy Job API")

    with app.app_context():
        db.create_all()
        seed_data()

    return app


app = create_app()

if __name__ == "__main__":
    app.run(debug=True, port=5000)