import React, { useMemo } from "react";
import { useQuery } from "@apollo/react-hooks";
import { useRouter } from "next/router";

import { vpEnabledForLocale } from "../VacationPackageProductPage/utils/vpEnabledForLocale";

import VPLandingPageSectionsContainer from "./VPLandingPageSectionsContainer";
import { useVPSearchActiveServices } from "./hooks/useVPActiveServices";
import VPLandingPageQuery from "./queries/VPLandingPageQuery.graphql";
import { getVPDefaultTypeFilter } from "./utils/vacationPackagesUtils";
import { VacationPackageVpType } from "./utils/vacationSearchFilterUtils";

import getVpSectionsSkeletons, {
  getVPFallbackPageVariation,
} from "components/ui/LandingPages/utils/landingPageSkeletons/VPSectionsSkeletons";
import CommonLandingPageContentContainer from "components/ui/LandingPages/CommonLandingPageContentContainer";
import { SearchTabsEnum } from "components/ui/FrontSearchWidget/utils/FrontEnums";
import { FrontSearchStateContext } from "components/ui/FrontSearchWidget/FrontSearchStateContext";
import { normalizeGraphCMSLocale } from "utils/helperUtils";
import useActiveLocale from "hooks/useActiveLocale";
import { useSettings } from "contexts/SettingsContext";

const VPLandingPageContentContainer = ({
  queryCondition,
}: {
  queryCondition: LandingPageTypes.LandingPageQueryCondition;
}) => {
  const locale = useActiveLocale();
  const { asPath } = useRouter();
  const { marketplaceUrl } = useSettings();
  const { data, error, loading } = useQuery<{
    landingPages: Pick<
      LandingPageTypes.LandingPageQueryContent,
      "id" | "destination" | "pageVariation" | "subType"
    >[];
  }>(VPLandingPageQuery, {
    variables: {
      stage: "DRAFT",
      where: queryCondition,
      locale: normalizeGraphCMSLocale(locale),
      isDeleted: false,
    },
  });
  const { activeServices } = useVPSearchActiveServices();
  const landingPage = data?.landingPages[0];
  const destination = landingPage?.destination;
  const pageVariation =
    landingPage?.pageVariation || getVPFallbackPageVariation(asPath, marketplaceUrl);
  const subType = landingPage?.subType;
  const vpSubtype = subType?.subtype as VacationPackageVpType | undefined;
  const context = useMemo(
    () =>
      ({
        vacationOriginName: undefined,
        vacationDefaultOriginName: undefined,
        vacationOriginId: undefined,
        vacationDefaultOriginId: undefined,
        vacationType: getVPDefaultTypeFilter(vpSubtype),
        vacationDestinationName: destination?.name?.value,
        vacationDestinationId: destination?.flightId,
        vacationDefaultDestinationId: destination?.flightId,
        vacationDefaultDestinationName: destination?.name?.value,
        activeSearchTab: SearchTabsEnum.VacationPackages,
      } as FrontSearchStateContext),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data]
  );
  const sectionSkeletons = getVpSectionsSkeletons({
    pageVariation,
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
      isIndexed={vpEnabledForLocale(locale) && vpSubtype !== "SkiTrip"}
      SectionSkeletons={sectionSkeletons}
      LandingPageSectionContent={
        <VPLandingPageSectionsContainer
          queryCondition={queryCondition}
          subType={subType}
          pageVariation={pageVariation}
          destination={destination}
          sectionSkeletons={sectionSkeletons}
        />
      }
    />
  );
};

export default VPLandingPageContentContainer;
