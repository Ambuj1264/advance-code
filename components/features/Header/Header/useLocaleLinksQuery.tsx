import { useQuery } from "@apollo/react-hooks";

import LocaleLinksQuery from "./graphql/LocaleLinksQuery.graphql";

import { longCacheHeaders } from "utils/apiUtils";

const useLocaleLinks = (url: string) => {
  const { data } = useQuery<{
    localeLinks: LocaleLink[];
  }>(LocaleLinksQuery, {
    variables: {
      url,
    },
    context: {
      headers: longCacheHeaders,
    },
  });
  return data?.localeLinks ?? [];
};

export default useLocaleLinks;
