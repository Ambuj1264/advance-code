import styled from "@emotion/styled";
import { css } from "@emotion/core";
import React, { ReactNode } from "react";
import rgba from "polished/lib/color/rgba";
import Button from "@travelshift/ui/components/Inputs/Button";
import usePreviousState from "@travelshift/ui/hooks/usePreviousState";
import { flatten } from "fp-ts/lib/Array";

import ClientLinkPrefetch from "../../ClientLinkPrefetch";
import { ProductLabelWrapper } from "../../ProductLabels/ProductLabels";

import {
  breakpointsMax,
  attractionColor,
  borderRadiusSmall,
  boxShadowTileRegular,
  gutters,
  whiteColor,
} from "styles/variables";
import { clampLines, column, mqIE, mqMin, singleLineTruncation } from "styles/base";
import { convertImage } from "utils/imageUtils";
import { typographyCaptionSemibold, typographySubtitle1 } from "styles/typography";
import ReviewSummaryWhite from "components/ui/ReviewSummary/ReviewSummaryWhite";
import { PageType, GraphCMSPageType, GraphCMSPageVariation, AutoCompleteType } from "types/enums";
import { urlToRelative } from "utils/apiUtils";
import { getProductSlugFromHref } from "utils/routerUtils";

export const ListCardFooter = styled.div<{}>(
  ({ theme }) => css`
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    padding: ${gutters.small / 2}px ${gutters.small / 2}px;
    background-color: ${rgba(theme.colors.action, 0.05)};

    & > *:nth-last-child(2) {
      margin-right: 0;
    }

    ${mqMin.large} {
      flex-wrap: nowrap;
    }
  `
);

export const ListCardFooterRightColumn = styled.div`
  display: block;
  flex-grow: 1;
  flex-wrap: nowrap;
  align-items: center;
  text-align: center;

  ${mqMin.medium} {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    text-align: right;
  }
`;

export const TileProductCardWrapper = styled.div`
  position: relative;
  z-index: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: ${boxShadowTileRegular};
  border-radius: ${borderRadiusSmall};
  height: 100%;
  background-color: ${whiteColor};
`;

export const TileHeadline = styled.h3<{}>(({ theme }: { theme: Theme }) => [
  typographySubtitle1,
  clampLines(2),
  css`
    padding: 0 ${gutters.small / 2}px;
    color: ${theme.colors.primary};
    text-align: center;

    ${mqIE} {
      height: auto;
    }
  `,
]);

export const LinkWrapper = ({
  linkUrl,
  target,
  clientRoute,
  children,
  className,
  openInSameWindowIfNoLinkTarget,
  nofollow = false,
  dataTestid,
}: {
  linkUrl?: string;
  target?: string;
  clientRoute?: SharedTypes.ClientRoute;
  children: ReactNode;
  className?: string;
  openInSameWindowIfNoLinkTarget: boolean;
  nofollow?: boolean;
  dataTestid?: string;
}) =>
  linkUrl ? (
    <ClientLinkPrefetch
      clientRoute={clientRoute}
      linkUrl={linkUrl}
      className={className}
      nofollow={nofollow}
      target={target ?? (openInSameWindowIfNoLinkTarget ? "" : "_blank")}
      dataTestid={dataTestid}
    >
      {children}
    </ClientLinkPrefetch>
  ) : (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>{children}</>
  );

export const Address = styled.div([
  typographyCaptionSemibold,
  singleLineTruncation,
  css`
    position: absolute;
    bottom: ${gutters.small / 2}px;
    left: ${gutters.small}px;
    border-radius: 20px;
    max-width: 90%;
    height: 16px;
    padding-right: ${gutters.small}px;
    background: rgba(0, 0, 0, 0.5);
    color: ${whiteColor};
  `,
]);

export const AddressIconWrapper = styled.span`
  position: relative;
  left: -2px;
  display: inline-block;
  margin-right: ${gutters.small / 2 - 2}px;
  border-radius: 16px;
  width: 16px;
  height: 16px;
  background-color: ${attractionColor};
  line-height: 14px;
  text-align: center;
  vertical-align: top;

  > svg {
    margin-top: 3px;
    height: 10px;
    fill: ${whiteColor};
  }
`;

export const TopRightIconWrapper = styled.div<{ backgroundColor?: string }>(
  ({ backgroundColor = attractionColor }) => css`
    position: absolute;
    top: 0;
    right: 0;
    border-bottom-left-radius: ${borderRadiusSmall};
    width: 32px;
    height: 32px;
    background-color: ${backgroundColor};
    line-height: 32px;
    text-align: center;

    > svg {
      display: inline-block;
      max-width: 19px;
      max-height: 19px;
      vertical-align: middle;
      fill: ${whiteColor};
    }
  `
);

