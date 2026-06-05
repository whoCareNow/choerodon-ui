import React, { CSSProperties, FormHTMLAttributes, ReactNode } from 'react';
import classNames from 'classnames';
import useProPrefix from '../_util/useProPrefix';
import FormContext, { FormContextValue, LabelWidth } from './FormContext';
import Item from './Item';
import { LabelAlign, LabelLayout, RequiredMarkAlign } from './enum';

export interface FormProps extends FormHTMLAttributes<HTMLFormElement> {
  labelLayout?: LabelLayout;
  labelWidth?: LabelWidth;
  labelAlign?: LabelAlign;
  useColon?: boolean;
  requiredMarkAlign?: RequiredMarkAlign;
  disabled?: boolean;
  header?: ReactNode;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export interface DisplayFormType extends React.FunctionComponent<FormProps> {
  Item: typeof Item;
}

const Form: DisplayFormType = props => {
  const {
    labelLayout = LabelLayout.horizontal,
    labelWidth = 100,
    labelAlign = LabelAlign.right,
    useColon = false,
    requiredMarkAlign = RequiredMarkAlign.left,
    disabled = false,
    header,
    children,
    className,
    style,
    ...rest
  } = props;

  const prefixCls = useProPrefix('form');

  const contextValue: FormContextValue = {
    labelLayout,
    labelWidth,
    labelAlign,
    useColon,
    requiredMarkAlign,
    disabled,
  };

  return (
    <FormContext.Provider value={contextValue}>
      <form className={classNames(prefixCls, className)} style={style} {...rest}>
        {header && <div className={`${prefixCls}-header`}>{header}</div>}
        {children}
      </form>
    </FormContext.Provider>
  );
};

Form.displayName = 'DisplayForm';
Form.Item = Item;

export default Form;
