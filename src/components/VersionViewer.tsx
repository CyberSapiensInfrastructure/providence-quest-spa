import { useTranslation } from "react-i18next";

const VersionViewer = () => {
  const { t } = useTranslation();

  return (
    <div className="absolute bottom-1 right-1 opacity-80 text-xs tracking-widest">
      {t("version")}
    </div>
  );
};

export default VersionViewer;
