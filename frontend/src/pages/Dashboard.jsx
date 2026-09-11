import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import PatientReminders from "./PatientReminders";

import Button from "../components/Button";
import Card from "../components/Card";
import "./Dashboard.css";
const API_URL = import.meta.env.VITE_API_URL;
function Dashboard() {
    const [userId, setUserId] = useState("");
    const [sessionId, setSessionId] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const [analysis, setAnalysis] = useState(null);
    const [analysisLoading, setAnalysisLoading] = useState(false);

    const { t } = useLanguage();

    useEffect(() => {
        const token = localStorage.getItem("access_token");

        if (!token) {
            window.location.href = "/";
            return;
        }

        fetch(`${API_URL}/api/auth/me`, {
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

    const handleStartGame = async () => {
        const token = localStorage.getItem("access_token");

        setLoading(true);
        setMessage("");

        try {
            const response = await fetch(
                `${API_URL}/api/game/session`,
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
            sessionStorage.setItem("game_session_id", data.session_id);

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
        setMessage("");

        try {
            const response = await fetch(
                `${API_URL}/api/analysis`,
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
        localStorage.removeItem("role");
        window.location.href = "/";
    };

    return (
        <div className="patient-dashboard">

            {/* Top Navigation Header */}
            <header className="dashboard-header">
                <div className="header-container">
                    <div className="header-brand">
                        <div className="header-brand-mark">C</div>
                        <h2 className="header-title">
                            {t("dashboardTitle") || "Cognitive Care"}
                        </h2>
                    </div>

                    <div className="header-user">
                        <span className="patient-badge">
                            {t("patient") || "Patient"}: {userId || "..."}
                        </span>

                        <button
                            type="button"
                            className="logout-button"
                            onClick={handleLogout}
                        >
                            {t("logout") || "Logout"}
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="dashboard-main">

                {/* Friendly Welcome Greeting */}
                <section className="dashboard-welcome">
                    <h1>{t("welcome") || "Welcome"}, {userId || t("patient") || "Patient"}</h1>
                    <p>Here&apos;s what you can do today.</p>
                </section>

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

                {/* Section 1: Play & Practice (Primary Action) */}
                <Card className="play-card">
                    <h2 className="card-title">
                        {t("playGames") || "Play & Practice"}
                    </h2>
                    <p className="card-desc">
                        Keep your mind active with a short cognitive exercise.
                    </p>

                    <div className="play-action-area">
                        <Button
                            onClick={handleStartGame}
                            disabled={loading}
                        >
                            {loading ? "Starting Game..." : (t("playGames") || "Start a Game")}
                        </Button>

                        <Link to="/dashboard/games" style={{ textDecoration: "none" }}>
                            <Button variant="secondary">
                                Open Games Center →
                            </Button>
                        </Link>

                        {sessionId && (
                            <div className="session-info">
                                <span className="session-info-text">
                                    Game Session: <strong>{sessionId}</strong>
                                </span>
                                <span className="coming-soon-badge">Active</span>
                            </div>
                        )}
                    </div>
                </Card>

                {/* Section 2: My Progress */}
                <Card>
                    <h2 className="card-title">
                        {t("yourPerformance") || t("performance") || "My Progress"}
                    </h2>
                    <p className="card-desc">
                        Check your cognitive activity and performance history.
                    </p>

                    {analysis ? (
                        <div>
                            <div className="metrics-grid">
                                <div className="metric-tile">
                                    <span className="metric-label">{t("gamesPlayed") || "Games Played"}</span>
                                    <span className="metric-value">{analysis.games_played}</span>
                                </div>

                                <div className="metric-tile">
                                    <span className="metric-label">{t("averageScore") || "Average Score"}</span>
                                    <span className="metric-value">{analysis.average_score}</span>
                                </div>

                                <div className="metric-tile">
                                    <span className="metric-label">{t("averageAccuracy") || "Accuracy"}</span>
                                    <span className="metric-value">{analysis.average_accuracy}%</span>
                                </div>

                                <div className="metric-tile">
                                    <span className="metric-label">{t("averageTime") || "Average Time"}</span>
                                    <span className="metric-value">{analysis.average_time}s</span>
                                </div>

                                <div className="metric-tile trend">
                                    <span className="metric-label">{t("trend") || "Trend"}</span>
                                    <span className="metric-value">{analysis.trend}</span>
                                </div>
                            </div>

                            <Button
                                variant="secondary"
                                onClick={handleViewAnalysis}
                                disabled={analysisLoading}
                            >
                                {analysisLoading ? (t("loadingAnalysis") || "Loading Analysis...") : "Refresh Analysis"}
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
                                {analysisLoading ? (t("loadingAnalysis") || "Loading Analysis...") : (t("viewAnalysis") || "View Analysis")}
                            </Button>
                        </div>
                    )}
                </Card>

                {/* Section 3: Daily Reminders (Active Component from main) */}
                <Card>
                    <div className="card-title-row">
                        <h2 className="card-title">
                            {t("myReminders") || "Daily Reminders"}
                        </h2>
                        <Link to="/dashboard/reminders" style={{ textDecoration: "none" }}>
                            <button type="button" className="logout-button">
                                Manage Reminders →
                            </button>
                        </Link>
                    </div>
                    <p className="card-desc">
                        Manage medicine, hydration, activities and appointments.
                    </p>

                    <PatientReminders />
                </Card>

            </main>

        </div>
    );
}

export default Dashboard;