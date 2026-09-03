from flask import Flask
from flask_cors import CORS

from app.routes.auth import auth_bp
from app.routes.game import game_bp
from app.routes.analysis import analysis_bp


def create_app():

    app = Flask(__name__)

    CORS(app)

    app.register_blueprint(auth_bp)

    app.register_blueprint(game_bp)
    app.register_blueprint(analysis_bp)

    @app.route("/")
    def home():
        return {
            "message": "Cognitive Care Backend is running!"
        }

    @app.route("/api/health")
    def health():
        return {
            "status": "ok"
        }

    return app