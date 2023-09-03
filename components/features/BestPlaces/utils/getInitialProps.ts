import { NextPageContext } from "next";

import BestPlacesLandingPageQuery from "../queries/BestPlacesLandingPageQuery.graphql";
import BestPlacesSearchQuery from "../queries/BestPlacesSearchQuery.graphql";

import { getSearchRadius } from "./bestPlacesMapUtils";

import FrontValuePropsQuery from "components/ui/FrontValuePropositions/FrontValuePropsQuery.graphql";
import breadcrumbsQuery from "components/ui/Breadcrumbs/BreadcrumbsQuery.graphql";
import { Namespaces } from "shared/namespaces";
import {
  BestPlacesPage,
  BestPlacesQueryParam,
  Direction,
  LandingPageType,
  PageType,
} from "types/enums";
import { getLanguageFromContext, longCacheHeaders } from "utils/apiUtils";
import PageMetadataQuery from "hooks/queries/PageMetadataQuery.graphql";
import { cleanAsPath, removeEnCnLocaleCode } from "utils/routerUtils";
import { arrayQueryParam } from "utils/typeConversionUtils";
import { checkIsCountryMap, StartingLocationTypes } from "components/ui/Map/utils/mapUtils";

const getInitialProps = async (ctx: NextPageContext) => {
  const locale = getLanguageFromContext(ctx);
  const path = removeEnCnLocaleCode(cleanAsPath(ctx.asPath, locale), locale);
  const {
    activeTab,
    page: pageQuery = 1,
    attractionIds,
    orderBy,
    lat,
    lng,
    startingLocationTypes: startingLocationTypesQuery,
    startingLocationId,
    startingLocationName,
    destinationId: destinationIdQuery,
  }: {
    [BestPlacesQueryParam.ACTIVE_TAB]?: BestPlacesPage;
    [BestPlacesQueryParam.PAGE]?: number;
    [BestPlacesQueryParam.ATTRACTION_IDS]?: string | string[];
    [BestPlacesQueryParam.ORDER_BY]?: string;
    [BestPlacesQueryParam.LATITUDE]?: string;
    [BestPlacesQueryParam.LONGITUDE]?: string;
    [BestPlacesQueryParam.STARTING_LOCATION_TYPES]?:
      | StartingLocationTypes
      | StartingLocationTypes[];
    [BestPlacesQueryParam.STARTING_LOCATION_ID]?: string;
    [BestPlacesQueryParam.STARTING_LOCATION_NAME]?: string;
    [BestPlacesQueryParam.DESTINATION_ID]?: string;
  } = ctx.query || {};

  const startingLocationTypes = arrayQueryParam(
    startingLocationTypesQuery
  ) as StartingLocationTypes[];
  const isCountryMap = checkIsCountryMap(startingLocationTypes);
  const searchRadius = getSearchRadius(isCountryMap);
  const attractionTypeIds = arrayQueryParam(attractionIds, Number);
  const page = pageQuery && Number(pageQuery);
  const centerLatitude = lat ? Number(lat) : null;
  const centerLongitude = lng ? Number(lng) : null;
  const destinationId = destinationIdQuery ? Number(destinationIdQuery) : null;

  return {
    isMobileFooterShown: true,
    contactUsButtonPosition: Direction.Right,
    namespacesRequired: [
      Namespaces.commonNs,
      Namespaces.headerNs,
      Namespaces.footerNs,
      Namespaces.bestPlacesNs,
      Namespaces.countryNs,
      Namespaces.tourSearchNs,
      Namespaces.commonSearchNs,
    ],
    queries: [
      {
        query: PageMetadataQuery,
        variables: { path: `${path}${page > 1 ? `?page=${page}` : ""}` },
        context: { headers: longCacheHeaders },
      },
      {
        query: breadcrumbsQuery,
        variables: {
          type: PageType.ATTRACTION.toUpperCase(),
          landingPageType: LandingPageType.ATTRACTIONS.toUpperCase(),
        },
        context: { headers: longCacheHeaders },
      },
      {
        query: FrontValuePropsQuery,
      },
      {
        query: BestPlacesLandingPageQuery,
      },
      {
        query: BestPlacesSearchQuery,
        variables: {
          type: activeTab,
          page,
          centerLatitude,
          centerLongitude,
          radius: searchRadius,
          attractionTypeIds,
          sortBy: orderBy,
        },
        isRequiredForPageRendering: true,
      },
    ],
    page,
    attractionIds: attractionTypeIds,
    orderBy,
    lat,
    lng,
    startingLocationTypes,
    startingLocationId,
    startingLocationName,
    destinationId,
  };
};

export default getInitialProps;
