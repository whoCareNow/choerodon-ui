import React, { HTMLAttributes, ReactNode } from 'react';
import classNames from 'classnames';
import { useDisplayConfig } from '../_util/DisplayConfigContext';

export interface ColProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  className?: string;
}

const Col: React.FunctionComponent<ColProps> = ({ className, children, ...rest }) => {
  const { getPrefixCls } = useDisplayConfig();
  const prefixCls = getPrefixCls('col');
  return (
    <div {...rest} className={classNames(prefixCls, className)}>
      {children}
    </div>
  );
};

Col.displayName = 'DisplayCol';

export default Col;
