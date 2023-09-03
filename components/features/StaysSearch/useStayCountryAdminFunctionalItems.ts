import { useQuery } from "@apollo/react-hooks";
import { useRouter } from "next/router";

import PublishStayCountryPageQuery from "./queries/PublishStayCountryPageQuery.graphql";

import useHandleCacheClear from "components/features/AdminGear/useHandleCacheClear";

const useStayCountryAdminFunctionalItems = ({
  productType,
  shouldSkip,
  setShouldPublishPage,
  countryOsmId,
}: {
  productType?: string;
  shouldSkip: boolean;
  countryOsmId?: number;
  setShouldPublishPage: (shouldPublishPage: boolean) => void;
}) => {
  const { asPath } = useRouter();
  const { handleCacheClear, cacheClearingLoadingState } = useHandleCacheClear();
  const { loading, refetch } = useQuery<{
    publishCountryPage: {
      success: boolean;
      errorMessage?: string;
    };
  }>(PublishStayCountryPageQuery, {
    variables: {
      productType,
      countryOsmId,
    },
    skip: shouldSkip,
    notifyOnNetworkStatusChange: true,
    onCompleted: ({ publishCountryPage }) => {
      if (publishCountryPage.success) {
        handleCacheClear({ surrogateKey: asPath });
      }
      setShouldPublishPage(false);
    },
  });
  const getCountryFunctionalItems = () =>
    [
      {
        name: "Regenerate content and rebuild cache",
        onClick: () => {
          setShouldPublishPage(true);
          setTimeout(() => refetch(), 0);
        },
        loading: loading || cacheClearingLoadingState.singlePage,
      },
    ] as AdminGearTypes.AdminFunctionalItem[];
  return {
    getCountryFunctionalItems,
  };
};

export default useStayCountryAdminFunctionalItems;
