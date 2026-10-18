from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from extensions import db
from models import User

auth_bp = Blueprint("auth", __name__)


@auth_bp.post("/register")
def register():
    data = request.get_json() or {}
    name = (data.get("name") or "").strip()
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""
    role = data.get("role", "jobseeker")
    company = (data.get("company") or "").strip() or None

    if not name or not email or len(password) < 6:
        return jsonify(msg="Name, valid email and password (min 6 chars) are required"), 400

    if role not in ("jobseeker", "employer"):
        return jsonify(msg="Invalid role"), 400

    if User.query.filter_by(email=email).first():
        return jsonify(msg="Email already registered"), 409

    user = User(name=name, email=email, role=role,
                company=company if role == "employer" else None)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()

    token = create_access_token(identity=str(user.id),
                                additional_claims={"role": user.role})
    return jsonify(access_token=token, user=user.to_dict()), 201


@auth_bp.post("/login")
def login():
    data = request.get_json() or {}
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return jsonify(msg="Invalid email or password"), 401

    token = create_access_token(identity=str(user.id),
                                additional_claims={"role": user.role})
    return jsonify(access_token=token, user=user.to_dict()), 200


@auth_bp.get("/me")
@jwt_required()
def me():
    user = db.session.get(User, int(get_jwt_identity()))
    if not user:
        return jsonify(msg="User not found"), 404
    return jsonify(user.to_dict())