'use client';

import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { createClient } from '@supabase/supabase-js';
import { toast } from 'react-hot-toast';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export function useRealtime(brandId: string | null, tables: string[] = ['customers', 'sales']) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!brandId) return;

    const channels = tables.map((table) => {
      const channel = supabase
        .channel(`${table}:${brandId}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: table,
            filter: `brand_id=eq.${brandId}`,
          },
          (payload) => {
            // Invalidar queries relacionadas
            queryClient.invalidateQueries({ queryKey: [table, brandId] });

            // Mostrar notificação
            if (payload.eventType === 'INSERT') {
              toast.success(`Novo registro adicionado em ${table}`);
            } else if (payload.eventType === 'UPDATE') {
              toast.success(`Registro atualizado em ${table}`);
            } else if (payload.eventType === 'DELETE') {
              toast.success(`Registro removido de ${table}`);
            }
          }
        )
        .subscribe();

      return channel;
    });

    return () => {
      channels.forEach((channel) => {
        supabase.removeChannel(channel);
      });
    };
  }, [brandId, queryClient, tables]);
}
