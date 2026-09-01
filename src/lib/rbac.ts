/**
 * RBAC (Role-Based Access Control) Helpers
 * Funções para controlar acesso baseado em role do usuário
 */

export type UserRole = 'admin' | 'manager' | 'representante';

/**
 * Verifica se o usuário pode visualizar todos os dados
 */
export function canViewAllData(role: string): boolean {
  return ['admin', 'manager'].includes(role);
}

/**
 * Verifica se o usuário pode editar usuários
 */
export function canEditUsers(role: string): boolean {
  return role === 'admin';
}

/**
 * Verifica se o usuário pode visualizar audit logs
 */
export function canViewAuditLogs(role: string): boolean {
  return ['admin', 'manager'].includes(role);
}

/**
 * Retorna filtro de dados baseado no role
 * Se representante, filtra por representanteId
 * Se admin/manager, sem filtro
 */
export function getDataFilter(role: string, userId: string): Record<string, any> {
  if (canViewAllData(role)) {
    return {};
  }
  return { representanteId: userId };
}

/**
 * Verifica se o usuário pode deletar dados
 */
export function canDeleteData(role: string): boolean {
  return ['admin', 'manager'].includes(role);
}

/**
 * Verifica se o usuário pode exportar dados
 */
export function canExportData(role: string): boolean {
  return ['admin', 'manager', 'representante'].includes(role);
}

/**
 * Verifica se o usuário pode gerar relatórios
 */
export function canGenerateReports(role: string): boolean {
  return ['admin', 'manager', 'representante'].includes(role);
}

/**
 * Verifica se o usuário pode importar dados
 */
export function canImportData(role: string): boolean {
  return ['admin', 'manager'].includes(role);
}

/**
 * Verifica se o usuário pode gerenciar marcas
 */
export function canManageBrands(role: string): boolean {
  return ['admin', 'manager'].includes(role);
}

/**
 * Verifica se o usuário pode visualizar análise de gaps
 */
export function canViewGapAnalysis(role: string): boolean {
  return ['admin', 'manager', 'representante'].includes(role);
}

/**
 * Verifica se o usuário pode visualizar mapas
 */
export function canViewMaps(role: string): boolean {
  return ['admin', 'manager', 'representante'].includes(role);
}
