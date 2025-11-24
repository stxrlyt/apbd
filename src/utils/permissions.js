// Role definitions
export const ROLES = {
  ADMIN: "admin",
  SECRETARY: "secretary",
  KADES: "kades",
  OTHER: "other"
};

// Permission checks
export function canCreateDraft(role) {
  return role === ROLES.ADMIN || role === ROLES.SECRETARY;
}

export function canApproveDraft(role) {
  return role === ROLES.KADES || role === ROLES.ADMIN || role === ROLES.SECRETARY;
}

export function canViewDraft(role) {
  // Everyone can view drafts
  return true;
}

export function canEditDraft(role) {
  return role === ROLES.ADMIN || role === ROLES.SECRETARY;
}

export function canDeleteDraft(role) {
  return role === ROLES.ADMIN || role === ROLES.SECRETARY;
}

export function canAuditDraft(role) {
  // Everyone can audit (read-only view)
  return true;
}

export function hasFullAccess(role) {
  return role === ROLES.ADMIN || role === ROLES.SECRETARY;
}

