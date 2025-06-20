import React from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';

interface Column<T> {
  key: string;
  title: string;
  dataIndex: keyof T;
  width?: number | string;
  align?: 'left' | 'center' | 'right';
  render?: (value: any, record: T, index: number) => React.ReactNode;
}

interface TableProps<T> {
  columns: Column<T>[];
  dataSource: T[];
  loading?: boolean;
  rowKey?: keyof T | ((record: T) => string);
  bordered?: boolean;
  striped?: boolean;
  hoverable?: boolean;
  onRowClick?: (record: T, index: number) => void;
  className?: string;
  emptyMessage?: string;
}

const TableContainer = styled.div`
  width: 100%;
  overflow-x: auto;
  border-radius: ${theme.borderRadius.lg};
  border: 1px solid ${theme.colors.border};
  background: ${theme.colors.background.paper};

  &::-webkit-scrollbar {
    height: 6px;
  }

  &::-webkit-scrollbar-track {
    background: ${theme.colors.background.default};
  }

  &::-webkit-scrollbar-thumb {
    background: ${theme.colors.border};
    border-radius: ${theme.borderRadius.full};
  }
`;

const TableElement = styled.table<{
  bordered: boolean;
  striped: boolean;
  hoverable: boolean;
}>`
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;

  th, td {
    padding: ${theme.spacing.md};
    text-align: left;
    border-bottom: 1px solid ${theme.colors.border};
    ${props => props.bordered && `
      border: 1px solid ${theme.colors.border};
    `}
  }

  th {
    background: ${theme.colors.background.default};
    font-weight: ${theme.typography.fontWeight.medium};
    color: ${theme.colors.text.secondary};
    white-space: nowrap;
  }

  td {
    color: ${theme.colors.text.primary};
  }

  tbody {
    tr {
      ${props => props.striped && `
        &:nth-child(even) {
          background: ${theme.colors.background.default};
        }
      `}

      ${props => props.hoverable && `
        &:hover {
          background: ${theme.colors.background.hover};
          cursor: pointer;
        }
      `}
    }
  }
`;

const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${theme.colors.background.paper}CC;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
`;

const EmptyState = styled.div`
  padding: ${theme.spacing.xl};
  text-align: center;
  color: ${theme.colors.text.secondary};
  font-size: ${theme.typography.fontSize.sm};
`;

const Table: React.FC<TableProps<any>> = ({
  columns,
  dataSource,
  loading = false,
  rowKey,
  bordered = false,
  striped = false,
  hoverable = false,
  onRowClick,
  className,
  emptyMessage = 'Không có dữ liệu'
}) => {
  const getRowKey = (record: any, index: number): string => {
    if (typeof rowKey === 'function') {
      return rowKey(record);
    }
    if (rowKey) {
      return String(record[rowKey]);
    }
    return String(index);
  };

  return (
    <TableContainer className={className}>
      <TableElement
        bordered={bordered}
        striped={striped}
        hoverable={hoverable}
      >
        <thead>
          <tr>
            {columns.map(column => (
              <th
                key={column.key}
                style={{
                  width: column.width,
                  textAlign: column.align
                }}
              >
                {column.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {dataSource.length === 0 ? (
            <tr>
              <td colSpan={columns.length}>
                <EmptyState>{emptyMessage}</EmptyState>
              </td>
            </tr>
          ) : (
            dataSource.map((record, index) => (
              <tr
                key={getRowKey(record, index)}
                onClick={() => onRowClick?.(record, index)}
              >
                {columns.map(column => (
                  <td
                    key={column.key}
                    style={{
                      width: column.width,
                      textAlign: column.align
                    }}
                  >
                    {column.render
                      ? column.render(record[column.dataIndex], record, index)
                      : record[column.dataIndex]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </TableElement>
      {loading && (
        <LoadingOverlay>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke={theme.colors.primary}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ animation: 'spin 1s linear infinite' }}
          >
            <path d="M21 12a9 9 0 11-6.219-8.56" />
          </svg>
        </LoadingOverlay>
      )}
    </TableContainer>
  );
};

export default Table;