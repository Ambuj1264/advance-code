import { Router } from "@layer0/core/router";

import layer0PassthroughRoutes from "./layer0PassthroughRoutes";

import { gteSsr } from "cache";
import { setupSharedRoutes } from "layer0ProductionSharedRoutes";
import { cachedMonolithPages, legacyGTEProxyName } from "layer0RoutesConstants";
import {
  cachedProxyRules,
  proxyRules,
  routeMatcher,
  routeRules,
  sitemapProxyRules,
  staticAssetsRules,
  redirectGTELangs,
  redirectWrongCountryUrl,
  getLayer0Routes,
  redirectOldRoutes,
  redirectArticleAttractionCategories,
} from "utils/layer0RoutesUtils";
import { MarketplaceName } from "types/enums";

const router = new Router();
const GTERoutes = getLayer0Routes(MarketplaceName.GUIDE_TO_EUROPE);

router
  .match(
    routeMatcher("/res/global/img/favicons/default/favicon.ico"),
    staticAssetsRules(".next/static/icons/gte-travelmarketplaces-com-favicon-16x16.png")
  )
  .match({ path: "/sitemap-:param" }, sitemapProxyRules());

redirectGTELangs(router);
redirectWrongCountryUrl(router);
redirectOldRoutes(router);
redirectArticleAttractionCategories(router);

setupSharedRoutes(router, legacyGTEProxyName as never);

[...GTERoutes.entries()].map(([path, route]) =>
  router.match(routeMatcher(path), routeRules(gteSsr, route.name))
);

cachedMonolithPages.forEach(path => router.match(path, cachedProxyRules(legacyGTEProxyName)));

router.fallback(proxyRules(legacyGTEProxyName as never));

const destinations = new Router()
  .destination("passthrough", layer0PassthroughRoutes)
  .destination("production", router);

export { router as gteProductionRouter };
export default destinations;
