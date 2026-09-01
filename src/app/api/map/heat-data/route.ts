import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase environment variables');
  }

  return createClient(supabaseUrl, supabaseServiceKey);
}

export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url);
    const stateCode = searchParams.get('state_code');
    const cityId = searchParams.get('city_id');

    let query = supabase
      .from('customers')
      .select('*, cities(name, latitude, longitude), neighborhoods(name, latitude, longitude)')
      .eq('user_id', user.id);

    if (stateCode) {
      query = query.eq('state_code', stateCode);
    }

    if (cityId) {
      query = query.eq('city_id', cityId);
    }

    const { data: customers, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Transform data for heatmap
    const heatmapData = customers?.map(customer => ({
      id: customer.id,
      name: customer.name,
      lat: customer.neighborhoods?.latitude || customer.cities?.latitude || 0,
      lng: customer.neighborhoods?.longitude || customer.cities?.longitude || 0,
      status: customer.status,
      revenue: customer.revenue,
      intensity: customer.status === 'active' ? 1 : customer.status === 'inactive' ? 0.5 : 0.2,
    })) || [];

    return NextResponse.json({ data: heatmapData });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