export const InnerRow = styled.div`
  display: flex;
  flex-direction: row;
  flex-grow: 1;
  align-items: stretch;
  justify-content: space-between;

  ${mqIE} {
    flex: 0 0 100%;
  }
`;

export const ListCardWrapper = styled.div`
  position: relative;
  display: block;
  box-shadow: ${boxShadowTileRegular};
  border-radius: ${borderRadiusSmall};
  height: 100%;
  background-color: ${whiteColor};
  overflow: hidden;

  ${ProductLabelWrapper} {
    top: ${gutters.small / 2}px;
    bottom: auto;
  }
`;

export const ListRowContent = styled(InnerRow)`
  flex-wrap: wrap;

  ${mqMin.medium} {
    flex-wrap: nowrap;
  }
`;

export const ListCardLinkHeader = styled(ClientLinkPrefetch)`
  flex-basis: 330px;
  flex-shrink: 0;
  align-self: flex-start;
`;

export const ListCardRightColumn = styled.div`
  flex: 1;
  margin: ${gutters.small}px 0 0 ${gutters.large}px;
  overflow: hidden;
  ${mqMin.medium} {
    margin-right: ${gutters.small}px;
  }
`;

export const ListCardHeadline = styled.h3<{}>(({ theme }: { theme: Theme }) => [
  column({ small: 2 / 3 }),
  typographySubtitle1,
  clampLines(2),
  css`
    width: 100%;
    max-height: 48px;
    padding-left: 0;
    color: ${theme.colors.primary};
    ${mqMin.medium} {
      padding-left: 0;
    }
    &:hover {
      text-decoration: underline;
    }
  `,
]);

export const ListCardLinkHeadline = styled(ClientLinkPrefetch)`
  width: 100%;
`;

export const ReviewSummaryWhiteStyled = styled(ReviewSummaryWhite)([
  column({ small: 1 / 3 }),
  css`
    display: inline-flex;
    width: auto;
    ${mqMin.large} {
      padding-right: 0;
    }
  `,
]);

export const ListCardRowDescription = styled(InnerRow)`
  align-items: flex-start;
  padding: ${gutters.small}px 0 0;
`;

export const ListCardButtonStyled = styled(Button, {
  shouldForwardProp: () => true,
})`
  margin-left: ${gutters.large}px;
  width: auto;
  min-width: 118px;
`;

export const ListCardReviewsWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  width: 60%;
`;

export const ItemsWrapper = styled.div`
  & + & {
    margin-top: ${gutters.large}px;
  }
