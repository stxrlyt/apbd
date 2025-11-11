// ---------- Mock utilities ----------
export const uid = () => Math.random().toString(36).slice(2, 9);
export const now = () => new Date().toISOString();