import * as XLSX from 'xlsx';
import { CustomerImport, PriorityImport, SaleImport } from '@/lib/validators/importSchema';

export interface ParsedImportData {
  analysisData: CustomerImport[];
  priorityData: PriorityImport[];
  transactionData: SaleImport[];
  sheetNames: string[];
}

export async function parseExcelFile(file: File): Promise<ParsedImportData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetNames = workbook.SheetNames;

        const result: ParsedImportData = {
          analysisData: [],
          priorityData: [],
          transactionData: [],
          sheetNames,
        };

        // Parse Análise RJ (primeira aba)
        if (sheetNames.length > 0) {
          const analysisSheet = workbook.Sheets[sheetNames[0]];
          const analysisRows = XLSX.utils.sheet_to_json(analysisSheet);
          result.analysisData = analysisRows.map((row: any) => ({
            cnpj: row.CNPJ || row.cnpj || '',
            razao_social: row['Razão Social'] || row.razao_social || '',
            cidade: row.Cidade || row.cidade || '',
            estado: row.Estado || row.estado || '',
            endereco: row.Endereço || row.endereco || '',
            telefone: row.Telefone || row.telefone || '',
            email: row.Email || row.email || '',
            status: row.Status || row.status || 'prospect',
          }));
        }

        // Parse Prioridade (segunda aba)
        if (sheetNames.length > 1) {
          const prioritySheet = workbook.Sheets[sheetNames[1]];
          const priorityRows = XLSX.utils.sheet_to_json(prioritySheet);
          result.priorityData = priorityRows.map((row: any) => ({
            cnpj: row.CNPJ || row.cnpj || '',
            priority_score: parseInt(row['Priority Score'] || row.priority_score || '0'),
            urgency: row.Urgency || row.urgency || 'média',
            last_visit: row['Last Visit'] || row.last_visit || '',
            next_visit: row['Next Visit'] || row.next_visit || '',
          }));
        }

        // Parse Transações (terceira aba)
        if (sheetNames.length > 2) {
          const transactionSheet = workbook.Sheets[sheetNames[2]];
          const transactionRows = XLSX.utils.sheet_to_json(transactionSheet);
          result.transactionData = transactionRows.map((row: any) => ({
            cnpj: row.CNPJ || row.cnpj || '',
            data_venda: row['Data Venda'] || row.data_venda || new Date().toISOString(),
            valor: parseFloat(row.Valor || row.valor || '0'),
            quantidade: parseInt(row.Quantidade || row.quantidade || '1'),
            produto: row.Produto || row.produto || '',
            representante_id: row['Representante ID'] || row.representante_id || '',
          }));
        }

        resolve(result);
      } catch (error) {
        reject(new Error(`Erro ao fazer parse do Excel: ${error}`));
      }
    };

    reader.onerror = () => {
      reject(new Error('Erro ao ler arquivo'));
    };

    reader.readAsArrayBuffer(file);
  });
}
