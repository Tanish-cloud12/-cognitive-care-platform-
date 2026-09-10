from app.database.db import users_collection, caregiver_patient_collection
from app.utils.security import hash_password, verify_password, create_access_token


def register_user(user_id, password, role):

    existing_user = users_collection.find_one({
        "user_id": user_id
    })

    if existing_user:
        return False, "User ID already exists"

    hashed_password = hash_password(password)

    user = {
        "user_id": user_id,
        "password": hashed_password,
        "role": role
    }

    users_collection.insert_one(user)

    # Automatically connect every new patient
    # to the default demo caregiver C001
    if role == "patient":

        existing_connection = caregiver_patient_collection.find_one({
            "caregiver_id": "C001",
            "patient_id": user_id
        })

        if not existing_connection:
            caregiver_patient_collection.insert_one({
                "caregiver_id": "C001",
                "patient_id": user_id
            })

    return True, "User registered successfully"


def login_user(user_id, password, role):

    user = users_collection.find_one({
        "user_id": user_id,
        "role": role
    })

    if not user:
        return None, "Invalid ID or password"

    if not verify_password(password, user["password"]):
        return None, "Invalid ID or password"

    token = create_access_token(
        user["user_id"],
        user["role"]
    )

    return token, None