from flask import Blueprint, request, jsonify

from app.middleware.auth import role_required

from app.services.reminder_service import (
    create_reminder,
    get_patient_reminders,
    delete_reminder
)

reminder_bp = Blueprint(
    "reminder",
    __name__,
    url_prefix="/api/reminders"
)


# CAREGIVER: CREATE REMINDER
@reminder_bp.route("", methods=["POST"])
@role_required("caregiver")
def add_reminder(user_id, role):

    data = request.get_json()

    patient_id = data.get("patient_id")
    reminder_type = data.get("type")
    title = data.get("title")
    date = data.get("date")
    time = data.get("time")

    if not patient_id:
        return jsonify({
            "message": "Patient ID is required"
        }), 400

    if reminder_type not in ["medicine", "appointment"]:
        return jsonify({
            "message": "Reminder type must be medicine or appointment"
        }), 400

    if not title:
        return jsonify({
            "message": "Reminder title is required"
        }), 400

    if not date:
        return jsonify({
            "message": "Reminder date is required"
        }), 400

    if not time:
        return jsonify({
            "message": "Reminder time is required"
        }), 400

    reminder = create_reminder(
        caregiver_id=user_id,
        patient_id=patient_id,
        reminder_type=reminder_type,
        title=title,
        date=date,
        time=time
    )

    return jsonify({
        "message": "Reminder created successfully",
        "reminder": reminder
    }), 201


# PATIENT: GET THEIR OWN REMINDERS
@reminder_bp.route("/patient", methods=["GET"])
@role_required("patient")
def patient_reminders(user_id, role):

    reminders = get_patient_reminders(user_id)

    return jsonify({
        "reminders": reminders
    }), 200


# CAREGIVER: DELETE REMINDER
@reminder_bp.route("/<reminder_id>", methods=["DELETE"])
@role_required("caregiver")
def remove_reminder(user_id, role, reminder_id):

    success = delete_reminder(
        caregiver_id=user_id,
        reminder_id=reminder_id
    )

    if not success:
        return jsonify({
            "message": "Reminder not found"
        }), 404

    return jsonify({
        "message": "Reminder deleted successfully"
    }), 200