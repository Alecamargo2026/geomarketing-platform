import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import * as XLSX from 'xlsx';

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

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: 'array' });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(worksheet);

    // Create import log
    const { data: importLog, error: logError } = await supabase
      .from('import_logs')
      .insert([
        {
          user_id: user.id,
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

    // Process each row
    for (const row of data) {
      try {
        const rowData = row as Record<string, any>;
        
        // Get city
        const { data: cities } = await supabase
          .from('cities')
          .select('id')
          .eq('name', rowData.city)
          .eq('state_code', rowData.state)
          .single();

        if (!cities) {
          errorCount++;
          errors.push(`Row ${importedCount + 1}: City not found`);
          continue;
        }

        // Insert customer
        const { error: insertError } = await supabase
          .from('customers')
          .insert([
            {
              user_id: user.id,
              name: rowData.name,
              cnpj: rowData.cnpj,
              email: rowData.email,
              phone: rowData.phone,
              city_id: cities.id,
              state_code: rowData.state,
              revenue: parseFloat(rowData.revenue) || 0,
              status: rowData.status || 'prospect',
              visit_frequency: rowData.visit_frequency,
              notes: rowData.notes,
            },
          ]);

        if (insertError) {
          errorCount++;
          errors.push(`Row ${importedCount + 1}: ${insertError.message}`);
        } else {
          importedCount++;
        }
      } catch (error) {
        errorCount++;
        errors.push(`Row ${importedCount + 1}: ${String(error)}`);
      }
    }

    // Update import log
    await supabase
      .from('import_logs')
      .update({
        status: 'completed',
        imported_count: importedCount,
        error_count: errorCount,
        errors: errors.join('\n'),
        completed_at: new Date().toISOString(),
      })
      .eq('id', importLog.id);

    return NextResponse.json({
      success: true,
      imported_count: importedCount,
      error_count: errorCount,
      errors,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
