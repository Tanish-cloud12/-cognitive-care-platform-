import { useState } from "react";
import translations from "../i18n/translations";

function useLanguage() {

    const [language, setLanguage] = useState(
        localStorage.getItem("patient_language") || "english"
    );

    const changeLanguage = (newLanguage) => {
        setLanguage(newLanguage);
        localStorage.setItem(
            "patient_language",
            newLanguage
        );
    };

    const t = (key) => {
        return (
            translations[language]?.[key] ||
            translations.english[key] ||
            key
        );
    };

    return {
        language,
        changeLanguage,
        t
    };
}

export default useLanguage;