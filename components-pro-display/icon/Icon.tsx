import React, {
  CSSProperties,
  FocusEventHandler,
  MouseEventHandler,
} from 'react';
import classNames from 'classnames';
import { useDisplayConfig } from '../_util/DisplayConfigContext';

export interface IconProps {
  type: string;
  className?: string;
  title?: string;
  customFontName?: string;
  style?: CSSProperties;
  tabIndex?: number;
  onClick?: MouseEventHandler<HTMLElement>;
  onFocus?: FocusEventHandler<HTMLElement>;
  onMouseDown?: MouseEventHandler<HTMLElement>;
  onMouseUp?: MouseEventHandler<HTMLElement>;
  onMouseEnter?: MouseEventHandler<HTMLElement>;
  onMouseLeave?: MouseEventHandler<HTMLElement>;
}

const Icon: React.FunctionComponent<IconProps> = props => {
  const { getConfig } = useDisplayConfig();
  const iconfontPrefix = getConfig('iconfontPrefix') || 'icon';
  const {
    type,
    customFontName,
    className,
    title,
    style,
    tabIndex,
    onClick,
    onFocus,
    onMouseDown,
    onMouseUp,
    onMouseEnter,
    onMouseLeave,
  } = props;

  let iconTabIndex = tabIndex;
  if (iconTabIndex === undefined && onClick) {
    iconTabIndex = -1;
  }

  return (
    <i
      role={onClick ? 'img' : undefined}
      title={title}
      tabIndex={iconTabIndex}
      className={classNames(iconfontPrefix, customFontName, `${iconfontPrefix}-${type}`, className)}
      style={style}
      onClick={onClick}
      onFocus={onFocus}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    />
  );
};

Icon.displayName = 'DisplayIcon';

(Icon as React.FunctionComponent<IconProps> & { __C7N_ICON?: boolean }).__C7N_ICON = true;

export default Icon;
