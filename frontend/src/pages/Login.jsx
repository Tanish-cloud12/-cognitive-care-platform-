import { useState } from "react";

import Button from "../components/Button";
import Input from "../components/Input";
import Card from "../components/Card";
import RoleSelector from "../components/Roleselector";
import "./Login.css";

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

    return(
        <main className="login-page">

            <div className="login-container">

                {/* Branding */}
                <div className="login-brand">
                    <div className="brand-mark">C</div>

                    <h1>Cognitive Care</h1>

                    <p>
                        Simple, supportive care for everyday life.
                    </p>
                </div>

                {/* Login Card */}
                <Card className="login-card">

                    <div className="login-header">
                        <h2>Welcome back</h2>

                        <p>
                            Please sign in to continue.
                        </p>
                    </div>

                    <form onSubmit={handleLogin}>

                        <RoleSelector
                            role={role}
                            setRole={setRole}
                        />

                        <Input
                            id="userId"
                            label={
                                role === "patient"
                                    ? "Patient ID"
                                    : "Caregiver ID"
                            }
                            type="text"
                            value={userId}
                            onChange={(e) =>
                                setUserId(e.target.value)
                            }
                            placeholder={
                                role === "patient"
                                    ? "Enter your Patient ID"
                                    : "Enter your Caregiver ID"
                            }
                            required
                        />

                        <Input
                            id="password"
                            label="Password"
                            type="password"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                            placeholder="Enter your password"
                            required
                        />

                        {message && (
                            <p
                                className={
                                    message === "Login successful!"
                                        ? "login-message success"
                                        : "login-message error"
                                }
                            >
                                {message}
                            </p>
                        )}

                        <Button
                            type="submit"
                            disabled={loading}
                        >
                            {loading
                                ? "Logging in..."
                                : "Log In"}
                        </Button>

                    </form>

                    {/* Signup */}
                    {role === "patient" && (
                        <div className="signup-prompt">

                            <p>New to Cognitive Care?</p>

                            <button
                                type="button"
                                className="signup-button"
                                onClick={() =>
                                    window.location.href = "/signup"
                                }
                            >
                                Create a patient account
                            </button>

                        </div>
                    )}

                </Card>

                <p className="login-footer">
                    Your care. Your support. Your peace of mind.
                </p>

            </div>

        </main>
    )
}

export default Login;