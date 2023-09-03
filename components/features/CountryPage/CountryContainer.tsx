import React from "react";
import { useLazyQuery, useQuery } from "@apollo/react-hooks";
import { QueryParamProvider } from "use-query-params";

import SearchCategoryQuery from "../AccommodationSearchPage/queries/AccommodationSearchCategoryQuery.graphql";
import { constructAccommodationCategory } from "../AccommodationSearchPage/utils/accommodationSearchUtils";
import AdminGearLoader from "../AdminGear/AdminGearLoader";
import { getHomeAdminLinks } from "../AdminGear/utils";
import useTourAutoCompleteQuery from "../SearchPage/hooks/useTourAutoCompleteQuery";

import CountryPageClientQuery from "./queries/CountryPageClientQuery.graphql";
import {
  getMarketplaceFlightService,
  getPropsWithDefaults,
  isFlightsEnabled,
} from "./utils/countryUtils";
import CountryPageQuery from "./queries/CountryPageQuery.graphql";
import CountrySEO from "./CountrySEO";
import TopTravelPlansContainer from "./TopTravelPlansContainer/TopTravelPlansContainer";
import TopThingsToDoContainer from "./TopThingsToDoContainer";
import TopImagesContainer from "./TopImagesContainer/TopImagesContainer";
import TravelCommunityContainer from "./TravelCommunityContainer/TravelCommunityContainer";

import FrontMobileFooterContainer from "components/ui/FrontSearchWidget/FrontMobileFooterContainer";
import FrontMobileStepsContainer from "components/ui/FrontSearchWidget/FrontMobileStepsContainer";
import FrontSearchWidgetContainer from "components/ui/FrontSearchWidget/FrontSearchWidgetContainer";
import { FrontSearchStateContext } from "components/ui/FrontSearchWidget/FrontSearchStateContext";
import FrontCover from "components/ui/Cover/FrontCover/FrontCover";
import { WaypointWrapperForMobileFooter } from "components/ui/Lazy/WaypointWrapper";
import useEffectOnScrollMobile from "hooks/useEffectOnScrollMobile";
import Container from "components/ui/Grid/Container";
import FrontValuePropositions from "components/ui/FrontValuePropositions/FrontValuePropositions";
import TopServicesContainer from "components/ui/TopServices/TopServicesContainer";
import TopAttractionsContainer from "components/ui/TopAttractionsContainer/TopAttractionsContainer";
import TopTravelAdviceContainer from "components/ui/TopTravelAdviceContainer/TopTravelAdviceContainer";
import useActiveLocale from "hooks/useActiveLocale";
import { useSettings } from "contexts/SettingsContext";
import { useIsTablet } from "hooks/useMediaQueryCustom";
import { constructTours } from "utils/typeConversionUtils";
import { Marketplace, PageType } from "types/enums";
import LazyHydrateWrapper from "components/ui/LazyHydrateWrapper";
import FrontSearchStateContextProviderContainer from "components/ui/FrontSearchWidget/FrontSearchStateContextProviderContainer";
import useLandingPageFlightSearchUrl from "components/ui/LandingPages/hooks/useLandingPageFlightSearchUrl";
import StaticLinkHandler from "components/ui/StaticLinkHandler";

