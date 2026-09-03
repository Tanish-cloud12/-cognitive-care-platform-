from flask import Blueprint, request, jsonify
from app.middleware.auth import token_required
from app.services.auth_service import (
    register_user,
    login_user
)


auth_bp = Blueprint(
    "auth",
    __name__,
    url_prefix="/api/auth"
)


@auth_bp.route("/register", methods=["POST"])
def register():

    data = request.get_json()

    patient_id = data.get("patient_id")
    password = data.get("password")

    if not patient_id or not password:
        return jsonify({
            "message": "Patient ID and password are required"
        }), 400

    success, message = register_user(
        patient_id,
        password
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

    patient_id = data.get("patient_id")
    password = data.get("password")

    if not patient_id or not password:
        return jsonify({
            "message": "Patient ID and password are required"
        }), 400

    token, error = login_user(
        patient_id,
        password
    )

    if error:
        return jsonify({
            "message": error
        }), 401

    return jsonify({
        "message": "Login successful",
        "access_token": token
    }), 200


@auth_bp.route("/me", methods=["GET"])
@token_required
def get_current_user(user_id):

    return jsonify({
        "message": "You are authenticated",
        "user_id": user_id
    }), 200