import { useQuery } from "@apollo/react-hooks";
import { NextRouter } from "next/router";

import GetRedirectUrlQuery from "./GetRedirectUrlQuery.graphql";
import RedirectsQuery from "./RedirectsQuery.graphql";

import { Marketplace } from "types/enums";
import { getCoreMarketPlace, isBrowser } from "utils/helperUtils";
import { asPathWithoutQueryParams } from "utils/routerUtils";
import { constructGtiCnRelativeUrl, isGtiCn, urlWithChineseLocale } from "utils/apiUtils";
import { RedirectTypes } from "types/RedirectTypes";
import useActiveLocale from "hooks/useActiveLocale";

const useGetRedirectData = (
  router: NextRouter,
  marketplace: Marketplace,
  handleSsrRedirect?: true | undefined
) => {
  const activeLocale = useActiveLocale();
  const normalizedAsPath =
    marketplace === Marketplace.GUIDE_TO_ICELAND
      ? router.asPath
      : urlWithChineseLocale(router.asPath);
  const normalizedAsPathWithoutQuery = asPathWithoutQueryParams(normalizedAsPath);
  const skip = handleSsrRedirect === undefined && !isBrowser;

  const redirectUrlQueryVariable = isGtiCn(marketplace, activeLocale)
    ? constructGtiCnRelativeUrl(normalizedAsPathWithoutQuery, activeLocale)
    : normalizedAsPathWithoutQuery;

  // for all but GUIDE_TO_EUROPE
  const { data: monolithRedirectData, loading } = useQuery<RedirectTypes.GetRedirectUrlQuery>(
    GetRedirectUrlQuery,
    {
      variables: {
        url: redirectUrlQueryVariable,
      },
      skip: skip || marketplace === Marketplace.GUIDE_TO_EUROPE,
    }
  );

  const asPathWithoutQuery = asPathWithoutQueryParams(router.asPath);

  // for every marketplace
  const { data: redirectsDbData, loading: loadingGTE } = useQuery<RedirectTypes.RedirectsQuery>(
    RedirectsQuery,
    {
      variables: {
        url: decodeURIComponent(asPathWithoutQuery),
        marketplace: getCoreMarketPlace(marketplace),
      },
      skip,
    }
  );

  const redirectsDbRes = redirectsDbData?.redirects?.[0];

  const data = {
    url: monolithRedirectData?.getRedirectUrl?.url || redirectsDbRes?.to,
    code: redirectsDbRes?.code,
  };

  return {
    data,
    loading: marketplace === Marketplace.GUIDE_TO_EUROPE ? loadingGTE : loading && loadingGTE,
  };
};

export default useGetRedirectData;
