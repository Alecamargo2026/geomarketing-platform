import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  // Dados mock de concorrentes
  const competitors = [
    {
      id: 'competitor-1',
      name: 'Concorrente A',
      city: 'Rio de Janeiro',
      state: 'RJ',
      neighborhood: 'Centro',
      lat: -22.9068,
      lng: -43.1729,
      marketShare: 15,
      presence: 'strong',
    },
    {
      id: 'competitor-2',
      name: 'Concorrente B',
      city: 'Rio de Janeiro',
      state: 'RJ',
      neighborhood: 'Copacabana',
      lat: -22.9829,
      lng: -43.1899,
      marketShare: 12,
      presence: 'medium',
    },
    {
      id: 'competitor-3',
      name: 'Concorrente C',
      city: 'Rio de Janeiro',
      state: 'RJ',
      neighborhood: 'Ipanema',
      lat: -22.9868,
      lng: -43.2025,
      marketShare: 10,
      presence: 'medium',
    },
    {
      id: 'competitor-4',
      name: 'Concorrente D',
      city: 'Rio de Janeiro',
      state: 'RJ',
      neighborhood: 'Leblon',
      lat: -22.9971,
      lng: -43.2256,
      marketShare: 8,
      presence: 'weak',
    },
    {
      id: 'competitor-5',
      name: 'Concorrente E',
      city: 'Niterói',
      state: 'RJ',
      neighborhood: 'Niterói Centro',
      lat: -22.8833,
      lng: -43.1,
      marketShare: 5,
      presence: 'weak',
    },
  ];

  return NextResponse.json({
    success: true,
    data: competitors,
    timestamp: new Date().toISOString(),
  });
}
