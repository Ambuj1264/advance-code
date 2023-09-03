// eslint-disable-next-line functional/immutable-data, no-return-assign
import { ServerResponse, IncomingMessage } from "http";

import { ApolloClient } from "apollo-client";
import { NextPageContext } from "next";
import { parseUrl, stringify } from "use-query-params";

import GetRedirectUrlQuery from "../GetRedirectUrlQuery.graphql";
import RedirectsQuery from "../RedirectsQuery.graphql";

import {
  asPathWithoutQueryParams,
  getRedirectSurrogateKeysHeader,
  removeEnCnLocaleCode,
} from "utils/routerUtils";
import {
  constructGtiCnRelativeUrl,
  getLanguageFromContext,
  getMarketplaceFromCtx,
  isGtiCn,
  urlWithChineseLocale,
} from "utils/apiUtils";
import { Marketplace, SupportedLanguages } from "types/enums";
import { getCoreMarketPlace } from "utils/helperUtils";

const constructRedirectUrlWithQuery = (requestUrl: string, redirectUrl = "") => {
  const { query: redirectQuery = {} } = parseUrl(redirectUrl);
  const redirectQueryString = stringify(redirectQuery);

  if (redirectQueryString) {
    return redirectUrl;
  }

  const { query: reqQuery = {} } = parseUrl(requestUrl);
  const reqQueryString = stringify(reqQuery);

  return reqQueryString ? `${redirectUrl}?${reqQueryString}` : redirectUrl;
};

export const redirectHandler = ({
  data,
  req,
  res,
  fallbackStatusCode,
  locale,
}: {
  data?: { url?: string; code?: number | string };
  req?: IncomingMessage;
  res?: ServerResponse;
  fallbackStatusCode: number;
  locale: string;
}) => {
  const redirectUrl = data?.url
    ? removeEnCnLocaleCode(data.url, locale, data.url.startsWith("http"))
    : undefined;
  let statusCode = fallbackStatusCode;

  if (redirectUrl && res) {
    if (req?.url !== redirectUrl && data?.code) {
      statusCode = Number(data.code);
    } else {
      statusCode = 404;
    }
  }

  const formattedRedirectUrl =
    redirectUrl && req?.url ? constructRedirectUrlWithQuery(req.url, redirectUrl) : undefined;

  return { statusCode, redirectUrl: formattedRedirectUrl };
};

// eslint-disable-next-line no-return-assign
const changeStatusCode = (res: ServerResponse, statusCode: number) =>
  // eslint-disable-next-line functional/immutable-data
  res && !res.headersSent && (res.statusCode = statusCode);

const emptyRedirectQueryData = {
  data: null,
};

export const normalizeRedirectQueriesData = (
  queriesData: {
    data?: {
      getRedirectUrl?: { url: string; code: number } | null;
      redirects?: { to: string; code: number }[];
    } | null;
  }[]
) => {
  return queriesData.map(({ data } = { data: {} }) => ({
    url: data?.getRedirectUrl?.url || data?.redirects?.[0]?.to,
    code: data?.getRedirectUrl?.code || data?.redirects?.[0]?.code,
  }));
};

export const redirectCheck = async (
  apollo: ApolloClient<unknown>,
  ctx: NextPageContext,
  fallbackStatusCode: number
) => {
  const marketplace = getMarketplaceFromCtx(ctx);
  const language = getLanguageFromContext(ctx) as SupportedLanguages;

  const requestUrl = ctx?.req?.url ?? "";
  const normalizedReqUrl = urlWithChineseLocale(requestUrl);
  const normalizedAsPathWithoutQuery = asPathWithoutQueryParams(normalizedReqUrl);
  const asPathWithoutQuery = asPathWithoutQueryParams(requestUrl);

  const redirectUrlQueryVariable = isGtiCn(marketplace, language)
    ? constructGtiCnRelativeUrl(normalizedAsPathWithoutQuery, language)
    : normalizedAsPathWithoutQuery;

  const returnValue = await Promise.all([
    ...(marketplace !== Marketplace.GUIDE_TO_EUROPE
      ? [
          apollo
            .query({
              query: GetRedirectUrlQuery,
              variables: {
                url: redirectUrlQueryVariable,
              },
            })
            .catch(() => emptyRedirectQueryData),
        ]
      : []),
    apollo
      .query({
        query: RedirectsQuery,
        variables: {
          url: decodeURIComponent(asPathWithoutQuery),
          marketplace: getCoreMarketPlace(marketplace),
        },
      })
      .catch(() => emptyRedirectQueryData),
  ])
    .then(normalizeRedirectQueriesData)
    .then(normalizedDataArray => {
      const redirectData =
        normalizedDataArray.filter(normalizedData => Boolean(normalizedData.url))[0] ||
        emptyRedirectQueryData;

      const locale = getLanguageFromContext(ctx);
      const { statusCode, redirectUrl } = redirectHandler({
        data: redirectData,
        fallbackStatusCode,
        req: ctx.req,
        res: ctx.res,
        locale,
      });

      const surrogateKeys = getRedirectSurrogateKeysHeader(
        asPathWithoutQuery,
        statusCode,
        ctx.pathname
      );

      if (redirectUrl && ((ctx?.res && statusCode === 301) || statusCode === 302)) {
        ctx.res!.writeHead(statusCode, {
          Location: redirectUrl,
          ...surrogateKeys,
        });
        ctx.res!.end();
      } else {
        changeStatusCode(ctx.res!, statusCode);
        if (ctx.res && !ctx.res.headersSent) {
          ctx.res.setHeader("x-0-surrogate-key", surrogateKeys["x-0-surrogate-key"]);
        }
      }

      return fallbackStatusCode;
    })
    .catch(() => {
      changeStatusCode(ctx.res!, fallbackStatusCode);
      return fallbackStatusCode;
    });

  return returnValue;
};
