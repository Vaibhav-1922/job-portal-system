from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import or_
from extensions import db
from models import Job, User

jobs_bp = Blueprint("jobs", __name__)


def _current_user():
    return db.session.get(User, int(get_jwt_identity()))


@jobs_bp.get("")
def list_jobs():
    q = (request.args.get("q") or "").strip()
    category = (request.args.get("category") or "").strip()
    job_type = (request.args.get("job_type") or "").strip()
    location = (request.args.get("location") or "").strip()
    limit = request.args.get("limit", type=int)

    query = Job.query
    if q:
        like = f"%{q}%"
        query = query.filter(or_(
            Job.title.ilike(like),
            Job.company.ilike(like),
            Job.description.ilike(like),
        ))
    if category:
        query = query.filter(Job.category == category)
    if job_type:
        query = query.filter(Job.job_type == job_type)
    if location:
        query = query.filter(Job.location.ilike(f"%{location}%"))

    query = query.order_by(Job.created_at.desc())
    if limit:
        query = query.limit(limit)

    return jsonify([j.to_dict() for j in query.all()])


@jobs_bp.get("/categories")
def categories():
    rows = db.session.query(Job.category).distinct().all()
    return jsonify([r[0] for r in rows if r[0]])


@jobs_bp.get("/mine")
@jwt_required()
def my_jobs():
    user = _current_user()
    if user.role != "employer":
        return jsonify(msg="Employers only"), 403
    jobs = Job.query.filter_by(employer_id=user.id).order_by(Job.created_at.desc()).all()
    return jsonify([j.to_dict() for j in jobs])


@jobs_bp.get("/<int:job_id>")
def get_job(job_id):
    job = db.session.get(Job, job_id)
    if not job:
        return jsonify(msg="Job not found"), 404
    return jsonify(job.to_dict())


@jobs_bp.post("")
@jwt_required()
def create_job():
    user = _current_user()
    if user.role != "employer":
        return jsonify(msg="Only employers can post jobs"), 403

    d = request.get_json() or {}
    required = ["title", "location", "description"]
    if any(not (d.get(f) or "").strip() for f in required):
        return jsonify(msg="Title, location and description are required"), 400

    job = Job(
        title=d["title"].strip(),
        company=(d.get("company") or user.company or user.name).strip(),
        location=d["location"].strip(),
        description=d["description"].strip(),
        requirements=(d.get("requirements") or "").strip() or None,
        salary_min=d.get("salary_min") or None,
        salary_max=d.get("salary_max") or None,
        job_type=d.get("job_type") or "Full-time",
        category=d.get("category") or "Engineering",
        employer_id=user.id,
    )
    db.session.add(job)
    db.session.commit()
    return jsonify(job.to_dict()), 201


@jobs_bp.put("/<int:job_id>")
@jwt_required()
def update_job(job_id):
    user = _current_user()
    job = db.session.get(Job, job_id)
    if not job:
        return jsonify(msg="Job not found"), 404
    if job.employer_id != user.id:
        return jsonify(msg="Not authorized"), 403

    d = request.get_json() or {}
    for field in ["title", "company", "location", "description", "requirements",
                  "salary_min", "salary_max", "job_type", "category"]:
        if field in d:
            setattr(job, field, d[field])
    db.session.commit()
    return jsonify(job.to_dict())


@jobs_bp.delete("/<int:job_id>")
@jwt_required()
def delete_job(job_id):
    user = _current_user()
    job = db.session.get(Job, job_id)
    if not job:
        return jsonify(msg="Job not found"), 404
    if job.employer_id != user.id:
        return jsonify(msg="Not authorized"), 403
    db.session.delete(job)
    db.session.commit()
    return jsonify(msg="Job deleted"), 200