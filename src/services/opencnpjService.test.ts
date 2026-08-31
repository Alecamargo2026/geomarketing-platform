import { fetchCompanyByCNPJ, classifyCompanySize } from '@/services/opencnpjService';

describe('OpenCNPJ Service', () => {
  describe('classifyCompanySize', () => {
    it('classifies microempresa', () => {
      const size = classifyCompanySize(1);
      expect(size).toBe('Microempresa');
    });

    it('classifies pequena empresa', () => {
      const size = classifyCompanySize(3);
      expect(size).toBe('Pequena');
    });

    it('classifies média empresa', () => {
      const size = classifyCompanySize(10);
      expect(size).toBe('Média');
    });

    it('classifies grande empresa', () => {
      const size = classifyCompanySize(50);
      expect(size).toBe('Grande');
    });
  });

  describe('fetchCompanyByCNPJ', () => {
    it('returns null for invalid CNPJ', async () => {
      const company = await fetchCompanyByCNPJ('00.000.000/0000-00');
      expect(company).toBeNull();
    });

    it('handles network errors gracefully', async () => {
      const company = await fetchCompanyByCNPJ('invalid');
      expect(company).toBeNull();
    });
  });
});
