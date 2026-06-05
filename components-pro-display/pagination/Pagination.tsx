import React, { ReactNode, useCallback, useMemo } from 'react';
import classNames from 'classnames';
import Icon from '../primitives/Icon';
import useProPrefix from '../_util/useProPrefix';
import Pager from './Pager';
import { SizeChangerPosition } from './enum';

export type PagerType = 'page' | 'prev' | 'next' | 'first' | 'last' | 'jump-prev' | 'jump-next';

export interface PaginationProps {
  total: number;
  page?: number;
  pageSize?: number;
  onChange?: (page: number, pageSize: number) => void;
  itemRender?: (page: number, type: PagerType) => ReactNode;
  pageSizeOptions?: string[];
  showSizeChanger?: boolean;
  showSizeChangerLabel?: boolean;
  showTotal?: boolean;
  showPager?: boolean;
  hideOnSinglePage?: boolean;
  sizeChangerPosition?: SizeChangerPosition;
  className?: string;
  disabled?: boolean;
}

const DEFAULT_PAGE_SIZE_OPTIONS = ['10', '20', '50', '100'];

function defaultItemRender(page: number, type: PagerType) {
  switch (type) {
    case 'first':
      return <Icon type="first_page" />;
    case 'last':
      return <Icon type="last_page" />;
    case 'prev':
      return <Icon type="navigate_before" />;
    case 'next':
      return <Icon type="navigate_next" />;
    case 'jump-prev':
    case 'jump-next':
      return '•••';
    default:
      return page;
  }
}

const Pagination: React.FunctionComponent<PaginationProps> = props => {
  const {
    total,
    page = 1,
    pageSize = 10,
    onChange,
    itemRender = defaultItemRender,
    pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
    showSizeChanger = true,
    showSizeChangerLabel = true,
    showTotal = true,
    showPager = true,
    hideOnSinglePage = false,
    sizeChangerPosition = SizeChangerPosition.left,
    className,
    disabled = false,
  } = props;

  const prefixCls = useProPrefix('pagination');

  const totalPage = useMemo(() => Math.max(1, Math.ceil(total / pageSize)), [pageSize, total]);
  const currentPage = Math.min(Math.max(page, 1), totalPage);
  const hasNext = currentPage < totalPage;

  const handleChange = useCallback(
    (nextPage: number, nextPageSize?: number) => {
      const size = nextPageSize ?? pageSize;
      let pageChange = nextPage;
      if (nextPageSize !== undefined && nextPageSize !== pageSize) {
        pageChange = 1;
      }
      onChange?.(pageChange, size);
    },
    [onChange, pageSize],
  );

  const handlePageSizeChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      handleChange(1, Number(event.target.value));
    },
    [handleChange],
  );

  const renderPager = useCallback(
    (pagerPage: number, type: PagerType, active = false, pagerDisabled = false) => (
      <Pager
        key={type === 'page' ? pagerPage : type}
        page={pagerPage}
        type={type}
        active={active}
        disabled={pagerDisabled || disabled}
        className={classNames(`${prefixCls}-pager`, `${prefixCls}-pager-${type}`)}
        renderer={itemRender}
        onClick={handleChange}
      />
    ),
    [disabled, handleChange, itemRender, prefixCls],
  );

  if (hideOnSinglePage && total <= pageSize) {
    return null;
  }

  const from = total === 0 ? 0 : pageSize * (currentPage - 1) + 1;
  const to = Math.min(pageSize * currentPage, total);

  const sizeChanger = showSizeChanger ? (
    <select
      key="size-changer"
      className={`${prefixCls}-size-changer-native`}
      value={String(pageSize)}
      disabled={disabled}
      onChange={handlePageSizeChange}
    >
      {pageSizeOptions.map(option => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  ) : null;

  const sizeChangerNode = showSizeChanger ? (
    showSizeChangerLabel ? (
      [
        <span key="size-info" className={`${prefixCls}-perpage`}>
          每页行数
        </span>,
        sizeChanger,
      ]
    ) : (
      sizeChanger
    )
  ) : null;

  return (
    <nav className={classNames(prefixCls, className)}>
      {sizeChangerPosition === SizeChangerPosition.left && sizeChangerNode}
      {showTotal && (
        <span key="total" className={`${prefixCls}-page-info`}>
          {from} - {to} / {total}
        </span>
      )}
      {renderPager(1, 'first', false, currentPage === 1)}
      {renderPager(currentPage - 1, 'prev', false, currentPage === 1)}
      {showPager && renderPager(currentPage, 'page', true)}
      {renderPager(currentPage + 1, 'next', false, !hasNext)}
      {renderPager(totalPage, 'last', false, !hasNext)}
      {sizeChangerPosition === SizeChangerPosition.right && sizeChangerNode}
    </nav>
  );
};

Pagination.displayName = 'DisplayPagination';

export default Pagination;
