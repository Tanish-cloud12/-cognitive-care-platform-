import LanguageSettings from "../components/LanguageSettings";
import { useLanguage } from "../context/LanguageContext";

function PatientSettings() {

    const { t } = useLanguage();

    return (
        <div>

            <h1>{t("settings")}</h1>

            <LanguageSettings />

        </div>
    );
}

export default PatientSettings;