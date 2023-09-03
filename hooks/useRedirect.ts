import { useRouter } from "next/router";
import { useContext, useEffect } from "react";

import { RouterContext } from "contexts/RouterContext";
import { getUrlWithAdditionalQueryParam } from "utils/routerUtils";
import { RedirectTypes } from "types/RedirectTypes";

export const useServerSideRedirect = ({
  to,
  status,
  condition,
}: RedirectTypes.ServerSideRedirect) => {
  const { serverSideRedirect } = useContext(RouterContext);
  if ((condition || typeof condition === "undefined") && serverSideRedirect) {
    serverSideRedirect(to, status);
  }
};

export const useClientSideRedirect = ({ to, as, condition }: RedirectTypes.ClientSideRedirect) => {
  const { replace } = useRouter();
  useEffect(() => {
    if (condition || typeof condition === "undefined") {
      replace(to, as);
    }
  }, [condition, replace, to, as]);
};

export const useServerAndOrClientSideRedirect = ({
  to,
  status,
  condition,
}: RedirectTypes.ServerSideRedirect) => {
  useServerSideRedirect({ to, status, condition });
  useClientSideRedirect({ to, condition });
};

export const useRedirectToPageParam = ({
  page,
  loading,
  totalPages,
  status,
  goToPage,
}: RedirectTypes.RedirectToPageParam) => {
  const { asPath } = useRouter();
  const condition = !loading && (totalPages ? page > totalPages : page > 1);
  const value = goToPage ?? totalPages ?? 1;
  const to: string = getUrlWithAdditionalQueryParam({
    baseUrl: asPath,
    param: "page",
    value: value > 1 ? value : undefined,
  });

  useServerAndOrClientSideRedirect({ to, status, condition });
};
