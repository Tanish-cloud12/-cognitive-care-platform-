import { useEffect, useState } from "react";

import Button from "../components/Button";
import Card from "../components/Card";
import "./CaregiverDashboard.css";

function CaregiverDashboard() {
    const [userId, setUserId] = useState("");
    const [message, setMessage] = useState("");

    const [patients, setPatients] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState("");
    const [analysis, setAnalysis] = useState(null);

    // Reminder states
    const [showReminders, setShowReminders] = useState(false);
    const [reminderType, setReminderType] = useState("medicine");
    const [reminderTitle, setReminderTitle] = useState("");
    const [reminderDate, setReminderDate] = useState("");
    const [reminderTime, setReminderTime] = useState("");

    // --------------------------------------------------
    // CHECK CAREGIVER LOGIN
    // --------------------------------------------------
    useEffect(() => {
        const token = localStorage.getItem("access_token");
        const role = localStorage.getItem("role");

        if (!token || role !== "caregiver") {
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
                if (data.user_id && data.role === "caregiver") {
                    setUserId(data.user_id);
                } else {
                    localStorage.removeItem("access_token");
                    localStorage.removeItem("role");
                    window.location.href = "/";
                }
            })
            .catch((error) => {
                console.error(error);
                setMessage("Unable to connect to server");
            });
    }, []);

    // --------------------------------------------------
    // LOAD CONNECTED PATIENTS
    // --------------------------------------------------
    const handleViewPatients = async () => {
        const token = localStorage.getItem("access_token");

        try {
            const response = await fetch(
                "http://127.0.0.1:5000/api/caregiver/patients",
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setMessage(
                    data.message || "Could not load patients"
                );
                return;
            }

            setPatients(data.patients);

            // Automatically select first patient if available
            if (data.patients.length > 0) {
                handleSelectPatient(data.patients[0]);
            }

        } catch (error) {
            console.error(error);
            setMessage("Unable to connect to server");
        }
    };

    // --------------------------------------------------
    // SELECT ONE PATIENT
    // --------------------------------------------------
    const handleSelectPatient = async (patientId) => {
        const token = localStorage.getItem("access_token");

        setSelectedPatient(patientId);

        // Clear previous patient's data
        setAnalysis(null);

        // Close reminder form when changing patient
        setShowReminders(false);
        setMessage("");

        try {
            const response = await fetch(
                `http://127.0.0.1:5000/api/caregiver/patient/${patientId}/analysis`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setMessage(
                    data.message || "Could not load patient data"
                );
                return;
            }

            setAnalysis(data);

        } catch (error) {
            console.error(error);
            setMessage("Unable to connect to server");
        }
    };

    // --------------------------------------------------
    // OPEN / TOGGLE REMINDER SECTION
    // --------------------------------------------------
    const handleManageReminders = () => {
        if (!selectedPatient) {
            setMessage("Please select a patient first.");
            return;
        }

        setMessage("");
        setShowReminders((prev) => !prev);
    };

    // --------------------------------------------------
    // ADD REMINDER
    // --------------------------------------------------
    const handleAddReminder = async (e) => {
        e.preventDefault();

        // Make sure patient is selected
        if (!selectedPatient) {
            setMessage("Please select a patient first.");
            return;
        }

        // Validate fields
        if (!reminderTitle || !reminderDate || !reminderTime) {
            setMessage("Please fill all reminder fields.");
            return;
        }

        const token = localStorage.getItem("access_token");

        const reminderData = {
            patient_id: selectedPatient,
            type: reminderType,
            title: reminderTitle,
            date: reminderDate,
            time: reminderTime,
        };

        try {
            const response = await fetch(
                "http://127.0.0.1:5000/api/reminders",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(reminderData),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setMessage(
                    data.message || "Could not create reminder"
                );
                return;
            }

            // Success message
            setMessage(
                `Reminder added successfully for ${selectedPatient}`
            );

            // Clear form
            setReminderTitle("");
            setReminderDate("");
            setReminderTime("");

        } catch (error) {
            console.error(error);
            setMessage("Unable to connect to server");
        }
    };

    // --------------------------------------------------
    // LOGOUT
    // --------------------------------------------------
    const handleLogout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("role");
        window.location.href = "/";
    };

    return (
        <div className="caregiver-dashboard">

            {/* Top Navigation Header */}
            <header className="dashboard-header">
                <div className="header-container">
                    <div className="header-brand">
                        <div className="header-brand-mark">C</div>
                        <h2 className="header-title">Cognitive Care</h2>
                    </div>

                    <div className="header-user">
                        <span className="caregiver-badge">
                            Caregiver: {userId || "..."}
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
                    <h1>Good morning, {userId || "Caregiver"}</h1>
                    <p>Here&apos;s how your patients are doing today.</p>
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

                {/* Patient Selection Card */}
                <Card>
                    <div className="card-title-row">
                        <h2 className="card-title">Your Patients</h2>
                        <button
                            type="button"
                            className="small-action-btn"
                            onClick={handleViewPatients}
                        >
                            {patients.length > 0 ? "Refresh Patients" : "Load Patients"}
                        </button>
                    </div>

                    <p className="card-desc">
                        Select a connected patient to view their cognitive progress and performance history.
                    </p>

                    {patients.length > 0 ? (
                        <div className="patient-chips">
                            {patients.map((patient) => {
                                const isSelected = selectedPatient === patient;
                                return (
                                    <button
                                        key={patient}
                                        type="button"
                                        className={
                                            isSelected
                                                ? "patient-chip selected"
                                                : "patient-chip"
                                        }
                                        onClick={() => handleSelectPatient(patient)}
                                    >
                                        <div className="patient-chip-header">
                                            <span className="patient-chip-name">
                                                {patient}
                                            </span>
                                            {isSelected && (
                                                <span className="selected-badge">
                                                    Active
                                                </span>
                                            )}
                                        </div>
                                        <span className="patient-chip-status">
                                            {isSelected
                                                ? "Currently selected"
                                                : "Click to view metrics"}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="empty-patients">
                            <p>No connected patients loaded yet.</p>
                            <Button
                                variant="secondary"
                                onClick={handleViewPatients}
                            >
                                View Patients
                            </Button>
                        </div>
                    )}
                </Card>

                {/* Selected Patient & Cognitive Progress */}
                <Card>
                    <h2 className="card-title">Patient Progress</h2>
                    <p className="card-desc">
                        Detailed cognitive metrics and trend monitoring for the selected patient.
                    </p>

                    {selectedPatient ? (
                        <div>
                            <div className="viewing-banner">
                                <span className="viewing-banner-text">
                                    Currently viewing: <strong>{selectedPatient}</strong>
                                </span>
                                <span className="selected-badge">Selected Patient</span>
                            </div>

                            {analysis ? (
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
                            ) : (
                                <div className="no-selection-prompt">
                                    Loading cognitive analysis for {selectedPatient}...
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="no-selection-prompt">
                            Select a patient above to review their cognitive performance.
                        </div>
                    )}
                </Card>

                {/* Reminder Management Panel (When Open & Patient Selected) */}
                {showReminders && selectedPatient && (
                    <Card className="reminder-form-card">
                        <div className="card-title-row">
                            <h2 className="card-title">
                                Add Reminder for {selectedPatient}
                            </h2>
                            <button
                                type="button"
                                className="small-action-btn"
                                onClick={() => setShowReminders(false)}
                            >
                                Close Form
                            </button>
                        </div>

                        <p className="card-desc">
                            Schedule medicine or appointment reminders for this patient.
                        </p>

                        <form className="reminder-form" onSubmit={handleAddReminder}>
                            <div className="reminder-input-group">
                                <label htmlFor="reminderType">Reminder Type</label>
                                <select
                                    id="reminderType"
                                    className="reminder-select"
                                    value={reminderType}
                                    onChange={(e) => setReminderType(e.target.value)}
                                >
                                    <option value="medicine">Medicine</option>
                                    <option value="appointment">Appointment</option>
                                </select>
                            </div>

                            <div className="reminder-input-group">
                                <label htmlFor="reminderTitle">Title / Description</label>
                                <input
                                    id="reminderTitle"
                                    type="text"
                                    className="reminder-input"
                                    value={reminderTitle}
                                    onChange={(e) => setReminderTitle(e.target.value)}
                                    placeholder={
                                        reminderType === "medicine"
                                            ? "e.g. Take Blood Pressure Pill"
                                            : "e.g. Neurologist Appointment"
                                    }
                                    required
                                />
                            </div>

                            <div className="reminder-row">
                                <div className="reminder-input-group">
                                    <label htmlFor="reminderDate">Date</label>
                                    <input
                                        id="reminderDate"
                                        type="date"
                                        className="reminder-input"
                                        value={reminderDate}
                                        onChange={(e) => setReminderDate(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="reminder-input-group">
                                    <label htmlFor="reminderTime">Time</label>
                                    <input
                                        id="reminderTime"
                                        type="time"
                                        className="reminder-input"
                                        value={reminderTime}
                                        onChange={(e) => setReminderTime(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <Button type="submit">
                                Add Reminder
                            </Button>
                        </form>
                    </Card>
                )}

                {/* Quick Actions */}
                <Card>
                    <h2 className="card-title">Quick Actions</h2>
                    <p className="card-desc">
                        Additional tools, predictive insights, and alerts for care management.
                    </p>

                    <div className="quick-actions-grid">
                        <div className="quick-action-card">
                            <div className="quick-action-top">
                                <div>
                                    <h3 className="quick-action-title">AI Analysis</h3>
                                    <p className="quick-action-desc">
                                        View AI-generated summaries of patient cognitive performance.
                                    </p>
                                </div>
                                <span className="coming-soon-tag">Coming Soon</span>
                            </div>
                            <Button variant="secondary" disabled>
                                View AI Analysis
                            </Button>
                        </div>

                        <div className="quick-action-card">
                            <div className="quick-action-top">
                                <div>
                                    <h3 className="quick-action-title">Alerts</h3>
                                    <p className="quick-action-desc">
                                        Important patient cognitive alerts and safety notifications.
                                    </p>
                                </div>
                                <span className="coming-soon-tag">Coming Soon</span>
                            </div>
                            <Button variant="secondary" disabled>
                                View Alerts
                            </Button>
                        </div>

                        <div className="quick-action-card">
                            <div className="quick-action-top">
                                <div>
                                    <h3 className="quick-action-title">Reminders</h3>
                                    <p className="quick-action-desc">
                                        Add and schedule medicine and appointment reminders for patients.
                                    </p>
                                </div>
                                <span className="selected-badge">Active</span>
                            </div>
                            <Button
                                variant="secondary"
                                onClick={handleManageReminders}
                            >
                                {showReminders ? "Close Reminders" : "Manage Reminders"}
                            </Button>
                        </div>
                    </div>
                </Card>

            </main>

        </div>
    );
}

export default CaregiverDashboard;