import { pipe } from "fp-ts/lib/pipeable";
import { NextPageContext } from "next";
import { fromNullable, getOrElse, map } from "fp-ts/lib/Option";
import { ApolloError } from "apollo-client";
import getConfig from "next/config";

import { isBrowser } from "./helperUtils";
import { isDev as isDevEnv, isDevBranchDeployment } from "./globalUtils";
import {
  cleanAsPath,
  getUrlWithoutTrailingSlash,
  isInsecureLocalDevelopment,
  removeEnCnLocaleCode,
} from "./routerUtils";

import {
  Layer0PageHeaders,
  Marketplace,
  SupportedCurrencies,
  SupportedLanguages,
  TravelshiftCustomHeader,
} from "types/enums";
import lazyCaptureException from "lib/lazyCaptureException";

export const urlWithChineseLocale = (url: string) =>
  url.startsWith("/zh/") || url.endsWith("/zh") ? url.replace("zh", "zh_CN") : url;

export const getCnSubdomainUrl = (url: string, websiteUrl: string, locale: SupportedLanguages) =>
  locale === SupportedLanguages.LegacyChinese || locale === SupportedLanguages.Chinese
    ? `https://cn.guidetoiceland.is${url}`
    : `${websiteUrl}${url}`;

export const prependChineseToGTI = (url: string) =>
  typeof window !== "undefined" && /^https?:\/\/cn\./.test(window.location.href)
    ? `/zh_CN${url}`
    : url;

