from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models import Application, Job, User

apps_bp = Blueprint("applications", __name__)


def _current_user():
    return db.session.get(User, int(get_jwt_identity()))


@apps_bp.post("")
@jwt_required()
def apply():
    user = _current_user()
    if user.role != "jobseeker":
        return jsonify(msg="Only jobseekers can apply"), 403

    d = request.get_json() or {}
    job_id = d.get("job_id")
    job = db.session.get(Job, job_id) if job_id else None
    if not job:
        return jsonify(msg="Job not found"), 404

    existing = Application.query.filter_by(job_id=job.id, applicant_id=user.id).first()
    if existing:
        return jsonify(msg="You have already applied to this job"), 409

    app = Application(job_id=job.id, applicant_id=user.id,
                      cover_letter=(d.get("cover_letter") or "").strip() or None)
    db.session.add(app)
    db.session.commit()
    return jsonify(app.to_dict()), 201


@apps_bp.get("/my")
@jwt_required()
def my_applications():
    user = _current_user()
    apps = (Application.query
            .filter_by(applicant_id=user.id)
            .order_by(Application.created_at.desc()).all())
    return jsonify([a.to_dict() for a in apps])


@apps_bp.get("/job/<int:job_id>")
@jwt_required()
def job_applications(job_id):
    user = _current_user()
    job = db.session.get(Job, job_id)
    if not job:
        return jsonify(msg="Job not found"), 404
    if job.employer_id != user.id:
        return jsonify(msg="Not authorized"), 403
    apps = Application.query.filter_by(job_id=job_id).order_by(Application.created_at.desc()).all()
    return jsonify([a.to_dict() for a in apps])


@apps_bp.patch("/<int:app_id>")
@jwt_required()
def update_status(app_id):
    user = _current_user()
    app = db.session.get(Application, app_id)
    if not app:
        return jsonify(msg="Application not found"), 404
    if app.job.employer_id != user.id:
        return jsonify(msg="Not authorized"), 403

    status = (request.get_json() or {}).get("status")
    if status not in ("pending", "reviewed", "accepted", "rejected"):
        return jsonify(msg="Invalid status"), 400
    app.status = status
    db.session.commit()
    return jsonify(app.to_dict())


@apps_bp.delete("/<int:app_id>")
@jwt_required()
def withdraw(app_id):
    user = _current_user()
    app = db.session.get(Application, app_id)
    if not app:
        return jsonify(msg="Application not found"), 404
    if app.applicant_id != user.id:
        return jsonify(msg="Not authorized"), 403
    db.session.delete(app)
    db.session.commit()
    return jsonify(msg="Application withdrawn")