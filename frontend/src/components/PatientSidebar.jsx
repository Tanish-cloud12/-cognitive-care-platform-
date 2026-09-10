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

import { useLanguage } from "../context/LanguageContext";

const PatientSidebar = () => {

    const [collapsed, setCollapsed] = useState(false);

    const { t } = useLanguage();

    const menuItems = [
        {
            name: t("home"),
            path: "/dashboard",
            icon: Home,
            end: true,
        },
        {
            name: t("playGames"),
            path: "/dashboard/games",
            icon: Gamepad2,
        },
        {
            name: t("myReminders"),
            path: "/dashboard/reminders",
            icon: Bell,
        },
        {
            name: t("memoryGallery"),
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
                            key={item.path}
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
                            {t("settings")}
                        </span>
                    )}
                </NavLink>

                <button
                    className="sidebar-link logout-button"
                    onClick={() => {

                        localStorage.removeItem(
                            "access_token"
                        );

                        localStorage.removeItem(
                            "role"
                        );

                        window.location.href = "/";

                    }}
                >
                    <LogOut size={23} />

                    {!collapsed && (
                        <span>
                            {t("logout")}
                        </span>
                    )}
                </button>

            </div>

        </aside>
    );
};

export default PatientSidebar;