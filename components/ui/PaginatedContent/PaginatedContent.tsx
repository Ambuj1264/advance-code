import React, { Fragment, ReactElement, SyntheticEvent, useCallback, useEffect } from "react";
import styled from "@emotion/styled";
import { range } from "fp-ts/lib/Array";
import { NumberParam, useQueryParam } from "use-query-params";
import { useRouter } from "next/router";
import { css } from "@emotion/core";
import rgba from "polished/lib/color/rgba";

import { getPaginationRange } from "./paginatedContentUtils";
import { PaginationContainer, PaginationContent } from "./PaginatedContentShared";
import { ArrowButton, ArrowLeftStyled, ArrowLink, ArrowRightStyled } from "./Arrows";

import { useTranslation } from "i18n";
import { greyColor } from "styles/variables";
import { typographySubtitle2 } from "styles/typography";
import { mqMin } from "styles/base";
import { Namespaces } from "shared/namespaces";
import {
  getUrlWithAdditionalQueryParam,
  asPathWithoutQueryParams,
  removeEnCnLocaleCode,
} from "utils/routerUtils";
import { QueryParamTypes } from "components/ui/Filters/QueryParamTypes";
import { useSettings } from "contexts/SettingsContext";
import useActiveLocale from "hooks/useActiveLocale";
import { isGtiCn } from "utils/apiUtils";

const linkStyles = ({ theme }: { theme: Theme }) => [
  typographySubtitle2,
  css`
    position: relative;
    display: inline-block;
    width: 40px;
    height: 40px;
    line-height: 40px;

    ${mqMin.medium} {
      width: 48px;
      height: 48px;
      line-height: 48px;
    }
    &::before {
      content: "";
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      border-radius: 25px;
      background-color: ${rgba(theme.colors.primary, 0.05)};
      opacity: 0;
      transition: opacity 0.3s;
    }

    &:hover {
      &::before {
        opacity: 1;
      }
    }
  `,
];

const numberElementLinkStyles = (isSelected: boolean, theme: Theme, isDisabled?: boolean) => [
  linkStyles,
  css`
    pointer-events: ${isSelected ? "none" : "auto"};
    color: ${isSelected ? greyColor : theme.colors.primary};
  `,
  isSelected &&
    css`
      &::before {
        border: 1px solid ${rgba(greyColor, 0.7)};
        background-color: unset;
        opacity: 1;
      }
    `,
  isDisabled &&
    css`
      pointer-events: none;
      color: ${greyColor};
    `,
];

const LinkStyled = styled.a<{ isSelected: boolean; isDisabled?: boolean }>(
  ({ isSelected, theme, isDisabled }) => numberElementLinkStyles(isSelected, theme, isDisabled)
);

const NumberButton = styled.button<{
  isSelected: boolean;
  isDisabled?: boolean;
}>(({ isSelected, theme, isDisabled }) => numberElementLinkStyles(isSelected, theme, isDisabled));

