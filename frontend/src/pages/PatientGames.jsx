import React, { useState } from "react";
import { Gamepad2, Play, Sparkles, HeartHandshake } from "lucide-react";
import "./PatientGames.css";

function PatientGames() {
    const [loading, setLoading] = useState(false);
    const [activeSessionId, setActiveSessionId] = useState(() => {
        return sessionStorage.getItem("game_session_id") || null;
    });

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
            setActiveSessionId(data.session_id);

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
        <div className="patient-games-page">
            {/* Welcoming Page Header */}
            <header className="games-page-header">
                <div className="games-header-badge">
                    <Sparkles size={18} className="games-badge-icon" aria-hidden="true" />
                    <span>Cognitive Activity</span>
                </div>
                <h1 className="games-page-title">Let&apos;s Keep Your Mind Active</h1>
                <p className="games-page-subtitle">
                    Take a few minutes to play and exercise your memory.
                </p>
            </header>

            {/* Primary Available Game Card */}
            <section className="games-card-primary" aria-labelledby="primary-game-title">
                <div className="game-card-header">
                    <div className="game-icon-container" aria-hidden="true">
                        <Gamepad2 size={40} />
                    </div>
                    <div className="game-title-group">
                        <span className="game-tag">Memory & Focus Exercise</span>
                        <h2 id="primary-game-title" className="game-title">
                            Daily Mind & Memory Game
                        </h2>
                        <p className="game-description">
                            A gentle, enjoyable activity crafted to exercise your memory, attention, and cognitive agility at your own comfortable pace.
                        </p>
                    </div>
                </div>

                {/* Clear features */}
                <div className="game-highlights">
                    <div className="highlight-item">
                        <span className="highlight-icon" aria-hidden="true">⏱️</span>
                        <div>
                            <strong>No Pressure</strong>
                            <span>Take all the time you need</span>
                        </div>
                    </div>
                    <div className="highlight-item">
                        <span className="highlight-icon" aria-hidden="true">🧠</span>
                        <div>
                            <strong>Brain Exercise</strong>
                            <span>Supports daily mental wellness</span>
                        </div>
                    </div>
                    <div className="highlight-item">
                        <span className="highlight-icon" aria-hidden="true">✨</span>
                        <div>
                            <strong>Easy to Play</strong>
                            <span>Simple, large, and clear steps</span>
                        </div>
                    </div>
                </div>

                {/* Primary Action Button & Status */}
                <div className="game-action-row">
                    <button
                        type="button"
                        className="game-start-button"
                        onClick={handleStartGame}
                        disabled={loading}
                        aria-label={loading ? "Starting game session" : "Start Game"}
                    >
                        <Play size={24} className="button-icon" aria-hidden="true" />
                        <span>{loading ? "Starting Your Session..." : "Start Game"}</span>
                    </button>

                    {activeSessionId && (
                        <div className="game-session-active" role="status">
                            <span className="active-dot" aria-hidden="true"></span>
                            <span className="session-label">
                                Active Game Session: <strong>{activeSessionId}</strong>
                            </span>
                            <span className="active-badge">Active</span>
                        </div>
                    )}
                </div>
            </section>

            {/* Reassuring Guidance & Balance Section */}
            <section className="games-tips-section" aria-labelledby="tips-heading">
                <div className="tips-card">
                    <div className="tips-header">
                        <div className="tips-icon-badge" aria-hidden="true">
                            <HeartHandshake size={26} />
                        </div>
                        <div>
                            <h2 id="tips-heading" className="tips-title">Helpful Tips Before You Begin</h2>
                            <p className="tips-subtitle">Keep these simple reminders in mind for a pleasant experience:</p>
                        </div>
                    </div>

                    <div className="tips-grid">
                        <div className="tip-item">
                            <div className="tip-number">1</div>
                            <div className="tip-content">
                                <strong>Find a quiet, comfortable space</strong>
                                <p>Sit where you feel relaxed, with good lighting and few distractions around you.</p>
                            </div>
                        </div>

                        <div className="tip-item">
                            <div className="tip-number">2</div>
                            <div className="tip-content">
                                <strong>Go at your own pace</strong>
                                <p>There is no rush or time limit. You can pause or rest whenever you like.</p>
                            </div>
                        </div>

                        <div className="tip-item">
                            <div className="tip-number">3</div>
                            <div className="tip-content">
                                <strong>Every minute helps</strong>
                                <p>Simply exercising your memory each day is a wonderful achievement for your brain.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default PatientGames;