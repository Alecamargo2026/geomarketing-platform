import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface BrandStore {
  selectedBrandId: string | null;
  setSelectedBrandId: (brandId: string | null) => void;
}

export const useBrandStore = create<BrandStore>()(
  persist(
    (set) => ({
      selectedBrandId: null,
      setSelectedBrandId: (brandId) => set({ selectedBrandId: brandId }),
    }),
    {
      name: 'brand-store',
      storage: typeof window !== 'undefined' ? createJSONStorage(() => localStorage) : undefined,
    }
  )
);
