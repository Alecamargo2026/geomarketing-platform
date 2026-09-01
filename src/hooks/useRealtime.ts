import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { createClient } from '@supabase/supabase-js';
import toast from 'react-hot-toast';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export function useRealtimeCustomers(brandId: string | null) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!brandId) return;

    const channel = supabase.channel(`customers-brand-${brandId}`, {
      config: { broadcast: { self: true } },
    });

    channel
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'customers',
          filter: `brand_id=eq.${brandId}`,
        },
        (payload: any) => {
          // Invalidar cache para atualizar dados
          queryClient.invalidateQueries({ queryKey: ['customers', brandId] });

          // Mostrar notificação
          if (payload.eventType === 'INSERT') {
            toast.success(`Novo cliente: ${payload.new.razaoSocial || 'Sem nome'}`);
          } else if (payload.eventType === 'UPDATE') {
            toast.info(`Cliente atualizado: ${payload.new.razaoSocial || 'Sem nome'}`);
          } else if (payload.eventType === 'DELETE') {
            toast.error(`Cliente removido: ${payload.old.razaoSocial || 'Sem nome'}`);
          }
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [brandId, queryClient]);
}

export function useRealtimeSales(brandId: string | null) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!brandId) return;

    const channel = supabase.channel(`sales-brand-${brandId}`, {
      config: { broadcast: { self: true } },
    });

    channel
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'sales',
          filter: `brand_id=eq.${brandId}`,
        },
        (payload: any) => {
          // Invalidar cache para atualizar dados
          queryClient.invalidateQueries({ queryKey: ['sales', brandId] });

          // Mostrar notificação
          if (payload.eventType === 'INSERT') {
            const valor = payload.new.valorTotal || 0;
            toast.success(`Nova venda: R$ ${valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`);
          }
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [brandId, queryClient]);
}

export function useRealtimeAuditLogs() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase.channel('audit-logs', {
      config: { broadcast: { self: true } },
    });

    channel
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'audit_logs',
        },
        (payload: any) => {
          // Invalidar cache para atualizar dados
          queryClient.invalidateQueries({ queryKey: ['audit-logs'] });
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [queryClient]);
}
