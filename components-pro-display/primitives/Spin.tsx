import React, { ReactNode } from 'react';
import classNames from 'classnames';
import { useDisplayConfig } from '../_util/DisplayConfigContext';

export interface SpinProps {
  spinning?: boolean;
  prefixCls?: string;
  children?: ReactNode;
}

const Spin: React.FunctionComponent<SpinProps> = ({ spinning, prefixCls: customizePrefixCls, children }) => {
  const { getPrefixCls } = useDisplayConfig();
  const prefixCls = getPrefixCls('spin', customizePrefixCls);

  if (!spinning) {
    return <>{children}</>;
  }

  return (
    <div className={`${prefixCls}-nested-loading`}>
      <div>
        <div className={classNames(prefixCls, `${prefixCls}-spinning`)}>
          <span className={`${prefixCls}-dot ${prefixCls}-dot-spin`}>
            <i className={`${prefixCls}-dot-item`} />
            <i className={`${prefixCls}-dot-item`} />
            <i className={`${prefixCls}-dot-item`} />
            <i className={`${prefixCls}-dot-item`} />
          </span>
        </div>
      </div>
      <div className={`${prefixCls}-container`}>{children}</div>
    </div>
  );
};

Spin.displayName = 'DisplaySpin';

export default Spin;
