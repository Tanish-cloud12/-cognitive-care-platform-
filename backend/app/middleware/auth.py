from functools import wraps

from flask import request, jsonify

import jwt
import os

from dotenv import load_dotenv


load_dotenv()

JWT_SECRET = os.getenv("JWT_SECRET")
JWT_ALGORITHM = "HS256"


def token_required(f):

    @wraps(f)
    def decorated(*args, **kwargs):

        # Get Authorization header
        auth_header = request.headers.get("Authorization")

        if not auth_header:
            return jsonify({
                "message": "Authorization token is required"
            }), 401

        # Expected format:
        # Bearer <token>

        parts = auth_header.split(" ")

        if len(parts) != 2 or parts[0] != "Bearer":
            return jsonify({
                "message": "Invalid authorization format"
            }), 401

        token = parts[1]

        try:

            payload = jwt.decode(
                token,
                JWT_SECRET,
                algorithms=[JWT_ALGORITHM]
            )

            user_id = payload["user_id"]
            role = payload["role"]

        except jwt.ExpiredSignatureError:

            return jsonify({
                "message": "Token has expired"
            }), 401

        except jwt.InvalidTokenError:

            return jsonify({
                "message": "Invalid token"
            }), 401

        # Give user_id and role to the protected route
        return f(user_id, role, *args, **kwargs)

    return decorated


def role_required(required_role):

    def decorator(f):

        @wraps(f)
        @token_required
        def decorated(user_id, role, *args, **kwargs):

            if role != required_role:
                return jsonify({
                    "message": "Access denied"
                }), 403

            return f(user_id, role, *args, **kwargs)

        return decorated

    return decorator