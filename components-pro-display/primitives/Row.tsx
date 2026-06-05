import React, { HTMLAttributes, ReactNode } from 'react';
import classNames from 'classnames';
import { useDisplayConfig } from '../_util/DisplayConfigContext';

export interface RowProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  className?: string;
}

const Row: React.FunctionComponent<RowProps> = ({ className, children, ...rest }) => {
  const { getPrefixCls } = useDisplayConfig();
  const prefixCls = getPrefixCls('row');
  return (
    <div {...rest} className={classNames(prefixCls, className)}>
      {children}
    </div>
  );
};

Row.displayName = 'DisplayRow';

export default Row;
