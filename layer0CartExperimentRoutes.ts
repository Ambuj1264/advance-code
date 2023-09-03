/* eslint-disable no-restricted-syntax */
import { Router } from "@layer0/core/router";

import { legacyGTIProxyName } from "./layer0RoutesConstants";
import { TRAVELSHIFT_EXPERIMENT_COOKIE_NAME } from "./utils/constants";

import { ActiveExperiments } from "components/ui/Experiments/experimentEnums";

const layer0CartExperimentRoutes = new Router();

const isIndexingDisabled = process.env.ALLOW_INDEXING !== "true";

layer0CartExperimentRoutes.match(
  { path: "/:path*", headers: { host: /cn\./ } },
  ({ setRequestHeader }) => {
    setRequestHeader("Force-Locale", "zh_CN");
  }
);

layer0CartExperimentRoutes.fallback(({ cache, proxy, setResponseHeader, addResponseCookie }) => {
  setResponseHeader("x-passthrough", "true");
  cache({ edge: false });
  addResponseCookie(
    TRAVELSHIFT_EXPERIMENT_COOKIE_NAME,
    `${ActiveExperiments.NEW_CART},${process.env.CART_EXPERIMENT_ID},0`
  );
  proxy(legacyGTIProxyName);

  if (isIndexingDisabled) {
    setResponseHeader("X-Robots-Tag", "noindex");
  }
});

export default layer0CartExperimentRoutes;
