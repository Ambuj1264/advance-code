import React, { useMemo } from "react";
import { useRouter } from "next/router";
import { useQuery } from "@apollo/react-hooks";

import CarLandingPageQuery from "./queries/CarLandingPageQuery.graphql";

import { cleanAsPathWithLocale } from "utils/routerUtils";
import { PageType, GraphCMSPageVariation } from "types/enums";
import CommonLandingPageContentContainer from "components/ui/LandingPages/CommonLandingPageContentContainer";
import { SearchTabsEnum } from "components/ui/FrontSearchWidget/utils/FrontEnums";
import { FrontSearchStateContext } from "components/ui/FrontSearchWidget/FrontSearchStateContext";
import CarLandingPageSectionsContainer from "components/ui/LandingPages/CarLandingPageSectionsContainer";
import { normalizeGraphCMSLocale } from "utils/helperUtils";
import useActiveLocale from "hooks/useActiveLocale";
import getCarsSectionsSkeletons from "components/ui/LandingPages/utils/landingPageSkeletons/carsSectionsSkeletons";

const GTECarLandingPageContentContainer = ({
  queryCondition,
}: {
  queryCondition: LandingPageTypes.LandingPageQueryCondition;
}) => {
  const locale = useActiveLocale();
  const { asPath } = useRouter();

  const { data, error, loading } = useQuery<{
    landingPages: Pick<
      LandingPageTypes.LandingPageQueryContent,
      "id" | "destination" | "origin" | "pageVariation" | "subType"
    >[];
  }>(CarLandingPageQuery, {
    variables: {
      stage: "DRAFT",
      where: queryCondition,
      locale: normalizeGraphCMSLocale(locale),
      isDeleted: false,
    },
  });

  const landingPage = loading ? undefined : data?.landingPages[0];
  const subtype = landingPage?.subType?.subtype;

  const activeServices = useMemo(
    () => [
      {
        isLegacy: false,
        pageType: PageType.GTE_CAR_SEARCH as string,
        title: "Find a car",
        subtype,
        uri: cleanAsPathWithLocale(asPath),
      },
    ],
    [asPath, subtype]
  );
  const isCountryPage = landingPage?.pageVariation?.includes("Country");
  const isEuropePage = landingPage?.pageVariation?.includes("Continent");
  const origin = isCountryPage ? undefined : landingPage?.origin;
  const destination = isCountryPage ? undefined : landingPage?.destination;
  const pageVariation = landingPage?.pageVariation || GraphCMSPageVariation.inContinent;
  const destinationId = destination?.carId;
  const originId = origin?.carId;
  const originName = origin?.name?.value;
  const destinationName = destination?.name
    ? destination?.name?.value
    : destination?.defaultName?.value;
  const countryCode = isCountryPage ? landingPage?.destination?.alpha2Code : undefined;
  const sectionSkeletons = getCarsSectionsSkeletons({
    pageVariation,
  });

  const context = useMemo(
    () =>
      ({
        carPickupLocationId: originId || destinationId,
        carDropoffLocationId: destinationId,
        carPickupLocationName: !isEuropePage ? originName || destinationName : undefined,
        carDropoffLocationName: !isEuropePage ? destinationName : undefined,
        activeSearchTab: SearchTabsEnum.Cars,
        countryCode,
      } as FrontSearchStateContext),
    [originId, destinationId, originName, destinationName, countryCode, isEuropePage]
  );
  return (
    <CommonLandingPageContentContainer
      queryData={data}
      queryLoading={loading}
      queryError={error}
      requiredQuery
      queryCondition={queryCondition}
      activeServices={activeServices}
      shouldInitializeLocationInput={!isEuropePage}
      context={context}
      hideTabs
      SectionSkeletons={sectionSkeletons}
      LandingPageSectionContent={
        <CarLandingPageSectionsContainer
          queryCondition={queryCondition}
          subtype={landingPage?.subType?.subtype}
          pageVariation={pageVariation}
          origin={landingPage?.origin}
          destination={landingPage?.destination}
          sectionSkeletons={sectionSkeletons}
        />
      }
    />
  );
};

export default GTECarLandingPageContentContainer;
