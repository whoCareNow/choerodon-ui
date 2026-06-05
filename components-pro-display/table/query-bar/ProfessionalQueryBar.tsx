import React, {
  cloneElement,
  isValidElement,
  KeyboardEvent,
  ReactElement,
  ReactNode,
  useCallback,
  useMemo,
  useState,
} from 'react';
import classNames from 'classnames';
import isFunction from 'lodash/isFunction';
import Icon from '../../primitives/Icon';
import useProPrefix from '../../_util/useProPrefix';
import Button from '../../button';
import { ButtonColor, FuncType } from '../../button/enum';
import Form, { FormProps } from '../../form';
import { LabelLayout } from '../../form/enum';
import TableButtons from './TableButtons';

const TABLE_LOCALE = {
  reset_button: '重置',
  query_button: '查询',
  more: '更多',
};

export interface ProfessionalQueryBarProps {
  prefixCls?: string;
  queryFields?: ReactNode[];
  queryFieldsLimit?: number;
  buttons?: ReactNode[];
  formProps?: FormProps;
  summaryBar?: ReactNode;
  defaultExpanded?: boolean;
  autoQueryAfterReset?: boolean;
  onBeforeQuery?: () => boolean | void | Promise<boolean | void>;
  onQuery?: () => void;
  onReset?: () => void;
  className?: string;
}

function normalizeQueryFields(queryFields?: ReactNode[]): ReactElement[] {
  if (!queryFields) {
    return [];
  }
  return queryFields.filter(
    (field): field is ReactElement =>
      isValidElement(field) && !(field.props as { hidden?: boolean }).hidden,
  );
}

function injectEnterDown(elements: ReactElement[], onEnter: () => void): ReactElement[] {
  return elements.map(element => {
    const { onEnterDown } = element.props as { onEnterDown?: () => void };
    if (onEnterDown && isFunction(onEnterDown)) {
      return element;
    }
    return cloneElement(element, { onEnterDown: onEnter });
  });
}

const ProfessionalQueryBar: React.FunctionComponent<ProfessionalQueryBarProps> = props => {
  const {
    queryFields: queryFieldsProp,
    queryFieldsLimit = 3,
    buttons = [],
    formProps,
    summaryBar,
    defaultExpanded = false,
    autoQueryAfterReset = true,
    onBeforeQuery,
    onQuery,
    onReset,
    className,
    prefixCls: customizePrefixCls,
  } = props;

  const prefixCls = useProPrefix('table', customizePrefixCls);
  const queryFields = useMemo(() => normalizeQueryFields(queryFieldsProp), [queryFieldsProp]);
  const [moreOpen, setMoreOpen] = useState(defaultExpanded);

  const mainFields = useMemo(
    () => queryFields.slice(0, queryFieldsLimit),
    [queryFields, queryFieldsLimit],
  );
  const moreFields = useMemo(
    () => queryFields.slice(queryFieldsLimit),
    [queryFields, queryFieldsLimit],
  );

  const handleQuery = useCallback(
    async (collapse?: boolean) => {
      if (onBeforeQuery) {
        const ok = await onBeforeQuery();
        if (ok === false) {
          return;
        }
      }
      if (onQuery && !collapse) {
        onQuery();
      }
    },
    [onBeforeQuery, onQuery],
  );

  const handleFieldEnter = useCallback(() => {
    handleQuery();
  }, [handleQuery]);

  const handleQueryReset = useCallback(() => {
    onReset?.();
    if (autoQueryAfterReset) {
      handleQuery(true);
    }
  }, [autoQueryAfterReset, handleQuery, onReset]);

  const toggleMore = useCallback(() => {
    setMoreOpen(prev => !prev);
  }, []);

  const handleFormKeyDown = useCallback(
    (event: KeyboardEvent<HTMLFormElement>) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        handleFieldEnter();
      }
      formProps?.onKeyDown?.(event);
    },
    [formProps, handleFieldEnter],
  );

  const labelLayout = formProps?.labelLayout ?? LabelLayout.horizontal;
  const noVerticalFlag = labelLayout !== LabelLayout.vertical;

  const queryBar = useMemo(() => {
    if (!queryFields.length) {
      return null;
    }
    const fieldsWithEnter = injectEnterDown(mainFields, handleFieldEnter);
    const moreWithEnter = moreOpen ? injectEnterDown(moreFields, handleFieldEnter) : [];

    return (
      <div key="query_bar" className={`${prefixCls}-professional-query-bar`}>
        <Form
          labelWidth={80}
          labelLayout={labelLayout}
          {...formProps}
          onKeyDown={handleFormKeyDown}
        >
          {fieldsWithEnter}
          {moreWithEnter}
        </Form>
        <span
          className={classNames(`${prefixCls}-professional-query-bar-button`, {
            [`${prefixCls}-professional-query-bar-button-vertical`]: !noVerticalFlag,
          })}
        >
          {moreFields.length > 0 && (
            <Button className={`${prefixCls}-professional-query-more`} funcType={FuncType.raised} onClick={toggleMore}>
              {TABLE_LOCALE.more}
              {moreOpen ? <Icon type="expand_less" /> : <Icon type="expand_more" />}
            </Button>
          )}
          <Button className={`${prefixCls}-professional-reset-btn`} funcType={FuncType.raised} onClick={handleQueryReset}>
            {TABLE_LOCALE.reset_button}
          </Button>
          <Button color={ButtonColor.primary} wait={500} onClick={() => handleQuery()}>
            {TABLE_LOCALE.query_button}
          </Button>
        </span>
      </div>
    );
  }, [
    formProps,
    handleFieldEnter,
    handleFormKeyDown,
    handleQuery,
    handleQueryReset,
    labelLayout,
    mainFields,
    moreFields,
    moreOpen,
    noVerticalFlag,
    prefixCls,
    queryFields.length,
    toggleMore,
  ]);

  const toolbar = useMemo(() => {
    if (!buttons.length && !summaryBar) {
      return null;
    }
    const summaryBarCls = summaryBar ? `${prefixCls}-summary-topLeft` : '';
    return (
      <div key="professional_toolbar" className={`${prefixCls}-professional-toolbar`}>
        <TableButtons prefixCls={prefixCls} buttons={buttons} className={summaryBarCls}>
          {summaryBar}
        </TableButtons>
      </div>
    );
  }, [buttons, prefixCls, summaryBar]);

  if (!queryBar && !toolbar) {
    return null;
  }

  return (
    <div className={className}>
      {queryBar}
      {toolbar}
    </div>
  );
};

ProfessionalQueryBar.displayName = 'DisplayTableProfessionalBar';

export default ProfessionalQueryBar;
