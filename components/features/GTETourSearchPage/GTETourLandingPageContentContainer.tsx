import React, { useMemo } from "react";
import { useRouter } from "next/router";
import { useQuery } from "@apollo/react-hooks";

import TourLandingPageSectionsContainer from "./GTETourLandingPageSectionsContainer";
import TourLandingPageQuery from "./queries/TourLandingPageQuery.graphql";

import { isTourPageIndexed } from "components/features/GTETourProductPage/utils/gteTourUtils";
import { cleanAsPathWithLocale } from "utils/routerUtils";
import { PageType, GraphCMSPageVariation } from "types/enums";
import CommonLandingPageContentContainer from "components/ui/LandingPages/CommonLandingPageContentContainer";
import { SearchTabsEnum } from "components/ui/FrontSearchWidget/utils/FrontEnums";
import { FrontSearchStateContext } from "components/ui/FrontSearchWidget/FrontSearchStateContext";
import { normalizeGraphCMSLocale } from "utils/helperUtils";
import useActiveLocale from "hooks/useActiveLocale";
import getTourSectionsSkeletons from "components/ui/LandingPages/utils/landingPageSkeletons/tourSectionsSkeleton";
import {
  getTourLocation,
  getDestinationCountryCode,
} from "components/ui/LandingPages/utils/landingPageUtils";

const GTETourLandingPageContentContainer = ({
  queryCondition,
}: {
  queryCondition: LandingPageTypes.LandingPageQueryCondition;
}) => {
  const locale = useActiveLocale();
  const { asPath } = useRouter();
  const { data, error, loading } = useQuery<{
    landingPages: (Pick<
      LandingPageTypes.LandingPageQueryContent,
      "id" | "destination" | "pageVariation"
    > & {
      subType?: {
        subtype?: string;
        tagId?: number;
        parentSubType?: {
          subtype?: string;
        };
      };
    })[];
  }>(TourLandingPageQuery, {
    variables: {
      stage: "DRAFT",
      where: queryCondition,
      locale: normalizeGraphCMSLocale(locale),
      isDeleted: false,
    },
  });
  const landingPage = data?.landingPages[0];
  const subType = landingPage?.subType?.subtype;
  const tagId = landingPage?.subType?.tagId;
  const parentSubType = landingPage?.subType?.parentSubType?.subtype;
  const pageVariation = landingPage?.pageVariation || GraphCMSPageVariation.inContinent;
  const destination = landingPage?.destination;
  const sectionSkeletons = getTourSectionsSkeletons({
    pageVariation,
  });
  const { tripStartingLocationId, tripStartingLocationName } = getTourLocation(
    destination,
    pageVariation
  );
  const fromCountryCode = getDestinationCountryCode(destination, pageVariation);
  const activeServices = useMemo(
    () => [
      {
        isLegacy: false,
        pageType: PageType.GTE_TOUR_SEARCH as string,
        title: "Find a trip",
        uri: cleanAsPathWithLocale(asPath),
      },
    ],
    [asPath]
  );
  const context = useMemo(
    () =>
      ({
        activeSearchTab: SearchTabsEnum.Trips,
        tripStartingLocationId,
        tripStartingLocationName,
        destinationCountryCode: fromCountryCode,
      } as FrontSearchStateContext),
    [data]
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
      isIndexed={isTourPageIndexed(true, locale)}
      SectionSkeletons={sectionSkeletons}
      hideLastBreadcrumb={false}
      LandingPageSectionContent={
        <TourLandingPageSectionsContainer
          queryCondition={queryCondition}
          subtype={subType}
          pageVariation={pageVariation}
          destination={destination}
          sectionSkeletons={sectionSkeletons}
          tagId={tagId}
          parentSubType={parentSubType}
        />
      }
    />
  );
};

export default GTETourLandingPageContentContainer;
