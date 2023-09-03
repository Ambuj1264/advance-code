import React, { ReactElement, SyntheticEvent, useCallback } from "react";
import { StringParam, useQueryParams } from "use-query-params";
import { useRouter } from "next/router";
import styled from "@emotion/styled";
import { useTheme } from "emotion-theming";
import rgba from "polished/lib/color/rgba";
import { css } from "@emotion/core";

import { PaginationContainer, PaginationContent } from "./PaginatedContentShared";
import { ArrowButton, ArrowLeftStyled, ArrowLink, ArrowRightStyled } from "./Arrows";

import { useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";
import { QueryParamTypes } from "components/ui/Filters/QueryParamTypes";
import {
  asPathWithoutQueryParams,
  getUrlWithAdditionalQueryParam,
  omitQueryParamsFromUrl,
} from "utils/routerUtils";
import { CursorPaginationQueryParams } from "types/enums";
import { greyColor, gutters } from "styles/variables";

enum PAGINATION_DIRECTION {
  NEXT = "NEXT",
  PREVIOUS = "PREVIOUS",
}

const StyledArrowText = styled.span(
  ({ disabled, theme }: { disabled: boolean; theme: Theme }) => css`
    color: ${disabled ? rgba(greyColor, 0.7) : theme.colors.primary};
  `
);

const StyledNavigationItem = styled.div`
  margin: 0 20px;
`;

const StyledNavigation = styled.div`
  display: flex;
  flex-grow: 1;
  flex-shrink: 0;
  justify-content: center;

  ${ArrowRightStyled} {
    margin-left: ${gutters.small}px;
  }

  ${ArrowLeftStyled} {
    margin-right: ${gutters.small}px;
  }

  ${ArrowLink}, ${ArrowButton} {
    display: flex;
    align-items: center;
    width: auto;

    &:hover {
      &::before {
        display: none;
      }
    }

    ${StyledArrowText} {
      flex-grow: 1;
    }
  }
`;

const constructPageHrefLink = ({
  direction,
  enabled,
  pageCursor,
  asPath,
}: {
  direction: PAGINATION_DIRECTION;
  enabled: boolean;
  pageCursor: string;
  asPath: string;
}): string => {
  if (!enabled) return "";

  const queryParamName =
    direction === PAGINATION_DIRECTION.NEXT
      ? CursorPaginationQueryParams.NEXT_PAGE_ID
      : CursorPaginationQueryParams.PREV_PAGE_ID;

  let url = getUrlWithAdditionalQueryParam({
    baseUrl: typeof window === "undefined" ? asPathWithoutQueryParams(asPath) : asPath,
    param: queryParamName,
    value: pageCursor,
    paramType: StringParam,
  });

  if (direction === PAGINATION_DIRECTION.NEXT) {
    url = omitQueryParamsFromUrl(url, [CursorPaginationQueryParams.PREV_PAGE_ID]);
  } else if (direction === PAGINATION_DIRECTION.PREVIOUS) {
    url = omitQueryParamsFromUrl(url, [CursorPaginationQueryParams.NEXT_PAGE_ID]);
  }

  return url;
};

const PaginatedContentByCursor = ({
  children,
  className,
  isLoading,
  setQueryParam = false,
  usePaginatedLinks = false,
  hasPreviousPage = false,
  hasNextPage = false,
  prevPageCursor,
  nextPageCursor,
}: {
  children?: ReactElement;
  className?: string;
  isLoading?: boolean;
  setQueryParam?: boolean;
  usePaginatedLinks?: boolean;
  hasPreviousPage?: boolean;
  hasNextPage?: boolean;
  prevPageCursor: string;
  nextPageCursor: string;
}) => {
  const { t } = useTranslation(Namespaces.commonNs);
  const { asPath } = useRouter();
  const theme: Theme = useTheme();

  const [, setPageQueryParams] = useQueryParams({
    [CursorPaginationQueryParams.NEXT_PAGE_ID]: StringParam,
    [CursorPaginationQueryParams.PREV_PAGE_ID]: StringParam,
  });

  const navigate = useCallback(
    (navigationDirection: PAGINATION_DIRECTION) => {
      let nextPage = "";
      let prevPage = "";

      if (isLoading) return;

      if (navigationDirection === PAGINATION_DIRECTION.NEXT && hasNextPage && nextPageCursor) {
        nextPage = nextPageCursor;
      } else if (
        navigationDirection === PAGINATION_DIRECTION.PREVIOUS &&
        hasPreviousPage &&
        prevPageCursor
      ) {
        prevPage = prevPageCursor;
      }

      if (setQueryParam && setPageQueryParams) {
        setPageQueryParams(
          {
            [CursorPaginationQueryParams.NEXT_PAGE_ID]: nextPage,
            [CursorPaginationQueryParams.PREV_PAGE_ID]: prevPage,
          },
          QueryParamTypes.PUSH_IN
        );
      }
    },
    [
      hasNextPage,
      hasPreviousPage,
      isLoading,
      nextPageCursor,
      prevPageCursor,
      setPageQueryParams,
      setQueryParam,
    ]
  );

  const onPrevClick = useCallback(
    (e: SyntheticEvent) => {
      e.preventDefault();
      navigate(PAGINATION_DIRECTION.PREVIOUS);
    },
    [navigate]
  );

  const onNextClick = useCallback(
    (e: SyntheticEvent) => {
      e.preventDefault();
      navigate(PAGINATION_DIRECTION.NEXT);
    },
    [navigate]
  );

  const shouldShowNavigationControls = !isLoading && (hasNextPage || hasPreviousPage);
  const NavRight = usePaginatedLinks && hasNextPage ? ArrowLink : ArrowButton;
  const NavLeft = usePaginatedLinks && hasPreviousPage ? ArrowLink : ArrowButton;

  return (
    <div className={className}>
      <PaginationContent>{children}</PaginationContent>
      {shouldShowNavigationControls && (
        <PaginationContainer>
          <StyledNavigation>
            <StyledNavigationItem>
              <NavLeft
                isDisabled={!hasPreviousPage}
                onClick={onPrevClick}
                {...(usePaginatedLinks && hasPreviousPage
                  ? {
                      href: constructPageHrefLink({
                        direction: PAGINATION_DIRECTION.PREVIOUS,
                        enabled: hasPreviousPage,
                        pageCursor: prevPageCursor,
                        asPath,
                      }),
                    }
                  : { type: "button" })}
              >
                <ArrowLeftStyled isDisabled={!hasPreviousPage} />
                <StyledArrowText theme={theme} disabled={!hasPreviousPage}>
                  {t("Previous")}
                </StyledArrowText>
              </NavLeft>
            </StyledNavigationItem>
            <StyledNavigationItem>
              <NavRight
                isDisabled={!hasNextPage}
                onClick={onNextClick}
                {...(usePaginatedLinks && hasNextPage
                  ? {
                      href: constructPageHrefLink({
                        direction: PAGINATION_DIRECTION.NEXT,
                        enabled: hasNextPage,
                        pageCursor: nextPageCursor,
                        asPath,
                      }),
                    }
                  : { type: "button" })}
              >
                <StyledArrowText theme={theme} disabled={!hasNextPage}>
                  {t("Next")}
                </StyledArrowText>
                <ArrowRightStyled isDisabled={!hasNextPage} />
              </NavRight>
            </StyledNavigationItem>
          </StyledNavigation>
        </PaginationContainer>
      )}
    </div>
  );
};

export default PaginatedContentByCursor;
