import { NextRequest, NextResponse } from 'next/server';

export async function getAuthUser(request: NextRequest) {
  const userId = request.headers.get('x-user-id');
  const userRole = request.headers.get('x-user-role');
  const tenantId = request.headers.get('x-tenant-id');

  if (!userId) {
    return null;
  }

  return { userId, userRole, tenantId };
}

export function canViewAllData(role: string | null): boolean {
  return ['admin', 'manager'].includes(role || '');
}

export function canEditUsers(role: string | null): boolean {
  return role === 'admin';
}

export function canViewAuditLogs(role: string | null): boolean {
  return ['admin', 'manager'].includes(role || '');
}

export function getDataFilter(role: string | null, userId: string): any {
  if (canViewAllData(role)) return {};
  return { representante_id: userId };
}

export async function logAudit(
  supabase: any,
  userId: string,
  tenantId: string,
  action: string,
  entityType: string,
  entityId: string,
  oldValues?: any,
  newValues?: any,
  details?: string,
  ipAddress?: string,
  userAgent?: string
) {
  try {
    await supabase
      .from('audit_logs')
      .insert([
        {
          user_id: userId,
          tenant_id: tenantId,
          action,
          entity_type: entityType,
          entity_id: entityId,
          old_values: oldValues,
          new_values: newValues,
          details,
          ip_address: ipAddress,
          user_agent: userAgent,
          timestamp: new Date().toISOString(),
        },
      ]);
  } catch (err) {
    console.error('Audit log failed:', err);
  }
}

export function createErrorResponse(message: string, status: number = 400) {
  return NextResponse.json({ error: message }, { status });
}

export function createSuccessResponse(data: any, status: number = 200) {
  return NextResponse.json(data, { status });
}
