import { BRAND_ICONS, useAppearance } from "../../context/AppearanceContext.jsx";

export default function Brand({ className = "brand" }) {
  const { appearance } = useAppearance();
  const Icon = BRAND_ICONS[appearance.icon];

  return (
    <div className={className}>
      <span className={`brand-icon${appearance.brandImageData ? " has-image" : ""}`}>
        {appearance.brandImageData
          ? <img className="brand-logo-image" src={appearance.brandImageData} alt="" />
          : <Icon size={20} />}
      </span>
      <span>Smart<span className="brand-light">Tracker</span></span>
    </div>
  );
}
