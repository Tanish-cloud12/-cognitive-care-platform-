import uuid
from datetime import datetime

from app.database.db import game_sessions_collection


def create_game_session(user_id):

    session_id = str(uuid.uuid4())

    session = {
        "session_id": session_id,
        "user_id": user_id,
        "status": "started",
        "started_at": datetime.utcnow(),
        "ended_at": None
    }

    game_sessions_collection.insert_one(session)

    return session_id