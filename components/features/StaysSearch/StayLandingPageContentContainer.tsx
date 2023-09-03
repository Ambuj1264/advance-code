import React, { useMemo } from "react";
import { useRouter } from "next/router";
import { useQuery } from "@apollo/react-hooks";

import StayLandingPageSectionsContainer from "./StayLandingPageSectionsContainer";
import StayLandingPageQuery from "./queries/StayLandingPageQuery.graphql";

import useStayLandingAdminFunctionalItems from "components/features/StaysSearch/useStayLandingAdminFunctionalItems";
import { cleanAsPathWithLocale } from "utils/routerUtils";
import { PageType, GraphCMSPageVariation, GraphCMSSubType } from "types/enums";
import CommonLandingPageContentContainer from "components/ui/LandingPages/CommonLandingPageContentContainer";
import { SearchTabsEnum } from "components/ui/FrontSearchWidget/utils/FrontEnums";
import { FrontSearchStateContext } from "components/ui/FrontSearchWidget/FrontSearchStateContext";
import { normalizeGraphCMSLocale } from "utils/helperUtils";
import useActiveLocale from "hooks/useActiveLocale";
import { getAccommodationLocation } from "components/ui/LandingPages/utils/landingPageUtils";
import { isStaysPageIndexed } from "components/features/StayProductPage/utils/stayUtils";
import getStaysSectionsSkeletons from "components/ui/LandingPages/utils/landingPageSkeletons/staySectionsSkeletons";

const StayLandingPageContentContainer = ({
  queryCondition,
}: {
  queryCondition: LandingPageTypes.LandingPageQueryCondition;
}) => {
  const locale = useActiveLocale();
  const { asPath } = useRouter();
  const { data, error, loading } = useQuery<{
    landingPages: Pick<
      LandingPageTypes.LandingPageQueryContent,
      "id" | "destination" | "pageVariation" | "subType"
    >[];
  }>(StayLandingPageQuery, {
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
        pageType: PageType.GTE_STAYS_SEARCH as string,
        title: "Find a stay",
        uri: cleanAsPathWithLocale(asPath),
      },
    ],
    [asPath]
  );
  const landingPage = data?.landingPages[0];
  const destination = landingPage?.destination;
  const pageVariation = landingPage?.pageVariation;
  const { accommodationAddress, accommodationType } = getAccommodationLocation(
    // change when stayIds in graphcms are correct
    undefined,
    destination?.name?.value,
    pageVariation
  );
  const subtype = landingPage?.subType?.subtype as GraphCMSSubType;
  const context = useMemo(
    () =>
      ({
        accommodationAddress,
        accommodationType,
        accommodationSubtype: subtype,
        activeSearchTab: SearchTabsEnum.Stays,
      } as FrontSearchStateContext),
    [data]
  );
  const sectionSkeletons = getStaysSectionsSkeletons({
    pageVariation,
  });
  const functionalItems = useStayLandingAdminFunctionalItems({
    subType: subtype as GraphCMSSubType,
    pageVariation,
    stayId: destination?.stayId,
  });
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
      isIndexed={isStaysPageIndexed(true, locale)}
      functionalItems={functionalItems}
      SectionSkeletons={sectionSkeletons}
      LandingPageSectionContent={
        <StayLandingPageSectionsContainer
          queryCondition={queryCondition}
          subtype={subtype}
          pageVariation={pageVariation || GraphCMSPageVariation.inContinent}
          destination={destination}
          sectionSkeletons={sectionSkeletons}
        />
      }
    />
  );
};

export default StayLandingPageContentContainer;
