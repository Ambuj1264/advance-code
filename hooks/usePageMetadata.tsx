import { useQuery } from "@apollo/react-hooks";
import { useRouter } from "next/router";

import PageMetadataQuery from "./queries/PageMetadataQuery.graphql";

import { cleanAsPath, removeEnCnLocaleCode } from "utils/routerUtils";
import { longCacheHeaders } from "utils/apiUtils";
import useActiveLocale from "hooks/useActiveLocale";
import lazyCaptureException from "lib/lazyCaptureException";

const usePageMetadata = ({ canonicalQueryParams }: { canonicalQueryParams?: string }) => {
  const { asPath } = useRouter();
  const activeLocale = useActiveLocale();
  const pathWithoutLocale = removeEnCnLocaleCode(cleanAsPath(asPath, activeLocale), activeLocale);

  const queryPostfix = canonicalQueryParams ? `?${canonicalQueryParams}` : "";
  const { data, error } = useQuery<PageMetadata>(PageMetadataQuery, {
    variables: { path: `${pathWithoutLocale}${queryPostfix}` },
    context: { headers: longCacheHeaders },
  });
  if (error) {
    lazyCaptureException(new Error(`Pagemetadata query failed`), {
      errorInfo: error,
      pathname: asPath,
      operationName: "pageMetadataQuery",
    });
  }
  return data;
};

export default usePageMetadata;
