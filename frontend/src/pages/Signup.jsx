import { useState } from "react";

import Button from "../components/Button";
import Input from "../components/Input";
import Card from "../components/Card";
import "./Signup.css";
const API_URL = import.meta.env.VITE_API_URL;
function Signup() {
    const [userId, setUserId] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSignup = async (e) => {
        e.preventDefault();

        setMessage("");

        if (password !== confirmPassword) {
            setMessage("Passwords do not match");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(
                `${API_URL}/api/auth/register`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        user_id: userId,
                        password: password,
                        role: "patient",
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setMessage(data.message || "Registration failed");
                setLoading(false);
                return;
            }

            setMessage(
                "Registration successful! You can now login."
            );

            setUserId("");
            setPassword("");
            setConfirmPassword("");

        } catch (error) {
            console.error(error);
            setMessage("Unable to connect to server");
        }

        setLoading(false);
    };

    return (
        <main className="signup-page">

            <div className="signup-container">

                {/* Branding */}
                <div className="signup-brand">
                    <div className="brand-mark">C</div>

                    <h1>Cognitive Care</h1>

                    <p>
                        Simple, supportive care for everyday life.
                    </p>
                </div>

                {/* Signup Card */}
                <Card className="signup-card">

                    <div className="signup-header">
                        <h2>Create Patient Account</h2>

                        <p>
                            Sign up to begin your personalized care journey.
                        </p>
                    </div>

                    <form onSubmit={handleSignup}>

                        <Input
                            id="userId"
                            label="Patient ID"
                            type="text"
                            value={userId}
                            onChange={(e) =>
                                setUserId(e.target.value)
                            }
                            placeholder="Choose a Patient ID"
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
                            placeholder="Create a password"
                            required
                        />

                        <Input
                            id="confirmPassword"
                            label="Confirm Password"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) =>
                                setConfirmPassword(e.target.value)
                            }
                            placeholder="Re-enter your password"
                            required
                        />

                        {message && (
                            <p
                                className={
                                    message.includes("successful")
                                        ? "signup-message success"
                                        : "signup-message error"
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
                                ? "Creating Account..."
                                : "Create Account"}
                        </Button>

                    </form>

                    {/* Back to Login */}
                    <div className="login-prompt">

                        <p>Already have an account?</p>

                        <button
                            type="button"
                            className="login-link-button"
                            onClick={() =>
                                window.location.href = "/"
                            }
                        >
                            Sign in to your account
                        </button>

                    </div>

                </Card>

                <p className="signup-footer">
                    Your care. Your support. Your peace of mind.
                </p>

            </div>

        </main>
    );
}

export default Signup;