import cron from 'node-cron';
import { createClient } from '@supabase/supabase-js';
import { generatePDFReport } from '@/services/reportGenerator';
import nodemailer from 'nodemailer';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Configurar transporter de email (usar variáveis de ambiente)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export function startReportSchedulerJob() {
  // Rodar no 1º dia do mês às 8AM UTC
  cron.schedule('0 8 1 * *', async () => {
    console.log('[Report Scheduler] Iniciando geração de relatórios mensais...');

    try {
      // Buscar todas as marcas
      const { data: brands, error: brandsError } = await supabase
        .from('brands')
        .select('id, name, email');

      if (brandsError) {
        console.error('[Report Scheduler] Erro ao buscar marcas:', brandsError);
        return;
      }

      if (!brands || brands.length === 0) {
        console.log('[Report Scheduler] Nenhuma marca encontrada');
        return;
      }

      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      const monthStr = lastMonth.toLocaleDateString('pt-BR', { month: '2-digit', year: 'numeric' });

      // Gerar relatório para cada marca
      for (const brand of brands) {
        try {
          // Buscar dados da marca
          const { data: customers } = await supabase
            .from('customers')
            .select('name, revenue, status')
            .eq('brand_id', brand.id);

          // Calcular KPIs
          const totalRevenue = (customers || []).reduce((sum, c) => sum + (c.revenue || 0), 0);
          const coverage = customers ? (customers.length / 1000) * 100 : 0;
          const gaps = (customers || []).filter(c => c.status === 'prospect').length;

          const topCustomers = (customers || [])
            .sort((a, b) => (b.revenue || 0) - (a.revenue || 0))
            .slice(0, 10)
            .map(c => ({
              name: c.name,
              revenue: c.revenue || 0,
              status: c.status,
            }));

          // Gerar PDF
          const pdfBuffer = generatePDFReport({
            brandName: brand.name,
            month: monthStr,
            totalRevenue,
            coverage,
            gaps,
            topCustomers,
            gapAnalysis: [],
          });

          // Enviar email
          if (brand.email) {
            await transporter.sendMail({
              from: process.env.SMTP_FROM,
              to: brand.email,
              subject: `Relatório Mensal - ${brand.name} - ${monthStr}`,
              html: `
                <h2>Relatório Mensal - ${brand.name}</h2>
                <p>Período: ${monthStr}</p>
                <p>Faturamento Total: R$ ${totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                <p>Cobertura: ${coverage.toFixed(1)}%</p>
                <p>Zonas Brancas: ${gaps}</p>
                <p>Relatório em anexo.</p>
              `,
              attachments: [
                {
                  filename: `relatorio_${brand.id}_${monthStr.replace('/', '-')}.pdf`,
                  content: pdfBuffer,
                  contentType: 'application/pdf',
                },
              ],
            });

            console.log(`[Report Scheduler] Relatório enviado para ${brand.name}`);
          }

          // Salvar registro de relatório
          await supabase.from('reports').insert({
            brand_id: brand.id,
            month: monthStr,
            total_revenue: totalRevenue,
            coverage: coverage,
            gaps_count: gaps,
            generated_at: new Date().toISOString(),
          });
        } catch (error) {
          console.error(`[Report Scheduler] Erro ao processar marca ${brand.name}:`, error);
        }
      }

      console.log('[Report Scheduler] Geração de relatórios concluída');
    } catch (error) {
      console.error('[Report Scheduler] Erro geral:', error);
    }
  });

  console.log('[Report Scheduler] Job agendado para rodar no 1º dia do mês às 8AM UTC');
}
