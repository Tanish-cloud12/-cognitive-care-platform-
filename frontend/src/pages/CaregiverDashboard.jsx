import { useEffect, useState } from "react";

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

                if (
                    data.user_id &&
                    data.role === "caregiver"
                ) {

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

            // Automatically select first patient
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
    // OPEN REMINDER SECTION
    // --------------------------------------------------

    const handleManageReminders = () => {

        if (!selectedPatient) {

            setMessage("Please select a patient first.");

            return;
        }

        setMessage("");

        setShowReminders(true);
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
        if (
            !reminderTitle ||
            !reminderDate ||
            !reminderTime
        ) {

            setMessage("Please fill all reminder fields.");

            return;
        }

        const token = localStorage.getItem("access_token");

        // IMPORTANT:
        // patient_id automatically comes from selected patient
        const reminderData = {

            patient_id: selectedPatient,

            type: reminderType,

            title: reminderTitle,

            date: reminderDate,

            time: reminderTime
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
                    data.message ||
                    "Could not create reminder"
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

            setMessage(
                "Unable to connect to server"
            );

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


    // --------------------------------------------------
    // UI
    // --------------------------------------------------

    return (
        <div>

            <h1>Cognitive Care</h1>

            <h2>Caregiver Dashboard</h2>

            <hr />


            {/* WELCOME */}

            <h3>Welcome</h3>

            <p>
                Caregiver: {userId}
            </p>


            {/* MESSAGE */}

            {message && (
                <p>
                    {message}
                </p>
            )}


            <hr />


            {/* PATIENT OVERVIEW */}

            <h3>Patient Overview</h3>

            <p>
                Select a patient to view their data.
            </p>


            <button onClick={handleViewPatients}>
                Load Patients
            </button>


            {/* PATIENT SELECTOR */}

            {patients.length > 0 && (

                <div>

                    <h4>Select Patient</h4>

                    <select
                        value={selectedPatient}
                        onChange={(e) =>
                            handleSelectPatient(
                                e.target.value
                            )
                        }
                    >

                        <option value="">
                            -- Select Patient --
                        </option>


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

            )}


            {/* SELECTED PATIENT DATA */}

            {analysis && selectedPatient && (

                <div>

                    <hr />

                    <h3>
                        Cognitive Performance
                    </h3>

                    <p>
                        Patient: {selectedPatient}
                    </p>

                    <p>
                        Games Played:{" "}
                        {analysis.games_played}
                    </p>

                    <p>
                        Average Score:{" "}
                        {analysis.average_score}
                    </p>

                    <p>
                        Average Accuracy:{" "}
                        {analysis.average_accuracy}%
                    </p>

                    <p>
                        Average Time:{" "}
                        {analysis.average_time} seconds
                    </p>

                    <p>
                        Trend:{" "}
                        {analysis.trend}
                    </p>

                </div>

            )}


            {/* AI PERFORMANCE */}

            <hr />

            <h3>
                AI Performance Analysis
            </h3>

            <p>
                View AI-generated summaries of
                the selected patient's performance.
            </p>

            <button>
                View AI Analysis
            </button>


            {/* ALERTS */}

            <h3>
                Alerts
            </h3>

            <p>
                Important alerts for the selected
                patient will appear here.
            </p>

            <button>
                View Alerts
            </button>


            {/* REMINDERS */}

            <hr />

            <h3>
                Reminders
            </h3>

            <p>
                Add medicine and appointment
                reminders for the selected patient.
            </p>


            <button
                onClick={handleManageReminders}
            >
                Manage Reminders
            </button>


            {/* REMINDER FORM */}

            {showReminders && selectedPatient && (

                <div>

                    <hr />

                    <h3>
                        Reminders for Patient:{" "}
                        {selectedPatient}
                    </h3>


                    <form
                        onSubmit={handleAddReminder}
                    >


                        {/* REMINDER TYPE */}

                        <div>

                            <label>
                                Reminder Type:
                            </label>

                            <br />

                            <select
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


                        <br />


                        {/* TITLE */}

                        <div>

                            <label>
                                Title:
                            </label>

                            <br />

                            <input
                                type="text"
                                value={reminderTitle}
                                onChange={(e) =>
                                    setReminderTitle(
                                        e.target.value
                                    )
                                }
                                placeholder={
                                    reminderType ===
                                    "medicine"
                                        ? "e.g. Take medicine"
                                        : "e.g. Doctor appointment"
                                }
                            />

                        </div>


                        <br />


                        {/* DATE */}

                        <div>

                            <label>
                                Date:
                            </label>

                            <br />

                            <input
                                type="date"
                                value={reminderDate}
                                onChange={(e) =>
                                    setReminderDate(
                                        e.target.value
                                    )
                                }
                            />

                        </div>


                        <br />


                        {/* TIME */}

                        <div>

                            <label>
                                Time:
                            </label>

                            <br />

                            <input
                                type="time"
                                value={reminderTime}
                                onChange={(e) =>
                                    setReminderTime(
                                        e.target.value
                                    )
                                }
                            />

                        </div>


                        <br />


                        {/* SUBMIT */}

                        <button type="submit">
                            Add Reminder
                        </button>

                    </form>

                </div>

            )}


            <br />
            <br />


            {/* LOGOUT */}

            <button onClick={handleLogout}>
                Logout
            </button>

        </div>
    );
}

export default CaregiverDashboard;