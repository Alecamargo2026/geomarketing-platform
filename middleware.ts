import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const PUBLIC_ROUTES = ['/auth/login', '/auth/register', '/auth/callback', '/'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes
  if (PUBLIC_ROUTES.some(route => pathname === route || pathname.startsWith(route + '/'))) {
    return NextResponse.next();
  }

  // Check for auth token
  const token = request.cookies.get('supabase-auth-token')?.value;
  if (!token) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Get user from token
    const { data: { user }, error } = await supabase.auth.admin.getUserById(
      token.split('.')[0]
    );

    if (error || !user) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    // Get user data from database
    const { data: userData } = await supabase
      .from('users')
      .select('id, role, tenant_id, email, name')
      .eq('id', user.id)
      .single();

    if (!userData) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    // Create request headers with auth info
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', user.id);
    requestHeaders.set('x-user-role', userData.role || 'user');
    requestHeaders.set('x-tenant-id', userData.tenant_id || '');
    requestHeaders.set('x-user-email', userData.email || '');

    // Log page view to audit logs
    const auditLog = {
      tenant_id: userData.tenant_id,
      user_id: user.id,
      action: 'PAGE_VIEW',
      entity_type: 'Page',
      entity_id: pathname,
      details: `View ${pathname}`,
      ip_address: request.ip || 'unknown',
      user_agent: request.headers.get('user-agent') || 'unknown',
      timestamp: new Date().toISOString(),
    };

    try {
      await supabase
        .from('audit_logs')
        .insert([auditLog]);
    } catch (err) {
      console.error('Failed to log audit:', err);
    }

    const response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });

    return response;
  } catch (err) {
    console.error('Middleware error:', err);
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};
