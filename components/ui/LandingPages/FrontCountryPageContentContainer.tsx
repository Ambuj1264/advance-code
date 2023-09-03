import React, { useMemo } from "react";
import { useQuery } from "@apollo/react-hooks";

import {
  getAccommodationLocation,
  getTourLocation,
  getDestinationCountryCode,
} from "./utils/landingPageUtils";
import CommonLandingPageContentContainer from "./CommonLandingPageContentContainer";
import getFrontPageSkeletons from "./utils/landingPageSkeletons/frontPageSkeletons";
import FrontCountryPageContentQuery from "./queries/FrontCountryPageContentQuery.graphql";

import { SearchTabsEnum } from "components/ui/FrontSearchWidget/utils/FrontEnums";
import { GraphCMSPageVariation, GraphCMSSubType } from "types/enums";
import LandingPageSectionsContainer from "components/ui/LandingPages/LandingPageSectionsContainer";
import { FrontSearchStateContext } from "components/ui/FrontSearchWidget/FrontSearchStateContext";
import useActiveLocale from "hooks/useActiveLocale";
import { normalizeGraphCMSLocale } from "utils/helperUtils";
import useVpPackages from "hooks/useVpPackages";
import useLandingPageServices from "components/ui/LandingPages/hooks/useLandingPageServices";

const FrontCountryPageContentContainer = ({
  queryCondition,
  landingPageUriQueryCondition,
  gteFrontPageMobileImageUrl,
}: {
  queryCondition: LandingPageTypes.LandingPageQueryCondition;
  landingPageUriQueryCondition: LandingPageTypes.LandingPageQueryCondition;
  gteFrontPageMobileImageUrl?: string;
}) => {
  const locale = useActiveLocale();
  const { data, error, loading } = useQuery<{
    landingPages: Pick<
      LandingPageTypes.LandingPageQueryContent,
      "id" | "destination" | "origin" | "pageVariation" | "subType"
    >[];
  }>(FrontCountryPageContentQuery, {
    variables: {
      stage: "DRAFT",
      where: queryCondition,
      locale: normalizeGraphCMSLocale(locale),
      isDeleted: false,
    },
  });
  const activeServices = useLandingPageServices({
    landingPageUriQueryCondition,
  });
  const landingPage = data?.landingPages[0];
  const pageVariation = landingPage?.pageVariation;
  const isCountryPage = pageVariation === GraphCMSPageVariation.guide;
  const isContinentPage = pageVariation?.includes("Continent");
  const origin = landingPage?.origin;
  const destination = landingPage?.destination;
  const destinationName = destination?.name?.value;
  const originName = origin?.name?.value;
  const flightOriginId = origin?.flightId;
  const flightDestinationId = destination?.flightId;
  const carOriginId = origin?.carId;
  const carDestinationId = destination?.carId;
  const stayId = destination?.stayId;
  const subType = landingPage?.subType;
  const countryCode = destination?.alpha2Code;
  const { accommodationAddress, accommodationId, accommodationType } = getAccommodationLocation(
    stayId,
    destinationName,
    pageVariation
  );
  const { tripStartingLocationId, tripStartingLocationName } = getTourLocation(
    destination,
    pageVariation
  );
  const destinationCountryCode = getDestinationCountryCode(destination, pageVariation);
  const shouldShowVacationPackages = useVpPackages();
  const sectionSkeletons = getFrontPageSkeletons({
    pageVariation,
  });
  const context = useMemo(
    () =>
      ({
        flightOriginId,
        flightOriginName: originName,
        flightDestinationId,
        flightDestinationName: destinationName,
        flightDefaultOriginId: flightOriginId,
        flightDefaultOriginName: originName,
        flightDefaultDestinationId: flightDestinationId,
        flightDefaultDestinationName: destinationName,
        carPickupLocationId:
          !isCountryPage && !isContinentPage ? carOriginId || carDestinationId : undefined,
        carDropoffLocationId: !isCountryPage && !isContinentPage ? carDestinationId : undefined,
        carPickupLocationName:
          !isCountryPage && !isContinentPage ? originName || destinationName : undefined,
        carDropoffLocationName: !isCountryPage && !isContinentPage ? destinationName : undefined,

        vacationOriginName: undefined,
        vacationDefaultOriginName: undefined,
        vacationOriginId: undefined,
        vacationDefaultOriginId: undefined,

        vacationDestinationName: destinationName,
        vacationDestinationId: flightDestinationId,
        vacationDefaultDestinationId: flightDestinationId,
        vacationDefaultDestinationName: destinationName,
        countryCode,
        accommodationId,
        accommodationAddress,
        accommodationType,
        accommodationSubtype: subType?.subtype as GraphCMSSubType,
        activeSearchTab: shouldShowVacationPackages
          ? SearchTabsEnum.VacationPackages
          : SearchTabsEnum.Flights,
        tripStartingLocationId,
        tripStartingLocationName,
        destinationCountryCode,
      } as FrontSearchStateContext),
    [
      flightOriginId,
      originName,
      flightDestinationId,
      destinationName,
      isCountryPage,
      carOriginId,
      carDestinationId,
      countryCode,
      accommodationId,
      accommodationAddress,
      accommodationType,
      subType,
      shouldShowVacationPackages,
      tripStartingLocationId,
      tripStartingLocationName,
      destinationCountryCode,
      isContinentPage,
    ]
  );
  return (
    <CommonLandingPageContentContainer
      queryData={data}
      queryLoading={loading}
      queryError={error}
      requiredQuery
      queryCondition={queryCondition}
      activeServices={activeServices}
      context={context}
      SectionSkeletons={sectionSkeletons}
      shouldInitializeLocationInput={isCountryPage}
      showBreadcrumbs={isCountryPage}
      gteFrontPageMobileImageUrl={gteFrontPageMobileImageUrl}
      LandingPageSectionContent={
        <LandingPageSectionsContainer
          activeLocale={locale}
          pageType={queryCondition.pageType}
          queryCondition={queryCondition}
          subType={subType}
          pageVariation={pageVariation ?? GraphCMSPageVariation.none}
          origin={origin}
          destination={destination}
          sectionSkeletons={sectionSkeletons}
        />
      }
    />
  );
};

export default FrontCountryPageContentContainer;
