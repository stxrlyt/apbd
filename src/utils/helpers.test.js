import { describe, it, expect, vi } from 'vitest';
import { uid, now } from './helpers';

describe('Helpers', () => {
  describe('uid', () => {
    it('should generate a unique ID string', () => {
      const id = uid();
      expect(typeof id).toBe('string');
      expect(id.length).toBeGreaterThan(0);
    });

    it('should generate different IDs on each call', () => {
      const id1 = uid();
      const id2 = uid();
      expect(id1).not.toBe(id2);
    });

    it('should generate IDs with alphanumeric characters', () => {
      const id = uid();
      expect(id).toMatch(/^[a-z0-9]+$/i);
    });
  });

  describe('now', () => {
    it('should return a valid ISO string', () => {
      const timestamp = now();
      expect(typeof timestamp).toBe('string');
      expect(() => new Date(timestamp)).not.toThrow();
    });

    it('should return current time in ISO format', () => {
      const timestamp = now();
      const date = new Date(timestamp);
      const nowDate = new Date();
      
      // Should be within 1 second of current time
      const diff = Math.abs(nowDate.getTime() - date.getTime());
      expect(diff).toBeLessThan(1000);
    });

    it('should match ISO 8601 format', () => {
      const timestamp = now();
      expect(timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
    });
  });
});

