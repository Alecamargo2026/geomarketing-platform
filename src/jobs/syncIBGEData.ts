import cron from 'node-cron';
import { createClient } from '@supabase/supabase-js';
import { getIBGEData, calculatePotential, calculateGap } from '@/services/ibgeService';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export function startIBGESyncJob() {
  // Rodar diariamente às 2AM UTC
  cron.schedule('0 2 * * *', async () => {
    console.log('[IBGE Sync] Iniciando sincronização de dados IBGE...');

    try {
      // Buscar todos os bairros
      const { data: neighborhoods, error: fetchError } = await supabase
        .from('geo_neighborhoods')
        .select('id, city, state, population');

      if (fetchError) {
        console.error('[IBGE Sync] Erro ao buscar bairros:', fetchError);
        return;
      }

      if (!neighborhoods || neighborhoods.length === 0) {
        console.log('[IBGE Sync] Nenhum bairro encontrado');
        return;
      }

      let updated = 0;
      let errors = 0;

      // Processar cada bairro
      for (const neighborhood of neighborhoods) {
        try {
          // Buscar dados IBGE
          const ibgeData = await getIBGEData(neighborhood.city, neighborhood.state);

          if (!ibgeData) {
            console.warn(`[IBGE Sync] Dados não encontrados para ${neighborhood.city}, ${neighborhood.state}`);
            errors++;
            continue;
          }

          // Calcular potencial (usando população placeholder)
          const potential = calculatePotential(
            neighborhood.population || 100000,
            35000, // PIB per capita médio Brasil
            0.15 // Taxa comercial 15%
          );

          // Buscar faturamento atual
          const { data: sales } = await supabase
            .from('sales')
            .select('amount')
            .eq('neighborhood_id', neighborhood.id);

          const currentRevenue = (sales || []).reduce((sum, s) => sum + (s.amount || 0), 0);

          // Calcular gap
          const gap = calculateGap(potential, currentRevenue);

          // Atualizar bairro
          const { error: updateError } = await supabase
            .from('geo_neighborhoods')
            .update({
              potential_market: potential,
              gap_percentage: gap.percentage,
              gap_reais: gap.reais,
              ibge_data: ibgeData,
              last_ibge_sync: new Date().toISOString(),
            })
            .eq('id', neighborhood.id);

          if (updateError) {
            console.error(`[IBGE Sync] Erro ao atualizar ${neighborhood.city}:`, updateError);
            errors++;
          } else {
            updated++;
          }
        } catch (error) {
          console.error(`[IBGE Sync] Erro ao processar ${neighborhood.city}:`, error);
          errors++;
        }
      }

      console.log(`[IBGE Sync] Sincronização concluída: ${updated} atualizados, ${errors} erros`);
    } catch (error) {
      console.error('[IBGE Sync] Erro geral:', error);
    }
  });

  console.log('[IBGE Sync] Job agendado para rodar diariamente às 2AM UTC');
}
