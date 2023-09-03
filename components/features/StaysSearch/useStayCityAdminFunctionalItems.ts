import { useQuery } from "@apollo/react-hooks";
import { useRouter } from "next/router";

import PublishStayCityPageQuery from "./queries/PublishStayCityPageQuery.graphql";

import useHandleCacheClear from "components/features/AdminGear/useHandleCacheClear";

const useStayCityAdminFunctionalItems = ({
  productType,
  shouldSkip,
  setShouldPublishPage,
  cityOsmId,
}: {
  productType?: string;
  shouldSkip: boolean;
  cityOsmId?: number;
  setShouldPublishPage: (shouldPublishPage: boolean) => void;
}) => {
  const { asPath } = useRouter();
  const { handleCacheClear, cacheClearingLoadingState } = useHandleCacheClear();
  const { loading, refetch } = useQuery<{
    publishCityPage: {
      success: boolean;
      errorMessage?: string;
    };
  }>(PublishStayCityPageQuery, {
    variables: {
      productType,
      cityOsmId,
    },
    skip: shouldSkip,
    notifyOnNetworkStatusChange: true,
    onCompleted: ({ publishCityPage }) => {
      if (publishCityPage.success) {
        handleCacheClear({ surrogateKey: asPath });
      }
      setShouldPublishPage(false);
    },
  });
  const getCityFunctionalItems = () =>
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
    getCityFunctionalItems,
  };
};

export default useStayCityAdminFunctionalItems;
