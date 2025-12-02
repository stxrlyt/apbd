import { describe, it, expect } from 'vitest';
import {
  ROLES,
  canCreateDraft,
  canApproveDraft,
  canViewDraft,
  canEditDraft,
  canDeleteDraft,
  canAuditDraft,
  hasFullAccess,
} from './permissions';

describe('Permissions', () => {
  describe('canCreateDraft', () => {
    it('should allow admin to create drafts', () => {
      expect(canCreateDraft(ROLES.ADMIN)).toBe(true);
    });

    it('should allow secretary to create drafts', () => {
      expect(canCreateDraft(ROLES.SECRETARY)).toBe(true);
    });

    it('should not allow kades to create drafts', () => {
      expect(canCreateDraft(ROLES.KADES)).toBe(false);
    });

    it('should not allow other roles to create drafts', () => {
      expect(canCreateDraft(ROLES.OTHER)).toBe(false);
    });

    it('should handle null/undefined role', () => {
      expect(canCreateDraft(null)).toBe(false);
      expect(canCreateDraft(undefined)).toBe(false);
    });
  });

  describe('canApproveDraft', () => {
    it('should allow admin to approve drafts', () => {
      expect(canApproveDraft(ROLES.ADMIN)).toBe(true);
    });

    it('should allow secretary to approve drafts', () => {
      expect(canApproveDraft(ROLES.SECRETARY)).toBe(true);
    });

    it('should allow kades to approve drafts', () => {
      expect(canApproveDraft(ROLES.KADES)).toBe(true);
    });

    it('should not allow other roles to approve drafts', () => {
      expect(canApproveDraft(ROLES.OTHER)).toBe(false);
    });
  });

  describe('canViewDraft', () => {
    it('should allow all roles to view drafts', () => {
      expect(canViewDraft(ROLES.ADMIN)).toBe(true);
      expect(canViewDraft(ROLES.SECRETARY)).toBe(true);
      expect(canViewDraft(ROLES.KADES)).toBe(true);
      expect(canViewDraft(ROLES.OTHER)).toBe(true);
    });
  });

  describe('canEditDraft', () => {
    it('should allow admin to edit drafts', () => {
      expect(canEditDraft(ROLES.ADMIN)).toBe(true);
    });

    it('should allow secretary to edit drafts', () => {
      expect(canEditDraft(ROLES.SECRETARY)).toBe(true);
    });

    it('should not allow kades to edit drafts', () => {
      expect(canEditDraft(ROLES.KADES)).toBe(false);
    });

    it('should not allow other roles to edit drafts', () => {
      expect(canEditDraft(ROLES.OTHER)).toBe(false);
    });
  });

  describe('canDeleteDraft', () => {
    it('should allow admin to delete drafts', () => {
      expect(canDeleteDraft(ROLES.ADMIN)).toBe(true);
    });

    it('should allow secretary to delete drafts', () => {
      expect(canDeleteDraft(ROLES.SECRETARY)).toBe(true);
    });

    it('should not allow kades to delete drafts', () => {
      expect(canDeleteDraft(ROLES.KADES)).toBe(false);
    });

    it('should not allow other roles to delete drafts', () => {
      expect(canDeleteDraft(ROLES.OTHER)).toBe(false);
    });
  });

  describe('canAuditDraft', () => {
    it('should allow all roles to audit drafts', () => {
      expect(canAuditDraft(ROLES.ADMIN)).toBe(true);
      expect(canAuditDraft(ROLES.SECRETARY)).toBe(true);
      expect(canAuditDraft(ROLES.KADES)).toBe(true);
      expect(canAuditDraft(ROLES.OTHER)).toBe(true);
    });
  });

  describe('hasFullAccess', () => {
    it('should return true for admin', () => {
      expect(hasFullAccess(ROLES.ADMIN)).toBe(true);
    });

    it('should return true for secretary', () => {
      expect(hasFullAccess(ROLES.SECRETARY)).toBe(true);
    });

    it('should return false for kades', () => {
      expect(hasFullAccess(ROLES.KADES)).toBe(false);
    });

    it('should return false for other roles', () => {
      expect(hasFullAccess(ROLES.OTHER)).toBe(false);
    });
  });
});

