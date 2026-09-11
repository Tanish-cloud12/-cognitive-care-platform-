from flask import Flask, send_from_directory, make_response
from flask_cors import CORS
from pathlib import Path

from app.routes.auth import auth_bp
from app.routes.game import game_bp
from app.routes.analysis import analysis_bp
from app.routes.caregiver import caregiver_bp
from app.routes.reminder_routes import reminder_bp
from app.routes.memory import memory_bp
from app.services.auth_service import health_check

def create_app():

    app = Flask(__name__)
    CORS(app)

    app.register_blueprint(auth_bp)
    app.register_blueprint(game_bp)
    app.register_blueprint(analysis_bp)
    app.register_blueprint(caregiver_bp)
    app.register_blueprint(reminder_bp)
    app.register_blueprint(memory_bp)

    # -----------------------------------------
    # Godot Web Game
    # -----------------------------------------

    public_folder = Path(__file__).resolve().parent.parent / "public" / "godot"

    @app.route("/game/")
    def godot_game():
        response = make_response(
            send_from_directory(public_folder, "index.html")
        )
        response.headers["Cache-Control"] = "no-store"
        return response

    @app.route("/game/<path:filename>")
    def godot_game_files(filename):

        response = make_response(
            send_from_directory(
                public_folder,
                filename
            )
        )

        # Correct MIME types for Godot Web
        if filename.endswith(".pck"):
            response.headers["Content-Type"] = "application/octet-stream"

        elif filename.endswith(".wasm"):
            response.headers["Content-Type"] = "application/wasm"

        elif filename.endswith(".js"):
            response.headers["Content-Type"] = "application/javascript"

        # Prevent browser from using the previous broken export
        response.headers["Cache-Control"] = "no-store"

        return response

    # -----------------------------------------
    # Basic routes
    # -----------------------------------------

    @app.route("/")
    def home():
        return {
            "message": "Cognitive Care Backend is running!!"
        }

    @app.route("/api/health")
    def health():
        return {
            "status": "ok"
        }

    @app.route("/api/master")
    def master():
        data = health_check()
        return data

    return app

