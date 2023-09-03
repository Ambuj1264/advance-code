import { Router } from "@layer0/core/router";

import layer0PassthroughRoutes from "./layer0PassthroughRoutes";
import { gteSsr } from "./cache";

import { setupSharedRoutes } from "layer0ProductionSharedRoutes";
import { cachedMonolithPages, legacyGTEStagingProxyName } from "layer0RoutesConstants";
import {
  cachedProxyRules,
  getLayer0Routes,
  proxyRules,
  redirectGTELangs,
  redirectOldRoutes,
  redirectWrongCountryUrl,
  routeMatcher,
  routeRules,
} from "utils/layer0RoutesUtils";
import { MarketplaceName } from "types/enums";

const router = new Router();
const GTERoutes = getLayer0Routes(MarketplaceName.GUIDE_TO_EUROPE);

router.match({ path: "/(zh|zh_CN)/:path", headers: { host: /cn\./ } }, ({ redirect }) =>
  redirect("/:path")
);
router.match({ path: "/:path*", headers: { host: /cn\./ } }, ({ setRequestHeader }) => {
  setRequestHeader("Force-Locale", "zh_CN");
});

redirectGTELangs(router);
redirectWrongCountryUrl(router);
redirectOldRoutes(router);

setupSharedRoutes(router, legacyGTEStagingProxyName as never);

[...GTERoutes.entries()].map(([path, route]) =>
  router.match(routeMatcher(path), routeRules(gteSsr, route.name))
);

cachedMonolithPages.forEach(path =>
  router.match(path, cachedProxyRules(legacyGTEStagingProxyName))
);

router.fallback(proxyRules(legacyGTEStagingProxyName as never));

const destinations = new Router()
  .destination("passthrough", layer0PassthroughRoutes)
  .destination("production", router);

export { router as productionRouter };
export default destinations;
