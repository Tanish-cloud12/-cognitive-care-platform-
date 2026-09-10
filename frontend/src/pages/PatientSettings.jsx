import LanguageSettings from "../components/LanguageSettings";
import { useLanguage } from "../context/LanguageContext";
import { Settings as SettingsIcon } from "lucide-react";
import "./PatientSettings.css";

function PatientSettings() {
    const { t } = useLanguage();

    return (
        <div className="patient-settings-page">
            {/* Header */}
            <header className="settings-page-header">
                <div className="settings-header-badge">
                    <SettingsIcon size={18} className="settings-badge-icon" aria-hidden="true" />
                    <span>Preferences</span>
                </div>
                <h1 className="settings-page-title">{t("settings") || "Settings"}</h1>
                <p className="settings-page-subtitle">
                    Make Cognitive Care comfortable for you.
                </p>
            </header>

            {/* Language Settings Card */}
            <LanguageSettings />
        </div>
    );
}

export default PatientSettings;