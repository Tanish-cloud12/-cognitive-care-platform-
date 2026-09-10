import { useEffect, useState } from "react";

function PatientReminders() {

    const [reminders, setReminders] = useState([]);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const fetchReminders = async () => {

            const token = localStorage.getItem("access_token");

            try {

                const response = await fetch(
                    "http://127.0.0.1:5000/api/reminders/patient",
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

                setReminders(data.reminders);

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
        return <p>Loading reminders...</p>;
    }

    return (
        <div>

            <h2>My Reminders</h2>

            {message && (
                <p>{message}</p>
            )}

            {reminders.length === 0 ? (

                <p>No reminders available.</p>

            ) : (

                reminders.map((reminder) => (

                    <div key={reminder.reminder_id}>

                        <hr />

                        <h3>
                            {reminder.type === "medicine"
                                ? "Medicine Reminder"
                                : "Appointment Reminder"}
                        </h3>

                        <p>{reminder.title}</p>

                        <p>
                            Date: {reminder.date}
                        </p>

                        <p>
                            Time: {reminder.time}
                        </p>

                    </div>

                ))

            )}

        </div>
    );
}

export default PatientReminders;