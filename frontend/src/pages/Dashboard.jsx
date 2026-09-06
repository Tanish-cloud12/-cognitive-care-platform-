import { useEffect, useState } from "react";
import PatientReminders from "./PatientReminders";

function Dashboard() {
    const [userId, setUserId] = useState("");
    const [analysis, setAnalysis] = useState(null);
    const [analysisLoading, setAnalysisLoading] = useState(false);
    const [message, setMessage] = useState("");

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
                setMessage("Unable to load user information");
            });
    }, []);

    const handleViewAnalysis = async () => {
        const token = localStorage.getItem("access_token");

        setAnalysisLoading(true);
        setMessage("");

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

    return (
        <div>
            <h1>Cognitive Care Dashboard</h1>

            <h2>Welcome</h2>

            <p>
                Patient: {userId}
            </p>

            <hr />

            <h3>Performance</h3>

            <button
                onClick={handleViewAnalysis}
                disabled={analysisLoading}
            >
                {analysisLoading
                    ? "Loading Analysis..."
                    : "View Analysis"}
            </button>

            {message && <p>{message}</p>}

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
                     <hr />

            <PatientReminders />
                </div>
            )}
        </div>
    );
}

export default Dashboard;