export const getStrippedUrlPath = (url?: string) =>
  pipe(
    url,
    fromNullable,
    map(u => u.split(/[?#]/)[0]),
    map(u => urlWithChineseLocale(u)),
    map(u => prependChineseToGTI(u)),
    map(u => getUrlWithoutTrailingSlash(u)),
    getOrElse(() => "")
  );

export const getAbsoluteUrl = (request: NextPageContext["req"]) => {
  let protocol = "https:";
  const { host } = request?.headers || { host: "" };
  if (host!.indexOf("localhost") > -1 || host!.indexOf("dev.guidetoiceland") > -1) {
    protocol = "http:";
  }
  return `${protocol}//${host}`;
};

export const formatMarketplace = (marketplace: string) => marketplace.replace("_", "-");

export const urlToRelative = (url: string) => {
  const isAbsoluteUriWithPathName = /^(https|http):\/\/.*\//.test(url);
  const isAbsoluteURI = /^(http|https):\/\//.test(url);

  if (isAbsoluteURI && !isAbsoluteUriWithPathName) {
    return "/";
  }

  return `/${url.replace(/^(?:\/\/|[^/]+)*\//, "")}`;
};

export const getLanguageFromContext = (ctx: NextPageContext) => {
  return pipe(
    ctx.res?.getHeader("x-layer0-locale") ||
      ctx.req?.headers?.["x-ts-locale"] ||
      // @ts-ignore
      (ctx.req?.i18n as any)?.language ||
      (ctx.query?.i18n as any)?.locale ||
      (typeof window !== "undefined" ? window?.__NEXT_DATA__?.props?.initialLanguage : null), // eslint-disable-line
    fromNullable,
    getOrElse(() => SupportedLanguages.English)
  );
};

export type QueryParamsViaLayer0Type = Partial<Record<keyof typeof Layer0PageHeaders, string>>;
export const getQueryParamsViaLayer0 = (
  ctx: NextPageContext,
  clientRouteParams?: { [key: string]: string }
): QueryParamsViaLayer0Type => {
  return Object.entries({ ...Layer0PageHeaders }).reduce(
    (query: QueryParamsViaLayer0Type, [enumParam, header]) => {
      const queryValue =
        ctx.res?.getHeader(header) ||
        ctx.query?.[enumParam] ||
        // eslint-disable-next-line no-underscore-dangle
        (isBrowser &&
          (window.__NEXT_DATA__.props?.pageProps[enumParam] || clientRouteParams?.[enumParam]));
      if (!queryValue) {
        return query;
      }
      return {
        ...query,
        [enumParam]: decodeURIComponent(queryValue),
      };
    },
    {}
  );
};

export const getSlugFromContext = (ctx: NextPageContext) => {
  const { slug, category } = getQueryParamsViaLayer0(ctx);
  return (slug || category) as string;
};

// We currently have a multiple authentication system. Adding this header helps the backend check with the
// monolith if the user is indeed an admin, so they do not have to wait between every authorization request.
// Only used in some specific queries in the admin tool as of March 2023.
export const monolithAuthVerificationHeaders = {
  "x-travelshift-authenticate": true,
};

export const noCacheHeaders = {
  [TravelshiftCustomHeader.SKIP_CACHE]: true,
};

export const backendControlledCacheHeaders = {
  [TravelshiftCustomHeader.BACKEND_CONTROLLED_CACHE]: true,
};

export const shortCacheHeaders = {
  [TravelshiftCustomHeader.SHORT_CACHE]: true,
  "x-sw-cache-control": 60 * 30,
};

export const longCacheHeaders = {
  [TravelshiftCustomHeader.LONG_CACHE]: true,
};

export const cacheOnClient30M = {
  ...noCacheHeaders,
  "x-sw-cache-control": 60 * 30,
};

export const getClientApiHeaders = ({ locale, url }: { locale?: string; url: string }) => {
  const [protocol, uri] = url.split("://");
  return {
    "x-travelshift-language": locale || "en",
    "x-travelshift-url-front":
      // Special case because monolith does not send correct request url for prod environments
      ((url?.includes("guidetoiceland") && !url.includes("cn.")) || url?.includes("traveldev")) &&
      locale === "zh_CN"
        ? `${protocol}://cn.${uri}`
        : url,
  };
};

const { CLIENT_API_URI, CLIENT_API_PROTOCOL, INTERNAL_CLIENTAPI_URI, isServerless } =
  getConfig().publicRuntimeConfig;

export const getClientApiUri = ({
  // eslint-disable-next-line @typescript-eslint/no-shadow
  isBrowser,
  currentRequestUrl = `${CLIENT_API_PROTOCOL}://${CLIENT_API_URI}`,
  internalUri = INTERNAL_CLIENTAPI_URI,
  absoluteUrl,
  isServerlessEnv = isServerless,
  isDev = isDevEnv() || isDevBranchDeployment(),
}: {
  isBrowser: boolean;
  currentRequestUrl?: string;
  internalUri?: string;
  absoluteUrl?: string;
  isServerlessEnv?: boolean;
  isDev?: boolean;
}) => {
  const isClientHostMismatch = isBrowser && !absoluteUrl?.includes(window.location.hostname);

  if (isBrowser && (isClientHostMismatch || isDev)) return "/client-api";
  if (isServerlessEnv && absoluteUrl) return `${absoluteUrl}/client-api`;
  return internalUri || `${currentRequestUrl}/client-api`;
};

export const isApolloErrorTimeout = (res: Response) =>
  res instanceof ApolloError && res.message?.toLowerCase().includes("timeout");

export const getMarketplaceUrl = (ctx: NextPageContext): string =>
  ctx?.req?.headers?.["x-travelshift-url-front"] ||
  (typeof window !== `undefined` && window.__NEXT_DATA__.props?.currentRequestUrl) ||
  `https://${CLIENT_API_URI}`;

export const getMarketplaceFromUrl = (url: string) => {
  if (!url) return Marketplace.GUIDE_TO_ICELAND;

  if (url.includes("guidetoeurope")) return Marketplace.GUIDE_TO_EUROPE;
  if (url.includes("guidetothephilippines")) return Marketplace.GUIDE_TO_THE_PHILIPPINES;
  if (url.includes("iceland-photo-tours")) return Marketplace.ICELAND_PHOTO_TOURS;
  if (url.includes("norwaytravelguide")) return Marketplace.NORWAY_TRAVEL_GUIDE;
  return Marketplace.GUIDE_TO_ICELAND;
};

export const getCurrencyFromMarketPlace = (marketplace: Marketplace) => {
  switch (marketplace) {
    case Marketplace.GUIDE_TO_ICELAND:
      return SupportedCurrencies.UNITED_STATES_DOLLAR;
    case Marketplace.GUIDE_TO_EUROPE:
      return SupportedCurrencies.EURO;
    default:
      return SupportedCurrencies.ICELANDIC_KRONA;
  }
};

export const getMarketplaceFromCtx = (ctx: NextPageContext): Marketplace => {
  const url = getMarketplaceUrl(ctx);

  return getMarketplaceFromUrl(url);
};

export const getCountryCodeFromResponseHeader = async (
  marketplaceUrl: string,
  host?: string
): Promise<string | undefined> => {
  let countryCode;
  if (host) {
    const protocol = isInsecureLocalDevelopment ? "http" : "https";
    const encodedEndpointURI = encodeURI(
      `query=query marketplaceUrlQuery($url: String!){marketplaceConfig(where:{url: $url},stage:DRAFT){url}}&operationName=marketplaceUrlQuery&variables={"url": "${marketplaceUrl}"}`
    );
    countryCode = await fetch(`${protocol}://${host}/client-api?${encodedEndpointURI}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(longCacheHeaders as unknown as HeadersInit),
      },
    })
      .then(res => res.headers.get("x-travelshift-country-code") || undefined)
      .catch(e => {
        lazyCaptureException(new Error("Error while fetching marketplaceUrlResponse."), {
          errorInfo: e,
        });
        return undefined;
      });
  }
  return countryCode;
};

export const shouldSkipBreadcrumbsQuery = ({
  slug,
  type,
  id,
}: {
  slug?: string;
  type?: string;
  id?: number;
}) => {
  if (type && !slug && id === undefined) {
    return true;
  }

  return false;
};

export const isGtiCn = (marketplace: Marketplace, activeLocale: SupportedLanguages) => {
  return (
    marketplace === Marketplace.GUIDE_TO_ICELAND &&
    (activeLocale === SupportedLanguages.Chinese ||
      activeLocale === SupportedLanguages.LegacyChinese)
  );
};

export const constructGtiCnRelativeUrl = (
  asPath: string,
  activeLocale: SupportedLanguages,
  shouldCleanAsPath = false
) => {
  return `/${removeEnCnLocaleCode(
    shouldCleanAsPath ? cleanAsPath(asPath) : asPath,
    activeLocale
  )}`.replace("//", "/");
};

export const constructGtiCnCanonicalUrl = ({
  marketplace,
  activeLocale,
  marketplaceUrl,
  asPath,
  shouldCleanAsPath = false,
  defaultNonGtiCnCanonicalUrl,
  alternateGtiCnCanonicalUrl,
}: {
  marketplace: Marketplace;
  activeLocale: SupportedLanguages;
  marketplaceUrl: string;
  asPath: string;
  shouldCleanAsPath?: boolean;
  defaultNonGtiCnCanonicalUrl: string;
  alternateGtiCnCanonicalUrl?: string;
}) => {
  if (isGtiCn(marketplace, activeLocale)) {
    if (alternateGtiCnCanonicalUrl) return alternateGtiCnCanonicalUrl;

    const relativeCanonicalStrippedLang = constructGtiCnRelativeUrl(
      asPath,
      activeLocale,
      shouldCleanAsPath
    );
    return getCnSubdomainUrl(relativeCanonicalStrippedLang, marketplaceUrl, activeLocale);
  }

  return defaultNonGtiCnCanonicalUrl;
};
