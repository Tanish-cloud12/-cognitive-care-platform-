import { useEffect, useState } from "react";

import Button from "../components/Button";
import Card from "../components/Card";
import "./Dashboard.css";

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
        <div className="patient-dashboard">

            {/* Top Navigation Header */}
            <header className="dashboard-header">
                <div className="header-container">
                    <div className="header-brand">
                        <div className="header-brand-mark">C</div>
                        <h2 className="header-title">Cognitive Care</h2>
                    </div>

                    <div className="header-user">
                        <span className="patient-badge">
                            Patient: {userId || "..."}
                        </span>

                        <button
                            type="button"
                            className="logout-button"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="dashboard-main">

                {/* Friendly Welcome Greeting */}
                <section className="dashboard-welcome">
                    <h1>Welcome, {userId || "Patient"}</h1>
                    <p>Here&apos;s what you can do today.</p>
                </section>

                {/* Section 1: Play & Practice (Primary Action) */}
                <Card className="play-card">
                    <h2 className="card-title">Play & Practice</h2>
                    <p className="card-desc">
                        Keep your mind active with a short cognitive exercise.
                    </p>

                    <div className="play-action-area">
                        <Button
                            onClick={handleStartGame}
                            disabled={loading}
                        >
                            {loading ? "Starting Game..." : "Start a Game"}
                        </Button>

                        {sessionId && (
                            <div className="session-info">
                                <span className="session-info-text">
                                    Game Session: <strong>{sessionId}</strong>
                                </span>
                                <span className="coming-soon-badge">Active</span>
                            </div>
                        )}

                        {message && (
                            <div
                                className={
                                    message.includes("successfully")
                                        ? "dashboard-message success"
                                        : "dashboard-message error"
                                }
                            >
                                {message}
                            </div>
                        )}
                    </div>
                </Card>

                {/* Section 2: My Progress */}
                <Card>
                    <h2 className="card-title">My Progress</h2>
                    <p className="card-desc">
                        Check your cognitive activity and performance history.
                    </p>

                    {analysis ? (
                        <div>
                            <div className="metrics-grid">
                                <div className="metric-tile">
                                    <span className="metric-label">Games Played</span>
                                    <span className="metric-value">{analysis.games_played}</span>
                                </div>

                                <div className="metric-tile">
                                    <span className="metric-label">Average Score</span>
                                    <span className="metric-value">{analysis.average_score}</span>
                                </div>

                                <div className="metric-tile">
                                    <span className="metric-label">Accuracy</span>
                                    <span className="metric-value">{analysis.average_accuracy}%</span>
                                </div>

                                <div className="metric-tile">
                                    <span className="metric-label">Average Time</span>
                                    <span className="metric-value">{analysis.average_time}s</span>
                                </div>

                                <div className="metric-tile trend">
                                    <span className="metric-label">Trend</span>
                                    <span className="metric-value">{analysis.trend}</span>
                                </div>
                            </div>

                            <Button
                                variant="secondary"
                                onClick={handleViewAnalysis}
                                disabled={analysisLoading}
                            >
                                {analysisLoading ? "Loading Analysis..." : "Refresh Analysis"}
                            </Button>
                        </div>
                    ) : (
                        <div className="progress-placeholder">
                            <p>See how you&apos;re doing</p>
                            <Button
                                variant="secondary"
                                onClick={handleViewAnalysis}
                                disabled={analysisLoading}
                            >
                                {analysisLoading ? "Loading Analysis..." : "View Analysis"}
                            </Button>
                        </div>
                    )}
                </Card>

                {/* Section 3: Daily Reminders (Stub / Placeholder) */}
                <Card>
                    <h2 className="card-title">Daily Reminders</h2>
                    <p className="card-desc">
                        Manage medicine, hydration, activities and appointments.
                    </p>

                    <div className="reminders-box">
                        <p>Your reminders will appear here.</p>
                        <span className="coming-soon-badge">Coming Soon</span>
                    </div>

                    <Button variant="secondary" disabled>
                        View Reminders
                    </Button>
                </Card>

            </main>

        </div>
    );
}

export default Dashboard;