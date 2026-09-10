from app.database.db import caregiver_patient_collection
from app.services.analysis_service import get_patient_analysis


def connect_patient(caregiver_id, patient_id):

    existing_connection = caregiver_patient_collection.find_one({
        "caregiver_id": caregiver_id,
        "patient_id": patient_id
    })

    if existing_connection:
        return False, "Patient is already connected"

    connection = {
        "caregiver_id": caregiver_id,
        "patient_id": patient_id
    }

    caregiver_patient_collection.insert_one(connection)

    return True, "Patient connected successfully"


def get_caregiver_patients(caregiver_id):

    connections = caregiver_patient_collection.find({
        "caregiver_id": caregiver_id
    })

    patients = []

    for connection in connections:
        patients.append(connection["patient_id"])

    return patients


def get_patient_analysis_for_caregiver(
    caregiver_id,
    patient_id
):

    # Check whether this caregiver is connected
    # to the requested patient.

    connection = caregiver_patient_collection.find_one({
        "caregiver_id": caregiver_id,
        "patient_id": patient_id
    })

    if not connection:
        return None, "Patient is not connected to this caregiver"

    # Reuse the same analysis used by the patient side.
    analysis = get_patient_analysis(patient_id)

    # Add patient ID for caregiver dashboard
    analysis["patient_id"] = patient_id

    return analysis, None