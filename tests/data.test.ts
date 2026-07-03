import { describe, it, expect } from 'vitest';
import { ARCHETYPES, ARCHETYPE_CODES } from '@/data/archetypes';
import { PREMIUM } from '@/data/premiumContent';

// These tests pin the data to what the UI actually promises:
// the sales page sells "6 roles", the report renders "cinco pasos",
// the strengths grid is 2x2, etc. If content edits break a promise,
// this fails before production does.

const CODE_RE = /^[IE][SN][LV][PF]$/;

describe('ARCHETYPES catalogue', () => {
  it('has exactly the 16 valid 4-letter codes', () => {
    const keys = Object.keys(ARCHETYPES);
    expect(keys).toHaveLength(16);
    expect(new Set(keys).size).toBe(16);
    for (const key of keys) {
      expect(key).toMatch(CODE_RE);
      expect(ARCHETYPES[key].code).toBe(key);
    }
    expect([...ARCHETYPE_CODES].sort()).toEqual(keys.sort());
  });

  it('every archetype has the fields the result page renders', () => {
    for (const a of Object.values(ARCHETYPES)) {
      expect(a.name.length).toBeGreaterThan(0);
      expect(a.tagline.length).toBeGreaterThan(0);
      expect(a.description.length).toBeGreaterThan(100);
      expect(a.strengths).toHaveLength(4);          // 2x2 grid
      expect(a.famousExamples.length).toBeGreaterThanOrEqual(2);
      expect(a.growthZone.length).toBeGreaterThan(0);
      expect(a.color).toMatch(/^#[0-9a-fA-F]{6}$/);
      expect(a.emoji.length).toBeGreaterThan(0);
    }
  });

  it('complementaryCodes point to real, different archetypes', () => {
    for (const a of Object.values(ARCHETYPES)) {
      expect(a.complementaryCodes).toHaveLength(2);
      for (const c of a.complementaryCodes) {
        expect(ARCHETYPES[c], `${a.code} → complementario ${c} no existe`).toBeDefined();
        expect(c).not.toBe(a.code);
      }
    }
  });

  it('rarity percentages are plausible and roughly sum to 100', () => {
    let total = 0;
    for (const a of Object.values(ARCHETYPES)) {
      expect(a.rarity).toBeGreaterThanOrEqual(1);
      expect(a.rarity).toBeLessThanOrEqual(25);
      total += a.rarity;
    }
    expect(total).toBeGreaterThanOrEqual(85);
    expect(total).toBeLessThanOrEqual(115);
  });
});

describe('PREMIUM content', () => {
  it('covers exactly the same 16 codes as ARCHETYPES', () => {
    expect(Object.keys(PREMIUM).sort()).toEqual(Object.keys(ARCHETYPES).sort());
    for (const [key, p] of Object.entries(PREMIUM)) {
      expect(p.code).toBe(key);
    }
  });

  it('delivers what the sales page promises', () => {
    for (const p of Object.values(PREMIUM)) {
      expect(p.idealRoles, `${p.code}: la venta promete 6 roles`).toHaveLength(6);
      expect(p.actionPlan, `${p.code}: el reporte dice "cinco pasos"`).toHaveLength(5);
      expect(p.careerPitfalls.length, `${p.code}: la venta promete 3 errores típicos`).toBeGreaterThanOrEqual(3);
      expect(p.energyDrains.length).toBeGreaterThanOrEqual(3);
    }
  });

  it('every text field the report renders is non-empty', () => {
    for (const p of Object.values(PREMIUM)) {
      for (const field of [
        'deepDive', 'communicationStyle', 'workEnvironment', 'negotiationStyle',
        'shadowTitle', 'shadowDescription', 'deepFear', 'healingPath',
        'shadowQuote', 'loveStyle', 'conflictPattern',
      ] as const) {
        expect(p[field].trim().length, `${p.code}.${field} vacío`).toBeGreaterThan(0);
      }
    }
  });
});
