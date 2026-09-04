from datetime import datetime

from app.database.db import (
    game_sessions_collection,
    game_results_collection
)


def save_game_result(
    session_id,
    user_id,
    game_type,
    score,
    mistakes,
    correct_answers,
    time_taken,
    metrics
):

    session = game_sessions_collection.find_one({
        "session_id": session_id,
        "user_id": user_id
    })

    if not session:
        return False, "Game session not found or does not belong to this patient"

    result = {
        "session_id": session_id,
        "user_id": user_id,
        "game_type": game_type,
        "score": score,
        "mistakes": mistakes,
        "correct_answers": correct_answers,
        "time_taken": time_taken,
        "metrics": metrics,
        "completed_at": datetime.utcnow()
    }

    game_results_collection.insert_one(result)

    game_sessions_collection.update_one(
        {
            "session_id": session_id,
            "user_id": user_id
        },
        {
            "$set": {
                "status": "completed",
                "ended_at": datetime.utcnow()
            }
        }
    )

    return True, "Game result saved successfully"