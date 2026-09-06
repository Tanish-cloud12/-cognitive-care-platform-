import React, { useState } from "react";

function PatientGames() {
    const [loading, setLoading] = useState(false);

    const handleStartGame = async () => {
        if (loading) {
            return;
        }

        try {
            setLoading(true);

            // Get JWT saved during login
            const token = localStorage.getItem("access_token");

            // Check if user is logged in
            if (!token) {
                alert("Please login again.");
                return;
            }

            // Create game session
            const response = await fetch(
                "http://localhost:5000/api/game/session",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            // Handle backend error
            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to create game session"
                );
            }

            // Check session ID
            if (!data.session_id) {
                throw new Error(
                    "Game session ID was not returned by the server."
                );
            }

            console.log(
                "Game session created:",
                data.session_id
            );

            // Store session ID temporarily
            sessionStorage.setItem(
                "game_session_id",
                data.session_id
            );

            alert(
                `Game started!\nSession ID: ${data.session_id}`
            );

            // Godot integration will be added here later.
            // Godot will receive this session ID.

        } catch (error) {
            console.error(
                "Error starting game:",
                error
            );

            alert(
                error.message ||
                "Unable to start game"
            );

        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>Play Game</h1>

            <p>
                Ready to play?
            </p>

            <button
                onClick={handleStartGame}
                disabled={loading}
            >
                {loading
                    ? "Starting..."
                    : "Start Game"
                }
            </button>
        </div>
    );
}

export default PatientGames;