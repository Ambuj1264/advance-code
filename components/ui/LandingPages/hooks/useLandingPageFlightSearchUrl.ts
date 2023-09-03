import { useQuery } from "@apollo/react-hooks";

import useActiveLocale from "hooks/useActiveLocale";
import { GraphCMSPageType } from "types/enums";
import LandingPageUriQuery from "components/ui/LandingPages/queries/LandingPageUriQuery.graphql";
import { normalizeGraphCMSLocale } from "utils/helperUtils";

const useLandingPageFlightSearchUrl = ({
  landingPageUriQueryCondition,
  isFlightEnabled,
}: {
  landingPageUriQueryCondition: LandingPageTypes.LandingPageQueryCondition;
  isFlightEnabled: boolean;
}) => {
  const locale = useActiveLocale();
  const { data: landingPageUriData } = useQuery<{
    landingPageUrls: {
      pageType: GraphCMSPageType;
      metadataUri: string;
      destination?: LandingPageTypes.Place;
    }[];
  }>(LandingPageUriQuery, {
    variables: {
      locale: normalizeGraphCMSLocale(locale),
      where: landingPageUriQueryCondition,
    },
    skip: !isFlightEnabled,
  });
  return {
    metadataUri: landingPageUriData?.landingPageUrls?.[0]?.metadataUri || "/best-flights",
    destination: landingPageUriData?.landingPageUrls?.[0]?.destination,
  };
};

export default useLandingPageFlightSearchUrl;
