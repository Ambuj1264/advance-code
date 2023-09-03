import React, {
  useState,
  useCallback,
  useEffect,
  useMemo,
  forwardRef,
  Ref,
  useRef,
  cloneElement,
} from "react";
import { css } from "@emotion/core";
import styled, { StyledComponent } from "@emotion/styled";
import { range } from "fp-ts/lib/Array";

import WaypointWrapper from "./Lazy/WaypointWrapper";
import { ColumnSizes } from "./LandingPages/LandingPageCardSection";
import { ArrowButton } from "./ContentCarousel";
import { StyledRow } from "./ScrollSnapWrapper";
import { LazyloadOffset } from "./Lazy/LazyComponent";
import { LandingSectionPaginationParams } from "./LandingPages/hooks/useSectionPagination";

import useEffectOnce from "hooks/useEffectOnce";
import { gutters, guttersPx } from "styles/variables";
import { column, mqMax, mqMin } from "styles/base";
import { useIsMobile } from "hooks/useMediaQueryCustom";
import { getTotalPages } from "utils/helperUtils";

export const ArrowButtonHiddenOnMobile = styled(ArrowButton)`
  ${mqMax.large} {
    display: none;
  }
`;

export const StyledScrollSnapRow = styled(StyledRow)<{
  mobileRows?: number;
  mobileCardWidth: number;
}>([
  ({ mobileRows = 1, mobileCardWidth }) => css`
    position: relative;

    ${mqMax.large} {
      display: grid;
      grid-auto-columns: ${mobileCardWidth}px;
      grid-auto-flow: column;
      grid-gap: 0;
      grid-template-rows: ${range(1, mobileRows)
        .map(() => "auto")
        .join(" ")};
      padding-right: ${gutters.large}px;
      overflow: auto;
      scroll-snap-type: x mandatory;
    }

    ${mqMin.large} {
      flex-wrap: wrap;
      margin: 0 -${gutters.large / 2}px;
      overflow: hidden;
    }
  `,
]);

export const DefaultItemWrapper = styled.div<{
  isVisible: boolean;
  mobileCardWidth: number;
  columnSizes: ColumnSizes;
}>([
  ({ columnSizes }) => column(columnSizes, true),
  ({ isVisible, mobileCardWidth }) => css`
    min-width: ${mobileCardWidth}px;
    padding: 0 ${guttersPx.smallHalf};
    scroll-snap-align: start;

    ${mqMin.large} {
      display: ${isVisible ? "block" : "none"};
      min-width: unset;
      padding: 0 ${guttersPx.largeHalf};
      scroll-snap-align: initial;
    }
  `,
]);

export const Wrapper = styled.div<{ fixedHeight?: number }>([
  ({ fixedHeight }) => css`
    position: relative;
    ${mqMin.desktop} {
      height: ${fixedHeight ? `${fixedHeight}px;` : "auto"};
    }
  `,
]);

/**
 * Injects isVisible param into passed children, indicating element is visible or not.
 */
