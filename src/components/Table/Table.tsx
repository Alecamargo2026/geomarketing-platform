'use client'

import React from 'react'
import './Table.css'

export interface TableColumn {
  key: string
  label: string
  sortable?: boolean
  width?: string
  render?: (value: any, row: any) => React.ReactNode
}

export interface TableProps {
  columns: TableColumn[]
  data: any[]
  loading?: boolean
  error?: string
  onSort?: (key: string, direction: 'asc' | 'desc') => void
  onRowClick?: (row: any) => void
  selectable?: boolean
  onSelectionChange?: (selectedRows: any[]) => void
  pagination?: {
    page: number
    pageSize: number
    total: number
    onPageChange: (page: number) => void
  }
  className?: string
}

/**
 * Componente Table profissional com sorting, paginação e seleção
 * Segue padrões WCAG 2.1 AA
 */
export default function Table({
  columns,
  data,
  loading = false,
  error,
  onSort,
  onRowClick,
  selectable = false,
  onSelectionChange,
  pagination,
  className = '',
}: TableProps) {
  const [selectedRows, setSelectedRows] = React.useState<Set<string>>(new Set())
  const [sortKey, setSortKey] = React.useState<string | null>(null)
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('asc')

  const handleSort = (key: string) => {
    const newDirection = sortKey === key && sortDirection === 'asc' ? 'desc' : 'asc'
    setSortKey(key)
    setSortDirection(newDirection)
    onSort?.(key, newDirection)
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = new Set(data.map((_, i) => i.toString()))
      setSelectedRows(allIds)
      onSelectionChange?.(data)
    } else {
      setSelectedRows(new Set())
      onSelectionChange?.([])
    }
  }

  const handleSelectRow = (index: number) => {
    const newSelected = new Set(selectedRows)
    const id = index.toString()
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedRows(newSelected)
    const selectedData = data.filter((_, i) => newSelected.has(i.toString()))
    onSelectionChange?.(selectedData)
  }

  const tableClasses = ['table', className].filter(Boolean).join(' ')

  if (error) {
    return (
      <div className="table__error">
        <p>{error}</p>
      </div>
    )
  }

  return (
    <div className={tableClasses}>
      <div className="table__wrapper">
        <table className="table__element" role="table">
          <thead className="table__head">
            <tr className="table__row">
              {selectable && (
                <th className="table__cell table__cell--checkbox">
                  <input
                    type="checkbox"
                    checked={selectedRows.size === data.length && data.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    aria-label="Selecionar todos"
                  />
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={[
                    'table__cell',
                    'table__cell--header',
                    column.sortable && 'table__cell--sortable',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  style={{ width: column.width }}
                  onClick={() => column.sortable && handleSort(column.key)}
                  role="columnheader"
                  aria-sort={
                    sortKey === column.key
                      ? sortDirection === 'asc'
                        ? 'ascending'
                        : 'descending'
                      : 'none'
                  }
                >
                  <span className="table__header-content">
                    {column.label}
                    {column.sortable && sortKey === column.key && (
                      <span className="table__sort-icon" aria-hidden="true">
                        {sortDirection === 'asc' ? '▲' : '▼'}
                      </span>
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="table__body">
            {loading ? (
              <tr className="table__row">
                <td colSpan={columns.length + (selectable ? 1 : 0)} className="table__cell table__cell--loading">
                  Carregando...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr className="table__row">
                <td colSpan={columns.length + (selectable ? 1 : 0)} className="table__cell table__cell--empty">
                  Nenhum dado encontrado
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className={[
                    'table__row',
                    selectedRows.has(rowIndex.toString()) && 'table__row--selected',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  onClick={() => onRowClick?.(row)}
                >
                  {selectable && (
                    <td className="table__cell table__cell--checkbox">
                      <input
                        type="checkbox"
                        checked={selectedRows.has(rowIndex.toString())}
                        onChange={() => handleSelectRow(rowIndex)}
                        onClick={(e) => e.stopPropagation()}
                        aria-label={`Selecionar linha ${rowIndex + 1}`}
                      />
                    </td>
                  )}
                  {columns.map((column) => (
                    <td key={column.key} className="table__cell" style={{ width: column.width }}>
                      {column.render ? column.render(row[column.key], row) : row[column.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pagination && (
        <div className="table__pagination">
          <button
            className="table__pagination-button"
            onClick={() => pagination.onPageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
          >
            ← Anterior
          </button>
          <span className="table__pagination-info">
            Página {pagination.page} de {Math.ceil(pagination.total / pagination.pageSize)}
          </span>
          <button
            className="table__pagination-button"
            onClick={() => pagination.onPageChange(pagination.page + 1)}
            disabled={pagination.page >= Math.ceil(pagination.total / pagination.pageSize)}
          >
            Próxima →
          </button>
        </div>
      )}
    </div>
  )
}
