import React, { ReactNode } from 'react';
import classNames from 'classnames';

export interface InputWrapperOptions {
  border?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  prefix?: ReactNode;
  suffix?: ReactNode;
}

export function renderInputWrapper(
  inputPrefixCls: string,
  input: ReactNode,
  options: InputWrapperOptions = {},
): ReactNode {
  const { border = true, disabled, readOnly, prefix, suffix } = options;
  return (
    <span
      className={classNames(`${inputPrefixCls}-wrapper`, {
        [`${inputPrefixCls}-border`]: border,
        [`${inputPrefixCls}-disabled`]: disabled,
        [`${inputPrefixCls}-read-only`]: readOnly,
      })}
    >
      <label>
        {prefix}
        {input}
        {suffix}
      </label>
    </span>
  );
}
