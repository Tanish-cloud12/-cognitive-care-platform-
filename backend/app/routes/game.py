from flask import Blueprint, jsonify, request

from app.middleware.auth import role_required
from app.services.game_service import create_game_session
from app.services.game_result_service import save_game_result


game_bp = Blueprint(
    "game",
    __name__,
    url_prefix="/api/game"
)


@game_bp.route("/session", methods=["POST"])
@role_required("patient")
def start_game(user_id, role):

    session_id = create_game_session(user_id)

    return jsonify({
        "message": "Game session created",
        "session_id": session_id
    }), 201


@game_bp.route("/result", methods=["POST"])
@role_required("patient")
def submit_game_result(user_id, role):

    data = request.get_json()

    session_id = data.get("session_id")
    game_type = data.get("game_type")
    score = data.get("score")
    mistakes = data.get("mistakes")
    correct_answers = data.get("correct_answers")
    time_taken = data.get("time_taken")
    metrics = data.get("metrics", {})

    if not session_id:
        return jsonify({
            "message": "session_id is required"
        }), 400

    if not game_type:
        return jsonify({
            "message": "game_type is required"
        }), 400

    success, message = save_game_result(
        session_id,
        user_id,
        game_type,
        score,
        mistakes,
        correct_answers,
        time_taken,
        metrics
    )

    if not success:
        return jsonify({
            "message": message
        }), 403

    return jsonify({
        "message": message
    }), 201