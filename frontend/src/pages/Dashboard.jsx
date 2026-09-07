import { useEffect, useState } from "react";
import PatientReminders from "./PatientReminders";

import { useLanguage } from "../context/LanguageContext";

function Dashboard() {

    const [userId, setUserId] = useState("");
    const [analysis, setAnalysis] = useState(null);
    const [analysisLoading, setAnalysisLoading] = useState(false);
    const [message, setMessage] = useState("");

    const { t } = useLanguage();

    useEffect(() => {

        const token =
            localStorage.getItem("access_token");

        if (!token) {
            window.location.href = "/";
            return;
        }

        fetch(
            "http://127.0.0.1:5000/api/auth/me",
            {
                method: "GET",
                headers: {
                    Authorization:
                        `Bearer ${token}`,
                },
            }
        )
            .then((response) =>
                response.json()
            )
            .then((data) => {

                if (data.user_id) {

                    setUserId(
                        data.user_id
                    );

                } else {

                    localStorage.removeItem(
                        "access_token"
                    );

                    window.location.href = "/";
                }

            })
            .catch((error) => {

                console.error(error);

                setMessage(
                    "Unable to load user information"
                );

            });

    }, []);

    const handleViewAnalysis = async () => {

        const token =
            localStorage.getItem("access_token");

        setAnalysisLoading(true);
        setMessage("");

        try {

            const response = await fetch(
                "http://127.0.0.1:5000/api/analysis",
                {
                    method: "GET",
                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                    },
                }
            );

            const data =
                await response.json();

            if (!response.ok) {

                setMessage(
                    data.message ||
                    "Could not load analysis"
                );

                setAnalysisLoading(false);
                return;
            }

            setAnalysis(data);

        } catch (error) {

            console.error(error);

            setMessage(
                "Unable to connect to server"
            );

        }

        setAnalysisLoading(false);
    };

    return (
        <div>

            <h1>
                {t("dashboardTitle")}
            </h1>

            <h2>
                {t("welcome")}
            </h2>

            <p>
                {t("patient")}: {userId}
            </p>

            <hr />

            <h3>
                {t("performance")}
            </h3>

            <button
                onClick={
                    handleViewAnalysis
                }
                disabled={analysisLoading}
            >
                {analysisLoading
                    ? t("loadingAnalysis")
                    : t("viewAnalysis")}
            </button>

            {message && (
                <p>
                    {message}
                </p>
            )}

            {analysis && (
                <div>

                    <h4>
                        {t("yourPerformance")}
                    </h4>

                    <p>
                        {t("gamesPlayed")}:{" "}
                        {analysis.games_played}
                    </p>

                    <p>
                        {t("averageScore")}:{" "}
                        {analysis.average_score}
                    </p>

                    <p>
                        {t("averageAccuracy")}:{" "}
                        {analysis.average_accuracy}%
                    </p>

                    <p>
                        {t("averageTime")}:{" "}
                        {analysis.average_time}{" "}
                        seconds
                    </p>

                    <p>
                        {t("trend")}:{" "}
                        {analysis.trend}
                    </p>

                    <hr />

                    <PatientReminders />

                </div>
            )}

        </div>
    );
}

export default Dashboard;