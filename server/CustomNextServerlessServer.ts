import nonWebpackRequire from "@layer0/core/utils/nonWebpackRequire";
import { REMOVE_HEADER_VALUE } from "@layer0/next/router/constants";
import type { Options } from "next/dist/server/base-server";
import type NextServerType from "next/dist/server/next-server";
import type { Route } from "next/dist/server/router";

import { getCnLocaleFromUri } from "../shared/LocaleRouter/localeRouterUtils";

import clientRouter from "shared/routes";
import { Layer0PageHeaders } from "types/enums";

// region runtime imports
const NextServer = nonWebpackRequire("next/dist/server/next-server").default;
// endregion runtime imports

export const tempPageNameHeader = "x-travelshift-page";

const layer0HeadersEntries = Object.entries({ ...Layer0PageHeaders });

export default class CustomNextServerlessServer extends (NextServer as typeof NextServerType) {
  private clientApiUrl: string;

  constructor(options: Options, clientApiUrl: string) {
    super(options);
    this.clientApiUrl = clientApiUrl;
  }

  protected generateRoutes() {
    const originalRoutes = super.generateRoutes();
    const customRouterRoute: Route = {
      match: pathname => clientRouter.match(pathname, this.clientApiUrl),
      type: "route",
      name: "catchall custom",
      fn: async (req, res, matchParams, parsedCheckerUrl) => {
        const urlFront = (req.headers["x-travelshift-url-front"] || this.clientApiUrl) as string;
        const { query, route, parsedUrl } = matchParams;

        // TODO: not sure this is needed
        if (!route) {
          await this.render404(req, res, parsedUrl);
          return {
            finished: true,
          };
        }

        const pageToRender: string = route.page;
        const locale = getCnLocaleFromUri(query.i18n.locale, urlFront);
        res.setHeader("x-layer0-locale", locale);
        res.setHeader("X-Frame-Options", "sameorigin");
        res.setHeader("Content-Security-Policy", "frame-ancestors 'self'");
        res.setHeader(tempPageNameHeader, pageToRender);

        // eslint-disable-next-line functional/immutable-data
        req.headers["x-matched-path"] = pageToRender;

        res.setHeader("Cache-Control", route.isProtected ? "private" : REMOVE_HEADER_VALUE);

        layer0HeadersEntries.forEach(([enumParam, header]) => {
          const param = enumParam;

          if (query[param]) {
            res.setHeader(header, encodeURI(query[param]));
          }
        });

        await this.render(req, res, pageToRender, parsedCheckerUrl?.query, parsedUrl, true);

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
