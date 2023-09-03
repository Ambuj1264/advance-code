/**
 * This module was copied directly from `next-routes` and then changed
 * to handle locales and translated url tokens.
 */
/* eslint-disable functional/immutable-data */
import { parse } from "url";

import React from "react";
import NextLink from "next/link";
import NextRouter from "next/router";
import i18nextMiddleware from "i18next-http-middleware";

import { i18next, useTranslation } from "../i18n";

import Route from "./Route";

const parseOptions = (name, pattern, page) => {
  if (name instanceof Object) {
    return name;
  }
  if (name[0] === "/") {
    return { name: null, pattern: name, page: pattern };
  }
  return { name, pattern, page };
};

export default class RouterClass {
  constructor({ Link = NextLink, Router = NextRouter } = {}) {
    this.routes = [];
    this.Link = this.getLink(Link);
    this.NextRouter = this.getNextRouter(Router);
  }

  addWithOptions(options) {
    const { name, pattern } = options;
    if (this.findByName(name)) {
      throw new Error(`Route "${name}" already exists`);
    }

    const newRoute = new Route(options);
    this.routes.push(newRoute);
    if (pattern === "/") {
      this.rootRoute = newRoute;
    }

    return this;
  }

  add(...options) {
    return this.addWithOptions(parseOptions(...options));
  }

  setTranslations(translations, defaultLocale) {
    this.defaultLocale = defaultLocale;
    this.translations = translations;
    this.routes.forEach(route => route.setTranslations(translations, defaultLocale));
  }

  findByName(name) {
    if (!name) {
      return null;
    }
    return this.routes.filter(route => route.name === name)[0];
  }

  match(url, marketplaceUrl = "", skipProtected = false) {
    const parsedUrl = parse(url, true);
    const { pathname, query } = parsedUrl;

    return this.routes.reduce(
      (result, route) => {
        if (result.route) {
          return result;
        }
        const params = route.match(pathname);

        if (!params) {
          return result;
        }

        const authRoute = {
          ...result,
          route: { ...route, page: `/auth` },
          params,
          query: {
            i18n: params.i18n,
          },
        };

        if (!process.env.CLOUD9 && route.marketplace) {
          const isMarketplaceSpecificUrl = route.marketplace.some(marketplace =>
            marketplaceUrl.includes(marketplace)
          );
          if (isMarketplaceSpecificUrl) {
            if (route.isProtected && !skipProtected) {
              return authRoute;
            }
            return { ...result, route, params, query: { ...query, ...params } };
          }

          return result;
        }

        if (route.isProtected && !skipProtected) {
          return authRoute;
        }

        return { ...result, route, params, query: { ...query, ...params } };
      },
      { query, parsedUrl, route: null }
    );
  }

  matchLocale(url) {
    const parsedUrl = parse(url, true);
    const { pathname, query } = parsedUrl;

    // Use user locale if provided.
    let { locale } = query;

    // If not, guess the locale from the first path segment.
    // Falling back to defaultLocale.
    if (!locale) {
      const firstPath = pathname.split("/")[1];
      const params = this.rootRoute.match(`/${firstPath}/`);
      locale = params ? params.i18n.locale : this.defaultLocale;
    }
    const translations = this.translations[locale];
    return { parsedUrl, i18n: { locale, translations } };
  }

  findAndGetUrls(nameOrUrl, params, locale) {
    const route = this.findByName(nameOrUrl);

    if (route) {
      return { route, urls: route.getUrls(params, locale), byName: true };
    }
    const { route: matchedRoute, query } = this.match(nameOrUrl);
    const href = matchedRoute ? matchedRoute.getHref(query) : nameOrUrl;
    const urls = { href, as: nameOrUrl };
    return { route: matchedRoute, urls };
  }

  getLocaleHandlers() {
    return [
      (req, res, next) => {
        const { i18n } = this.matchLocale(req.url);
        // Needed for i18next
        req.lng = i18n.locale === "zh_CN" ? "zh" : i18n.locale;
        next();
      },
      i18nextMiddleware.handle(i18next, {
        removeLngFromUrl: false,
      }),
    ];
  }

  getRouteHandler(app, fastify = false) {
    if (!this.rootRoute) {
      throw new Error("Missing root route.");
    }
    if (!this.defaultLocale) {
      throw new Error("Missing translation data in routes.");
    }
    return [
      ...(!fastify ? this.getLocaleHandlers() : []),
      (req, res, next) => {
        // we don't use `staging.` subdomains for route matching
        const urlFrontNormalized = (
          req.headers["x-travelshift-url-front"] ||
          process.env.CLIENT_API_URI ||
          ""
        ).replace("staging.", "");
        const { route, query } = this.match(req.url, urlFrontNormalized);

        if (route) {
          app.render(req, res, route.page, query);
          // Force non matched routes to show the error page
        } else if (!req.url.match(/\.(json|js|png|jpeg|ico)$/)) {
          app.render(req, res, "/_error", query);
        } else {
          next();
        }
      },
    ];
  }

  getNextHandler(app) {
    const nextHandler = app.getRequestHandler();
    return (req, res) => {
      // webpack-hot-middleware checks the req.url so we need this
      // so that the hmr routes are handled correctly
      req.url = req.originalUrl ?? req.url;
      const { parsedUrl } = this.matchLocale(req.url);

      nextHandler(req, res, parsedUrl);
    };
  }

  getLink(Link) {
    return props => {
      const { i18n } = useTranslation();
      const { route, params = {}, to, locale = i18n.language, ...newProps } = props;
      const nameOrUrl = route || to;
      if (nameOrUrl) {
        Object.assign(
          newProps,
          // eslint-disable-next-line react/no-this-in-sfc
          this.findAndGetUrls(nameOrUrl, params, locale).urls
        );
      }
      return React.createElement(Link, newProps);
    };
  }

  getNextRouter(Router) {
    const newRouter = Router;
    const wrap = method => (route, params, options) => {
      const {
        byName,
        urls: { as, href },
      } = this.findAndGetUrls(route, params);
      return Router[method](href, as, byName ? options : params);
    };

    newRouter.pushRoute = wrap("push");
    newRouter.replaceRoute = wrap("replace");
    newRouter.prefetchRoute = wrap("prefetch");
    return newRouter;
  }
}

export const privateParseOptions = parseOptions;
