from app.database.db import caregiver_patient_collection


def get_caregiver_patients(caregiver_id):

    connections = caregiver_patient_collection.find(
        {"caregiver_id": caregiver_id},
        {"_id": 0, "patient_id": 1}
    )

    return [
        connection["patient_id"]
        for connection in connections
    ]