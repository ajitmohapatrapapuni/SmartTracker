import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Activity, BookOpen, Compass, ShieldCheck, Sparkles, Target } from "lucide-react";
import { AuthContext } from "./AuthContext.jsx";

export const APPEARANCE_KEY = "smarttracker.appearance";
const PUBLIC_BRAND_KEY = "smarttracker.public-brand";

export const PALETTES = {
  violet: { name: "Violet", primary: "#6558e8", hover: "#5549d6", soft: "#f0efff", background: "#f6f7fb" },
  ocean: { name: "Ocean", primary: "#1687b5", hover: "#106d93", soft: "#e8f6fb", background: "#f4f8fa" },
  forest: { name: "Forest", primary: "#25805b", hover: "#1d684a", soft: "#eaf6ef", background: "#f5f8f6" },
  sunset: { name: "Sunset", primary: "#d45f48", hover: "#b84d39", soft: "#fff0eb", background: "#faf7f5" },
};

export const FONTS = {
  system: { name: "System", family: '"Segoe UI", Arial, sans-serif' },
  arial: { name: "Arial", family: "Arial, sans-serif" },
  georgia: { name: "Georgia", family: "Georgia, serif" },
  trebuchet: { name: "Trebuchet MS", family: '"Trebuchet MS", sans-serif' },
  mono: { name: "Monospace", family: '"Courier New", monospace' },
};

export const BRAND_ICONS = {
  activity: Activity,
  book: BookOpen,
  compass: Compass,
  shield: ShieldCheck,
  sparkles: Sparkles,
  target: Target,
};

export const DEFAULT_APPEARANCE = {
  palette: "violet",
  font: "system",
  icon: "activity",
  brandImageData: "",
  faviconData: "",
};

const AppearanceContext = createContext(null);
const hasOwn = (object, key) => Object.prototype.hasOwnProperty.call(object, key);

function isValidAppearance(value) {
  return value && typeof value === "object"
    ? {
        palette: hasOwn(PALETTES, value.palette) ? value.palette : DEFAULT_APPEARANCE.palette,
        font: hasOwn(FONTS, value.font) ? value.font : DEFAULT_APPEARANCE.font,
        icon: hasOwn(BRAND_ICONS, value.icon) ? value.icon : DEFAULT_APPEARANCE.icon,
        brandImageData: typeof value.brandImageData === "string"
          && /^data:image\/(png|jpeg|webp);base64,/i.test(value.brandImageData)
          && value.brandImageData.length <= 350000
          ? value.brandImageData
          : "",
        faviconData: typeof value.faviconData === "string"
          && /^data:image\/(png|jpeg|webp|x-icon|vnd\.microsoft\.icon);base64,/i.test(value.faviconData)
          && value.faviconData.length <= 350000
          ? value.faviconData
          : "",
      }
    : DEFAULT_APPEARANCE;
}

export function AppearanceProvider({ children }) {
  const { user } = useContext(AuthContext);
  const storageKey = `${APPEARANCE_KEY}.${user?.id || "guest"}`;
  const [stored, setStored] = useState({ key: "", value: DEFAULT_APPEARANCE });
  const appearance = stored.key === storageKey ? stored.value : DEFAULT_APPEARANCE;

  useEffect(() => {
    let value = DEFAULT_APPEARANCE;
    try {
      const saved = window.localStorage.getItem(storageKey);
      if (saved) value = isValidAppearance(JSON.parse(saved));
      const publicBrand = window.localStorage.getItem(PUBLIC_BRAND_KEY);
      if (user?.id && saved && !publicBrand) {
        window.localStorage.setItem(PUBLIC_BRAND_KEY, JSON.stringify({
          icon: value.icon,
          brandImageData: value.brandImageData,
        }));
      } else if (!user?.id && publicBrand) {
        value = isValidAppearance({ ...value, ...JSON.parse(publicBrand) });
      }
    } catch (error) {
      console.error("Could not load appearance preferences:", error);
    }
    setStored({ key: storageKey, value });
  }, [storageKey, user?.id]);

  useEffect(() => {
    const palette = PALETTES[appearance.palette];
    document.documentElement.style.setProperty("--purple", palette.primary);
    document.documentElement.style.setProperty("--purple-hover", palette.hover);
    document.documentElement.style.setProperty("--purple-soft", palette.soft);
    document.documentElement.style.setProperty("--app-bg", palette.background);
    document.documentElement.style.setProperty("--app-font", FONTS[appearance.font].family);

    let favicon = document.querySelector('link[rel="icon"][data-appearance="true"]');
    if (appearance.faviconData) {
      if (!favicon) {
        favicon = document.createElement("link");
        favicon.rel = "icon";
        favicon.dataset.appearance = "true";
        document.head.appendChild(favicon);
      }
      favicon.href = appearance.faviconData;
    } else if (favicon) {
      favicon.remove();
    }
  }, [appearance]);

  function updateAppearance(patch) {
    const next = isValidAppearance({ ...appearance, ...patch });
    window.localStorage.setItem(storageKey, JSON.stringify(next));
    if ("icon" in patch || "brandImageData" in patch) {
      window.localStorage.setItem(PUBLIC_BRAND_KEY, JSON.stringify({
        icon: next.icon,
        brandImageData: next.brandImageData,
      }));
    }
    setStored({ key: storageKey, value: next });
  }

  function resetAppearance() {
    window.localStorage.removeItem(storageKey);
    window.localStorage.removeItem(PUBLIC_BRAND_KEY);
    setStored({ key: storageKey, value: DEFAULT_APPEARANCE });
  }

  const value = useMemo(() => ({ appearance, updateAppearance, resetAppearance }), [appearance, storageKey]);
  return <AppearanceContext.Provider value={value}>{children}</AppearanceContext.Provider>;
}

export function useAppearance() {
  const context = useContext(AppearanceContext);
  if (!context) throw new Error("useAppearance must be used within AppearanceProvider.");
  return context;
}
