import { useState } from "react";
import { Globe, Check, CheckCircle2 } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

function LanguageSettings() {
    const {
        language,
        changeLanguage,
        t
    } = useLanguage();

    const [selectedLanguage, setSelectedLanguage] = useState(language);
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        changeLanguage(selectedLanguage);
        setSaved(true);
    };

    return (
        <section className="settings-card" aria-labelledby="language-heading">
            {/* Language Card Header */}
            <div className="settings-card-header">
                <div className="settings-icon-circle" aria-hidden="true">
                    <Globe size={32} />
                </div>
                <div className="settings-card-title-group">
                    <h2 id="language-heading" className="settings-card-title">
                        {t("language") || "Language"}
                    </h2>
                    <p className="settings-card-subtitle">
                        {t("chooseLanguage") || "Choose the language you'd like to use in the app."}
                    </p>
                </div>
            </div>

            {/* Form */}
            <div className="settings-form">
                <div className="form-group">
                    <label htmlFor="language-selector" className="settings-input-label">
                        Select Preferred Language
                    </label>

                    <select
                        id="language-selector"
                        className="settings-language-select"
                        value={selectedLanguage}
                        onChange={(e) => {
                            setSelectedLanguage(e.target.value);
                            setSaved(false);
                        }}
                        aria-label="Preferred application language"
                    >
                        <option value="english">
                            English
                        </option>

                        <option value="assamese">
                            Assamese
                        </option>

                        <option value="bengali">
                            Bengali
                        </option>

                        <option value="manipuri">
                            Manipuri (Meitei)
                        </option>

                        <option value="khasi">
                            Khasi
                        </option>

                        <option value="mizo">
                            Mizo
                        </option>

                        <option value="bodo">
                            Bodo
                        </option>

                        <option value="kokborok">
                            Kokborok
                        </option>
                    </select>
                </div>

                {saved && (
                    <div className="settings-feedback-banner" role="status">
                        <CheckCircle2 size={20} className="feedback-icon" aria-hidden="true" />
                        <span>{t("languageUpdated") || "Language updated successfully."}</span>
                    </div>
                )}

                <div className="settings-action-row">
                    <button
                        type="button"
                        className="settings-save-btn"
                        onClick={handleSave}
                        aria-label="Save chosen language"
                    >
                        <Check size={20} aria-hidden="true" />
                        <span>{t("saveLanguage") || "Save Language"}</span>
                    </button>
                </div>
            </div>
        </section>
    );
}

export default LanguageSettings;