from app.database.db import caregiver_patient_collection


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


from app.database.db import (
    caregiver_patient_collection,
    game_results_collection
)


def get_patient_analysis_for_caregiver(
    caregiver_id,
    patient_id
):

    # Check if caregiver is connected to patient
    connection = caregiver_patient_collection.find_one({
        "caregiver_id": caregiver_id,
        "patient_id": patient_id
    })

    if not connection:
        return None, "Patient is not connected to this caregiver"


    # Get patient's game results
    results = list(
        game_results_collection.find({
            "user_id": patient_id
        })
    )

    if not results:
        return {
            "patient_id": patient_id,
            "games_played": 0,
            "average_score": 0,
            "average_accuracy": 0,
            "average_time": 0,
            "trend": "no_data"
        }, None


    games_played = len(results)

    total_score = 0
    total_accuracy = 0
    total_time = 0

    for result in results:

        total_score += result.get("score", 0)

        metrics = result.get("metrics", {})

        total_accuracy += metrics.get("accuracy", 0)

        total_time += result.get("time_taken", 0)


    average_score = total_score / games_played
    average_accuracy = total_accuracy / games_played
    average_time = total_time / games_played


    return {
        "patient_id": patient_id,
        "games_played": games_played,
        "average_score": round(average_score, 2),
        "average_accuracy": round(
            average_accuracy * 100,
            2
        ),
        "average_time": round(
            average_time,
            2
        ),
        "trend": "stable"
    }, None