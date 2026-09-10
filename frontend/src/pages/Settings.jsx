import LanguageSettings from "../components/LanguageSettings";
import { useLanguage } from "../context/LanguageContext";

function Settings() {

    const { t } = useLanguage();

    return (
        <div>

            <h1>
                {t("settings")}
            </h1>

            <LanguageSettings />

        </div>
    );
}

export default Settings;