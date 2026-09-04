import { useEffect, useState } from "react";

function Dashboard() {
    
    const [userId, setUserId] = useState("");
    const [sessionId, setSessionId] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const [analysis, setAnalysis] = useState(null);
    const [analysisLoading, setAnalysisLoading] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("access_token");

        if (!token) {
            window.location.href = "/";
            return;
        }

        fetch("http://127.0.0.1:5000/api/auth/me", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.user_id) {
                    setUserId(data.user_id);
                } else {
                    localStorage.removeItem("access_token");
                    window.location.href = "/";
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    const handleStartGame = async () => {
        const token = localStorage.getItem("access_token");

        setLoading(true);
        setMessage("");

        try {
            const response = await fetch(
                "http://127.0.0.1:5000/api/game/session",
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setMessage(data.message || "Could not start game");
                setLoading(false);
                return;
            }

            setSessionId(data.session_id);

            setMessage("Game session created successfully!");

            console.log("Session ID:", data.session_id);

        } catch (error) {
            console.error(error);
            setMessage("Unable to connect to server");
        }

        setLoading(false);
    };

    const handleViewAnalysis = async () => {
        const token = localStorage.getItem("access_token");

        setAnalysisLoading(true);

        try {
            const response = await fetch(
                "http://127.0.0.1:5000/api/analysis",
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setMessage(data.message || "Could not load analysis");
                setAnalysisLoading(false);
                return;
            }

            setAnalysis(data);

        } catch (error) {
            console.error(error);
            setMessage("Unable to connect to server");
        }

        setAnalysisLoading(false);
    };

    const handleLogout = () => {
        localStorage.removeItem("access_token");
        window.location.href = "/";
    };

    return (
        <div>
            <h1>Cognitive Care Dashboard</h1>

            <h2>Welcome</h2>

            <p>
                Patient: {userId}
            </p>

            <hr />

            <h3>Game</h3>

            <button
                onClick={handleStartGame}
                disabled={loading}
            >
                {loading ? "Starting Game..." : "Start Game"}
            </button>

            {message && (
                <p>{message}</p>
            )}

            <h3>Performance</h3>

            <button
                onClick={handleViewAnalysis}
                disabled={analysisLoading}
            >
                {analysisLoading ? "Loading Analysis..." : "View Analysis"}
            </button>

            {analysis && (
                <div>
                    <h4>Your Performance</h4>

                    <p>
                        Games Played: {analysis.games_played}
                    </p>

                    <p>
                        Average Score: {analysis.average_score}
                    </p>

                    <p>
                        Average Accuracy: {analysis.average_accuracy}%
                    </p>

                    <p>
                        Average Time: {analysis.average_time} seconds
                    </p>

                    <p>
                        Trend: {analysis.trend}
                    </p>
                </div>
            )}

            <h3>Reminders</h3>

            <button>
                View Reminders
            </button>

            <br />
            <br />

            <button onClick={handleLogout}>
                Logout
            </button>
        </div>
    );
}

export default Dashboard;