const PaginatedContent = ({
  className,
  name = "pagination",
  isLoading,
  totalPages = 1,
  initialPage = 1,
  pagesToShow = 3,
  onPageChange,
  runPageChangeOnMount = true,
  setQueryParam = false,
  children,
  usePaginatedLinks = false,
  enablePagination = true,
}: {
  className?: string;
  name: string;
  isLoading?: boolean;
  initialPage?: number;
  totalPages: number;
  pagesToShow?: number;
  children?: ReactElement;
  onPageChange?: ({
    current,
    previous,
  }: {
    current: number;
    previous?: number;
  }) => void | Promise<void>;
  runPageChangeOnMount?: boolean;
  setQueryParam?: boolean;
  usePaginatedLinks?: boolean;
  enablePagination?: boolean;
}) => {
  const { asPath } = useRouter();
  const { marketplace } = useSettings();
  const activeLocale = useActiveLocale();
  const { t } = useTranslation(Namespaces.commonNs);

  const [pageQueryParam, setPageQueryParam] = useQueryParam(name, NumberParam);
  const currentPage = pageQueryParam || initialPage;

  const isGTICn = isGtiCn(marketplace, activeLocale);

  const asPathWithoutQueryParamsGtiCn = useCallback(
    (asPathValue: string) => {
      if (isGTICn) {
        return `/${removeEnCnLocaleCode(
          asPathWithoutQueryParams(asPathValue),
          activeLocale
        )}`.replace("//", "/");
      }

      return asPathWithoutQueryParams(asPathValue);
    },
    [isGTICn, activeLocale]
  );
  const setCurrentPage = useCallback(
    (pageNumber: number) => {
      if (pageNumber <= totalPages) {
        const updatedPageNumber = pageNumber === 1 ? undefined : pageNumber;
        if (setQueryParam && setPageQueryParam)
          setPageQueryParam(updatedPageNumber, QueryParamTypes.PUSH_IN);
      }
    },
    [setPageQueryParam, setQueryParam, totalPages]
  );

  const changePage = useCallback(
    pageNumber => {
      if (isLoading) return;

      setCurrentPage(pageNumber);
      onPageChange?.({
        current: pageNumber,
        previous: Number(pageQueryParam),
      });
    },
    [isLoading, onPageChange, pageQueryParam, setCurrentPage]
  );

  const onPageItemClick = useCallback(
    e => {
      e?.preventDefault();
      changePage(Number(e.currentTarget?.dataset.value));
    },
    [changePage]
  );
  const getPageNumberHref = useCallback(
    (pageNumber: number) =>
      pageNumber === 1
        ? asPathWithoutQueryParamsGtiCn(asPath)
        : getUrlWithAdditionalQueryParam({
            baseUrl: typeof window === "undefined" ? asPathWithoutQueryParamsGtiCn(asPath) : asPath,
            param: name,
            value: pageNumber,
            paramType: NumberParam,
          }),
    [asPathWithoutQueryParamsGtiCn, asPath, name]
  );

  useEffect(() => {
    if (runPageChangeOnMount && onPageChange) {
      onPageChange({
        current: currentPage,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    if (currentPage > totalPages) {
      changePage(1);
    }
  }, []);

  const onPrevClick = (e: SyntheticEvent) => {
    e.preventDefault();
    changePage(currentPage - 1);
  };

  const onNextClick = (e: SyntheticEvent) => {
    e.preventDefault();
    changePage(currentPage + 1);
  };
  const { start, end, dotsIndex } = getPaginationRange({
    currentPage,
    totalPages,
    pagesToShow,
  });

  const isLeftArrowDisabled = currentPage <= 1;
  const isRightArrowDisabled = currentPage >= totalPages;
  const shouldShowArrows = totalPages > 3;

  const LeftArrowWrapper = usePaginatedLinks && !isLeftArrowDisabled ? ArrowLink : ArrowButton;
  const RightArrowWrapper = usePaginatedLinks && !isRightArrowDisabled ? ArrowLink : ArrowButton;
  const getNumberElement = (isLink: boolean) => (isLink ? LinkStyled : NumberButton);
  const DefaultNumberElement = getNumberElement(usePaginatedLinks);

  return (
    <div className={className}>
      <PaginationContent>{children}</PaginationContent>
      {!isLoading && enablePagination && totalPages > 1 && (
        <PaginationContainer>
          {shouldShowArrows && (
            <LeftArrowWrapper
              isDisabled={isLeftArrowDisabled}
              onClick={onPrevClick}
              {...(usePaginatedLinks && !isLeftArrowDisabled
                ? {
                    href: getPageNumberHref(currentPage - 1),
                  }
                : { type: "button" })}
            >
              <ArrowLeftStyled isDisabled={isLeftArrowDisabled} />
            </LeftArrowWrapper>
          )}
          {start >= 2 && (
            <>
              <DefaultNumberElement
                key={1}
                data-value={1}
                title={`${t("Page")} 1`}
                onClick={onPageItemClick}
                isSelected={false}
                {...(usePaginatedLinks
                  ? {
                      href: getPageNumberHref(1),
                    }
                  : { type: "button" })}
              >
                {1}
              </DefaultNumberElement>
              {totalPages > 3 && start > 2 && (
                <DefaultNumberElement key="dots" isSelected={false} isDisabled>
                  ...
                </DefaultNumberElement>
              )}
            </>
          )}
          {range(start, end).map((value, i) => {
            let page = value;
            const isLastPage = i === pagesToShow && dotsIndex > 0;
            if (isLastPage) page = totalPages;
            const isLink = usePaginatedLinks && page !== currentPage;
            const NumberElement = getNumberElement(isLink);
            return (
              // eslint-disable-next-line react/no-array-index-key
              <Fragment key={i}>
                {isLastPage && dotsIndex > 0 && (
                  <NumberElement key="dots" isSelected={false} isDisabled>
                    ...
                  </NumberElement>
                )}
                <NumberElement
                  key={page}
                  data-value={page}
                  title={`${t("Page")} ${page}`}
                  onClick={onPageItemClick}
                  isSelected={page === currentPage}
                  {...(isLink
                    ? {
                        href: getPageNumberHref(page),
                      }
                    : { type: "button" })}
                >
                  {page}
                </NumberElement>
              </Fragment>
            );
          })}
          {shouldShowArrows && (
            <RightArrowWrapper
              isDisabled={isRightArrowDisabled}
              onClick={onNextClick}
              {...(usePaginatedLinks && !isRightArrowDisabled
                ? {
                    href: getPageNumberHref(currentPage + 1),
                  }
                : { type: "button" })}
            >
              <ArrowRightStyled isDisabled={isRightArrowDisabled} />
            </RightArrowWrapper>
          )}
        </PaginationContainer>
      )}
    </div>
  );
};

export default PaginatedContent;
