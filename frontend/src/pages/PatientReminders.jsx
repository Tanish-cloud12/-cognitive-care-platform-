import { useEffect, useState } from "react";
import { Bell, Pill, Calendar, Clock, AlertCircle } from "lucide-react";
import "./PatientReminders.css";
const API_URL = import.meta.env.VITE_API_URL;
function PatientReminders() {
    const [reminders, setReminders] = useState([]);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReminders = async () => {
            const token = localStorage.getItem("access_token");

            try {
                const response = await fetch(
                   `${API_URL}/api/reminders/patient`,
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
                        data.message || "Could not load reminders"
                    );
                    return;
                }

                setReminders(data.reminders || []);

            } catch (error) {
                console.error(error);
                setMessage("Unable to connect to server");

            } finally {
                setLoading(false);
            }
        };

        fetchReminders();
    }, []);

    if (loading) {
        return (
            <div className="patient-reminders-page">
                <header className="reminders-page-header">
                    <div className="reminders-header-badge">
                        <Bell size={18} className="reminders-badge-icon" aria-hidden="true" />
                        <span>Daily Schedule</span>
                    </div>
                    <h1 className="reminders-page-title">My Reminders</h1>
                    <p className="reminders-page-subtitle">
                        Things your caregiver wants you to remember.
                    </p>
                </header>

                <div className="reminders-loading-card" role="status">
                    <div className="reminders-spinner" aria-hidden="true"></div>
                    <p className="reminders-loading-text">Loading your reminders...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="patient-reminders-page">
            {/* Header */}
            <header className="reminders-page-header">
                <div className="reminders-header-badge">
                    <Bell size={18} className="reminders-badge-icon" aria-hidden="true" />
                    <span>Daily Schedule</span>
                </div>
                <h1 className="reminders-page-title">My Reminders</h1>
                <p className="reminders-page-subtitle">
                    Things your caregiver wants you to remember.
                </p>
            </header>

            {/* Error or Alert Message */}
            {message && (
                <div className="reminders-alert-banner" role="alert">
                    <AlertCircle size={22} className="meta-chip-icon" aria-hidden="true" />
                    <span>{message}</span>
                </div>
            )}

            {/* Reminders List or Empty State */}
            {reminders.length === 0 ? (
                <section className="reminders-empty-card" aria-label="No reminders">
                    <div className="empty-icon-container" aria-hidden="true">
                        <Bell size={40} />
                    </div>
                    <h2 className="empty-title">You&apos;re all caught up</h2>
                    <p className="empty-subtitle">
                        You don&apos;t have any reminders right now.
                    </p>
                    <div className="empty-note">
                        Your caregiver will post your daily medicines and appointments here.
                    </div>
                </section>
            ) : (
                <div className="reminders-list" role="feed" aria-label="Reminder list">
                    {reminders.map((reminder) => {
                        const isMedicine = reminder.type === "medicine";
                        const isAppointment = reminder.type === "appointment";
                        const isCompleted = reminder.status === "completed";

                        return (
                            <article
                                key={reminder.reminder_id}
                                className="reminder-card"
                                aria-label={`${isMedicine ? "Medicine" : isAppointment ? "Appointment" : "General"} Reminder: ${reminder.title}`}
                            >
                                <div className="reminder-card-top">
                                    <span
                                        className={`reminder-type-tag ${
                                            isMedicine
                                                ? "type-medicine"
                                                : isAppointment
                                                ? "type-appointment"
                                                : "type-general"
                                        }`}
                                    >
                                        {isMedicine ? (
                                            <Pill size={18} className="type-icon" aria-hidden="true" />
                                        ) : isAppointment ? (
                                            <Calendar size={18} className="type-icon" aria-hidden="true" />
                                        ) : (
                                            <Bell size={18} className="type-icon" aria-hidden="true" />
                                        )}
                                        <span>
                                            {isMedicine
                                                ? "Medicine Reminder"
                                                : isAppointment
                                                ? "Appointment Reminder"
                                                : "Reminder"}
                                        </span>
                                    </span>

                                    {reminder.status && (
                                        <span
                                            className={`reminder-status-tag ${
                                                isCompleted
                                                    ? "status-completed"
                                                    : "status-pending"
                                            }`}
                                        >
                                            {isCompleted ? "Completed" : "Scheduled"}
                                        </span>
                                    )}
                                </div>

                                <h2 className="reminder-title">{reminder.title}</h2>

                                <div className="reminder-meta-row">
                                    {reminder.date && (
                                        <div className="reminder-meta-chip">
                                            <Calendar size={20} className="meta-chip-icon" aria-hidden="true" />
                                            <span className="meta-chip-label">Date:</span>
                                            <span className="meta-chip-value">{reminder.date}</span>
                                        </div>
                                    )}

                                    {reminder.time && (
                                        <div className="reminder-meta-chip">
                                            <Clock size={20} className="meta-chip-icon" aria-hidden="true" />
                                            <span className="meta-chip-label">Time:</span>
                                            <span className="meta-chip-value">{reminder.time}</span>
                                        </div>
                                    )}
                                </div>
                            </article>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default PatientReminders;