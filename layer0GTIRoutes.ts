import { Router } from "@layer0/core/router";

import layer0PassthroughRoutes from "./layer0PassthroughRoutes";
import layer0CartExperimentRoutes from "./layer0CartExperimentRoutes";

import { setupSharedRoutes } from "layer0ProductionSharedRoutes";
import { setupDevSharedRoutes } from "layer0DevSharedRoutes";
import { ssr } from "cache";
import { cachedMonolithPages, legacyGTIProxyName } from "layer0RoutesConstants";
import {
  cachedProxyRules,
  createCartExperimentHandler,
  getFacebookMatch,
  proxyRules,
  getLayer0Paths,
  routeRules,
} from "utils/layer0RoutesUtils";
import { MarketplaceName } from "types/enums";

const router = new Router();
const paths = getLayer0Paths(MarketplaceName.GUIDE_TO_ICELAND);

router.match(
  { path: "/(zh|zh_CN)/:path*", headers: { host: /guidetoiceland/ } },
  ({ compute, redirect }) => {
    compute(() => redirect("https://cn.guidetoiceland.is/:path"));
  }
);

router.match({ path: "/:path*", headers: { host: /cn\./ } }, ({ request, setRequestHeader }) => {
  setRequestHeader("Force-Locale", "zh_CN");
  // eslint-disable-next-line functional/immutable-data
  request.url = request.url.replace(/\//, "/zh/");
});

router.match({ path: "/is/:path*" }, ({ compute, redirect }) => {
  compute(() => redirect("/:path", { statusCode: 302 }));
});

createCartExperimentHandler("1", router);

setupSharedRoutes(router, legacyGTIProxyName as never);

setupDevSharedRoutes(router, legacyGTIProxyName as never);

// currently we have only flight routes under paths var
paths.forEach(path => router.match({ path }, routeRules(ssr)));

// HTTP/HTTPS pass-through for Facebook
router.match(getFacebookMatch(), cachedProxyRules(legacyGTIProxyName as never));

cachedMonolithPages.forEach(path => router.match(path, cachedProxyRules(legacyGTIProxyName)));
router.fallback(proxyRules(legacyGTIProxyName as never));

const destinations = new Router()
  .destination("passthrough", layer0PassthroughRoutes)
  .destination("experiments", layer0CartExperimentRoutes)
  .destination("production", router);

export { router as productionRouter };
export default destinations;
