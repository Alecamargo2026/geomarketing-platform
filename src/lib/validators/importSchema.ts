import { z } from 'zod';

// Validar CNPJ brasileiro
const cnpjRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;

// Estados brasileiros válidos
const brazilianStates = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

export const CustomerImportSchema = z.object({
  cnpj: z.string().regex(cnpjRegex, 'CNPJ inválido'),
  razao_social: z.string().min(3, 'Razão social obrigatória'),
  cidade: z.string().min(2, 'Cidade obrigatória'),
  estado: z.enum(brazilianStates as [string, ...string[]], {
    errorMap: () => ({ message: 'Estado inválido' })
  }),
  endereco: z.string().optional(),
  telefone: z.string().optional(),
  email: z.string().email('Email inválido').optional(),
  status: z.enum(['ativo', 'inativo', 'prospect'], {
    errorMap: () => ({ message: 'Status inválido' })
  }).default('prospect'),
});

export const PriorityImportSchema = z.object({
  cnpj: z.string().regex(cnpjRegex, 'CNPJ inválido'),
  priority_score: z.number().min(0).max(100, 'Score deve estar entre 0 e 100'),
  urgency: z.enum(['baixa', 'média', 'alta', 'crítica']).optional(),
  last_visit: z.string().datetime().optional(),
  next_visit: z.string().datetime().optional(),
});

export const SaleImportSchema = z.object({
  cnpj: z.string().regex(cnpjRegex, 'CNPJ inválido'),
  data_venda: z.string().datetime('Data de venda inválida'),
  valor: z.number().positive('Valor deve ser positivo'),
  quantidade: z.number().positive('Quantidade deve ser positiva'),
  produto: z.string().min(2, 'Produto obrigatório'),
  representante_id: z.string().optional(),
});

export type CustomerImport = z.infer<typeof CustomerImportSchema>;
export type PriorityImport = z.infer<typeof PriorityImportSchema>;
export type SaleImport = z.infer<typeof SaleImportSchema>;
