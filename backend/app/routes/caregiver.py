from flask import Blueprint, jsonify
from app.middleware.auth import role_required
from app.services.caregiver_service import get_caregiver_patients
from app.services.analysis_service import get_patient_analysis
from app.database.db import caregiver_patient_collection


caregiver_bp = Blueprint(
    "caregiver",
    __name__,
    url_prefix="/api/caregiver"
)



@caregiver_bp.route("/patients", methods=["GET"])
@role_required("caregiver")
def get_patients(user_id, role):

    patients = get_caregiver_patients(user_id)

    return jsonify({
        "patients": patients
    }), 200



@caregiver_bp.route("/patient/<patient_id>/analysis", methods=["GET"])
@role_required("caregiver")
def patient_analysis(user_id, role, patient_id):

    
    connection = caregiver_patient_collection.find_one({
        "caregiver_id": user_id,
        "patient_id": patient_id
    })

    if not connection:
        return jsonify({
            "message": "You are not connected to this patient"
        }), 403

    
    analysis = get_patient_analysis(patient_id)

    return jsonify(analysis), 200