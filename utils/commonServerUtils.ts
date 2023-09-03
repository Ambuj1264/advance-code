import fetch from "node-fetch";

import appRouter from "../shared/routes";
import { SupportedLanguages } from "../types/enums";

import { removeLocaleCode } from "./routerUtils";

export const stripWwwFromHost = (url: string) => url.replace(/^www./g, "");

export const stripAmpFromUrl = (url: string) =>
  url.replace(/(amp=1&|[?&]amp=1(?!&)|amp=true&|[?&]amp=true(?!&))/, "");

export const getCorrectCountryUrl = (url: string) => {
  const netherlandsWrongUrl = url.match("/netherlands");
  const ukWrongUrl = url.match("/united-kingdom");
  const ukWrongUrl2 = url.match("/channel-islands");
  const macedoniaWrongUrl = url.match(/\/(north-)?macedonia/);
  if (netherlandsWrongUrl) {
    return url.replace("/netherlands", "/the-netherlands");
  }
  if (ukWrongUrl) {
    return url.replace("/united-kingdom", "/the-united-kingdom");
  }
  if (ukWrongUrl2) {
    return url.replace("/channel-islands", "/the-united-kingdom");
  }
  if (macedoniaWrongUrl) {
    return url.replace(/\/(north-)?macedonia/, "/republic-of-north-macedonia");
  }
  if (url.match("meilleure-voiture-de-location")) {
    return url.replace("meilleure-voiture-de-location", "meilleure-location-de-voiture");
  }
  return url;
};

export const getUnsupportedLangRedirect = async (GTEHost: string, requestUrl: string) => {
  const host = `https://${GTEHost}`;
  const fetchArgs = {
    method: "GET",
    headers: {
      accept: "application/json",
      "x-travelshift-url-front": host,
    },
  };

  let redirectTo = "/";
  const appRoute = appRouter.match(requestUrl, "guidetoeurope");
  const defaultLocale = SupportedLanguages.English;
  const currentRequestLocale = appRoute?.params?.i18n?.country || requestUrl.split("/")[1];

  const monolithLocaleLinksPromise = fetch(
    `${host}/client-api?query=query%20getLocaleLinks(%24url%3AString!)%7BlocaleLinks%3AgetLocaleUrls(url%3A%24url)%7Buri%3Aurl%20locale%7D%7D&operationName=getLocaleLinks&variables=%7B"url"%3A"%2F${encodeURIComponent(
      requestUrl
    )}"%7D`,
    fetchArgs
  )
    .then(res => res.json())
    // eslint-disable-next-line no-console
    .catch(e => console.log(e));
  const graphCMSLandingDataPromise = fetch(
    `${host}/client-api?query=query%20landingPageContentQuery($where:GraphCMSLandingPageWhereInput%20$locale:%5BGraphCMSLocale!%5D!%20$stage:GraphCMSStage=DRAFT)%7BlandingPages(where:$where,locales:$locale,stage:$stage)%7Blocalizations%7Blocale%20metadataUri%7D%7D%7D&operationName=landingPageContentQuery&variables=%7B%22where%22%3A%7B%22metadataUri%22%3A%22${requestUrl}%22%2C%22isDeleted%22%3Afalse%7D%2C%22locale%22%3A%22${currentRequestLocale}%22%7D`,
    fetchArgs
  )
    .then(res => res.json())
    // eslint-disable-next-line no-console
    .catch(e => console.log(e));

  const [monolithLocaleLinks, graphCMSLandingData] = await Promise.all([
    monolithLocaleLinksPromise,
    graphCMSLandingDataPromise,
  ]);

  const graphCMSData = graphCMSLandingData?.data?.landingPages?.[0]?.localizations;
  const linksData =
    (graphCMSData?.length > 0 && graphCMSData) || monolithLocaleLinks?.data?.localeLinks || [];

  const defaultRoute = linksData.find(({ locale }: { locale: string }) => locale === defaultLocale);
  if (defaultRoute) {
    redirectTo = defaultRoute.metadataUri || defaultRoute.uri;
  }

  if (redirectTo === host) {
    redirectTo = removeLocaleCode(requestUrl, currentRequestLocale) || "/";
  }

  return redirectTo;
};
