import cron from 'node-cron';
import { createClient } from '@supabase/supabase-js';
import { ibgeService } from '@/services/ibgeService';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * Job para sincronizar dados IBGE diariamente
 * Executa às 2AM UTC todos os dias
 */
export function startIBGESyncJob() {
  // Executar às 2AM UTC (0 2 * * *)
  cron.schedule('0 2 * * *', async () => {
    console.log('[IBGE Sync] Iniciando sincronização de dados IBGE...');

    try {
      // Buscar todos os bairros/neighborhoods
      const { data: neighborhoods, error: fetchError } = await supabase
        .from('geo_neighborhoods')
        .select('id, name, cityName, state, population, potentialMarket');

      if (fetchError) throw fetchError;

      if (!neighborhoods || neighborhoods.length === 0) {
        console.log('[IBGE Sync] Nenhum bairro encontrado para sincronizar');
        return;
      }

      let updated = 0;
      let failed = 0;

      // Processar cada bairro
      for (const neighborhood of neighborhoods) {
        try {
          // Buscar dados IBGE
          const ibgeData = await ibgeService.getIBGEData(neighborhood.cityName, neighborhood.state);

          if (!ibgeData) {
            console.warn(`[IBGE Sync] Dados não encontrados para ${neighborhood.cityName}, ${neighborhood.state}`);
            failed++;
            continue;
          }

          // Calcular potencial
          const potential = ibgeService.calculatePotential(
            ibgeData.population || 0,
            ibgeData.pibPerCapita || 0
          );

          // Buscar receita atual do bairro
          const { data: customers } = await supabase
            .from('customers')
            .select('revenue')
            .eq('neighborhood_id', neighborhood.id);

          const totalRevenue = (customers || []).reduce((sum, c) => sum + (c.revenue || 0), 0);

          // Calcular gap
          const gap = ibgeService.calculateGap(potential, totalRevenue);

          // Atualizar neighborhood
          const { error: updateError } = await supabase
            .from('geo_neighborhoods')
            .update({
              population: ibgeData.population,
              potentialMarket: potential,
              uncoveredPotential: gap.reais,
              coveragePercentage: totalRevenue > 0 ? (totalRevenue / potential) * 100 : 0,
              lastIBGESync: new Date().toISOString(),
            })
            .eq('id', neighborhood.id);

          if (updateError) throw updateError;

          updated++;
        } catch (error) {
          console.error(`[IBGE Sync] Erro ao processar ${neighborhood.cityName}:`, error);
          failed++;
        }
      }

      console.log(`[IBGE Sync] Concluído: ${updated} atualizados, ${failed} falhados`);
    } catch (error) {
      console.error('[IBGE Sync] Erro geral:', error);
    }
  });

  console.log('[IBGE Sync] Job agendado para 2AM UTC diariamente');
}

// Executar job ao iniciar a aplicação (apenas em produção)
if (process.env.NODE_ENV === 'production') {
  startIBGESyncJob();
}
