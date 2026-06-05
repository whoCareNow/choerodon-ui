import React from 'react';
import classNames from 'classnames';
import { useDisplayConfig } from '../_util/DisplayConfigContext';

export interface ProgressProps {
  type?: 'loading';
  size?: 'small' | 'default' | 'large';
}

function LoadingCircle() {
  const SIZE = 50;
  return (
    <svg viewBox={`0 0 ${SIZE} ${SIZE}`}>
      <circle cx={SIZE / 2} cy={SIZE / 2} r={SIZE / 2 - 5} />
    </svg>
  );
}

const Progress: React.FunctionComponent<ProgressProps> = ({ type = 'loading', size = 'small' }) => {
  const { getPrefixCls } = useDisplayConfig();
  const prefixCls = getPrefixCls('progress');

  return (
    <div
      className={classNames(prefixCls, {
        [`${prefixCls}-${type}`]: type,
        [`${prefixCls}-sm`]: size === 'small',
        [`${prefixCls}-lg`]: size === 'large',
      })}
    >
      <div className={`${prefixCls}-inner`}>
        <LoadingCircle />
      </div>
    </div>
  );
};

Progress.displayName = 'DisplayProgress';

export default Progress;
