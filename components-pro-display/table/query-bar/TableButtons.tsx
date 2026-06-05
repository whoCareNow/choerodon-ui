import React, { memo, ReactNode } from 'react';
import classNames from 'classnames';

export interface TableButtonsProps {
  prefixCls?: string;
  buttons?: ReactNode[];
  children?: ReactNode;
  className?: string;
}

const TableButtons = memo(function TableButtons({ prefixCls, buttons = [], children, className }: TableButtonsProps) {
  const buttonGroup = buttons.length ? (
    <span className={`${prefixCls}-toolbar-button-group`}>{buttons}</span>
  ) : null;
  if (buttonGroup || children) {
    return (
      <div className={classNames(`${prefixCls}-toolbar`, className)}>
        {buttonGroup}
        {children}
      </div>
    );
  }
  return null;
});

export default TableButtons;
