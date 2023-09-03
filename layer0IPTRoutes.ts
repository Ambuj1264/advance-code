import { Router } from "@layer0/core/router";

import layer0PassthroughRoutes from "./layer0PassthroughRoutes";
import { gteSsr } from "./cache";
import { MarketplaceName } from "./types/enums";

import { setupSharedRoutes } from "layer0ProductionSharedRoutes";
import { setupDevSharedRoutes } from "layer0DevSharedRoutes";
import { cachedMonolithPages, legacyIPTProxyName } from "layer0RoutesConstants";
import { cachedProxyRules, getLayer0Paths, proxyRules, routeRules } from "utils/layer0RoutesUtils";

const paths = getLayer0Paths(MarketplaceName.ICELAND_PHOTO_TOURS);

const router = new Router();

setupSharedRoutes(router, legacyIPTProxyName as never);

setupDevSharedRoutes(router, legacyIPTProxyName as never);

paths.forEach(path => router.match({ path }, routeRules(gteSsr)));

cachedMonolithPages.forEach(path => router.match(path, cachedProxyRules(legacyIPTProxyName)));

router.fallback(proxyRules(legacyIPTProxyName as never));

const destinations = new Router()
  .destination("passthrough", layer0PassthroughRoutes)
  .destination("production", router);

export { router as productionRouter };
export default destinations;
