/* eslint-disable jsx-a11y/anchor-is-valid */

import React, { ReactNode, Ref, useEffect } from "react";
import NextLink from "next/link";
import { useApolloClient } from "@apollo/react-hooks";
import { parseUrl } from "use-query-params";

import useActiveLocale from "hooks/useActiveLocale";
import { prefetchLegacyRoute, prefetchRouteData } from "utils/swUtils";

const ClientLink = (
  {
    clientRoute: { route, as, query, replace = false },
    children,
    prefetch = false,
    prefetchData = false,
    className,
    useRegularLink,
    target,
    title,
    onClick,
    abortController,
    nofollow = false,
    dataTestid,
    ...restProps
  }: {
    clientRoute: SharedTypes.ClientRoute;
    children?: ReactNode;
    prefetch?: boolean;
    prefetchData?: boolean;
    className?: string;
    useRegularLink?: boolean;
    target?: string;
    nofollow?: boolean;
    title?: string;
    onClick?: (event: React.SyntheticEvent) => void;
    abortController?: AbortController;
    dataTestid?: string;
  },
  ref?: Ref<HTMLAnchorElement>
) => {
  const activeLocale = useActiveLocale();
  const apolloClient = useApolloClient();
  const isTargetBlank = target === "_blank";
  const isChineseLocale = activeLocale === "zh_CN";

  useEffect(() => {
    if (isChineseLocale) return;

    if (prefetchData && !useRegularLink) {
      const ctx = { query };
      prefetchRouteData(route, as, ctx, apolloClient, !isTargetBlank, abortController);
    }
    if (prefetch && useRegularLink) {
      prefetchLegacyRoute(as, activeLocale);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefetchData, prefetch]);
  const isLegacyRoute = useRegularLink || target || activeLocale === "zh_CN";
  const link = (
    <a
      className={className}
      href={isLegacyRoute ? as : undefined}
      target={target}
      title={title}
      onClick={onClick}
      ref={ref}
      {...(nofollow ? { rel: "nofollow" } : null)}
      {...restProps}
      {...(isLegacyRoute ? { "data-ssr": true } : null)}
      data-id={dataTestid}
    >
      {children}
    </a>
  );

  if (isLegacyRoute) return link;

  return (
    <NextLink
      href={{
        pathname: route,
        query: {
          ...parseUrl(as).query,
          ...query,
        },
      }}
      as={as}
      passHref
      replace={replace}
      {...(prefetch ? {} : { prefetch: false })}
      {...restProps}
    >
      {link}
    </NextLink>
  );
};

export default React.forwardRef(ClientLink);
