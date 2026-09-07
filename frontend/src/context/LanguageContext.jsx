import React, { createContext, useContext, useState } from "react";
import translations from "../i18n/translations";

const LanguageContext = createContext();

export function LanguageProvider({ children }) {

    const [language, setLanguage] = useState(
        localStorage.getItem("patient_language") || "english"
    );

    const changeLanguage = (newLanguage) => {
        localStorage.setItem(
            "patient_language",
            newLanguage
        );

        setLanguage(newLanguage);
    };

    const t = (key) => {
        return (
            translations[language]?.[key] ||
            translations.english[key] ||
            key
        );
    };

    return (
        <LanguageContext.Provider
            value={{
                language,
                changeLanguage,
                t
            }}
        >
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    return useContext(LanguageContext);
}