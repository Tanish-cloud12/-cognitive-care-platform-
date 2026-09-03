from app.database.db import users_collection

from app.utils.security import (
    hash_password,
    verify_password,
    create_access_token
)


def register_user(patient_id, password):

    existing_user = users_collection.find_one({
        "patient_id": patient_id
    })

    if existing_user:
        return False, "Patient ID already exists"

    hashed_password = hash_password(password)

    user = {
        "patient_id": patient_id,
        "password": hashed_password
    }

    users_collection.insert_one(user)

    return True, "Patient registered successfully"


def login_user(patient_id, password):

    # Find patient
    user = users_collection.find_one({
        "patient_id": patient_id
    })

    if not user:
        return None, "Invalid patient ID or password"

    # Check password
    if not verify_password(
        password,
        user["password"]
    ):
        return None, "Invalid patient ID or password"

    # Create JWT
    token = create_access_token(
    user["patient_id"]
)

    return token, None