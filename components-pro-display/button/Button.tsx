import React, {
  Children,
  cloneElement,
  CSSProperties,
  isValidElement,
  MouseEvent,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import classNames from 'classnames';
import debounce from 'lodash/debounce';
import isString from 'lodash/isString';
import isFunction from 'lodash/isFunction';
import isPromise from 'is-promise';
import omit from 'lodash/omit';
import { useDisplayConfig } from '../_util/DisplayConfigContext';
import Icon from '../primitives/Icon';
import Progress from '../primitives/Progress';
import Ripple from '../primitives/Ripple';
import useProPrefix from '../_util/useProPrefix';
import { ButtonColor, ButtonTooltip, ButtonType, FuncType, WaitType } from './enum';

export interface ButtonProps {
  funcType?: FuncType;
  color?: ButtonColor;
  loading?: boolean;
  icon?: string;
  href?: string;
  target?: string;
  wait?: number;
  waitType?: WaitType;
  tooltip?: ButtonTooltip;
  type?: ButtonType;
  block?: boolean;
  disabled?: boolean;
  hidden?: boolean;
  className?: string;
  style?: CSSProperties;
  onClick?: (e: MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void | Promise<void>;
  onMouseEnter?: React.MouseEventHandler;
  onMouseLeave?: React.MouseEventHandler;
  children?: ReactNode;
}

const rxTwoCNChar = /^[\u4e00-\u9fa5]{2}$/;
const isTwoCNChar = rxTwoCNChar.test.bind(rxTwoCNChar);

function insertSpace(child: React.ReactChild, needInserted: boolean) {
  if (child == null) {
    return;
  }
  const SPACE = needInserted ? ' ' : '';
  if (
    typeof child !== 'string' &&
    typeof child !== 'number' &&
    isString((child as React.ReactElement).type) &&
    isTwoCNChar((child as React.ReactElement).props.children)
  ) {
    return cloneElement(child as React.ReactElement, {
      children: (child as React.ReactElement).props.children.split('').join(SPACE),
    });
  }
  if (typeof child === 'string') {
    return isTwoCNChar(child) ? <span>{child.split('').join(SPACE)}</span> : <span>{child}</span>;
  }
  if (isValidElement(child) && child.type === React.Fragment) {
    return <span>{child}</span>;
  }
  return child;
}

function spaceChildren(children: React.ReactNode, needInserted: boolean) {
  let isPrevChildPure = false;
  const childList: React.ReactNode[] = [];
  React.Children.forEach(children, child => {
    const type = typeof child;
    const isCurrentChildPure = type === 'string' || type === 'number';
    if (isPrevChildPure && isCurrentChildPure) {
      const lastIndex = childList.length - 1;
      childList[lastIndex] = `${childList[lastIndex]}${child}`;
    } else {
      childList.push(child);
    }
    isPrevChildPure = isCurrentChildPure;
  });
  return React.Children.map(childList, child =>
    insertSpace(child as React.ReactChild, needInserted),
  );
}

const Button: React.FunctionComponent<ButtonProps> = props => {
  const {
    funcType: funcTypeProp,
    color: colorProp,
    loading: loadingProp,
    icon,
    href,
    target,
    wait,
    waitType = WaitType.throttle,
    tooltip: tooltipProp,
    type = ButtonType.button,
    block,
    disabled: disabledProp,
    hidden,
    className,
    style,
    onClick,
    onMouseEnter,
    onMouseLeave,
    children,
  } = props;

  const { getConfig, getTooltip } = useDisplayConfig();
  const prefixCls = useProPrefix('btn');
  const elementRef = useRef<HTMLButtonElement | HTMLAnchorElement>(null);
  const [hasTwoCNChar, setHasTwoCNChar] = useState(false);
  const [loading, setLoading] = useState(!!loadingProp);

  const funcType = funcTypeProp ?? (getConfig('buttonFuncType') as FuncType) ?? FuncType.raised;
  const color = colorProp ?? (getConfig('buttonColor') as ButtonColor) ?? ButtonColor.default;
  const isDisabled = !!disabledProp || loading;

  useEffect(() => {
    setLoading(!!loadingProp);
  }, [loadingProp]);

  const handleClick = useCallback(
    async (e: MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
      if (!onClick) {
        return;
      }
      const result = onClick(e);
      if (isPromise(result)) {
        try {
          setLoading(true);
          await result;
        } finally {
          setLoading(false);
        }
      }
    },
    [onClick],
  );

  const clickHandler = useMemo(() => {
    if (wait && waitType) {
      const options: { leading?: boolean; trailing?: boolean; maxWait?: number } = { leading: true, trailing: true };
      if (waitType === WaitType.throttle) {
        options.trailing = false;
        options.maxWait = wait;
      } else if (waitType === WaitType.debounce) {
        options.leading = false;
      }
      return debounce(handleClick, wait, options);
    }
    return handleClick;
  }, [handleClick, wait, waitType]);

  useEffect(() => () => {
    if (typeof (clickHandler as any).cancel === 'function') {
      (clickHandler as any).cancel();
    }
  }, [clickHandler]);

  const handleClickIfBubble = useCallback(
    (e: MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
      if (isFunction(e.persist)) {
        e.persist();
      }
      if (wait && waitType) {
        e.stopPropagation();
        clickHandler(e);
      } else {
        clickHandler(e);
      }
    },
    [clickHandler, wait, waitType],
  );

  const fixTwoCNChar = useCallback(() => {
    const el = elementRef.current;
    if (!el || getConfig('autoInsertSpaceInButton') === false) {
      return;
    }
    const buttonText = el.textContent;
    const needInserted = Children.count(children) === 1 && !icon
      && !(funcType === FuncType.link || funcType === FuncType.flat);
    if (needInserted && buttonText && isTwoCNChar(buttonText)) {
      setHasTwoCNChar(true);
    } else {
      setHasTwoCNChar(false);
    }
  }, [children, funcType, getConfig, icon]);

  useEffect(() => {
    fixTwoCNChar();
  });

  const tooltip = tooltipProp ?? getTooltip('button');
  const autoInsertSpace = getConfig('autoInsertSpaceInButton') !== false;

  const isNeedInserted = useMemo(
    () =>
      Children.count(children) === 1 &&
      !icon &&
      !(funcType === FuncType.link || funcType === FuncType.flat),
    [children, funcType, icon],
  );

  const childrenCount = Children.count(children);
  const isIconOnlyChild =
    childrenCount === 1 &&
    isValidElement(children) &&
    (children.type as { __C7N_ICON?: boolean }).__C7N_ICON;
  const classString = classNames(`${prefixCls}-wrapper`, prefixCls, className, {
    [`${prefixCls}-${funcType}`]: funcType,
    [`${prefixCls}-${color}`]: color,
    [`${prefixCls}-icon-only`]: icon
      ? childrenCount === 0 || children === false
      : isIconOnlyChild,
    [`${prefixCls}-block`]: block,
    [`${prefixCls}-loading`]: loading,
    [`${prefixCls}-two-chinese-chars`]: hasTwoCNChar && autoInsertSpace,
    [`${prefixCls}-disabled`]: isDisabled,
  });

  const iconHiddenStyle: CSSProperties = {
    color: 'transparent',
    backgroundColor: 'transparent',
    transition: 'none',
    position: 'absolute',
  };

  const buttonIcon = (
    <>
      {icon && <Icon type={icon} style={loading ? iconHiddenStyle : {}} />}
      {loading && <Progress key="loading" type="loading" size="small" />}
    </>
  );

  const Cmp = href ? 'a' : 'button';
  const cmpProps: Record<string, any> = {
    ref: elementRef,
    className: classString,
    style,
    hidden,
    target: href ? target : undefined,
    type: href ? undefined : type,
    href: href && !isDisabled ? href : undefined,
    disabled: isDisabled || undefined,
  };

  if (!isDisabled) {
    cmpProps.onClick = handleClickIfBubble;
  }
  if (onMouseEnter) {
    cmpProps.onMouseEnter = onMouseEnter;
  }
  if (onMouseLeave) {
    cmpProps.onMouseLeave = onMouseLeave;
  }

  if (tooltip === ButtonTooltip.always && children != null) {
    cmpProps.title =
      typeof children === 'string' || typeof children === 'number' ? String(children) : undefined;
  }

  const kids =
    children || children === 0
      ? spaceChildren(children, isNeedInserted && autoInsertSpace)
      : null;
  const hasString = Children.toArray(children).some(child => isString(child));

  const tooltipWrapper = isDisabled && !href && (onMouseEnter || onMouseLeave);
  const omits: string[] = [];
  if (tooltipWrapper) {
    omits.push('className', 'style', 'hidden');
  }
  if (href) {
    omits.push('type');
  }

  const button = (
    <Ripple disabled={isDisabled || funcType === FuncType.link}>
      <Cmp {...omit(cmpProps, omits)}>
        {buttonIcon}
        {hasString ? <span>{kids}</span> : kids}
      </Cmp>
    </Ripple>
  );

  if (tooltipWrapper) {
    return (
      <span
        className={classNames(classString, `${prefixCls}-disabled-wrapper`)}
        style={style}
        hidden={hidden}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {button}
      </span>
    );
  }

  return button;
};

Button.displayName = 'DisplayButton';

export default Button;
