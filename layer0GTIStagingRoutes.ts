import { Router } from "@layer0/core/router";

import layer0PassthroughRoutes from "./layer0PassthroughRoutes";
import { MarketplaceName } from "./types/enums";
import { ssr } from "./cache";

import { ProxyNameType, setupSharedRoutes } from "layer0ProductionSharedRoutes";
import { setupDevSharedRoutes } from "layer0DevSharedRoutes";
import { cachedMonolithPages, legacyGTIStagingProxyName } from "layer0RoutesConstants";
import { cachedProxyRules, getLayer0Paths, proxyRules, routeRules } from "utils/layer0RoutesUtils";

const router = new Router();
const paths = getLayer0Paths(MarketplaceName.GUIDE_TO_ICELAND);

router.match({ path: "/(zh|zh_CN)/:path*", headers: { host: /guidetoiceland/ } }, ({ redirect }) =>
  redirect("https://cn.guidetoiceland.is/:path")
);
router.match({ path: "/:path*", headers: { host: /cn\./ } }, ({ setRequestHeader }) => {
  setRequestHeader("Force-Locale", "zh_CN");
});

// Allows pages with query parameter ?isPassthrough to proxy to the monolith
router.match(
  { query: { isPassthrough: "1" } },
  proxyRules(legacyGTIStagingProxyName as ProxyNameType)
);
paths.forEach(path => router.match({ path }, routeRules(ssr)));

setupSharedRoutes(router, legacyGTIStagingProxyName as never);

setupDevSharedRoutes(router, legacyGTIStagingProxyName as never);

cachedMonolithPages.forEach(path =>
  router.match(path, cachedProxyRules(legacyGTIStagingProxyName))
);
router.fallback(proxyRules(legacyGTIStagingProxyName as never));

const destinations = new Router()
  .destination("passthrough", layer0PassthroughRoutes)
  .destination("production", router);

export { router as productionRouter };
export default destinations;
