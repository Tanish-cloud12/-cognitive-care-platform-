from flask import Blueprint, jsonify

from app.middleware.auth import token_required
from app.services.analysis_service import get_patient_analysis


analysis_bp = Blueprint(
    "analysis",
    __name__,
    url_prefix="/api/analysis"
)


@analysis_bp.route("", methods=["GET"])
@token_required
def get_analysis(user_id):

    analysis = get_patient_analysis(user_id)

    return jsonify(analysis), 200