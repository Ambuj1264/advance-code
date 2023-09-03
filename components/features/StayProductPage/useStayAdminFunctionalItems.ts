import { useState } from "react";
import { useQuery } from "@apollo/react-hooks";
import { useRouter } from "next/router";

import PublishStayProductPageQuery from "./queries/PublishStayProductPageQuery.graphql";

import useHandleCacheClear from "components/features/AdminGear/useHandleCacheClear";

const useStayAdminFunctionalItems = ({ productId }: { productId?: number }) => {
  const { asPath } = useRouter();
  const { handleCacheClear, cacheClearingLoadingState } = useHandleCacheClear();
  const [shouldPublishPage, setShouldPublishPage] = useState(false);
  const { loading: publishLoading, refetch } = useQuery<{
    publishProductPage: {
      success: boolean;
      errorMessage?: string;
    };
  }>(PublishStayProductPageQuery, {
    variables: {
      productId,
    },
    skip: !shouldPublishPage || !productId,
    notifyOnNetworkStatusChange: true,
    onCompleted: ({ publishProductPage }) => {
      if (publishProductPage.success) {
        handleCacheClear({ surrogateKey: asPath });
      }
      setShouldPublishPage(false);
    },
  });
  return [
    {
      name: "Regenerate content and rebuild cache",
      onClick: () => {
        setShouldPublishPage(true);
        setTimeout(() => refetch(), 0);
      },
      loading: publishLoading || cacheClearingLoadingState.singlePage,
    },
  ] as AdminGearTypes.AdminFunctionalItem[];
};

export default useStayAdminFunctionalItems;
