import { useState } from "react";

function Login() {
    const [patientId, setPatientId] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();

        setMessage("");
        setLoading(true);

        try {
            const response = await fetch(
                "http://127.0.0.1:5000/api/auth/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        patient_id: patientId,
                        password: password,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setMessage(data.message || "Login failed");
                setLoading(false);
                return;
            }

            // Store JWT token
            localStorage.setItem(
                "access_token",
                data.access_token
            );

            setMessage("Login successful!");

            // Go to dashboard
            window.location.href = "/dashboard";

        } catch (error) {
            console.error(error);
            setMessage("Unable to connect to server");
        }

        setLoading(false);
    };

    return (
        <div>
            <h1>Cognitive Care</h1>

            <h2>Login</h2>

            <form onSubmit={handleLogin}>

                <div>
                    <label>Patient ID</label>

                    <input
                        type="text"
                        value={patientId}
                        onChange={(e) =>
                            setPatientId(e.target.value)
                        }
                        placeholder="Enter Patient ID"
                        required
                    />
                </div>

                <br />

                <div>
                    <label>Password</label>

                    <input
                        type="password"
                        value={password}
                        onChange={(e) =>
                            setPassword(e.target.value)
                        }
                        placeholder="Enter Password"
                        required
                    />
                </div>

                <br />

                <button type="submit" disabled={loading}>
                    {loading ? "Logging in..." : "Login"}
                </button>

            </form>

            {message && (
                <p>{message}</p>
            )}

            <br />

            {/* Sign Up button */}
            <button onClick={() => window.location.href = "/signup"}>
                New Patient? Sign Up
            </button>

        </div>
    );
}

export default Login;