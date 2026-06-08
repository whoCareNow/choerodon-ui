import React, { CSSProperties, ReactNode } from 'react';
import classNames from 'classnames';

export interface InputWrapperOptions {
  border?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  prefix?: ReactNode;
  suffix?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export function renderInputWrapper(
  inputPrefixCls: string,
  input: ReactNode,
  options: InputWrapperOptions = {},
): ReactNode {
  const { border = true, disabled, readOnly, prefix, suffix, className, style } = options;
  return (
    <span
      className={classNames(`${inputPrefixCls}-wrapper`, className, {
        [`${inputPrefixCls}-border`]: border,
        [`${inputPrefixCls}-disabled`]: disabled,
        [`${inputPrefixCls}-read-only`]: readOnly,
      })}
      style={style}
    >
      <label>
        {prefix}
        {input}
        {suffix}
      </label>
    </span>
  );
}
