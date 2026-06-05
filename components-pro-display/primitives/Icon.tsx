import React, { CSSProperties } from 'react';
import classNames from 'classnames';
import { useDisplayConfig } from '../_util/DisplayConfigContext';

export interface IconProps {
  type: string;
  className?: string;
  style?: CSSProperties;
  title?: string;
}

const Icon: React.FunctionComponent<IconProps> = ({ type, className, style, title, ...rest }) => {
  const { getConfig } = useDisplayConfig();
  const iconfontPrefix = getConfig('iconfontPrefix') || 'icon';
  return (
    <i
      {...rest}
      title={title}
      className={classNames(iconfontPrefix, `${iconfontPrefix}-${type}`, className)}
      style={style}
    />
  );
};

Icon.displayName = 'DisplayIcon';

export default Icon;
