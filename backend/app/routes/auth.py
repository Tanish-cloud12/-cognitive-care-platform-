from flask import Blueprint, request, jsonify

from app.services.auth_service import (
    register_user,
    login_user
)

from app.middleware.auth import token_required


auth_bp = Blueprint(
    "auth",
    __name__,
    url_prefix="/api/auth"
)


@auth_bp.route("/register", methods=["POST"])
def register():

    data = request.get_json()

    user_id = data.get("user_id")
    password = data.get("password")
    role = data.get("role")

    if not user_id or not password or not role:
        return jsonify({
            "message": "User ID, password and role are required"
        }), 400

    if role not in ["patient", "caregiver"]:
        return jsonify({
            "message": "Invalid role"
        }), 400

    success, message = register_user(
        user_id,
        password,
        role
    )

    if not success:
        return jsonify({
            "message": message
        }), 409

    return jsonify({
        "message": message
    }), 201


@auth_bp.route("/login", methods=["POST"])
def login():

    data = request.get_json()

    user_id = data.get("user_id")
    password = data.get("password")
    role = data.get("role")

    if not user_id or not password or not role:
        return jsonify({
            "message": "User ID, password and role are required"
        }), 400

    if role not in ["patient", "caregiver"]:
        return jsonify({
            "message": "Invalid role"
        }), 400

    token, error = login_user(
        user_id,
        password,
        role
    )

    if error:
        return jsonify({
            "message": error
        }), 401

    return jsonify({
        "message": "Login successful",
        "access_token": token,
        "role": role
    }), 200


@auth_bp.route("/me", methods=["GET"])
@token_required
def get_current_user(user_id, role):

    return jsonify({
        "user_id": user_id,
        "role": role
    }), 200