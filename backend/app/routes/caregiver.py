from flask import Blueprint, request, jsonify

from app.middleware.auth import role_required

from app.services.caregiver_service import (
    connect_patient,
    get_caregiver_patients,
    get_patient_analysis_for_caregiver
)


caregiver_bp = Blueprint(
    "caregiver",
    __name__,
    url_prefix="/api/caregiver"
)


@caregiver_bp.route("/connect", methods=["POST"])
@role_required("caregiver")
def connect(user_id, role):

    data = request.get_json()

    patient_id = data.get("patient_id")

    if not patient_id:
        return jsonify({
            "message": "Patient ID is required"
        }), 400

    # user_id comes from the JWT
    caregiver_id = user_id

    success, message = connect_patient(
        caregiver_id,
        patient_id
    )

    if not success:
        return jsonify({
            "message": message
        }), 409

    return jsonify({
        "message": message
    }), 201


@caregiver_bp.route("/patients", methods=["GET"])
@role_required("caregiver")
def get_patients(user_id, role):

    patients = get_caregiver_patients(user_id)

    return jsonify({
        "patients": patients
    }), 200


@caregiver_bp.route(
    "/patient/<patient_id>/analysis",
    methods=["GET"]
)
@role_required("caregiver")
def patient_analysis(user_id, role, patient_id):

    analysis, error = get_patient_analysis_for_caregiver(
        user_id,
        patient_id
    )

    if error:
        return jsonify({
            "message": error
        }), 403

    return jsonify(analysis), 200