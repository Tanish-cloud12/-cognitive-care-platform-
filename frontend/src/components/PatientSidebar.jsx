import React, { useState } from "react";
import { NavLink } from "react-router-dom";

import {
    Home,
    Gamepad2,
    Bell,
    Image,
    Settings,
    LogOut,
    Brain,
    ChevronLeft,
} from "lucide-react";

const PatientSidebar = () => {

    const [collapsed, setCollapsed] = useState(false);

    const menuItems = [
        {
            name: "Home",
            path: "/dashboard",
            icon: Home,
            end: true,
        },
        {
            name: "Play Games",
            path: "/dashboard/games",
            icon: Gamepad2,
        },
        {
            name: "My Reminders",
            path: "/dashboard/reminders",
            icon: Bell,
        },
        {
            name: "Memory Gallery",
            path: "/dashboard/memory-gallery",
            icon: Image,
        },
    ];

    return (
        <aside
            className={`patient-sidebar ${
                collapsed ? "collapsed" : ""
            }`}
        >

            {/* Logo */}
            <div className="sidebar-logo">

                <div className="logo-icon">
                    <Brain size={28} />
                </div>

                {!collapsed && (
                    <h2>Cognitive Care</h2>
                )}

            </div>

            {/* Toggle */}
            <button
                className="sidebar-toggle"
                onClick={() =>
                    setCollapsed(!collapsed)
                }
            >
                <ChevronLeft
                    size={20}
                    className={
                        collapsed
                            ? "rotate-icon"
                            : ""
                    }
                />
            </button>

            {/* Navigation */}
            <nav className="sidebar-nav">

                {menuItems.map((item) => {

                    const Icon = item.icon;

                    return (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            end={item.end}
                            className={({ isActive }) =>
                                `sidebar-link ${
                                    isActive
                                        ? "active"
                                        : ""
                                }`
                            }
                        >
                            <Icon size={23} />

                            {!collapsed && (
                                <span>
                                    {item.name}
                                </span>
                            )}

                        </NavLink>
                    );

                })}

            </nav>

            {/* Bottom */}
            <div className="sidebar-bottom">

                <NavLink
                    to="/dashboard/settings"
                    className={({ isActive }) =>
                        `sidebar-link ${
                            isActive
                                ? "active"
                                : ""
                        }`
                    }
                >
                    <Settings size={23} />

                    {!collapsed && (
                        <span>
                            Settings
                        </span>
                    )}
                </NavLink>

                <button
                    className="sidebar-link logout-button"
                    onClick={() => {

                        localStorage.removeItem(
                            "access_token"
                        );

                        window.location.href = "/";

                    }}
                >
                    <LogOut size={23} />

                    {!collapsed && (
                        <span>
                            Logout
                        </span>
                    )}
                </button>

            </div>

        </aside>
    );
};

export default PatientSidebar;