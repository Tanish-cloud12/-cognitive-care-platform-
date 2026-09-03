from app.database.db import game_results_collection


def get_patient_analysis(user_id):

    results = list(
        game_results_collection.find({
            "user_id": user_id
        })
    )

    if not results:
        return {
            "games_played": 0,
            "average_score": 0,
            "average_accuracy": 0,
            "average_time": 0,
            "trend": "no_data"
        }

    games_played = len(results)

    total_score = 0
    total_accuracy = 0
    total_time = 0

    for result in results:

        total_score += result.get("score", 0)

        metrics = result.get("metrics", {})

        accuracy = metrics.get("accuracy", 0)

        total_accuracy += accuracy

        total_time += result.get("time_taken", 0)

    average_score = total_score / games_played
    average_accuracy = total_accuracy / games_played
    average_time = total_time / games_played

    return {
        "games_played": games_played,
        "average_score": round(average_score, 2),
        "average_accuracy": round(average_accuracy * 100, 2),
        "average_time": round(average_time, 2),
        "trend": "stable"
    }