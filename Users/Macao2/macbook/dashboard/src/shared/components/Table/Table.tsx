import React from 'react';
import styled from 'styled-components';

interface Column {
  key: string;
  title: string;
  render?: (value: any, record: any) => React.ReactNode;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

interface TableProps {
  columns: Column[];
  data: any[];
  loading?: boolean;
  emptyText?: string;
  onRowClick?: (record: any) => void;
  rowKey?: string;
}

const TableContainer = styled.div`
  width: 100%;
  overflow-x: auto;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: white;
`;

const TableHeader = styled.th<{ width?: string; align?: string }>`
  background-color: #f8f9fa;
  padding: 12px;
  text-align: ${props => props.align || 'left'};
  font-weight: bold;
  color: #2c3e50;
  border-bottom: 2px solid #e9ecef;
  white-space: nowrap;
  width: ${props => props.width || 'auto'};
`;

const TableRow = styled.tr<{ clickable?: boolean }>`
  &:nth-child(even) {
    background-color: #f8f9fa;
  }

  &:hover {
    background-color: ${props => (props.clickable ? '#f1f3f5' : 'inherit')};
    cursor: ${props => (props.clickable ? 'pointer' : 'default')};
  }
`;

const TableCell = styled.td<{ align?: string }>`
  padding: 12px;
  border-bottom: 1px solid #e9ecef;
  color: #2c3e50;
  white-space: nowrap;
  text-align: ${props => props.align || 'left'};
`;

const EmptyText = styled.div`
  text-align: center;
  padding: 20px;
  color: #7f8c8d;
`;

const LoadingText = styled.div`
  text-align: center;
  padding: 20px;
  color: #7f8c8d;
`;

const Table: React.FC<TableProps> = ({
  columns,
  data,
  loading = false,
  emptyText = 'Không có dữ liệu',
  onRowClick,
  rowKey = 'id'
}) => {
  if (loading) {
    return <LoadingText>Đang tải...</LoadingText>;
  }

  if (!data.length) {
    return <EmptyText>{emptyText}</EmptyText>;
  }

  return (
    <TableContainer>
      <StyledTable>
        <thead>
          <tr>
            {columns.map(column => (
              <TableHeader
                key={column.key}
                width={column.width}
                align={column.align}
              >
                {column.title}
              </TableHeader>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map(record => (
            <TableRow
              key={record[rowKey]}
              clickable={!!onRowClick}
              onClick={() => onRowClick?.(record)}
            >
              {columns.map(column => (
                <TableCell key={column.key} align={column.align}>
                  {column.render
                    ? column.render(record[column.key], record)
                    : record[column.key]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </tbody>
      </StyledTable>
    </TableContainer>
  );
};

export default Table;