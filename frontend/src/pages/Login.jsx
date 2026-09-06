import { useState } from "react";

function Login() {
    const [role, setRole] = useState("patient");
    const [userId, setUserId] = useState("");
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
                        user_id: userId,
                        password: password,
                        role: role,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setMessage(data.message || "Login failed");
                setLoading(false);
                return;
            }

            // Save JWT token
            localStorage.setItem(
                "access_token",
                data.access_token
            );

            // Save role
            localStorage.setItem(
                "role",
                data.role
            );

            setMessage("Login successful!");

            // Redirect based on role
            if (data.role === "patient") {
                window.location.href = "/dashboard";
            } else if (data.role === "caregiver") {
                window.location.href = "/caregiver";
            }

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

            <div>
                <label>Select Role</label>

                <br />

                <button
                    type="button"
                    onClick={() => setRole("patient")}
                >
                    Patient
                </button>

                <button
                    type="button"
                    onClick={() => setRole("caregiver")}
                >
                    Caregiver
                </button>
            </div>

            <br />

            <p>
                Selected role: <strong>{role}</strong>
            </p>

            <form onSubmit={handleLogin}>

                <div>
                    <label>
                        {role === "patient"
                            ? "Patient ID"
                            : "Caregiver ID"}
                    </label>

                    <input
                        type="text"
                        value={userId}
                        onChange={(e) =>
                            setUserId(e.target.value)
                        }
                        placeholder={
                            role === "patient"
                                ? "Enter Patient ID"
                                : "Enter Caregiver ID"
                        }
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

                <button
                    type="submit"
                    disabled={loading}
                >
                    {loading
                        ? "Logging in..."
                        : "Login"}
                </button>

            </form>

            {message && <p>{message}</p>}

            <br />

            {role === "patient" && (
                <button
                    onClick={() =>
                        window.location.href = "/signup"
                    }
                >
                    New Patient? Sign Up
                </button>
            )}
        </div>
    );
}

export default Login;