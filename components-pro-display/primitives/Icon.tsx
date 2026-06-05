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

(Icon as React.FunctionComponent<IconProps> & { __C7N_ICON?: boolean }).__C7N_ICON = true;

Icon.displayName = 'DisplayIcon';

export default Icon;
