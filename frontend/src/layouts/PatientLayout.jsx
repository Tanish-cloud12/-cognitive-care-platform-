import React from "react";
import { Outlet } from "react-router-dom";

import PatientSidebar from "../components/PatientSidebar";
import "../styles/PatientSidebar.css";

const PatientLayout = () => {
    return (
        <div>
            <PatientSidebar />

            <main className="patient-main-content">
                <Outlet />
            </main>
        </div>
    );
};

export default PatientLayout;