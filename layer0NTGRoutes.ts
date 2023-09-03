import { Router } from "@layer0/core/router";

import layer0PassthroughRoutes from "./layer0PassthroughRoutes";
import { ssr } from "./cache";

import { setupSharedRoutes } from "layer0ProductionSharedRoutes";
import { setupDevSharedRoutes } from "layer0DevSharedRoutes";
import { cachedMonolithPages, legacyNTGProxyName } from "layer0RoutesConstants";
import {
  cachedProxyRules,
  getLayer0Paths,
  languageParam,
  proxyRules,
  routeMatcher,
  routeRules,
} from "utils/layer0RoutesUtils";
import { MarketplaceName } from "types/enums";

const router = new Router();
const NTGPaths = getLayer0Paths(MarketplaceName.NORWAY_TRAVEL_GUIDE);

setupSharedRoutes(router, legacyNTGProxyName as never);

setupDevSharedRoutes(router, legacyNTGProxyName as never);

NTGPaths.forEach(path => router.match(routeMatcher(path), routeRules(ssr)));

// We continue the proxy to the monolith
router.match(`/${languageParam}?cart`, proxyRules(legacyNTGProxyName));

cachedMonolithPages.forEach(path => router.match(path, cachedProxyRules(legacyNTGProxyName)));

router.fallback(proxyRules(legacyNTGProxyName as never));

const destinations = new Router()
  .destination("passthrough", layer0PassthroughRoutes)
  .destination("production", router);

export { router as productionRouter };
export default destinations;
