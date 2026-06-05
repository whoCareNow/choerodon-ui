import React, { CSSProperties, ReactNode, useContext, useMemo } from 'react';
import classNames from 'classnames';
import { pxToRem } from '../_util/pxToRem';
import Row from '../primitives/Row';
import Col from '../primitives/Col';
import useProPrefix from '../_util/useProPrefix';
import FormContext from './FormContext';
import { LabelAlign, LabelLayout, RequiredMarkAlign } from './enum';
import { FIELD_SUFFIX, getRequiredMarkAlign, normalizeLabelWidth } from './utils';

export interface FormItemProps {
  label?: ReactNode;
  required?: boolean;
  children?: ReactNode;
  className?: string;
  labelWidth?: number | 'auto';
  useColon?: boolean;
  requiredMarkAlign?: RequiredMarkAlign;
  labelLayout?: LabelLayout;
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
  } = props;

  const formContext = useContext(FormContext);
  const {
    labelLayout = LabelLayout.horizontal,
    labelWidth: contextLabelWidth = 100,
    labelAlign = LabelAlign.right,
    useColon = false,
    requiredMarkAlign = RequiredMarkAlign.left,
    disabled,
  } = formContext;

  const prefixCls = useProPrefix(FIELD_SUFFIX);
  const fieldUseColon = itemUseColon !== undefined ? itemUseColon : useColon;
  const layout = itemLabelLayout !== undefined ? itemLabelLayout : labelLayout;
  const markAlign = getRequiredMarkAlign(itemRequiredMarkAlign || requiredMarkAlign);

  if (layout === LabelLayout.none || layout === LabelLayout.float || layout === LabelLayout.placeholder) {
    return <div className={classNames(`${prefixCls}-wrapper`, className)}>{children}</div>;
  }

  const columnLabelWidth = normalizeLabelWidth(contextLabelWidth)[0];
  const labelWidth =
    itemLabelWidth !== undefined
      ? itemLabelWidth
      : columnLabelWidth === 'auto'
        ? undefined
        : columnLabelWidth;

  const labelClassName = classNames(`${prefixCls}-label`, `${prefixCls}-label-grid`, `${prefixCls}-label-${labelAlign}`, {
    [`${prefixCls}-required`]: required,
    [`${prefixCls}-label-vertical`]: layout === LabelLayout.vertical,
    [`${prefixCls}-label-useColon`]: label && fieldUseColon,
    [`${prefixCls}-label-required-mark-${markAlign}`]:
      layout === LabelLayout.horizontal && required,
  });

  const wrapperClassName = classNames(`${prefixCls}-wrapper`, className);

  if (layout === LabelLayout.vertical) {
    return (
      <div className={`${prefixCls}-row`}>
        <Label className={labelClassName}>{label}</Label>
        <div className={wrapperClassName}>{children}</div>
      </div>
    );
  }

  return (
    <Row className={`${prefixCls}-row`}>
      <Col className={`${prefixCls}-col`}>
        <Label className={labelClassName} width={typeof labelWidth === 'number' ? labelWidth : undefined}>
          {label}
        </Label>
      </Col>
      <Col className={`${prefixCls}-col ${prefixCls}-col-control`}>
        <div className={wrapperClassName} aria-disabled={disabled}>
          {children}
        </div>
      </Col>
    </Row>
  );
};

Item.displayName = 'DisplayFormItem';

export default Item;
