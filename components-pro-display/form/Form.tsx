import React, { Children, CSSProperties, FormHTMLAttributes, isValidElement, ReactElement, ReactNode } from 'react';
import classNames from 'classnames';
import useProPrefix from '../_util/useProPrefix';
import { pxToRem } from '../_util/pxToRem';
import FormContext, { FormContextValue, LabelWidth } from './FormContext';
import Item from './Item';
import { LabelAlign, LabelLayout, RequiredMarkAlign } from './enum';
import { normalizeLabelWidth } from './utils';

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
  /** 水平布局下列数，>1 时使用 table 栅格（与 Pro Form 一致，用于 QueryBar 等场景） */
  columns?: number;
}

export interface DisplayFormType extends React.FunctionComponent<FormProps> {
  Item: typeof Item;
}

function renderTableBody(children: ReactNode, columns: number) {
  const items = Children.toArray(children).filter(
    (child): child is ReactElement => isValidElement(child) && !(child.props as { hidden?: boolean }).hidden,
  );
  const rows: ReactElement[] = [];
  for (let i = 0; i < items.length; i += columns) {
    const rowItems = items.slice(i, i + columns);
    rows.push(
      <tr key={`form-row-${i}`}>
        {rowItems.map((item, index) =>
          React.cloneElement(item, { key: item.key ?? `form-item-${i + index}` }),
        )}
      </tr>,
    );
  }
  return rows;
}

function renderColGroup(columns: number, labelWidths: (number | 'auto')[]) {
  const isAutoWidth = labelWidths.every(width => width === 'auto');
  return (
    <colgroup>
      {Array.from({ length: columns }, (_, colIndex) => {
        const columnLabelWidth = labelWidths[colIndex % labelWidths.length];
        const colKey = `form-colgroup-${columns}-${String(columnLabelWidth)}-${colIndex}`;
        return (
          <React.Fragment key={colKey}>
            <col
              style={
                columnLabelWidth !== 'auto' && typeof columnLabelWidth === 'number'
                  ? { width: pxToRem(columnLabelWidth) }
                  : undefined
              }
            />
            <col style={isAutoWidth ? { width: `${100 / columns}%` } : undefined} />
          </React.Fragment>
        );
      })}
    </colgroup>
  );
}

const Form: DisplayFormType = props => {
  const {
    labelLayout = LabelLayout.horizontal,
    labelWidth = 100,
    labelAlign = LabelAlign.right,
    useColon = true,
    requiredMarkAlign = RequiredMarkAlign.left,
    disabled = false,
    header,
    children,
    className,
    style,
    columns = 1,
    ...rest
  } = props;

  const prefixCls = useProPrefix('form');
  const useTableLayout = labelLayout === LabelLayout.horizontal;

  const normalizedLabelWidth = normalizeLabelWidth(labelWidth, columns);
  const isAutoWidth = normalizedLabelWidth.every(width => width === 'auto');

  const contextValue: FormContextValue = {
    labelLayout,
    labelWidth,
    labelAlign,
    useColon,
    requiredMarkAlign,
    disabled,
    columns,
    useTableLayout,
  };

  const formClassName = classNames(
    prefixCls,
    {
      [`${prefixCls}-${labelLayout}`]: labelLayout,
      [`${prefixCls}-${columns > 1 ? 'multi' : 'single'}`]: useTableLayout,
    },
    className,
  );

  const body = useTableLayout ? (
    <table className={isAutoWidth ? 'auto-width' : undefined}>
      {renderColGroup(columns, normalizedLabelWidth)}
      <tbody>{renderTableBody(children, columns)}</tbody>
    </table>
  ) : (
    children
  );

  return (
    <FormContext.Provider value={contextValue}>
      <form className={formClassName} style={style} {...rest}>
        {header && <div className={`${prefixCls}-header`}>{header}</div>}
        {body}
      </form>
    </FormContext.Provider>
  );
};

Form.displayName = 'DisplayForm';
Form.Item = Item;

export default Form;
