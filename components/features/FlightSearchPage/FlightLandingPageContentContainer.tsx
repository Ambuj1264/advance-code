import React, { useMemo } from "react";
import { useRouter } from "next/router";
import { useQuery } from "@apollo/react-hooks";

import FlightLandingPageSectionsContainer from "./FlightLandingPageSectionsContainer";
import FlightLandingPageQuery from "./queries/FlightLandingPageQuery.graphql";

import { cleanAsPathWithLocale } from "utils/routerUtils";
import { PageType, GraphCMSPageVariation, GraphCMSPageType } from "types/enums";
import CommonLandingPageContentContainer from "components/ui/LandingPages/CommonLandingPageContentContainer";
import { SearchTabsEnum } from "components/ui/FrontSearchWidget/utils/FrontEnums";
import { FrontSearchStateContext } from "components/ui/FrontSearchWidget/FrontSearchStateContext";
import { normalizeGraphCMSLocale } from "utils/helperUtils";
import useActiveLocale from "hooks/useActiveLocale";
import getFlightsSectionsSkeletons from "components/ui/LandingPages/utils/landingPageSkeletons/flightsSectionsSkeletons";

const FlightLandingPageContentContainer = ({
  queryCondition,
}: {
  queryCondition: LandingPageTypes.LandingPageQueryCondition;
}) => {
  const locale = useActiveLocale();
  const { asPath } = useRouter();
  const { data, error, loading } = useQuery<{
    landingPages: Pick<
      LandingPageTypes.LandingPageQueryContent,
      "id" | "destination" | "origin" | "pageVariation"
    >[];
  }>(FlightLandingPageQuery, {
    variables: {
      stage: "DRAFT",
      where: queryCondition,
      locale: normalizeGraphCMSLocale(locale),
      isDeleted: false,
    },
  });
  const activeServices = useMemo(
    () => [
      {
        isLegacy: false,
        pageType: PageType.FLIGHTSEARCH as string,
        title: "Find a flight",
        uri: cleanAsPathWithLocale(asPath),
      },
    ],
    [asPath]
  );

  const landingPage = data?.landingPages[0];
  const origin = landingPage?.origin;
  const destination = landingPage?.destination;
  const pageVariation = landingPage?.pageVariation || GraphCMSPageVariation.inContinent;
  const sectionSkeletons = getFlightsSectionsSkeletons({
    pageVariation,
  });
  const context = useMemo(
    () =>
      ({
        flightOriginId: origin?.flightId,
        flightOriginName: origin?.name?.value,
        flightDestinationId: destination?.flightId,
        flightDestinationName: destination?.name?.value,
        flightDefaultOriginId: origin?.flightId,
        flightDefaultOriginName: origin?.name?.value,
        flightDefaultDestinationId: destination?.flightId,
        flightDefaultDestinationName: destination?.name?.value,
        activeSearchTab: SearchTabsEnum.Flights,
      } as FrontSearchStateContext),
    [destination?.flightId, destination?.name?.value, origin?.flightId, origin?.name?.value]
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
      hideTabs
      SectionSkeletons={sectionSkeletons}
      LandingPageSectionContent={
        <FlightLandingPageSectionsContainer
          pageType={queryCondition.pageType || GraphCMSPageType.Flights}
          queryCondition={queryCondition}
          pageVariation={pageVariation}
          origin={origin}
          destination={destination}
          sectionSkeletons={sectionSkeletons}
        />
      }
    />
  );
};

export default FlightLandingPageContentContainer;
