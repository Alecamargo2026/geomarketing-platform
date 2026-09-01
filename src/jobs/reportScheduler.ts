import cron from 'node-cron';
import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';
import { generatePDFReport } from '@/services/reportGenerator';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Configurar transporter de email
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

/**
 * Job para gerar e enviar relatórios mensais
 * Executa no 1º dia de cada mês às 8AM UTC
 */
export function startReportSchedulerJob() {
  // Executar no 1º dia do mês às 8AM UTC (0 8 1 * *)
  cron.schedule('0 8 1 * *', async () => {
    console.log('[Report Scheduler] Iniciando geração de relatórios mensais...');

    try {
      // Buscar todos os tenants
      const { data: tenants, error: tenantsError } = await supabase
        .from('tenants')
        .select('id, name, email');

      if (tenantsError) throw tenantsError;

      if (!tenants || tenants.length === 0) {
        console.log('[Report Scheduler] Nenhum tenant encontrado');
        return;
      }

      // Para cada tenant
      for (const tenant of tenants) {
        try {
          // Buscar todas as marcas do tenant
          const { data: brands, error: brandsError } = await supabase
            .from('brands')
            .select('id, name')
            .eq('tenant_id', tenant.id);

          if (brandsError) throw brandsError;

          // Para cada marca
          for (const brand of brands || []) {
            try {
              // Buscar dados do mês anterior
              const now = new Date();
              const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
              const monthStart = lastMonth.toISOString().split('T')[0];
              const monthEnd = new Date(lastMonth.getFullYear(), lastMonth.getMonth() + 1, 0)
                .toISOString()
                .split('T')[0];

              // Buscar clientes
              const { data: customers } = await supabase
                .from('customers')
                .select('cnpj, razaoSocial, revenue, status, representante')
                .eq('brand_id', brand.id)
                .eq('tenant_id', tenant.id);

              // Buscar vendas do período
              const { data: _sales } = await supabase
                .from('sales')
                .select('amount, created_at, product')
                .eq('brand_id', brand.id)
                .eq('tenant_id', tenant.id)
                .gte('created_at', monthStart)
                .lte('created_at', monthEnd);

              // Calcular KPIs
              const totalRevenue = (customers || []).reduce((sum, c) => sum + (c.revenue || 0), 0);
              const activeCustomers = (customers || []).filter((c) => c.status === 'ativo').length;
              const coverage = customers && customers.length > 0 ? (activeCustomers / customers.length) * 100 : 0;

              // Gerar PDF
              const pdfBuffer = generatePDFReport({
                brand: brand.name,
                month: lastMonth.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }),
                totalRevenue,
                coverage,
                gapCount: 0,
                customers: (customers || []).map((c) => ({
                  cnpj: c.cnpj,
                  razaoSocial: c.razaoSocial,
                  faturamento: c.revenue || 0,
                  status: c.status,
                  representante: c.representante,
                })),
                gaps: [],
              });

              // Buscar managers para enviar email
              const { data: managers } = await supabase
                .from('users')
                .select('email, name')
                .eq('tenant_id', tenant.id)
                .eq('role', 'manager');

              // Enviar email para cada manager
              for (const manager of managers || []) {
                try {
                  await transporter.sendMail({
                    from: process.env.SMTP_FROM,
                    to: manager.email,
                    subject: `Relatório Mensal - ${brand.name} - ${lastMonth.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}`,
                    html: `
                      <h2>Relatório Mensal de Vendas</h2>
                      <p>Olá ${manager.name},</p>
                      <p>Segue em anexo o relatório mensal de vendas para a marca <strong>${brand.name}</strong>.</p>
                      <p><strong>Resumo:</strong></p>
                      <ul>
                        <li>Faturamento Total: R$ ${totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</li>
                        <li>Clientes Ativos: ${activeCustomers}</li>
                        <li>Cobertura: ${coverage.toFixed(1)}%</li>
                      </ul>
                      <p>Atenciosamente,<br/>Sistema GeoMarketing</p>
                    `,
                    attachments: [
                      {
                        filename: `relatorio_${brand.name}_${lastMonth.getFullYear()}-${String(lastMonth.getMonth() + 1).padStart(2, '0')}.pdf`,
                        content: pdfBuffer,
                        contentType: 'application/pdf',
                      },
                    ],
                  });

                  console.log(`[Report Scheduler] Email enviado para ${manager.email}`);
                } catch (emailError) {
                  console.error(`[Report Scheduler] Erro ao enviar email para ${manager.email}:`, emailError);
                }
              }
            } catch (brandError) {
              console.error(`[Report Scheduler] Erro ao processar marca ${brand.name}:`, brandError);
            }
          }
        } catch (tenantError) {
          console.error(`[Report Scheduler] Erro ao processar tenant ${tenant.name}:`, tenantError);
        }
      }

      console.log('[Report Scheduler] Geração de relatórios concluída');
    } catch (error) {
      console.error('[Report Scheduler] Erro geral:', error);
    }
  });

  console.log('[Report Scheduler] Job agendado para 1º dia do mês às 8AM UTC');
}

// Executar job ao iniciar a aplicação (apenas em produção)
if (process.env.NODE_ENV === 'production') {
  startReportSchedulerJob();
}
