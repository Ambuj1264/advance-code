/* eslint-disable no-restricted-syntax */

import { Router, ResponseWriter } from "@layer0/core/router";

import { backends } from "../layer0.config";

type ProxyNameType = keyof typeof backends;

export const setupDevSharedRoutes = (router: Router, legacyProxyName: ProxyNameType) => {
  if (process.env.ALLOW_INDEXING !== "true") {
    // Add to cart for tours on monolith works using POST request, so we need to change location for our l0 dev branches.
    router.match(
      { path: "/process/tours/book/:path*" },
      ({ proxy, setResponseHeader }: ResponseWriter) => {
        proxy(legacyProxyName as ProxyNameType);
        setResponseHeader("location", "/cart");
      }
    );
  }
};