const ScrollSnapCarousel = (
  {
    itemsPerPage,
    mobileRows,
    mobileCardWidth,
    ssrRender,
    columnSizes,
    fixedHeight,
    children,
    ItemWrapper = DefaultItemWrapper,
    SkeletonComponent,
    className,
    paginationParams,
  }: {
    itemsPerPage: number;
    mobileRows: number;
    mobileCardWidth: number;
    ssrRender?: boolean;
    columnSizes: ColumnSizes;
    fixedHeight?: number;
    children: React.ReactElement | React.ReactElement[];
    ItemWrapper?: StyledComponent<any, any, Theme>;
    SkeletonComponent?: React.ElementType;
    className?: string;
    paginationParams?: LandingSectionPaginationParams | null;
  },
  waypointRef?: Ref<HTMLDivElement> | null
) => {
  const isMobile = useIsMobile();
  const isExternalPagination = !!paginationParams;
  const [isMobileOrSSR, setIsMobileOrSSR] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const childrenCount = React.Children.count(children);
  const totalPages =
    isExternalPagination && !paginationParams.isLastPage
      ? currentPage + 1
      : getTotalPages(childrenCount, itemsPerPage);
  const [allVisible, setAllVisible] = useState(ssrRender && totalPages <= 1);
  const withDesktopPaginationValue = isExternalPagination
    ? !paginationParams.isLastPage
    : totalPages > 1;
  const [withDesktopPagination, setWithDesktopPagination] = useState(withDesktopPaginationValue);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const isNextButtonClicked = useRef<boolean>(true);
  const onNextPageClick = useCallback(
    (page: number) => {
      isNextButtonClicked.current = true;
      if (isExternalPagination && paginationParams.loadingMoreItems) return;

      const hasNextPageContent = childrenCount >= (page - 1) * itemsPerPage + 1;

      if (hasNextPageContent && page <= totalPages) {
        setCurrentPage(page);
      }

      if (!hasNextPageContent && isExternalPagination && !paginationParams.isLastPage) {
        paginationParams.fetchMore();
        setCurrentPage(page);
      }
    },
    [childrenCount, isExternalPagination, itemsPerPage, paginationParams, totalPages]
  );

  const onPrevPageClick = useCallback((page: number) => {
    if (page >= 1) {
      setCurrentPage(page);
      isNextButtonClicked.current = false;
    }
  }, []);

  const onMobileHorizontalScrollEnter = useCallback(() => {
    if (!isMobile) return;

    if (isExternalPagination && !paginationParams.isLastPage) {
      onNextPageClick(currentPage + 1);
    }
    if (!allVisible) {
      setAllVisible(true);
    }
  }, [allVisible, isExternalPagination, isMobile, paginationParams, currentPage, onNextPageClick]);

  const firstIndexOfPage = itemsPerPage * (currentPage - 1);
  const lastIndexOfPage = itemsPerPage * currentPage - 1;
  // on mobile, only 2 items per row are initially visible on a page
  const mobileWaypointIndex = mobileRows * 3;
  const loadingItemsCount =
    paginationParams?.loadingMoreItems && SkeletonComponent ? itemsPerPage : 0;

  useEffect(() => {
    setWithDesktopPagination(!isMobile && totalPages > 1);
  }, [isMobile, totalPages]);

  useEffect(() => {
    if (!isExternalPagination) return;

    // mobile scrolling fix due to scrollSnap not playing nice when content is added dynamically
    const scrollRef = scrollerRef.current;
    let isScrolling: NodeJS.Timeout;
    function onMobileScroll() {
      clearTimeout(isScrolling);
      isScrolling = setTimeout(() => {
        // eslint-disable-next-line functional/immutable-data
        scrollRef!.style.scrollSnapType = `x mandatory`;
        scrollRef!.removeEventListener("scroll", onMobileScroll, false);
      }, 150);
    }
    if (isMobile && scrollRef) {
      scrollRef.addEventListener("scroll", onMobileScroll, false);
      if (paginationParams?.loadingMoreItems) {
        // eslint-disable-next-line functional/immutable-data
        scrollRef.style.scrollSnapType = `none`;
      }
    }

    // in case fetchMore was unsuccessful, we fall back to the last good page.
    if (!paginationParams?.loadingMoreItems && !isMobile) {
      const hasPageContent = childrenCount >= (currentPage - 1) * itemsPerPage + 1;
      if (!hasPageContent) {
        onPrevPageClick(currentPage - 1);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paginationParams?.loadingMoreItems]);

  useEffectOnce(() => {
    if (!isMobile) {
      setIsMobileOrSSR(isMobile);
    }
  });

  return (
    <Wrapper ref={waypointRef} fixedHeight={fixedHeight} className={className}>
      {withDesktopPagination && (
        <ArrowButtonHiddenOnMobile
          isBack
          onClick={() => onPrevPageClick(currentPage - 1)}
          isDisabled={currentPage <= 1}
        />
      )}
      <StyledScrollSnapRow
        mobileRows={mobileRows}
        mobileCardWidth={mobileCardWidth}
        ref={scrollerRef}
      >
        {useMemo(() => {
          return React.Children.map(children, (child, index) => {
            const desktopIsVisible = index >= firstIndexOfPage && index <= lastIndexOfPage;
            const mobileIsVisible = index <= mobileWaypointIndex;
            const isVisible = isMobileOrSSR ? mobileIsVisible : desktopIsVisible;

            const waypointMatch = !isExternalPagination && index === mobileWaypointIndex;
            const extMobileWaypointMatch =
              isExternalPagination &&
              index === (currentPage - 1) * itemsPerPage + mobileWaypointIndex;
            const shouldRenderMobileWaypoint =
              isMobile && (waypointMatch || extMobileWaypointMatch) && !withDesktopPagination;

            return (
              <ItemWrapper
                key={child.key}
                isVisible={withDesktopPagination ? desktopIsVisible : true}
                columnSizes={columnSizes}
                mobileCardWidth={mobileCardWidth}
              >
                {shouldRenderMobileWaypoint && (
                  <WaypointWrapper
                    horizontal
                    lazyloadOffset={LazyloadOffset.None}
                    onEnter={onMobileHorizontalScrollEnter}
                    scrollableAncestor={scrollerRef.current}
                    fireOnRapidScroll
                  />
                )}
                {cloneElement(child, { isVisible: allVisible || isVisible })}
              </ItemWrapper>
            );
          });
        }, [
          children,
          firstIndexOfPage,
          lastIndexOfPage,
          allVisible,
          ssrRender,
          itemsPerPage,
          withDesktopPagination,
          columnSizes,
          mobileCardWidth,
          onMobileHorizontalScrollEnter,
          isMobileOrSSR,
          currentPage,
        ])}
        {loadingItemsCount > 0 &&
          isNextButtonClicked.current &&
          range(1, loadingItemsCount).map(i => (
            <ItemWrapper
              // eslint-disable-next-line react/no-array-index-key
              key={i}
              isVisible
              columnSizes={columnSizes}
              mobileCardWidth={mobileCardWidth}
            >
              {SkeletonComponent && <SkeletonComponent />}
            </ItemWrapper>
          ))}
      </StyledScrollSnapRow>
      {withDesktopPagination && (
        <ArrowButtonHiddenOnMobile
          onClick={() => onNextPageClick(currentPage + 1)}
          isDisabled={currentPage >= totalPages}
        />
      )}
    </Wrapper>
  );
};

export default forwardRef(ScrollSnapCarousel);
