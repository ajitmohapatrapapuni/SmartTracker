import { useState } from "react";
import { BRAND_ICONS, DEFAULT_APPEARANCE, FONTS, PALETTES, useAppearance } from "../context/AppearanceContext.jsx";
import Button from "../components/ui/Button.jsx";

const MAX_IMAGE_SIZE = 256 * 1024;
const FAVICON_TYPES = ["image/png", "image/jpeg", "image/webp", "image/x-icon", "image/vnd.microsoft.icon"];
const BRAND_IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp"];
const ICON_NAMES = { activity: "Activity", book: "Book", compass: "Compass", shield: "Shield", sparkles: "Sparkles", target: "Target" };
const DefaultIcon = BRAND_ICONS[DEFAULT_APPEARANCE.icon];

function readImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== "string") {
        reject(new Error("Could not read the selected image."));
        return;
      }
      resolve(reader.result);
    };
    reader.onerror = () => reject(new Error("Could not read the selected image."));
    reader.readAsDataURL(file);
  });
}

function validateImage(file, allowedTypes, allowedExtensions, label) {
  const extension = file.name.toLowerCase().split(".").pop();
  const validExtension = allowedExtensions.includes(extension);
  if (!(allowedTypes.includes(file.type) || (!file.type && validExtension))) {
    return `Choose a supported ${label} image.`;
  }
  if (!file.size) return `The selected ${label} file is empty.`;
  if (file.size > MAX_IMAGE_SIZE) return `${label} files must be 256 KB or smaller.`;
  return "";
}

export default function Appearance() {
  const { appearance, updateAppearance, resetAppearance } = useAppearance();
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const SelectedBrandIcon = BRAND_ICONS[appearance.icon];

  function save(patch) {
    setError("");
    setNotice("");
    try {
      updateAppearance(patch);
      setNotice("Appearance saved in this browser.");
    } catch (saveError) {
      setError(`Could not save appearance: ${saveError.message}`);
    }
  }

  async function uploadFavicon(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setError("");
    setNotice("");
    const validationError = validateImage(file, FAVICON_TYPES, ["png", "jpg", "jpeg", "webp", "ico"], "favicon");
    if (validationError) {
      setError(validationError);
      return;
    }
    try {
      const faviconData = await readImage(file);
      save({ faviconData });
    } catch (readError) {
      setError(readError.message);
    }
  }

  async function uploadBrandImage(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setError("");
    setNotice("");
    const validationError = validateImage(file, BRAND_IMAGE_TYPES, ["png", "jpg", "jpeg", "webp"], "brand");
    if (validationError) {
      setError(validationError);
      return;
    }
    try {
      const brandImageData = await readImage(file);
      save({ brandImageData });
    } catch (readError) {
      setError(readError.message);
    }
  }

  function reset() {
    setError("");
    setNotice("");
    try {
      resetAppearance();
      setNotice("Appearance reset to the default settings.");
    } catch (resetError) {
      setError(`Could not reset appearance: ${resetError.message}`);
    }
  }

  return (
    <section>
      <div className="page-heading">
        <div><div className="eyebrow">WORKSPACE PREFERENCES</div><h1>Appearance</h1><p>Personalize your workspace colors, typography, and brand icon.</p></div>
        <Button variant="secondary" onClick={reset}>Reset to default</Button>
      </div>
      {error && <div className="alert error-alert" role="alert">{error}</div>}
      {notice && <div className="alert success-alert" role="status">{notice}</div>}
      <div className="appearance-grid">
        <section className="panel appearance-section">
          <div className="panel-heading"><div><h2>Color theme</h2><p>Choose a coordinated workspace palette.</p></div></div>
          <div className="theme-options">
            {Object.entries(PALETTES).map(([key, palette]) => (
              <button key={key} type="button" className={`theme-option${appearance.palette === key ? " selected" : ""}`} onClick={() => save({ palette: key })} aria-pressed={appearance.palette === key}>
                <span className="theme-swatches"><i style={{ backgroundColor: palette.primary }} /><i style={{ backgroundColor: palette.soft }} /><i style={{ backgroundColor: palette.background }} /></span>
                <span>{palette.name}</span>
              </button>
            ))}
          </div>
        </section>
        <section className="panel appearance-section">
          <div className="panel-heading"><div><h2>Font style</h2><p>Set the typeface used throughout the workspace.</p></div></div>
          <label className="appearance-label">Typeface
            <select value={appearance.font} onChange={(event) => save({ font: event.target.value })}>
              {Object.entries(FONTS).map(([key, font]) => <option key={key} value={key}>{font.name}</option>)}
            </select>
          </label>
          <div className="font-preview" style={{ fontFamily: FONTS[appearance.font].family }}>SmartTracker — Quality workspace</div>
        </section>
        <section className="panel appearance-section">
          <div className="panel-heading"><div><h2>Brand icon</h2><p>Choose a symbol or upload your own image for the workspace.</p></div></div>
          <div className="brand-icon-options">
            {Object.entries(BRAND_ICONS).map(([key, Icon]) => (
              <button key={key} type="button" className={`brand-icon-option${!appearance.brandImageData && appearance.icon === key ? " selected" : ""}`} onClick={() => save({ icon: key, brandImageData: "" })} aria-label={`${ICON_NAMES[key]} icon`} aria-pressed={!appearance.brandImageData && appearance.icon === key}>
                <Icon size={20} />
              </button>
            ))}
          </div>
          <div className="brand-image-controls">
            <div className="brand-image-preview">{appearance.brandImageData ? <img src={appearance.brandImageData} alt="Current brand image" /> : <SelectedBrandIcon size={20} />}</div>
            <label className="favicon-upload">Upload brand image<input type="file" accept=".png,.jpg,.jpeg,.webp,image/png,image/jpeg,image/webp" onChange={uploadBrandImage} /></label>
            {appearance.brandImageData && <Button variant="secondary" onClick={() => save({ brandImageData: DEFAULT_APPEARANCE.brandImageData })}>Remove image</Button>}
          </div>
        </section>
        <section className="panel appearance-section">
          <div className="panel-heading"><div><h2>Favicon</h2><p>Upload an image for this browser tab (PNG, JPG, WebP, or ICO; up to 256 KB).</p></div></div>
          <div className="favicon-controls">
            <div className="favicon-preview">{appearance.faviconData ? <img src={appearance.faviconData} alt="Current favicon" /> : <span aria-label="Default favicon"><DefaultIcon size={20} /></span>}</div>
            <label className="favicon-upload">Upload favicon<input type="file" accept=".png,.jpg,.jpeg,.webp,.ico,image/png,image/jpeg,image/webp,image/x-icon,image/vnd.microsoft.icon" onChange={uploadFavicon} /></label>
            {appearance.faviconData && <Button variant="secondary" onClick={() => save({ faviconData: DEFAULT_APPEARANCE.faviconData })}>Remove</Button>}
          </div>
        </section>
      </div>
    </section>
  );
}
