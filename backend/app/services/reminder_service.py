from uuid import uuid4

from app.database.db import (
    reminders_collection,
    caregiver_patient_collection
)


def create_reminder(
    caregiver_id,
    patient_id,
    reminder_type,
    title,
    date,
    time
):

    # Check caregiver is connected to this patient
    connection = caregiver_patient_collection.find_one({
        "caregiver_id": caregiver_id,
        "patient_id": patient_id
    })

    if not connection:
        return None, "Patient is not connected to this caregiver"

    reminder = {
        "reminder_id": str(uuid4()),
        "caregiver_id": caregiver_id,
        "patient_id": patient_id,
        "type": reminder_type,
        "title": title,
        "date": date,
        "time": time,
        "status": "pending"
    }

    reminders_collection.insert_one(reminder)

    return reminder, None


def get_patient_reminders(patient_id):

    reminders = reminders_collection.find({
        "patient_id": patient_id
    })

    result = []

    for reminder in reminders:
        result.append({
            "reminder_id": reminder["reminder_id"],
            "caregiver_id": reminder["caregiver_id"],
            "patient_id": reminder["patient_id"],
            "type": reminder["type"],
            "title": reminder["title"],
            "date": reminder["date"],
            "time": reminder["time"],
            "status": reminder["status"]
        })

    return result


def delete_reminder(caregiver_id, reminder_id):

    result = reminders_collection.delete_one({
        "reminder_id": reminder_id,
        "caregiver_id": caregiver_id
    })

    return result.deleted_count > 0