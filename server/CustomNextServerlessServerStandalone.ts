import type { Options } from "next/dist/server/base-server";
import type NextServerType from "next/dist/server/next-server";
import type { Route } from "next/dist/server/router";
import type { BaseNextRequest } from "next/dist/server/base-http";

import { getCnLocaleFromUri } from "../shared/LocaleRouter/localeRouterUtils";

import { getEnvWithDefaults } from "./serverUtils";
import MarketplaceSpecificRequestHeaders from "./marketplaceSpecificRequestHeaders";

import clientRouter from "shared/routes";

const NextServer = __non_webpack_require__("next/dist/server/next-server").default;

const { RUNTIME_ENV } = getEnvWithDefaults();
const isStagingOrDevBranch = RUNTIME_ENV !== "prod";

export default class CustomNextServerlessServer extends (NextServer as typeof NextServerType) {
  private clientApiUrl: string;

  private dev = false;

  constructor(options: Options, clientApiUrl: string) {
    super(options);
    this.clientApiUrl = clientApiUrl;
    this.dev = options.dev ?? false;
  }

  private getUrlFront(req: BaseNextRequest) {
    // branch deployments
    const urlFrontHeader = req?.headers[MarketplaceSpecificRequestHeaders.URL_FRONT] as string;
    if (this.dev || isStagingOrDevBranch) {
      // we don't use `staging.` subdomains for route matching
      return (urlFrontHeader || this.clientApiUrl || "").replace("staging.", "");
    }
    // prod
    return urlFrontHeader || req.headers.host || this.clientApiUrl;
  }

  protected generateRoutes() {
    const originalRoutes = super.generateRoutes();
    const customRouterRoute: Route = {
      // @ts-ignore, see patches/next+12.3.3 patch
      match: (pathname, req) => {
        const urlFront = this.getUrlFront(req);
        return clientRouter.match(pathname, urlFront);
      },
      type: "route",
      name: "catchall custom",
      fn: async (req, res, matchParams, parsedCheckedUrl) => {
        const urlFront = this.getUrlFront(req);
        const { query, route, parsedUrl } = matchParams;

        if (!route) {
          await this.render404(req, res, parsedUrl);
          return {
            finished: true,
          };
        }

        const pageToRender: string = route.page;
        const locale = getCnLocaleFromUri((parsedCheckedUrl?.query?.i18n as any)?.locale, urlFront);
        res.setHeader("x-travelshift-locale", locale);
        res.setHeader("X-Frame-Options", "sameorigin");
        res.setHeader("Content-Security-Policy", "frame-ancestors 'self'");

        if (route.isProtected) {
          res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
        }

        // eslint-disable-next-line no-promise-executor-return
        await this.render(
          req,
          res,
          pageToRender,
          { ...parsedCheckedUrl?.query, ...query },
          parsedUrl,
          true
        );

        return {
          finished: true,
        };
      },
    };

    return {
      ...originalRoutes,
      redirects: [],
      fsRoutes: [...originalRoutes.fsRoutes, customRouterRoute],
    };
  }
}
