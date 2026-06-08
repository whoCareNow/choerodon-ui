import React, { cloneElement, CSSProperties, isValidElement, ReactNode, useContext, useMemo } from 'react';
import classNames from 'classnames';
import { pxToRem } from '../_util/pxToRem';
import Col from '../primitives/Col';
import useProPrefix from '../_util/useProPrefix';
import FormContext from './FormContext';
import { LabelAlign, LabelLayout, RequiredMarkAlign } from './enum';
import { FIELD_SUFFIX, getRequiredMarkAlign, normalizeLabelWidth } from './utils';
import wrapNativeInput from './wrapNativeInput';
import DisplayTextField from '../text-field/TextField';

export interface FormItemProps {
  label?: ReactNode;
  required?: boolean;
  children?: ReactNode;
  className?: string;
  labelWidth?: number | 'auto';
  useColon?: boolean;
  requiredMarkAlign?: RequiredMarkAlign;
  labelLayout?: LabelLayout;
  hidden?: boolean;
  /** QueryBar 注入：转发给子级 TextField 等字段组件 */
  onEnterDown?: (e: React.KeyboardEvent) => void;
}

function Label(props: {
  className?: string;
  children?: ReactNode;
  width?: number;
  style?: CSSProperties;
}) {
  const { className, children, width, style } = props;
  const labelStyle = useMemo(
    () => ({
      ...style,
      width: width !== undefined ? pxToRem(width) : undefined,
    }),
    [style, width],
  );
  return (
    <label className={className} style={labelStyle}>
      <span>{children}</span>
    </label>
  );
}

function injectItemProps(
  children: ReactNode,
  inputPrefixCls: string,
  fieldPrefixCls: string,
  useTableLayout: boolean,
  onEnterDown?: FormItemProps['onEnterDown'],
) {
  const fieldClassName = useTableLayout ? fieldPrefixCls : undefined;
  let content = wrapNativeInput(children, inputPrefixCls, fieldClassName);

  if (isValidElement(content)) {
    const childType = content.type as { displayName?: string };
    const isTextField = childType === DisplayTextField || childType.displayName === 'DisplayTextField';
    const extraProps: Record<string, unknown> = {};

    if (onEnterDown && isTextField) {
      extraProps.onEnterDown = onEnterDown;
    }
    if (useTableLayout && isTextField) {
      extraProps.className = classNames(
        fieldPrefixCls,
        (content.props as { className?: string }).className,
      );
    }
    if (Object.keys(extraProps).length) {
      content = cloneElement(content, extraProps);
    }
  }
  return content;
}

function renderFieldWrapper(
  wrapperClassName: string,
  disabled: boolean | undefined,
  children: ReactNode,
) {
  return (
    <div className={wrapperClassName} aria-disabled={disabled}>
      {children}
    </div>
  );
}

const Item: React.FunctionComponent<FormItemProps> = props => {
  const {
    label,
    required,
    children,
    className,
    labelWidth: itemLabelWidth,
    useColon: itemUseColon,
    requiredMarkAlign: itemRequiredMarkAlign,
    labelLayout: itemLabelLayout,
    hidden,
    onEnterDown,
  } = props;

  if (hidden) {
    return null;
  }

  const formContext = useContext(FormContext);
  const {
    labelLayout = LabelLayout.horizontal,
    labelWidth: contextLabelWidth = 100,
    labelAlign = LabelAlign.right,
    useColon = false,
    requiredMarkAlign = RequiredMarkAlign.left,
    disabled,
    columns = 1,
    useTableLayout = false,
  } = formContext;

  const prefixCls = useProPrefix(FIELD_SUFFIX);
  const inputPrefixCls = useProPrefix('input');
  const fieldContent = useMemo(
    () => injectItemProps(children, inputPrefixCls, prefixCls, useTableLayout, onEnterDown),
    [children, inputPrefixCls, prefixCls, useTableLayout, onEnterDown],
  );
  const fieldUseColon = itemUseColon !== undefined ? itemUseColon : useColon;
  const layout = itemLabelLayout !== undefined ? itemLabelLayout : labelLayout;
  const markAlign = getRequiredMarkAlign(itemRequiredMarkAlign || requiredMarkAlign);

  if (layout === LabelLayout.none || layout === LabelLayout.float || layout === LabelLayout.placeholder) {
    return (
      <div className={classNames(prefixCls, `${prefixCls}-wrapper`, className)}>{fieldContent}</div>
    );
  }

  const columnLabelWidth = normalizeLabelWidth(contextLabelWidth, columns)[0];
  const labelWidth =
    itemLabelWidth !== undefined
      ? itemLabelWidth
      : columnLabelWidth === 'auto'
        ? undefined
        : columnLabelWidth;

  const labelClassName = classNames(
    `${prefixCls}-label`,
    !useTableLayout && `${prefixCls}-label-grid`,
    `${prefixCls}-label-${labelAlign}`,
    {
      [`${prefixCls}-required`]: required,
      [`${prefixCls}-label-vertical`]: layout === LabelLayout.vertical,
      [`${prefixCls}-label-useColon`]: label && fieldUseColon,
      [`${prefixCls}-label-required-mark-${markAlign}`]:
        layout === LabelLayout.horizontal && required,
    },
  );

  const wrapperClassName = classNames(`${prefixCls}-wrapper`, className);

  if (layout === LabelLayout.vertical) {
    return (
      <div className={`${prefixCls}-row`}>
        <Label className={labelClassName}>{label}</Label>
        <div className={wrapperClassName}>{fieldContent}</div>
      </div>
    );
  }

  if (useTableLayout) {
    return (
      <>
        <td className={labelClassName}>
          <label>
            <span>{label}</span>
          </label>
        </td>
        <td>
          {renderFieldWrapper(wrapperClassName, disabled, fieldContent)}
        </td>
      </>
    );
  }

  const rowClassName = `${prefixCls}-row ${prefixCls}-row`;

  return (
    <div className={rowClassName}>
      <Col className={`${prefixCls}-col`}>
        <Label className={labelClassName} width={typeof labelWidth === 'number' ? labelWidth : undefined}>
          {label}
        </Label>
      </Col>
      <Col className={`${prefixCls}-col ${prefixCls}-col-control`}>
        <div className={wrapperClassName} aria-disabled={disabled}>
          {fieldContent}
        </div>
      </Col>
    </div>
  );
};

Item.displayName = 'DisplayFormItem';

export default Item;
