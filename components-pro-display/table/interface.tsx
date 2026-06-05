import { CSSProperties, ReactNode } from 'react';
import { ProfessionalQueryBarProps } from './query-bar/ProfessionalQueryBar';

export type TableQueryBarType = 'professionalBar' | ReactNode;

export interface ColumnType<T = any> {
  key?: string;
  title?: ReactNode;
  dataIndex?: string;
  width?: number | string;
  align?: 'left' | 'center' | 'right';
  className?: string;
  render?: (value: any, record: T, index: number) => ReactNode;
}

export interface TableProps<T = any> extends Omit<ProfessionalQueryBarProps, 'className' | 'prefixCls'> {
  columns: ColumnType<T>[];
  dataSource?: T[];
  rowKey?: string | ((record: T, index: number) => string);
  bordered?: boolean;
  loading?: boolean;
  title?: ReactNode;
  className?: string;
  style?: CSSProperties;
  emptyText?: ReactNode;
  /** 传 `professionalBar` 或自定义节点；也可直接传 `queryFields` 自动启用专业搜索条 */
  queryBar?: TableQueryBarType;
  queryBarProps?: Partial<ProfessionalQueryBarProps>;
}
