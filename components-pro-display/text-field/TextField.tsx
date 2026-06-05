import React, {
  InputHTMLAttributes,
  KeyboardEvent,
  ReactNode,
  useCallback,
} from 'react';
import classNames from 'classnames';
import omit from 'lodash/omit';
import useProPrefix from '../_util/useProPrefix';
import { renderInputWrapper } from './renderInputWrapper';

export interface TextFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'prefix' | 'size'> {
  /** 查询条等场景：带 label 时 QueryBar 会自动包一层 Form.Item */
  label?: ReactNode;
  border?: boolean;
  prefix?: ReactNode;
  suffix?: ReactNode;
  clearButton?: boolean;
  /** 回车时触发，QueryBar 会注入此回调 */
  onEnterDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
}

const TextField: React.FunctionComponent<TextFieldProps> = props => {
  const {
    border = true,
    prefix,
    suffix,
    className,
    style,
    disabled,
    readOnly,
    onKeyDown,
    onEnterDown,
  } = props;
  const rest = omit(props, [
    'border',
    'prefix',
    'suffix',
    'clearButton',
    'label',
    'className',
    'style',
    'disabled',
    'readOnly',
    'onKeyDown',
    'onEnterDown',
  ]);

  const prefixCls = useProPrefix('input');

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      onKeyDown?.(event);
      if (!event.defaultPrevented && event.key === 'Enter') {
        onEnterDown?.(event);
      }
    },
    [onKeyDown, onEnterDown],
  );

  const input = (
    <input
      {...omit(rest, ['onEnterDown'])}
      className={classNames(prefixCls, className)}
      style={style}
      disabled={disabled}
      readOnly={readOnly}
      onKeyDown={handleKeyDown}
    />
  );

  return (
    <>
      {renderInputWrapper(prefixCls, input, { border, disabled, readOnly, prefix, suffix })}
    </>
  );
};

TextField.displayName = 'DisplayTextField';

export default TextField;
