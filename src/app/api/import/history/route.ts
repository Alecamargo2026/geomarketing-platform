import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const brandId = searchParams.get('brand');

    if (!brandId) {
      return NextResponse.json(
        { error: 'Brand ID é obrigatório' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('import_logs')
      .select('*')
      .eq('brand_id', brandId)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      throw error;
    }

    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Erro ao buscar histórico de importações:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar histórico de importações' },
      { status: 500 }
    );
  }
}
