export type UserRole = 'admin' | 'manager' | 'representante';

export function canViewAllData(role: UserRole): boolean {
  return role === 'admin' || role === 'manager';
}

export function canEditUsers(role: UserRole): boolean {
  return role === 'admin';
}

export function canViewAuditLogs(role: UserRole): boolean {
  return role === 'admin' || role === 'manager';
}

export function canManageBrands(role: UserRole): boolean {
  return role === 'admin';
}

export function canViewReports(role: UserRole): boolean {
  return role === 'admin' || role === 'manager' || role === 'representante';
}

export function getDataFilter(role: UserRole, userId: string): { representante_id?: string } {
  if (role === 'representante') {
    return { representante_id: userId };
  }
  return {};
}

export function canAccessBrand(role: UserRole, userBrandIds: string[], brandId: string): boolean {
  if (role === 'admin') return true;
  return userBrandIds.includes(brandId);
}
