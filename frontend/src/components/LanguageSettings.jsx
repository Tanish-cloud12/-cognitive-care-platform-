import { useState } from "react";
import { useLanguage } from "../context/LanguageContext";

function LanguageSettings() {

    const {
        language,
        changeLanguage,
        t
    } = useLanguage();

    const [selectedLanguage, setSelectedLanguage] =
        useState(language);

    const handleSave = () => {
        changeLanguage(selectedLanguage);
    };

    return (
        <div>

            <h2>{t("language")}</h2>

            <p>{t("chooseLanguage")}</p>

            <select
                value={selectedLanguage}
                onChange={(e) =>
                    setSelectedLanguage(e.target.value)
                }
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

            <br />
            <br />

            <button onClick={handleSave}>
                {t("saveLanguage")}
            </button>

        </div>
    );
}

export default LanguageSettings;