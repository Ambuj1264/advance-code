import { Router } from "@layer0/core/router";

import layer0PassthroughRoutes from "./layer0PassthroughRoutes";
import { MarketplaceName, SupportedLanguages } from "./types/enums";
import { gteSsr } from "./cache";

import { setupSharedRoutes } from "layer0ProductionSharedRoutes";
import { setupDevSharedRoutes } from "layer0DevSharedRoutes";
import { cachedMonolithPages, legacyGTTPProxyName } from "layer0RoutesConstants";
import { cachedProxyRules, getLayer0Paths, proxyRules, routeRules } from "utils/layer0RoutesUtils";

const router = new Router();
const paths = getLayer0Paths(MarketplaceName.GUIDE_TO_THE_PHILIPPINES);

// redirect all languages to english
const langsRegex = Object.values({ ...SupportedLanguages }).join("|");
router.match(`/(${langsRegex})`, ({ redirect }) => redirect("/", { statusCode: 302 }));
router.match(`/(${langsRegex})/:path*`, ({ redirect }) => redirect("/:path", { statusCode: 302 }));

setupSharedRoutes(router, legacyGTTPProxyName as never);

setupDevSharedRoutes(router, legacyGTTPProxyName as never);

paths.forEach(path => router.match({ path }, routeRules(gteSsr)));

cachedMonolithPages.forEach(path => router.match(path, cachedProxyRules(legacyGTTPProxyName)));

router.fallback(proxyRules(legacyGTTPProxyName as never));

const destinations = new Router()
  .destination("passthrough", layer0PassthroughRoutes)
  .destination("production", router);

export { router as productionRouter };
export default destinations;
