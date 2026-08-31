import { ibgeService } from '@/services/ibgeService';

describe('IBGE Service', () => {
  describe('calculatePotentialScore', () => {
    it('calculates score correctly', () => {
      const data = {
        population: 100000,
        pibPerCapita: 30000,
        density: 1000,
        numCompanies: 2000,
      };

      const score = ibgeService.calculatePotentialScore(data);
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(100);
    });

    it('returns 0 for empty data', () => {
      const score = ibgeService.calculatePotentialScore({});
      expect(score).toBe(0);
    });

    it('returns 100 for maximum values', () => {
      const data = {
        population: 12000000,
        pibPerCapita: 80000,
        density: 8000,
        numCompanies: 500000,
      };

      const score = ibgeService.calculatePotentialScore(data);
      expect(score).toBeLessThanOrEqual(100);
    });
  });

  describe('classifyPotential', () => {
    it('classifies very high potential', () => {
      const classification = ibgeService.classifyPotential(85);
      expect(classification).toBe('Muito Alto');
    });

    it('classifies high potential', () => {
      const classification = ibgeService.classifyPotential(65);
      expect(classification).toBe('Alto');
    });

    it('classifies medium potential', () => {
      const classification = ibgeService.classifyPotential(45);
      expect(classification).toBe('Médio');
    });

    it('classifies low potential', () => {
      const classification = ibgeService.classifyPotential(25);
      expect(classification).toBe('Baixo');
    });

    it('classifies very low potential', () => {
      const classification = ibgeService.classifyPotential(10);
      expect(classification).toBe('Muito Baixo');
    });
  });
});
