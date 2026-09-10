import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";

import PatientLayout from "./layouts/PatientLayout";

import Dashboard from "./pages/Dashboard";
import PatientGames from "./pages/PatientGames";
import PatientReminders from "./pages/PatientReminders";
import MemoryGallery from "./pages/MemoryGallery";
import PatientSettings from "./pages/PatientSettings";

import CaregiverDashboard from "./pages/CaregiverDashboard";

function App() {
    return (
        <BrowserRouter>
            <Routes>

                {/* Login */}
                <Route
                    path="/"
                    element={<Login />}
                />

                {/* Signup */}
                <Route
                    path="/signup"
                    element={<Signup />}
                />

                {/* ================= PATIENT ================= */}

                <Route
                    path="/dashboard"
                    element={<PatientLayout />}
                >

                    {/* Home */}
                    <Route
                        index
                        element={<Dashboard />}
                    />

                    {/* Games */}
                    <Route
                        path="games"
                        element={<PatientGames />}
                    />

                    {/* Reminders */}
                    <Route
                        path="reminders"
                        element={<PatientReminders />}
                    />

                    {/* Memory Gallery */}
                    <Route
                        path="memory-gallery"
                        element={<MemoryGallery />}
                    />

                    {/* Settings */}
                    <Route
                        path="settings"
                        element={<PatientSettings />}
                    />

                </Route>

                {/* ================= CAREGIVER ================= */}

                <Route
                    path="/caregiver"
                    element={<CaregiverDashboard />}
                />

            </Routes>
        </BrowserRouter>
    );
}

export default App;