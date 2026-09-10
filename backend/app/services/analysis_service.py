from app.database.db import (
    game_results_collection,
    game_sessions_collection
)


def calculate_trend(values, higher_is_better=True):

    if len(values) < 2:
        return "stable"

    midpoint = len(values) // 2

    first_half = values[:midpoint]
    second_half = values[midpoint:]

    first_average = sum(first_half) / len(first_half)
    second_average = sum(second_half) / len(second_half)

    difference = second_average - first_average

    
    if abs(difference) < 0.05:
        return "stable"

    if higher_is_better:
        return "improving" if difference > 0 else "declining"

    return "improving" if difference < 0 else "declining"


def get_patient_analysis(user_id):

    results = list(
        game_results_collection.find(
            {"user_id": user_id},
            {"_id": 0}
        ).sort("completed_at", 1)
    )

    if not results:
        return {
            "games_played": 0,
            "average_score": 0,
            "average_accuracy": 0,
            "average_time": 0,
            "total_hints_used": 0,
            "total_replays_used": 0,
            "completion_rate": 0,
            "accuracy_trend": "no_data",
            "response_time_trend": "no_data",
            "weekly_cognitive_score": 0,
            "weekly_trend": "no_data",
            "per_game_analysis": {}
        }

    games_played = len(results)

    total_score = 0
    total_accuracy = 0
    total_time = 0
    total_hints = 0
    total_replays = 0

    accuracy_values = []
    time_values = []

    per_game = {}

    for result in results:

        score = result.get("score", 0) or 0
        time_taken = result.get("time_taken", 0) or 0

        metrics = result.get("metrics", {}) or {}

        accuracy = metrics.get("accuracy", 0) or 0
        hints_used = metrics.get("hints_used", 0) or 0
        replays_used = metrics.get("replays_used", 0) or 0

        total_score += score
        total_accuracy += accuracy
        total_time += time_taken
        total_hints += hints_used
        total_replays += replays_used

        accuracy_values.append(accuracy)
        time_values.append(time_taken)

        game_type = result.get(
            "game_type",
            "unknown"
        )

        if game_type not in per_game:

            per_game[game_type] = {
                "games_played": 0,
                "total_score": 0,
                "total_accuracy": 0,
                "total_time": 0
            }

        per_game[game_type]["games_played"] += 1
        per_game[game_type]["total_score"] += score
        per_game[game_type]["total_accuracy"] += accuracy
        per_game[game_type]["total_time"] += time_taken

    average_score = total_score / games_played
    average_accuracy = total_accuracy / games_played
    average_time = total_time / games_played

    accuracy_trend = calculate_trend(
        accuracy_values,
        higher_is_better=True
    )

    response_time_trend = calculate_trend(
        time_values,
        higher_is_better=False
    )

    

    total_sessions = game_sessions_collection.count_documents({
        "user_id": user_id
    })

    completed_sessions = game_sessions_collection.count_documents({
        "user_id": user_id,
        "status": "completed"
    })

    if total_sessions > 0:
        completion_rate = (
            completed_sessions / total_sessions
        ) * 100
    else:
        completion_rate = 0

    

    accuracy_component = average_accuracy * 100

    
    completion_component = completion_rate

    
    total_assistance = total_hints + total_replays

    assistance_component = max(
        0,
        100 - (total_assistance * 5)
    )

    
    if average_time <= 30:
        time_component = 100
    elif average_time <= 60:
        time_component = 80
    elif average_time <= 90:
        time_component = 60
    else:
        time_component = 40

    weekly_cognitive_score = (
        (accuracy_component * 0.40)
        + (time_component * 0.20)
        + (assistance_component * 0.20)
        + (completion_component * 0.20)
    )

    weekly_cognitive_score = round(
        weekly_cognitive_score,
        2
    )

    

    if (
        accuracy_trend == "improving"
        and response_time_trend in ["improving", "stable"]
    ):
        weekly_trend = "Improving"

    elif (
        accuracy_trend == "declining"
        or response_time_trend == "declining"
    ):
        weekly_trend = "Declining"

    else:
        weekly_trend = "Stable"

   

    for game_type, data in per_game.items():

        count = data["games_played"]

        per_game[game_type] = {
            "games_played": count,
            "average_score": round(
                data["total_score"] / count,
                2
            ),
            "average_accuracy": round(
                (data["total_accuracy"] / count) * 100,
                2
            ),
            "average_time": round(
                data["total_time"] / count,
                2
            )
        }

    return {
        "games_played": games_played,
        "average_score": round(
            average_score,
            2
        ),
        "average_accuracy": round(
            average_accuracy * 100,
            2
        ),
        "average_time": round(
            average_time,
            2
        ),
        "total_hints_used": total_hints,
        "total_replays_used": total_replays,
        "completion_rate": round(
            completion_rate,
            2
        ),
        "accuracy_trend": accuracy_trend,
        "response_time_trend": response_time_trend,
        "weekly_cognitive_score": weekly_cognitive_score,
        "weekly_trend": weekly_trend,
        "per_game_analysis": per_game
    }