import React, { useMemo } from 'react';
import classNames from 'classnames';
import isFunction from 'lodash/isFunction';
import Spin from '../primitives/Spin';
import { useDisplayConfig } from '../_util/DisplayConfigContext';
import useProPrefix from '../_util/useProPrefix';
import ProfessionalQueryBar from './query-bar/ProfessionalQueryBar';
import { TableProps } from './interface';

function getCellValue<T>(record: T, dataIndex?: string): any {
  if (!dataIndex) {
    return undefined;
  }
  const paths = dataIndex.split('.');
  let value: any = record;
  paths.forEach(path => {
    if (value != null) {
      value = value[path];
    }
  });
  return value;
}

function getRowKey<T>(record: T, index: number, rowKey?: string | ((record: T, index: number) => string)): string {
  if (isFunction(rowKey)) {
    return rowKey(record, index);
  }
  if (rowKey && record && typeof record === 'object') {
    return String((record as any)[rowKey]);
  }
  return String(index);
}

export interface DisplayTableType extends React.FunctionComponent<TableProps> {
  ProfessionalBar: typeof ProfessionalQueryBar;
}

const Table: DisplayTableType = <T,>(props: TableProps<T>) => {
  const {
    columns,
    dataSource = [],
    rowKey,
    bordered,
    loading,
    title,
    className,
    style,
    emptyText = '暂无数据',
    queryBar,
    queryBarProps,
    queryFields,
    queryFieldsLimit,
    buttons,
    formProps,
    summaryBar,
    defaultExpanded,
    autoQueryAfterReset,
    onBeforeQuery,
    onQuery,
    onReset,
  } = props;

  const { getConfig } = useDisplayConfig();
  const prefixCls = useProPrefix('table');
  const spinPrefix = getConfig('prefixCls');

  const queryBarNode = useMemo(() => {
    if (queryBar && queryBar !== 'professionalBar' && typeof queryBar !== 'string') {
      return queryBar;
    }
    const useProfessional =
      queryBar === 'professionalBar' ||
      (queryFields && queryFields.length > 0);
    if (!useProfessional) {
      return null;
    }
    return (
      <ProfessionalQueryBar
        queryFields={queryFields}
        queryFieldsLimit={queryFieldsLimit}
        buttons={buttons}
        formProps={formProps}
        summaryBar={summaryBar}
        defaultExpanded={defaultExpanded}
        autoQueryAfterReset={autoQueryAfterReset}
        onBeforeQuery={onBeforeQuery}
        onQuery={onQuery}
        onReset={onReset}
        {...queryBarProps}
      />
    );
  }, [
    autoQueryAfterReset,
    buttons,
    defaultExpanded,
    formProps,
    onBeforeQuery,
    onQuery,
    onReset,
    queryBar,
    queryBarProps,
    queryFields,
    queryFieldsLimit,
    summaryBar,
  ]);

  const colgroup = useMemo(
    () => (
      <colgroup>
        {columns.map((col, i) => (
          <col
            key={col.key || col.dataIndex || String(i)}
            style={col.width !== undefined ? { width: col.width } : undefined}
          />
        ))}
      </colgroup>
    ),
    [columns],
  );

  const tableNode = (
    <div className={classNames(prefixCls, className, { [`${prefixCls}-bordered`]: bordered })} style={style}>
      {queryBarNode}
      {title && <div className={`${prefixCls}-header`}>{title}</div>}
      <div className={`${prefixCls}-wrapper`}>
        <div className={`${prefixCls}-content`}>
          <div className={`${prefixCls}-content-inner`}>
            <table>
              {colgroup}
              <thead className={`${prefixCls}-thead`}>
                <tr>
                  {columns.map((col, i) => (
                    <th
                      key={col.key || col.dataIndex || String(i)}
                      className={classNames(`${prefixCls}-cell`, col.className, {
                        [`${prefixCls}-cell-align-${col.align}`]: col.align,
                      })}
                    >
                      <span className={`${prefixCls}-cell-inner`}>{col.title}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className={`${prefixCls}-tbody`}>
                {dataSource.length === 0 ? (
                  <tr className={`${prefixCls}-row`}>
                    <td className={`${prefixCls}-cell`} colSpan={columns.length}>
                      <span className={`${prefixCls}-cell-inner`}>{emptyText}</span>
                    </td>
                  </tr>
                ) : (
                  dataSource.map((record, rowIndex) => (
                    <tr key={getRowKey(record, rowIndex, rowKey)} className={`${prefixCls}-row`}>
                      {columns.map((col, colIndex) => {
                        const value = getCellValue(record, col.dataIndex);
                        const content = col.render ? col.render(value, record, rowIndex) : value;
                        return (
                          <td
                            key={col.key || col.dataIndex || String(colIndex)}
                            className={classNames(`${prefixCls}-cell`, col.className, {
                              [`${prefixCls}-cell-align-${col.align}`]: col.align,
                            })}
                          >
                            <span className={`${prefixCls}-cell-inner`}>{content}</span>
                          </td>
                        );
                      })}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return <Spin prefixCls={spinPrefix} spinning>{tableNode}</Spin>;
  }

  return tableNode;
};

Table.displayName = 'DisplayTable';
Table.ProfessionalBar = ProfessionalQueryBar;

export default Table;
