'use client';

import { useEffect, useState } from 'react';
import { useBrandStore } from '@/store/brandStore';

interface Brand {
  id: string;
  name: string;
  logo?: string;
}

export function BrandSelector() {
  const { selectedBrandId, setSelectedBrandId } = useBrandStore();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await fetch('/api/brands');
        if (response.ok) {
          const data = await response.json();
          setBrands(data);
          if (!selectedBrandId && data.length > 0) {
            setSelectedBrandId(data[0].id);
          }
        }
      } catch (error) {
        console.error('Erro ao buscar marcas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, [selectedBrandId, setSelectedBrandId]);

  if (loading) {
    return <div className="h-10 bg-gray-200 rounded animate-pulse" />;
  }

  return (
    <select
      value={selectedBrandId || ''}
      onChange={(e) => setSelectedBrandId(e.target.value || null)}
      className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 font-medium hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <option value="">Selecione uma marca...</option>
      {brands.map((brand) => (
        <option key={brand.id} value={brand.id}>
          {brand.name}
        </option>
      ))}
    </select>
  );
}
