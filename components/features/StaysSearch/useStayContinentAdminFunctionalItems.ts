import { useQuery } from "@apollo/react-hooks";
import { useRouter } from "next/router";

import PublishStayContinentPageQuery from "./queries/PublishStayContinentPageQuery.graphql";

import useHandleCacheClear from "components/features/AdminGear/useHandleCacheClear";

const useStayContinentAdminFunctionalItems = ({
  productType,
  shouldSkip,
  setShouldPublishPage,
}: {
  productType?: string;
  shouldSkip: boolean;
  setShouldPublishPage: (shouldPublishPage: boolean) => void;
}) => {
  const { asPath } = useRouter();
  const { handleCacheClear, cacheClearingLoadingState } = useHandleCacheClear();
  const { loading, refetch } = useQuery<{
    publishContinentPage: {
      success: boolean;
      errorMessage?: string;
    };
  }>(PublishStayContinentPageQuery, {
    variables: {
      productType,
    },
    skip: shouldSkip,
    notifyOnNetworkStatusChange: true,
    onCompleted: ({ publishContinentPage }) => {
      if (publishContinentPage.success) {
        handleCacheClear({ surrogateKey: asPath });
      }
      setShouldPublishPage(false);
    },
  });
  const getContinentFunctionalItems = () =>
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
    getContinentFunctionalItems,
  };
};

export default useStayContinentAdminFunctionalItems;
