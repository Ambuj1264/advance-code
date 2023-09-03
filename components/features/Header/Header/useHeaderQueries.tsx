import { useQuery } from "@apollo/react-hooks";
import { HeaderTypes } from "@travelshift/ui/typings/headerTypes";

import { constructNewHeader } from "./utils/headerUtils";
import headerQuery from "./graphql/HeaderQuery.graphql";
import HeaderQueryGraphCms from "./graphql/HeaderQueryGraphCms.graphql";

import useActiveLocale from "hooks/useActiveLocale";
import { normalizeGraphCMSLocale } from "utils/helperUtils";
import { longCacheHeaders } from "utils/apiUtils";

export const useHeaderQuery = () => {
  const { error: headerError, data: headerData } = useQuery<HeaderTypes.QueryHeaderData>(
    headerQuery,
    {
      context: {
        headers: longCacheHeaders,
      },
    }
  );

  return {
    headerData,
    headerError,
  };
};

export const useNewHeaderQuery = () => {
  const activeLocale = useActiveLocale();
  const { error: headerError, data: newHeaderData } = useQuery<{
    marketplaceConfig: {
      headerConfig: HeaderTypes.QueryNewHeaderData;
    };
  }>(HeaderQueryGraphCms, {
    variables: {
      locale: normalizeGraphCMSLocale(activeLocale),
      url: "https://guidetoeurope.com",
    },
    context: {
      headers: longCacheHeaders,
    },
  });
  const headerData = constructNewHeader(newHeaderData?.marketplaceConfig?.headerConfig);
  const links = (headerData?.links ?? []).filter(({ url, text }) => url && text);

  return {
    headerData: headerData
      ? {
          ...headerData,
          links,
        }
      : undefined,
    headerError,
  };
};
