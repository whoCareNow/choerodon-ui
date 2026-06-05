import React, {
  Children,
  cloneElement,
  CSSProperties,
  isValidElement,
  ReactElement,
  ReactNode,
  useCallback,
  useState,
} from 'react';
import { useDisplayConfig } from '../_util/DisplayConfigContext';

export interface RippleProps {
  disabled?: boolean;
  children?: ReactNode;
}

function getRippleStyle(element: HTMLElement, clientX: number, clientY: number): CSSProperties {
  const rect = element.getBoundingClientRect();
  const x = clientX - rect.left;
  const y = clientY - rect.top;
  const maxWidth = Math.max(x, rect.width - x);
  const maxHeight = Math.max(y, rect.height - y);
  const radius = Math.sqrt(maxWidth * maxWidth + maxHeight * maxHeight);
  return {
    width: radius * 2,
    height: radius * 2,
    left: x - radius,
    top: y - radius,
  };
}

const Ripple: React.FunctionComponent<RippleProps> = ({ disabled, children }) => {
  const { getPrefixCls, getConfig } = useDisplayConfig();
  const prefixCls = getPrefixCls('ripple');
  const rippleEnabled = getConfig('ripple') !== false;
  const [rippleStyle, setRippleStyle] = useState<CSSProperties | null>(null);
  const [active, setActive] = useState(false);

  const hideRipple = useCallback(() => {
    setActive(false);
    window.setTimeout(() => setRippleStyle(null), 450);
  }, []);

  if (disabled || !rippleEnabled || !children) {
    return <>{children}</>;
  }

  const child = Children.only(children);
  if (!isValidElement(child)) {
    return <>{children}</>;
  }

  const element = child as ReactElement<any>;
  const childStyle = element.props.style || {};

  const handleMouseDown = (event: React.MouseEvent<HTMLElement>) => {
    element.props.onMouseDown?.(event);
    setRippleStyle(getRippleStyle(event.currentTarget, event.clientX, event.clientY));
    setActive(true);
  };

  const handleMouseUp = (event: React.MouseEvent<HTMLElement>) => {
    element.props.onMouseUp?.(event);
    hideRipple();
  };

  const handleMouseLeave = (event: React.MouseEvent<HTMLElement>) => {
    element.props.onMouseLeave?.(event);
    hideRipple();
  };

  const rippleNode = rippleStyle ? (
    <span key="ripple-wrapper" className={`${prefixCls}-wrapper`}>
      <span
        className={
          active
            ? `${prefixCls} c7n-zoom-small-slow-enter c7n-zoom-small-slow-enter-active`
            : `${prefixCls} c7n-zoom-small-slow-leave c7n-zoom-small-slow-leave-active`
        }
        style={rippleStyle}
      />
    </span>
  ) : null;

  return cloneElement(element, {
    onMouseDown: handleMouseDown,
    onMouseUp: handleMouseUp,
    onMouseLeave: handleMouseLeave,
    onDragEnd: hideRipple,
    style: { position: 'relative', ...childStyle },
    children: [...Children.toArray(element.props.children), rippleNode].filter(Boolean),
  });
};

Ripple.displayName = 'DisplayRipple';

export default Ripple;
