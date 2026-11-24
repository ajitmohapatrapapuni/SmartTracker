export function required(value, label) {
  if (!String(value || "").trim()) throw new Error(`${label} is required.`);
}

export function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}
