import { useState } from "react";

import Button from "../components/Button";
import Input from "../components/Input";
import Card from "../components/Card";
import RoleSelector from "../components/Roleselector";

import "./Login.css";
const API_URL = import.meta.env.VITE_API_URL;
// --------------------------------------------------
// DEMO CAREGIVER CREDENTIALS
// --------------------------------------------------
const DEMO_CAREGIVER_ID = "C001";
const DEMO_CAREGIVER_PASSWORD = "Caregiver@123";


function Login() {

    const [role, setRole] = useState("patient");
    const [userId, setUserId] = useState("");
    const [password, setPassword] = useState("");

    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);


    // --------------------------------------------------
    // ROLE CHANGE
    // --------------------------------------------------
    const handleRoleChange = (newRole) => {

        setRole(newRole);
        setMessage("");

        if (newRole === "caregiver") {

            // Automatically fill demo caregiver credentials
            setUserId(DEMO_CAREGIVER_ID);
            setPassword(DEMO_CAREGIVER_PASSWORD);

        } else {

            // Clear caregiver credentials when switching back
            // to patient
            setUserId("");
            setPassword("");
        }
    };


    // --------------------------------------------------
    // LOGIN
    // --------------------------------------------------
    const handleLogin = async (e) => {

        e.preventDefault();

        setMessage("");
        setLoading(true);

        try {

            const response = await fetch(
                `${API_URL}/api/auth/login`,
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


            // --------------------------------------------------
            // LOGIN FAILED
            // --------------------------------------------------
            if (!response.ok) {

                setMessage(
                    data.message || "Login failed"
                );

                setLoading(false);

                return;
            }


            // --------------------------------------------------
            // SAVE LOGIN INFORMATION
            // --------------------------------------------------
            localStorage.setItem(
                "access_token",
                data.access_token
            );

            localStorage.setItem(
                "role",
                data.role
            );


            setMessage("Login successful!");


            // --------------------------------------------------
            // REDIRECT
            // --------------------------------------------------
            if (data.role === "patient") {

                window.location.href = "/dashboard";

            } else if (data.role === "caregiver") {

                window.location.href = "/caregiver";
            }


        } catch (error) {

            console.error(error);

            setMessage(
                "Unable to connect to server"
            );

        } finally {

            setLoading(false);
        }
    };


    return (

        <main className="login-page">

            <div className="login-container">


                {/* --------------------------------------------------
                    BRAND
                -------------------------------------------------- */}
                <div className="login-brand">

                    <div className="brand-mark">
                        C
                    </div>

                    <h1>
                        Cognitive Care
                    </h1>

                    <p>
                        Simple, supportive care for everyday life.
                    </p>

                </div>


                {/* --------------------------------------------------
                    LOGIN CARD
                -------------------------------------------------- */}
                <Card className="login-card">

                    <div className="login-header">

                        <h2>
                            Welcome back
                        </h2>

                        <p>
                            Please sign in to continue.
                        </p>

                    </div>


                    <form onSubmit={handleLogin}>


                        {/* --------------------------------------------------
                            ROLE SELECTOR
                        -------------------------------------------------- */}
                        <RoleSelector
                            role={role}
                            setRole={handleRoleChange}
                        />


                        {/* --------------------------------------------------
                            USER ID
                        -------------------------------------------------- */}
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

                            readOnly={
                                role === "caregiver"
                            }
                        />


                        {/* --------------------------------------------------
                            PASSWORD
                        -------------------------------------------------- */}
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

                            readOnly={
                                role === "caregiver"
                            }
                        />


                        {/* --------------------------------------------------
                            DEMO CAREGIVER INFORMATION
                        -------------------------------------------------- */}
                        {role === "caregiver" && (

                            <div
                                style={{
                                    marginTop: "10px",
                                    marginBottom: "15px",
                                    padding: "10px",
                                    borderRadius: "8px",
                                    background: "#f5f5f5",
                                    fontSize: "14px",
                                }}
                            >

                                <strong>
                                    Demo Caregiver
                                </strong>

                                <br />

                                ID: C001

                                <br />

                                Password: Caregiver@123

                            </div>

                        )}


                        {/* --------------------------------------------------
                            MESSAGE
                        -------------------------------------------------- */}
                        {message && (

                            <p
                                className={
                                    message ===
                                    "Login successful!"
                                        ? "login-message success"
                                        : "login-message error"
                                }
                            >
                                {message}
                            </p>

                        )}


                        {/* --------------------------------------------------
                            LOGIN BUTTON
                        -------------------------------------------------- */}
                        <Button
                            type="submit"
                            disabled={loading}
                        >

                            {loading
                                ? "Logging in..."
                                : "Log In"}

                        </Button>


                    </form>


                    {/* --------------------------------------------------
                        PATIENT SIGNUP
                    -------------------------------------------------- */}
                    {role === "patient" && (

                        <div className="signup-prompt">

                            <p>
                                New to Cognitive Care?
                            </p>

                            <button
                                type="button"
                                className="signup-button"
                                onClick={() =>
                                    window.location.href =
                                        "/signup"
                                }
                            >
                                Create a patient account
                            </button>

                        </div>

                    )}

                </Card>


                {/* --------------------------------------------------
                    FOOTER
                -------------------------------------------------- */}
                <p className="login-footer">

                    Your care. Your support.
                    Your peace of mind.

                </p>

            </div>

        </main>
    );
}


export default Login;