import React, { useMemo, memo } from "react";
import { useRouter } from "next/router";
import { QueryParamProvider as ContextProvider, parse } from "use-query-params";

import { asPathWithoutQueryParams } from "utils/routerUtils";

const QueryParamProvider = ({
  skipScroll = false,
  children,
  ...rest
}: {
  skipScroll?: boolean;
  children: React.ReactNode;
}) => {
  const router = useRouter();

  const pathname = asPathWithoutQueryParams(router.asPath);

  const location = useMemo(
    () =>
      process.browser
        ? window.location
        : ({
            search: router.asPath.replace(/[^?]+/u, ""),
            pathname,
          } as Location),
    [router.asPath, pathname]
  );

  const history = useMemo(
    () => ({
      push: ({ search }: Location) => {
        router.push(
          { pathname: router.pathname, query: router.query },
          { search, pathname },
          { shallow: true, ...(skipScroll ? { scroll: false } : {}) }
        );
      },
      replace: ({ search }: Location) => {
        router.replace(
          router.pathname,
          {
            query: {
              ...router.query,
              ...parse(search),
            },
            pathname,
          },
          { shallow: true }
        );
      },
    }),
    [pathname, router, skipScroll]
  );

  return (
    <ContextProvider {...rest} history={history} location={location}>
      {children}
    </ContextProvider>
  );
};

export default memo(QueryParamProvider);
