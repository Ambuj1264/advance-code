import { useState } from "react";
import { useLazyQuery } from "@apollo/react-hooks";

import PurgeEdgeCacheQuery from "./graphql/PurgeCacheQuery.graphql";

const CLEARING_CACHE_DELAY = 30000;
const useHandleCacheClear = () => {
  const [cacheClearingLoadingState, setCacheClearingLoadingState] = useState({
    singlePage: false,
    multiPage: false,
  });
  const [purgeEdgeCache] = useLazyQuery<
    {
      purgeEdgeCache: {
        success: boolean;
      };
    },
    {
      environment: string;
      paths: string[];
      surrogateKeys: string[];
    }
  >(PurgeEdgeCacheQuery, {
    context: {
      fetchOptions: {
        method: "POST",
      },
    },
    onCompleted: data => {
      if (data.purgeEdgeCache.success) {
        setTimeout(() => {
          document.location.reload();
        }, CLEARING_CACHE_DELAY);
      } else {
        setCacheClearingLoadingState({
          singlePage: false,
          multiPage: false,
        });
      }
    },
  });
  const handleCacheClear = ({
    surrogateKey,
    isSinglePage = true,
  }: {
    surrogateKey: string;
    isSinglePage?: boolean;
  }) => {
    setCacheClearingLoadingState({
      singlePage: isSinglePage,
      multiPage: !isSinglePage,
    });
    purgeEdgeCache({
      variables: {
        environment: "production",
        surrogateKeys: [surrogateKey],
        paths: [surrogateKey],
      },
    });
  };
  return {
    cacheClearingLoadingState,
    handleCacheClear,
  };
};

export default useHandleCacheClear;