`;

export const constructServices = (
  searchCategories: AccommodationSearchTypes.QueryAccommodationSearchCategory[],
  pageType: PageType
): SharedTypes.PageCategoryItemType[] =>
  searchCategories.map((category: AccommodationSearchTypes.QueryAccommodationSearchCategory) => ({
    id: category.id,
    title: category.name,
    city: category.bindCity,
    image: convertImage(category.image),
    uri: urlToRelative(category.url),
    isLegacy: false,
    pageType,
  }));

export const getProductClientRoute = (
  product: SharedTypes.Product & {
    clientRoute?: SharedTypes.ClientRoute;
  },
  pageType: PageType
) =>
  product.clientRoute
    ? {
        ...product.clientRoute,
        query: {
          ...product.clientRoute?.query,
          title: product.headline,
        },
      }
    : {
        query: {
          slug: product.slug || getProductSlugFromHref(product.linkUrl),
          title: product.headline,
        },
        route: `/${pageType}`,
        as: urlToRelative(product.linkUrl),
      };

export const shouldScrollToTop = () => {
  const isMobile = window.matchMedia(`(max-width: ${breakpointsMax.large}px)`).matches;
  const { innerHeight } = window;
  const { top } = document.body.getBoundingClientRect();

  if (isMobile) return true;
  return top <= -innerHeight / 3;
};

export const scrollSearchPageToTop = (scrollOptions: ScrollToOptions = {}) => {
  if (shouldScrollToTop()) {
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: "smooth", ...scrollOptions });
    });
  }
};

export const useSearchScrollToTopEvents = ({
  totalProducts,
  loadingState,
  queryParamFilters = {},
  page,
}: {
  totalProducts?: number;
  loadingState?: boolean;
  queryParamFilters?: object;
  page?: number;
}) => {
  const totalFilters = flatten(
    Object.values(queryParamFilters)
      .filter(Boolean)
      .map(v => (Array.isArray(v) ? v : [v])) as any[]
  ).length;

  const prevState = usePreviousState({
    totalProducts,
    loadingState,
    totalFilters,
    page,
  });

  const onTotalProductsChange =
    prevState?.totalProducts !== undefined && totalProducts !== prevState.totalProducts;
  const onLoadingStateChange =
    prevState?.loadingState !== undefined && loadingState !== prevState.loadingState;
  const onTotalFiltersChange =
    prevState?.totalFilters !== undefined && totalFilters !== prevState.totalFilters;
  const onPageChange = prevState?.page !== undefined && page !== prevState.page;

  return {
    onTotalProductsChange,
    onLoadingStateChange,
    onTotalFiltersChange,
    onPageChange,
  };
};

const getSearchBreadcrumbsDestination = (pageType: GraphCMSPageType, id: string, type?: string) => {
  switch (pageType) {
    case GraphCMSPageType.VacationPackages:
    case GraphCMSPageType.Flights:
    case GraphCMSPageType.GTIFlights:
    case GraphCMSPageType.GTTPFlights: {
      const isEurope = id === "europe";
      const isGTIorGTTP =
        pageType === GraphCMSPageType.GTIFlights || pageType === GraphCMSPageType.GTTPFlights;
      const isAirport = id.includes("airport");
      if (isEurope || isGTIorGTTP || isAirport) return undefined;
      return {
        flightId: id,
      };
    }
    case GraphCMSPageType.Tours: {
      const isCountry = id.includes("COUNTRY");
      const isCity = id.includes("CITY");
      const locationId = id.split(":")[1];
      if (isCountry)
        return {
          countries_some: {
            tourId: locationId,
          },
        };
      if (isCity)
        return {
          tourId: locationId,
        };
      return undefined;
    }
    case GraphCMSPageType.Cars:
      // eslint-disable-next-line no-case-declarations
      const isAirportOrTrainStation =
        type === AutoCompleteType.AIRPORT || type === AutoCompleteType.TRAIN_STATION;
      if (isAirportOrTrainStation) return undefined;
      return {
        carId: id,
      };
    case GraphCMSPageType.Stays: {
      // TODO: add again when stayIds on destinations have been fixed
      /* const cityOrCountry = type === StaySearchType.COUNTRY || type === StaySearchType.CITY;
      if (cityOrCountry) {
        return {
          stayId: id,
        };
      } */
      return undefined;
    }
    default:
      return undefined;
  }
};

const getSearchBreadcrumbsPageVariation = (
  pageType: GraphCMSPageType,
  id: string,
  type?: string
) => {
  switch (pageType) {
    case GraphCMSPageType.VacationPackages: {
      const isEurope = id === "europe";
      const isCity = id.includes("city");
      if (isEurope) return GraphCMSPageVariation.inContinent;
      if (isCity) return GraphCMSPageVariation.inCity;
      return GraphCMSPageVariation.inCountry;
    }
    case GraphCMSPageType.Tours: {
      const isCountry = id.includes("COUNTRY");
      const isCity = id.includes("CITY");
      if (isCountry) return GraphCMSPageVariation.inCity;
      if (isCity) return GraphCMSPageVariation.inCityWithType;
      return undefined;
    }
    case GraphCMSPageType.Flights: {
      const isEurope = id === "europe";
      const isCity = id.includes("city");
      const isAirport = id.includes("airport");
      if (isEurope || isAirport) return GraphCMSPageVariation.toContinent;
      if (isCity) return GraphCMSPageVariation.toCity;
      return GraphCMSPageVariation.toCountry;
    }
    case GraphCMSPageType.GTIFlights:
    case GraphCMSPageType.GTTPFlights:
      return GraphCMSPageVariation.toCountry;
    case GraphCMSPageType.Cars:
      // eslint-disable-next-line no-case-declarations
      const isAirportOrTrainStation =
        type === AutoCompleteType.AIRPORT || type === AutoCompleteType.TRAIN_STATION;
      if (isAirportOrTrainStation) return GraphCMSPageVariation.inContinent;
      return GraphCMSPageVariation.inCity;
    case GraphCMSPageType.Stays: {
      // TODO: add again when stayIds on destinations have been fixed
      /* const isCountry = type === StaySearchType.COUNTRY;
      const isCity = type === StaySearchType.CITY;
      if (isCountry) return GraphCMSPageVariation.inCountry;
      if (isCity) return GraphCMSPageVariation.inCity; */
      return GraphCMSPageVariation.inContinent;
    }
    default:
      return undefined;
  }
};

export const getSearchBreadcrumbsConditions = (
  pageType: GraphCMSPageType,
  id?: string,
  type?: string
) => {
  if (!id) return undefined;
  const pageVariation = getSearchBreadcrumbsPageVariation(pageType, id, type);
  const destination = getSearchBreadcrumbsDestination(pageType, id, type);
  if (!pageVariation) return undefined;
  return {
    pageType,
    pageVariation,
    ...(destination ? { destination } : {}),
  } as LandingPageTypes.LandingPageQueryCondition;
};
