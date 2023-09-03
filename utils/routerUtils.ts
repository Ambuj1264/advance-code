import {
  encodeQueryParams,
  parseUrl,
  QueryParamConfig,
  stringify,
  StringParam,
} from "use-query-params";
import { pipe } from "fp-ts/lib/pipeable";

import { MarketplaceName, PageType, SupportedLanguages } from "../types/enums";

// TODO: this file should have only relative imports

export const isInsecureLocalDevelopment =
  typeof window !== `undefined`
    ? Boolean(window.location.hostname.match(/^(?!.*\b(?:secure)\b).*\b(?:localhost|dev)\b/))
    : false;

export const asPathWithoutQueryParams = (asPath: string): string => asPath.split("?")[0] || "";

export const getPathWithoutSlashes = (path: string): string => {
  return path.replace(/^\//, "").replace(/\/$/, "");
};

export const getUrlWithoutTrailingSlash = (url: string) => {
  return url.slice(-1) === "/" ? url.slice(0, -1) : url;
};

export const getPathWithoutSections = (path: string) => path.split("#")[0];

export const getPathWithoutSlugAndQueryParams = (path: string) =>
  asPathWithoutQueryParams(path).split("/").slice(0, -1).join("/");

export const omitQueryParamsFromUrl = (urlString: string, skipParams: string[]) => {
  const { url, query = {} } = parseUrl(urlString);
  const finalQuery = { ...query };

  // eslint-disable-next-line functional/immutable-data
  skipParams.forEach(param => delete finalQuery[param]);
  const isFinalQueryEmpty = Object.keys(finalQuery).length === 0;

  return `${url}${!isFinalQueryEmpty ? `?${stringify(finalQuery)}` : ""}`;
};

export const getUrlWithAdditionalQueryParam = ({
  baseUrl,
  param,
  value,
  paramType = StringParam,
}: {
  baseUrl: string;
  param: string;
  value: any;
  paramType?: QueryParamConfig<any, any>;
}) => {
  const { url, query = {} } = parseUrl(baseUrl);
  const encodedParam = encodeQueryParams({ [param]: paramType }, { [param]: value });
  const newQuery = stringify({
    ...query,
    ...encodedParam,
  });

  return `${url}${newQuery ? `?${newQuery}` : ""}`;
};

export const getRootUrl = (localeCode: string) => {
  const code = localeCode.substring(0, 2);
  return code === "zh" || code === "en" ? "/" : `${code}/`;
};

export const removeLocaleFromPath = (url: string, locale?: string) => {
  if (!locale) return url;
  // front page case
  if (url === `/${locale}`) return "/";

  return url.replace(getRootUrl(locale), "");
};

export const cleanAsPath = (
  // eslint-disable-next-line default-param-last
  asPath = "",
  locale?: string
) =>
  pipe(
    asPath,
    asPathWithoutQueryParams,
    path => removeLocaleFromPath(path, locale),
    getPathWithoutSlashes,
    getPathWithoutSections
  );

export const cleanAsPathWithLocale = (asPath = "") =>
  pipe(asPath, asPathWithoutQueryParams, getPathWithoutSections, formattedAsPath =>
    formattedAsPath.length > 1 ? getUrlWithoutTrailingSlash(formattedAsPath) : formattedAsPath
  );

export const prepareGraphCmsAsPath = (
  // eslint-disable-next-line default-param-last
  asPath = "",
  isGTI: boolean
) =>
  pipe(asPath, cleanAsPathWithLocale, url =>
    url.replace(
      isGTI
        ? new RegExp(`/${SupportedLanguages.Chinese}|/${SupportedLanguages.LegacyChinese}`)
        : "",
      ""
    )
  );

export const removeEnCnLocaleCode = (url: string, localeCode: string, isFullUrl = false) => {
  const code = localeCode.substring(0, 2);
  const isEnCn = code === "zh" || code === "en";

  if ((url === localeCode || url === code) && code === "zh") return "";

  return isEnCn ? url.replace(new RegExp(`${isFullUrl ? "" : "^/?"}${code}(_CN)?/`), "") : url;
};

export const removeEnLocaleCode = (url: string, localeCode: string) => {
  const code = localeCode.substring(0, 2);
  const isEn = code === "en";

  if (url === localeCode || url === code) return "";

  return isEn ? url.replace(new RegExp(`^/?${code}?`), "") : url;
};

export const removeLocaleCode = (url: string, localeCode: string) => {
  const code = localeCode.substring(0, 2);

  if (url === localeCode || url === code) return "";

  return url
    .replace(new RegExp(`^/?${SupportedLanguages.Chinese}?`), "")
    .replace(new RegExp(`^/?${code}?`), "");
};

export const getProductSlugFromHref = (url: string) =>
  // eslint-disable-next-line functional/immutable-data
  (url.startsWith("http") ? new URL(url).pathname : asPathWithoutQueryParams(url))
    .split("/")
    .pop() as string;

export const makeAbsoluteLink = (url: string, absoluteUrl: string): string => {
  if (url.startsWith("http")) {
    return url;
  }

  return `${absoluteUrl}/${getPathWithoutSlashes(url)}`;
};

export const joinRoutes = (routes: string[]) => routes.join("|");

export const getTranslatedRoutesFormatted = (translatedRoutes: string[]) =>
  pipe(
    translatedRoutes.map(route => `{${route}}`),
    joinRoutes
  );

export const constructLocalizedUrl = (host: string, activeLocale: SupportedLanguages) => {
  const protocol = isInsecureLocalDevelopment ? "http://" : "https://";
  if (host.includes("cn.") || activeLocale === "en") return `${protocol}${host}`;
  return `${protocol}${host}/${activeLocale}`;
};

export const normalizePathForSurrogateKeys = (asPath: string, isGTI?: boolean) =>
  pipe(
    asPath.replace(/(preview=1&|[?&]preview=1(?!&))/g, ""),
    path => (isGTI ? path.replace("/zh", "") : path),
    getPathWithoutSections
  );

export const extractPageTypeFromRoute = (route: string) => route.split("/")[1] as PageType;

export const getMarketplaceHostWithGTICn = (
  activeLocale: string,
  settingsMarketplaceUrl: string
) => {
  let marketplaceHost;
  try {
    marketplaceHost = new URL(settingsMarketplaceUrl).hostname;
  } catch {
    marketplaceHost = settingsMarketplaceUrl.replace(/https?:\/\/(.*)$/, "$1");
  }

  const isGTI = marketplaceHost.includes(MarketplaceName.GUIDE_TO_ICELAND);

  if (!isGTI) return marketplaceHost;
  if (activeLocale === "zh_CN") return `cn.${marketplaceHost}`;
  return marketplaceHost;
};

export const getRedirectSurrogateKeysHeader = (asPath?: string, status?: number, pathname = "") => {
  const pathKey = asPathWithoutQueryParams(asPath ?? "");
  const route = pathname.replace("/", "");

  return {
    "x-0-surrogate-key": `${pathKey} redirect ${
      status ? `redirect-${status}` : ""
    } RedirectQuery redirectsQuery ${route}`,
  };
};
