export type PaginationProps = {
  currentPage: number;
  pagesToShow: number;
  totalPages: number;
};

export const getPaginationIndexed = ({ currentPage, pagesToShow, totalPages }: PaginationProps) => {
  const isNotRangeStart = currentPage > pagesToShow;
  const isNotRangeEnd = currentPage + pagesToShow <= totalPages;
  const isOnly1PageToHide = totalPages - pagesToShow - 1 <= 1;
  const rangeStartIndex = currentPage - pagesToShow >= 0 || isNotRangeStart ? currentPage - 1 : 1;
  const rangeEndIndex =
    !isOnly1PageToHide && isNotRangeEnd ? rangeStartIndex + pagesToShow : totalPages;
  const rangeDiff = rangeEndIndex - rangeStartIndex;
  const isIncompleteRange = rangeDiff < pagesToShow && totalPages > pagesToShow;
  const rangeStart = isIncompleteRange
    ? rangeStartIndex - (pagesToShow - rangeDiff)
    : rangeStartIndex;
  return {
    start: rangeStart,
    end: rangeEndIndex,
  };
};

export const getPaginationRange = (paginationProps: PaginationProps) => {
  const { totalPages } = paginationProps;
  const { start, end } = getPaginationIndexed(paginationProps);
  const shouldDisplayDots = end < totalPages;
  const dotsPageIndex = shouldDisplayDots ? Math.min(end, totalPages) : -1;

  return {
    start,
    end,
    dotsIndex: dotsPageIndex,
  };
};
