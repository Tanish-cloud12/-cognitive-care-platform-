import { useEffect, useState } from "react";

import Button from "../components/Button";
import Card from "../components/Card";
import "./CaregiverDashboard.css";
const API_URL = import.meta.env.VITE_API_URL;
function CaregiverDashboard() {
    const [userId, setUserId] = useState("");
    const [message, setMessage] = useState("");

    const [patients, setPatients] = useState([]);
    const [patientAnalyses, setPatientAnalyses] = useState({});

    // Reminder states
    const [showReminders, setShowReminders] = useState(false);
    const [reminderType, setReminderType] = useState("medicine");
    const [reminderTitle, setReminderTitle] = useState("");
    const [reminderDate, setReminderDate] = useState("");
    const [reminderTime, setReminderTime] = useState("");
    const [reminderPatient, setReminderPatient] = useState("");

    // --------------------------------------------------
    // LOAD ANALYSIS FOR ONE PATIENT
    // --------------------------------------------------
    const loadPatientAnalysis = async (patientId) => {
        const token = localStorage.getItem("access_token");

        try {
            const response = await fetch(
                `${API_URL}/api/caregiver/patient/${patientId}/analysis`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                console.error(
                    `Could not load ${patientId}:`,
                    data.message
                );
                return;
            }

            setPatientAnalyses((prev) => ({
                ...prev,
                [patientId]: data,
            }));
        } catch (error) {
            console.error(error);
        }
    };

    // --------------------------------------------------
    // CHECK LOGIN + LOAD ALL PATIENTS
    // --------------------------------------------------
    useEffect(() => {
        const token = localStorage.getItem("access_token");
        const role = localStorage.getItem("role");

        if (!token || role !== "caregiver") {
            window.location.href = "/";
            return;
        }

        const loadDashboard = async () => {
            try {
                // Get logged-in caregiver
                const meResponse = await fetch(
                    `${API_URL}/api/auth/me`,
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const meData = await meResponse.json();

                if (
                    !meResponse.ok ||
                    meData.role !== "caregiver"
                ) {
                    localStorage.removeItem("access_token");
                    localStorage.removeItem("role");
                    window.location.href = "/";
                    return;
                }

                setUserId(meData.user_id);

                // Get all patients
                const patientsResponse = await fetch(
                    `${API_URL}/api/caregiver/patients`,
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const patientsData =
                    await patientsResponse.json();

                if (!patientsResponse.ok) {
                    setMessage(
                        patientsData.message ||
                        "Could not load patients"
                    );
                    return;
                }

                const patientList =
                    patientsData.patients || [];

                setPatients(patientList);

                // Automatically load every patient's analysis
                for (const patientId of patientList) {
                    await loadPatientAnalysis(patientId);
                }

            } catch (error) {
                console.error(error);
                setMessage("Unable to connect to server");
            }
        };

        loadDashboard();
    }, []);

    // --------------------------------------------------
    // REMINDERS
    // --------------------------------------------------
    const handleManageReminders = () => {
        if (patients.length === 0) {
            setMessage("No patients available.");
            return;
        }

        setMessage("");
        setShowReminders((prev) => !prev);

        // Automatically use first patient initially
        if (!reminderPatient) {
            setReminderPatient(patients[0]);
        }
    };

    const handleAddReminder = async (e) => {
        e.preventDefault();

        if (!reminderPatient) {
            setMessage("Please select a patient for the reminder.");
            return;
        }

        if (
            !reminderTitle ||
            !reminderDate ||
            !reminderTime
        ) {
            setMessage("Please fill all reminder fields.");
            return;
        }

        const token =
            localStorage.getItem("access_token");

        const reminderData = {
            patient_id: reminderPatient,
            type: reminderType,
            title: reminderTitle,
            date: reminderDate,
            time: reminderTime,
        };

        try {
            const response = await fetch(
                `${API_URL}/api/reminders`,
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
                    data.message ||
                    "Could not create reminder"
                );
                return;
            }

            setMessage(
                `Reminder added successfully for ${reminderPatient}`
            );

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

            {/* HEADER */}
            <header className="dashboard-header">
                <div className="header-container">

                    <div className="header-brand">
                        <div className="header-brand-mark">
                            C
                        </div>

                        <h2 className="header-title">
                            Cognitive Care
                        </h2>
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

            {/* MAIN */}
            <main className="dashboard-main">

                {/* WELCOME */}
                <section className="dashboard-welcome">

                    <h1>
                        Good morning,{" "}
                        {userId || "Caregiver"}
                    </h1>

                    <p>
                        Here&apos;s how your patients are
                        doing today.
                    </p>

                </section>

                {/* MESSAGE */}
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

                {/* ALL PATIENTS */}
                <Card>

                    <div className="card-title-row">
                        <h2 className="card-title">
                            All Patients
                        </h2>
                    </div>

                    <p className="card-desc">
                        View cognitive performance of all
                        patients.
                    </p>

                    {patients.length === 0 ? (

                        <div className="empty-patients">
                            <p>
                                No patients found.
                            </p>
                        </div>

                    ) : (

                        <div className="patient-chips">

                            {patients.map((patient) => {

                                const analysis =
                                    patientAnalyses[patient];

                                return (
                                    <div
                                        key={patient}
                                        className="patient-chip"
                                    >

                                        <div className="patient-chip-header">

                                            <span className="patient-chip-name">
                                                {patient}
                                            </span>

                                        </div>

                                        <span className="patient-chip-status">
                                            Patient data available
                                        </span>

                                    </div>
                                );

                            })}

                        </div>
                    )}

                </Card>

                {/* PATIENT PROGRESS */}
                <Card>

                    <h2 className="card-title">
                        Patient Progress
                    </h2>

                    <p className="card-desc">
                        Cognitive performance and
                        progress of all patients.
                    </p>

                    {patients.length === 0 ? (

                        <div className="no-selection-prompt">
                            No patient data available.
                        </div>

                    ) : (

                        <div>

                            {patients.map((patient) => {

                                const analysis =
                                    patientAnalyses[patient];

                                return (
                                    <div
                                        key={patient}
                                        style={{
                                            marginBottom: "30px",
                                        }}
                                    >

                                        <h3
                                            style={{
                                                marginBottom:
                                                    "15px",
                                            }}
                                        >
                                            Patient: {patient}
                                        </h3>

                                        {analysis ? (

                                            <div className="metrics-grid">

                                                <div className="metric-tile">

                                                    <span className="metric-label">
                                                        Games Played
                                                    </span>

                                                    <span className="metric-value">
                                                        {
                                                            analysis.games_played
                                                        }
                                                    </span>

                                                </div>

                                                <div className="metric-tile">

                                                    <span className="metric-label">
                                                        Average Score
                                                    </span>

                                                    <span className="metric-value">
                                                        {
                                                            analysis.average_score
                                                        }
                                                    </span>

                                                </div>

                                                <div className="metric-tile">

                                                    <span className="metric-label">
                                                        Accuracy
                                                    </span>

                                                    <span className="metric-value">
                                                        {
                                                            analysis.average_accuracy
                                                        }%
                                                    </span>

                                                </div>

                                                <div className="metric-tile">

                                                    <span className="metric-label">
                                                        Average Time
                                                    </span>

                                                    <span className="metric-value">
                                                        {
                                                            analysis.average_time
                                                        }s
                                                    </span>

                                                </div>

                                                <div className="metric-tile trend">

                                                    <span className="metric-label">
                                                        Trend
                                                    </span>

                                                    <span className="metric-value">
                                                        {
                                                            analysis.trend
                                                        }
                                                    </span>

                                                </div>

                                            </div>

                                        ) : (

                                            <div className="no-selection-prompt">
                                                Loading analysis...
                                            </div>

                                        )}

                                    </div>
                                );
                            })}

                        </div>
                    )}

                </Card>

                {/* REMINDERS */}
                {showReminders && patients.length > 0 && (

                    <Card className="reminder-form-card">

                        <div className="card-title-row">

                            <h2 className="card-title">
                                Add Reminder
                            </h2>

                            <button
                                type="button"
                                className="small-action-btn"
                                onClick={() =>
                                    setShowReminders(false)
                                }
                            >
                                Close Form
                            </button>

                        </div>

                        <p className="card-desc">
                            Schedule medicine or appointment
                            reminders.
                        </p>

                        <form
                            className="reminder-form"
                            onSubmit={handleAddReminder}
                        >

                            <div className="reminder-input-group">

                                <label htmlFor="reminderPatient">
                                    Patient
                                </label>

                                <select
                                    id="reminderPatient"
                                    className="reminder-select"
                                    value={reminderPatient}
                                    onChange={(e) =>
                                        setReminderPatient(
                                            e.target.value
                                        )
                                    }
                                >
                                    {patients.map((patient) => (
                                        <option
                                            key={patient}
                                            value={patient}
                                        >
                                            {patient}
                                        </option>
                                    ))}
                                </select>

                            </div>

                            <div className="reminder-input-group">

                                <label htmlFor="reminderType">
                                    Reminder Type
                                </label>

                                <select
                                    id="reminderType"
                                    className="reminder-select"
                                    value={reminderType}
                                    onChange={(e) =>
                                        setReminderType(
                                            e.target.value
                                        )
                                    }
                                >
                                    <option value="medicine">
                                        Medicine
                                    </option>

                                    <option value="appointment">
                                        Appointment
                                    </option>

                                </select>

                            </div>

                            <div className="reminder-input-group">

                                <label htmlFor="reminderTitle">
                                    Title / Description
                                </label>

                                <input
                                    id="reminderTitle"
                                    type="text"
                                    className="reminder-input"
                                    value={reminderTitle}
                                    onChange={(e) =>
                                        setReminderTitle(
                                            e.target.value
                                        )
                                    }
                                    placeholder="e.g. Take medicine"
                                    required
                                />

                            </div>

                            <div className="reminder-row">

                                <div className="reminder-input-group">

                                    <label htmlFor="reminderDate">
                                        Date
                                    </label>

                                    <input
                                        id="reminderDate"
                                        type="date"
                                        className="reminder-input"
                                        value={reminderDate}
                                        onChange={(e) =>
                                            setReminderDate(
                                                e.target.value
                                            )
                                        }
                                        required
                                    />

                                </div>

                                <div className="reminder-input-group">

                                    <label htmlFor="reminderTime">
                                        Time
                                    </label>

                                    <input
                                        id="reminderTime"
                                        type="time"
                                        className="reminder-input"
                                        value={reminderTime}
                                        onChange={(e) =>
                                            setReminderTime(
                                                e.target.value
                                            )
                                        }
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

                {/* QUICK ACTIONS */}
                <Card>

                    <h2 className="card-title">
                        Quick Actions
                    </h2>

                    <p className="card-desc">
                        Tools for patient care management.
                    </p>

                    <div className="quick-actions-grid">

                        <div className="quick-action-card">

                            <div className="quick-action-top">

                                <div>

                                    <h3 className="quick-action-title">
                                        AI Analysis
                                    </h3>

                                    <p className="quick-action-desc">
                                        View AI-generated summaries
                                        of patient performance.
                                    </p>

                                </div>

                                <span className="coming-soon-tag">
                                    Coming Soon
                                </span>

                            </div>

                            <Button
                                variant="secondary"
                                disabled
                            >
                                View AI Analysis
                            </Button>

                        </div>

                        <div className="quick-action-card">

                            <div className="quick-action-top">

                                <div>

                                    <h3 className="quick-action-title">
                                        Alerts
                                    </h3>

                                    <p className="quick-action-desc">
                                        Important patient alerts
                                        and notifications.
                                    </p>

                                </div>

                                <span className="coming-soon-tag">
                                    Coming Soon
                                </span>

                            </div>

                            <Button
                                variant="secondary"
                                disabled
                            >
                                View Alerts
                            </Button>

                        </div>

                        <div className="quick-action-card">

                            <div className="quick-action-top">

                                <div>

                                    <h3 className="quick-action-title">
                                        Reminders
                                    </h3>

                                    <p className="quick-action-desc">
                                        Add medicine and
                                        appointment reminders.
                                    </p>

                                </div>

                                <span className="selected-badge">
                                    Active
                                </span>

                            </div>

                            <Button
                                variant="secondary"
                                onClick={
                                    handleManageReminders
                                }
                            >
                                {showReminders
                                    ? "Close Reminders"
                                    : "Manage Reminders"}
                            </Button>

                        </div>

                    </div>

                </Card>

            </main>

        </div>
    );
}

export default CaregiverDashboard;