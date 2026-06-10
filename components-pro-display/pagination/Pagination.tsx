import React, { ReactNode, useCallback, useMemo } from 'react';
import classNames from 'classnames';
import Icon from '../primitives/Icon';
import Select from '../select/Select';
import Option from '../select/Option';
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
  showTotal?: boolean | ((total: number, range: [number, number]) => ReactNode);
  showPager?: boolean;
  hideOnSinglePage?: boolean;
  sizeChangerPosition?: SizeChangerPosition;
  sizeChangerOptionRenderer?: (option: { text: string; value: string }) => ReactNode;
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
    sizeChangerOptionRenderer,
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

  const renderPagers = useCallback(
    (pagerPage: number) => {
      const bufferSize = 1;
      const pagerList: ReactNode[] = [];
      if (totalPage <= 3 + bufferSize * 2) {
        for (let i = 1; i <= totalPage; i += 1) {
          pagerList.push(renderPager(i, 'page', pagerPage === i));
        }
      } else {
        let left = Math.max(1, pagerPage - bufferSize);
        let right = Math.min(totalPage, pagerPage + bufferSize);
        if (pagerPage - 1 <= bufferSize) {
          right = 1 + bufferSize * 2;
        }
        if (totalPage - pagerPage <= bufferSize) {
          left = totalPage - bufferSize * 2;
        }
        for (let i = left; i <= right; i += 1) {
          pagerList.push(renderPager(i, 'page', pagerPage === i));
        }
        if (pagerPage - 1 >= bufferSize * 2 && pagerPage !== 1 + 2) {
          pagerList.unshift(renderPager(Math.max(pagerPage - 5, 1), 'jump-prev'));
        }
        if (totalPage - pagerPage >= bufferSize * 2 && pagerPage !== totalPage - 2) {
          pagerList.push(renderPager(Math.min(pagerPage + 5, totalPage), 'jump-next'));
        }
        if (left !== 1) {
          pagerList.unshift(renderPager(1, 'page', pagerPage === 1));
        }
        if (totalPage > 1 && right !== totalPage) {
          pagerList.push(renderPager(totalPage, 'page', pagerPage === totalPage));
        }
      }
      return pagerList;
    },
    [renderPager, totalPage],
  );

  const handlePageSizeChange = useCallback(
    (value: string | number) => {
      handleChange(1, Number(value));
    },
    [handleChange],
  );

  if (hideOnSinglePage && total <= pageSize) {
    return null;
  }

  const from = total === 0 ? 0 : pageSize * (currentPage - 1) + 1;
  const to = Math.min(pageSize * currentPage, total);

  const sizeChanger = showSizeChanger ? (
    <Select
      key="size-select"
      isFlat
      searchable={false}
      className={`${prefixCls}-size-changer`}
      disabled={disabled}
      onChange={handlePageSizeChange}
      value={String(pageSize)}
      clearButton={false}
      size="small"
    >
      {pageSizeOptions.map(option => (
        <Option key={option} value={option}>
          {sizeChangerOptionRenderer
            ? sizeChangerOptionRenderer({ text: option, value: option })
            : option}
        </Option>
      ))}
    </Select>
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

  const pagersNode = showPager ? renderPagers(currentPage) : null;
  const isShowFirstAndLast = !showPager;

  return (
    <nav className={classNames(`${prefixCls}-wrapper`, prefixCls, className)}>
      {sizeChangerPosition === SizeChangerPosition.left && sizeChangerNode}
      {showTotal && (
        <span key="total" className={`${prefixCls}-page-info`}>
          {typeof showTotal === 'function'
            ? showTotal(total, [from, to])
            : `${from} - ${to} / ${total}`}
        </span>
      )}
      {isShowFirstAndLast && renderPager(1, 'first', false, currentPage === 1)}
      {renderPager(currentPage - 1, 'prev', false, currentPage === 1)}
      {pagersNode}
      {renderPager(currentPage + 1, 'next', false, !hasNext)}
      {isShowFirstAndLast && renderPager(totalPage, 'last', false, !hasNext)}
      {sizeChangerPosition === SizeChangerPosition.right && sizeChangerNode}
    </nav>
  );
};

Pagination.displayName = 'DisplayPagination';

export default Pagination;
