import React from 'react';
import classNames from 'classnames';
import { useDisplayConfig } from '../_util/DisplayConfigContext';

export interface ProgressProps {
  type?: 'loading';
  size?: 'small' | 'default' | 'large';
}

const Progress: React.FunctionComponent<ProgressProps> = ({ type = 'loading', size = 'small' }) => {
  const { getPrefixCls } = useDisplayConfig();
  const prefixCls = getPrefixCls('progress');
  return (
    <span
      className={classNames(prefixCls, `${prefixCls}-${type}`, {
        [`${prefixCls}-sm`]: size === 'small',
      })}
    />
  );
};

Progress.displayName = 'DisplayProgress';

export default Progress;
