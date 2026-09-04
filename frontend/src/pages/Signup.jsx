import { useState } from "react";

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
                "http://127.0.0.1:5000/api/auth/register",
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
        <div>
            <h1>Cognitive Care</h1>

            <h2>Create Patient Account</h2>

            <form onSubmit={handleSignup}>

                <div>
                    <label>Patient ID</label>

                    <input
                        type="text"
                        value={userId}
                        onChange={(e) =>
                            setUserId(e.target.value)
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
                        placeholder="Create Password"
                        required
                    />
                </div>

                <br />

                <div>
                    <label>Confirm Password</label>

                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) =>
                            setConfirmPassword(e.target.value)
                        }
                        placeholder="Confirm Password"
                        required
                    />
                </div>

                <br />

                <button
                    type="submit"
                    disabled={loading}
                >
                    {loading
                        ? "Creating Account..."
                        : "Sign Up"}
                </button>

            </form>

            {message && <p>{message}</p>}

            <br />

            <button
                onClick={() =>
                    window.location.href = "/"
                }
            >
                Already have an account? Login
            </button>
        </div>
    );
}

export default Signup;