const CountryContainer = ({
  queryCondition,
}: {
  queryCondition: LandingPageTypes.LandingPageQueryCondition;
}) => {
  const isDesktop = useIsTablet();
  const activeLocale = useActiveLocale();
  const { adminUrl, marketplace } = useSettings();
  const isGTI = marketplace === Marketplace.GUIDE_TO_ICELAND;

  const { metadataUri: flightUrl, destination } = useLandingPageFlightSearchUrl({
    landingPageUriQueryCondition: queryCondition,
    isFlightEnabled: isFlightsEnabled(marketplace),
  });
  const [fetchClientData, { data: clientData }] = useLazyQuery<CountryPageTypes.PageClientQuery>(
    CountryPageClientQuery,
    {
      context: {
        fetchOptions: {
          method: "POST",
        },
      },
    }
  );

  const {
    data: countryData,
    error: countryDataError,
    loading: countryDataLoading,
  } = useQuery<CountryPageTypes.PageQuery>(CountryPageQuery);

  const { data: searchCategoryData } =
    useQuery<AccommodationSearchTypes.QueryAccommodationSearchCategoryInfo>(SearchCategoryQuery, {
      variables: { slug: "" },
    });

  useEffectOnScrollMobile(fetchClientData);

  const { tourStartingLocations, defaultLocation } = useTourAutoCompleteQuery({});

  if (countryDataError) {
    return null;
  }

  const bestTravelPlanTours = constructTours(
    countryData?.frontBestTravelPlans.tours ?? [],
    clientData?.frontBestTravelPlans?.tours
  );
  const topThingsToDo = constructTours(
    countryData?.frontTopTours.tours ?? [],
    clientData?.frontTopTours?.tours
  );

  const searchCategory =
    searchCategoryData?.hotelSearchCategoryByUri &&
    constructAccommodationCategory(searchCategoryData);
  const isNotGTTP = marketplace !== Marketplace.GUIDE_TO_THE_PHILIPPINES;
  const isNotIPT = marketplace !== Marketplace.ICELAND_PHOTO_TOURS;
  const flightTitle = isGTI ? "Flights to Iceland" : "Flights to the Philippines";
  const flightService = getMarketplaceFlightService(flightUrl, flightTitle);
  const {
    countryCoverProps,
    frontBestTravelPlansProps,
    frontTopToursProps,
    frontTopAttractionsProps,
    frontTopArticlesProps,
    topTravelCommunityProps,
    frontTopGalleriesProps,
    frontTopServices,
  } = getPropsWithDefaults(countryData, flightService as SharedTypes.PageItemType, marketplace);
  const flightDefaultValues = {
    name: destination?.name?.value,
    id: destination?.flightId,
  };

  const context = {
    tripStartingLocationItems: tourStartingLocations,
    tripStartingLocationId: defaultLocation.id,
    tripStartingLocationName: defaultLocation.name,
    flightDefaultDestinationId: flightDefaultValues.id,
    flightDestinationId: flightDefaultValues.id,
    flightDefaultDestinationName: flightDefaultValues.name,
    flightDestinationName: flightDefaultValues.name,
    accommodationId: searchCategory?.location?.id,
    accommodationAddress: searchCategory?.location?.name,
    accommodationType: searchCategory?.location?.type,
    accommodationLocationItems: searchCategory?.defaultLocationsList,
  } as FrontSearchStateContext;

  return (
    <FrontSearchStateContextProviderContainer context={context}>
      <CountrySEO tours={bestTravelPlanTours} />
      <Container>
        <QueryParamProvider>
          <FrontCover {...countryCoverProps} loading={countryDataLoading}>
            <FrontSearchWidgetContainer activeServices={frontTopServices} />
          </FrontCover>
          <FrontMobileStepsContainer activeServices={frontTopServices} />
        </QueryParamProvider>
        <WaypointWrapperForMobileFooter lazyloadOffset="-100px" />
        <FrontValuePropositions />
        <TopServicesContainer isFirstSection />
        <TopTravelPlansContainer
          {...frontBestTravelPlansProps}
          bestTravelPlanTours={bestTravelPlanTours}
          loading={countryDataLoading}
        />
        <TopThingsToDoContainer
          {...frontTopToursProps}
          topThingsToDo={topThingsToDo}
          loading={countryDataLoading}
        />
        <StaticLinkHandler pageType={PageType.ATTRACTION}>
          <LazyHydrateWrapper ssrOnly key="topAttraction">
            <TopAttractionsContainer {...frontTopAttractionsProps} loading={countryDataLoading} />
          </LazyHydrateWrapper>
        </StaticLinkHandler>

        {!countryDataLoading && countryData?.frontTopArticles && (
          <LazyHydrateWrapper whenVisible key="topAdvice">
            <TopTravelAdviceContainer
              {...frontTopArticlesProps}
              loading={countryDataLoading}
              pageType={PageType.ARTICLE}
            />
          </LazyHydrateWrapper>
        )}
        {isNotGTTP && isNotIPT && (
          <TravelCommunityContainer {...topTravelCommunityProps} loading={countryDataLoading} />
        )}
        {!countryDataLoading &&
          countryData?.frontTopGalleries &&
          countryData.frontTopGalleries.images.length > 0 && (
            <TopImagesContainer {...frontTopGalleriesProps} loading={countryDataLoading} />
          )}
        <FrontMobileFooterContainer activeServices={frontTopServices} forceShow={isDesktop} />
      </Container>
      <AdminGearLoader links={getHomeAdminLinks(activeLocale, adminUrl)} />
    </FrontSearchStateContextProviderContainer>
  );
};

export default CountryContainer;
