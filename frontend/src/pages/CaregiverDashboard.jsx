import { useEffect, useState } from "react";

function CaregiverDashboard() {

    const [userId, setUserId] = useState("");
    const [message, setMessage] = useState("");
    const [patients, setPatients] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState("");
    const [analysis, setAnalysis] = useState(null);

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

        } catch (error) {

            console.error(error);
            setMessage("Unable to connect to server");

        }
    };


    const handleViewPerformance = async (patientId) => {

        const token = localStorage.getItem("access_token");

        setSelectedPatient(patientId);
        setAnalysis(null);
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
                    data.message || "Could not load analysis"
                );
                return;
            }

            setAnalysis(data);

        } catch (error) {

            console.error(error);
            setMessage("Unable to connect to server");

        }
    };


    const handleLogout = () => {

        localStorage.removeItem("access_token");
        localStorage.removeItem("role");

        window.location.href = "/";
    };


    return (
        <div>

            <h1>Cognitive Care</h1>

            <h2>Caregiver Dashboard</h2>

            <hr />

            <h3>Welcome</h3>

            <p>
                Caregiver: {userId}
            </p>

            {message && (
                <p>{message}</p>
            )}

            <hr />

            <h3>Patient Overview</h3>

            <p>
                View patients connected to your account.
            </p>

            <button onClick={handleViewPatients}>
                View Patients
            </button>

            {patients.length > 0 && (
                <div>

                    <h4>Connected Patients</h4>

                    {patients.map((patient) => (
                        <div key={patient}>

                            <p>
                                Patient ID: {patient}
                            </p>

                            <button
                                onClick={() =>
                                    handleViewPerformance(patient)
                                }
                            >
                                View Performance
                            </button>

                        </div>
                    ))}

                </div>
            )}

            {analysis && (
                <div>

                    <hr />

                    <h3>
                        Cognitive Performance
                    </h3>

                    <p>
                        Patient: {analysis.patient_id}
                    </p>

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

            <hr />

            <h3>AI Performance Analysis</h3>

            <p>
                View AI-generated summaries of
                patient performance.
            </p>

            <button>
                View AI Analysis
            </button>

            <h3>Alerts</h3>

            <p>
                Important patient alerts will appear here.
            </p>

            <button>
                View Alerts
            </button>

            <h3>Reminders</h3>

            <p>
                Manage medicine, hydration,
                activities and appointments.
            </p>

            <button>
                Manage Reminders
            </button>

            <br />
            <br />

            <button onClick={handleLogout}>
                Logout
            </button>

        </div>
    );
}

export default CaregiverDashboard;