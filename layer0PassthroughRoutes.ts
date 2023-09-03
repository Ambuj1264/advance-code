/* eslint-disable no-restricted-syntax */
import { Router } from "@layer0/core/router";

import {
  proxyRules,
  getFacebookMatch,
  getHostMatch,
  getProxyByHost,
} from "./utils/layer0RoutesUtils";
import { legacyGTIProxyName, HostToOriginMap } from "./layer0RoutesConstants";
import { getHostsByOrigin } from "./utils/layer0RoutesAdditionalUtils";

const hostsByOrigin = getHostsByOrigin(HostToOriginMap);
const proxyRouter = new Router();

hostsByOrigin.forEach(host => () => {
  const hostRegExp = new RegExp(host, "i");
  const proxyName = getProxyByHost(host);
  proxyRouter
    // HTTP/HTTPS pass-through for Facebook
    .match(getFacebookMatch(hostRegExp), proxyRules(proxyName))
    .match(getHostMatch(hostRegExp), proxyRules(proxyName));
});

// This is only used for development urls that don't include our marketplaces in the hostname
// This should be the last match in the router
// DO NOT MOVE
proxyRouter
  // HTTP/HTTPS pass-through for Facebook
  .match(getFacebookMatch(), proxyRules(legacyGTIProxyName))
  .fallback(proxyRules(legacyGTIProxyName));

export default proxyRouter;
