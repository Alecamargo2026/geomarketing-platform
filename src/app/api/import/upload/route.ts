import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { parseExcelFile } from '@/services/excelParser';
import { CustomerImportSchema, PriorityImportSchema, SaleImportSchema } from '@/lib/validators/importSchema';
import { ZodError } from 'zod';

export const dynamic = 'force-dynamic';

function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase environment variables');
  }

  return createClient(supabaseUrl, supabaseServiceKey);
}

export async function POST(request: NextRequest) {
  const supabase = getSupabaseClient();
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const brandId = formData.get('brandId') as string;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!brandId) {
      return NextResponse.json({ error: 'Brand ID is required' }, { status: 400 });
    }

    // Parse Excel file
    const parsedData = await parseExcelFile(file);

    // Create import log
    const { data: importLog, error: logError } = await supabase
      .from('import_logs')
      .insert([
        {
          user_id: user.id,
          brand_id: brandId,
          filename: file.name,
          status: 'processing',
          imported_count: 0,
          error_count: 0,
        },
      ])
      .select()
      .single();

    if (logError) {
      return NextResponse.json({ error: logError.message }, { status: 500 });
    }

    let importedCount = 0;
    let errorCount = 0;
    const errors: string[] = [];

    // Process analysis data (customers)
    for (let i = 0; i < parsedData.analysisData.length; i++) {
      try {
        const row = parsedData.analysisData[i];
        
        // Validate
        const validated = CustomerImportSchema.parse(row);

        // Check for duplicate
        const { data: existing } = await supabase
          .from('customers')
          .select('id')
          .eq('cnpj', validated.cnpj)
          .eq('brand_id', brandId)
          .single();

        if (existing) {
          // Update existing
          await supabase
            .from('customers')
            .update({
              name: validated.razao_social,
              email: validated.email,
              phone: validated.telefone,
              status: validated.status,
            })
            .eq('id', existing.id);
        } else {
          // Create new
          await supabase
            .from('customers')
            .insert([
              {
                user_id: user.id,
                brand_id: brandId,
                cnpj: validated.cnpj,
                name: validated.razao_social,
                email: validated.email,
                phone: validated.telefone,
                city: validated.cidade,
                state: validated.estado,
                address: validated.endereco,
                status: validated.status,
              },
            ]);
        }

        importedCount++;
      } catch (error) {
        errorCount++;
        if (error instanceof ZodError) {
          errors.push(`Row ${i + 1}: ${error.issues.map(e => e.message).join(', ')}`);
        } else {
          errors.push(`Row ${i + 1}: ${String(error)}`);
        }
      }
    }

    // Process priority data
    for (let i = 0; i < parsedData.priorityData.length; i++) {
      try {
        const row = parsedData.priorityData[i];
        
        // Validate
        const validated = PriorityImportSchema.parse(row);

        // Find customer
        const { data: customer } = await supabase
          .from('customers')
          .select('id')
          .eq('cnpj', validated.cnpj)
          .eq('brand_id', brandId)
          .single();

        if (customer) {
          // Update priority
          await supabase
            .from('customers')
            .update({
              priority_score: validated.priority_score,
              last_visit: validated.last_visit,
              next_visit: validated.next_visit,
            })
            .eq('id', customer.id);
        }
      } catch (error) {
        errorCount++;
        if (error instanceof ZodError) {
          errors.push(`Priority Row ${i + 1}: ${error.issues.map(e => e.message).join(', ')}`);
        }
      }
    }

    // Process transaction data
    for (let i = 0; i < parsedData.transactionData.length; i++) {
      try {
        const row = parsedData.transactionData[i];
        
        // Validate
        const validated = SaleImportSchema.parse(row);

        // Find customer
        const { data: customer } = await supabase
          .from('customers')
          .select('id')
          .eq('cnpj', validated.cnpj)
          .eq('brand_id', brandId)
          .single();

        if (customer) {
          // Create sale
          await supabase
            .from('sales')
            .insert([
              {
                user_id: user.id,
                brand_id: brandId,
                customer_id: customer.id,
                amount: validated.valor,
                quantity: validated.quantidade,
                product: validated.produto,
                sale_date: validated.data_venda,
                representante_id: validated.representante_id,
              },
            ]);

          // Update customer revenue
          const { data: sales } = await supabase
            .from('sales')
            .select('amount')
            .eq('customer_id', customer.id);

          const totalRevenue = (sales || []).reduce((sum, s) => sum + (s.amount || 0), 0);

          await supabase
            .from('customers')
            .update({ revenue: totalRevenue })
            .eq('id', customer.id);
        }
      } catch (error) {
        errorCount++;
        if (error instanceof ZodError) {
          errors.push(`Transaction Row ${i + 1}: ${error.issues.map(e => e.message).join(', ')}`);
        }
      }
    }

    // Update import log
    await supabase
      .from('import_logs')
      .update({
        status: 'completed',
        imported_count: importedCount,
        error_count: errorCount,
        errors: errors.slice(0, 100).join('\n'),
        completed_at: new Date().toISOString(),
      })
      .eq('id', importLog.id);

    return NextResponse.json({
      success: true,
      imported_count: importedCount,
      error_count: errorCount,
      errors: errors.slice(0, 10),
      total_errors: errors.length,
    });
  } catch (error) {
    console.error('Import error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
