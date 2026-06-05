import React, {
  CSSProperties,
  isValidElement,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import classNames from 'classnames';
import useProPrefix from '../_util/useProPrefix';
import Icon from '../primitives/Icon';
import Option, { OptionProps } from './Option';

export type SelectSize = 'small' | 'default' | 'large';

export interface SelectProps {
  value?: string | number;
  defaultValue?: string | number;
  onChange?: (value: string | number) => void;
  onBeforeChange?: (value: string | number) => boolean | void;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  disabled?: boolean;
  isFlat?: boolean;
  size?: SelectSize;
  border?: boolean;
  clearButton?: boolean;
  searchable?: boolean;
}

interface ParsedOption {
  value: string | number;
  label: ReactNode;
  disabled?: boolean;
}

function parseOptions(children: ReactNode): ParsedOption[] {
  const options: ParsedOption[] = [];
  React.Children.forEach(children, child => {
    if (
      isValidElement(child) &&
      (child.type as typeof Option & { __PRO_OPTION?: boolean }).__PRO_OPTION
    ) {
      const { value, disabled, children: label } = child.props as OptionProps;
      if (value !== undefined) {
        options.push({
          value,
          label: label ?? value,
          disabled,
        });
      }
    }
  });
  return options;
}

function getFlatInputWidth(text: string): number {
  return Math.max(text.length * 7 + 4, 4);
}

const Select: React.FunctionComponent<SelectProps> = props => {
  const {
    value,
    onChange,
    onBeforeChange,
    children,
    className,
    style,
    disabled = false,
    isFlat = false,
    size = 'default',
    border = true,
    clearButton = true,
  } = props;

  const prefixCls = useProPrefix('select');
  const wrapperRef = useRef<HTMLSpanElement>(null);
  const [open, setOpen] = useState(false);

  const options = useMemo(() => parseOptions(children), [children]);

  const selectedOption = useMemo(
    () => options.find(option => String(option.value) === String(value)),
    [options, value],
  );

  const displayLabel = selectedOption ? selectedOption.label : value;
  const displayText = value !== undefined && value !== '' ? String(displayLabel ?? value) : '';

  const close = useCallback(() => setOpen(false), []);

  const handleToggle = useCallback(() => {
    if (!disabled) {
      setOpen(prev => !prev);
    }
  }, [disabled]);

  const handleSelect = useCallback(
    (nextValue: string | number) => {
      if (onBeforeChange && onBeforeChange(nextValue) === false) {
        return;
      }
      onChange?.(nextValue);
      close();
    },
    [close, onBeforeChange, onChange],
  );

  useEffect(() => {
    if (!open) {
      return undefined;
    }
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        close();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [close, open]);

  const inputStyle = useMemo((): CSSProperties => {
    if (isFlat) {
      return {
        width: getFlatInputWidth(displayText),
        boxSizing: 'content-box',
      };
    }
    return { textIndent: '-1000px' };
  }, [displayText, isFlat]);

  const wrapperClassName = classNames(
    `${prefixCls}-wrapper`,
    {
      [`${prefixCls}-suffix-button`]: true,
      [`${prefixCls}-not-editable`]: true,
      [`${prefixCls}-border`]: border,
      [`${prefixCls}-flat`]: isFlat,
      [`${prefixCls}-sm`]: size === 'small',
      [`${prefixCls}-lg`]: size === 'large',
      [`${prefixCls}-empty`]: value === undefined || value === '',
      [`${prefixCls}-expand`]: open,
      [`${prefixCls}-disabled`]: disabled,
    },
    className,
  );

  const dropdown = open ? (
    <ul className={`${prefixCls}-dropdown-menu`} role="listbox">
      {options.map(option => {
        const selected = String(option.value) === String(value);
        return (
          <li
            key={String(option.value)}
            role="option"
            aria-selected={selected}
            className={classNames(`${prefixCls}-dropdown-menu-item`, {
              [`${prefixCls}-dropdown-menu-item-selected`]: selected,
              [`${prefixCls}-dropdown-menu-item-disabled`]: option.disabled,
            })}
            onClick={() => {
              if (!option.disabled) {
                handleSelect(option.value);
              }
            }}
          >
            {option.label}
          </li>
        );
      })}
    </ul>
  ) : null;

  return (
    <span ref={wrapperRef} className={wrapperClassName} style={style}>
      {value !== undefined && value !== '' ? (
        <input type="hidden" value={String(value)} readOnly />
      ) : null}
      {!isFlat ? (
        <span className={`${prefixCls}-rendered-value`}>
          <span className={`${prefixCls}-rendered-value-inner`}>{displayLabel}</span>
        </span>
      ) : null}
      <label onMouseDown={e => e.preventDefault()}>
        <input
          readOnly
          autoComplete="off"
          type="text"
          className={prefixCls}
          value={displayText}
          disabled={disabled}
          style={inputStyle}
          onClick={handleToggle}
        />
        {clearButton && value !== undefined && value !== '' && !disabled ? (
          <div className={`${prefixCls}-inner-button ${prefixCls}-clear-button`}>
            <Icon type="close" />
          </div>
        ) : null}
        <div className={`${prefixCls}-suffix`}>
          <Icon type="baseline-arrow_drop_down" className={`${prefixCls}-trigger`} />
        </div>
      </label>
      {dropdown}
    </span>
  );
};

Select.displayName = 'DisplaySelect';

(Select as typeof Select & { Option: typeof Option }).Option = Option;

export default Select;
