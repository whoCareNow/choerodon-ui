import React, { cloneElement, isValidElement, ReactNode } from 'react';
import classNames from 'classnames';
import { renderInputWrapper } from '../text-field/renderInputWrapper';

/**
 * Pro TextField 通过 c7n-pro-input-wrapper + c7n-pro-input-border 显示边框；
 * 裸 c7n-pro-input 的 border-style 为 none，UMD 场景下原生 input 需包一层。
 */
export default function wrapNativeInput(
  children: ReactNode,
  inputPrefixCls: string,
): ReactNode {
  if (!isValidElement(children) || children.type !== 'input') {
    return children;
  }
  const inputProps = children.props as React.InputHTMLAttributes<HTMLInputElement>;
  const input = cloneElement(children, {
    className: classNames(inputPrefixCls, inputProps.className),
  });
  return renderInputWrapper(inputPrefixCls, input, {
    border: true,
    disabled: inputProps.disabled,
    readOnly: inputProps.readOnly,
  });
}
