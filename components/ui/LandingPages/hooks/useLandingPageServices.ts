import { useQuery } from "@apollo/react-hooks";

import useActiveLocale from "hooks/useActiveLocale";
import { GraphCMSPageType, PageType } from "types/enums";
import LandingPageUriQuery from "components/ui/LandingPages/queries/LandingPageUriQuery.graphql";
import { isStaysPageIndexed } from "components/features/StayProductPage/utils/stayUtils";
import { isDev } from "utils/globalUtils";
import useVpPackages from "hooks/useVpPackages";

const useLandingPageServices = ({
  landingPageUriQueryCondition,
}: {
  landingPageUriQueryCondition: LandingPageTypes.LandingPageQueryCondition;
}) => {
  const locale = useActiveLocale();
  const { data: landingPageUriData } = useQuery<{
    landingPageUrls: {
      pageType: GraphCMSPageType;
      metadataUri: string;
    }[];
  }>(LandingPageUriQuery, {
    variables: {
      locale,
      where: landingPageUriQueryCondition,
    },
  });
  const shouldShowVacationPackages = useVpPackages();

  return [
    {
      isLegacy: false,
      pageType: PageType.FLIGHTSEARCH as string,
      title: "Find a flight",
      uri:
        landingPageUriData?.landingPageUrls.find(
          landingPage => landingPage.pageType === GraphCMSPageType.Flights
        )?.metadataUri ?? "",
    },
    {
      isLegacy: false,
      pageType: PageType.GTE_CAR_SEARCH as string,
      title: "Find a car",
      uri:
        landingPageUriData?.landingPageUrls.find(
          landingPage => landingPage.pageType === GraphCMSPageType.Cars
        )?.metadataUri ?? "",
    },
    ...(isStaysPageIndexed(true, locale) || isDev()
      ? [
          {
            isLegacy: false,
            pageType: PageType.GTE_STAYS_SEARCH as string,
            title: "Find a place to stay",
            uri:
              landingPageUriData?.landingPageUrls.find(
                landingPage => landingPage.pageType === GraphCMSPageType.Stays
              )?.metadataUri ?? "",
          },
        ]
      : []),
    {
      isLegacy: false,
      pageType: PageType.GTE_TOUR_SEARCH as string,
      title: "Find an experience",
      uri:
        landingPageUriData?.landingPageUrls.find(
          landingPage => landingPage.pageType === GraphCMSPageType.Tours
        )?.metadataUri ?? "",
    },
    ...(shouldShowVacationPackages
      ? [
          {
            isLegacy: false,
            pageType: PageType.VACATION_PACKAGES_LANDING as string,
            title: "Find a vacation package",
            uri:
              landingPageUriData?.landingPageUrls.find(
                landingPage => landingPage.pageType === GraphCMSPageType.VacationPackages
              )?.metadataUri ?? "",
          },
        ]
      : []),
  ];
};

export default useLandingPageServices;
