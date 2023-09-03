import { Operation } from "apollo-link";
import Router from "next/router";

import {
  asPathWithoutQueryParams,
  extractPageTypeFromRoute,
  normalizePathForSurrogateKeys,
} from "../utils/routerUtils";

const surrogateKeyCharsLimit = 512; // around 2kb of text

// These queries are global queries which are used on all pages, purging them will require a global cache purge
const globalOperationNames = [
  "newFooterQuery",
  "appQuery",
  "defaultCountryQuery",
  "topServicesQuery",
];

export const prepareSurrogateKeyStr = (key?: string) => {
  let result: string | undefined = key;
  if (!key) return key;

  // chars limit
  result = key.length >= surrogateKeyCharsLimit ? key.substring(0, surrogateKeyCharsLimit) : key;
  // replace extra spaces
  result = result.replace(/ +/g, " ");
  // replace special chars
  result = result.replace(/https:\/\/|[`~!@#$%^&*()+{}[\]\\|,.?;':"]/g, "-");

  return result.trim();
};

export const constructBaseSurrogateKeys = (
  pagePath: string,
  currentRequestUrl: string,
  nextRoute: string,
  localeCode: string,
  operationName?: string
) => {
  const normalizedPath = normalizePathForSurrogateKeys(
    pagePath,
    currentRequestUrl?.includes("guidetoiceland")
  );

  const marketplace = currentRequestUrl?.replace("https://", "");
  const normalizedAsPath = asPathWithoutQueryParams(normalizedPath);
  const isNonGlobalOperation = operationName && !globalOperationNames.includes(operationName);
  const route = nextRoute ? extractPageTypeFromRoute(nextRoute) : "";
  const extraSurrogateKeys =
    isNonGlobalOperation || !operationName
      ? [
          route,
          route ? `${route}-${marketplace}` : "",
          route ? `${route}-${marketplace}-${localeCode}` : "",
          normalizedPath,
          normalizedPath !== normalizedAsPath ? normalizedAsPath : undefined,
          operationName ? `${operationName}-${marketplace}` : "",
          operationName ? `${operationName}-${marketplace}-${localeCode}` : "",
          localeCode ? `${localeCode}-${marketplace}` : "",
        ]
      : [];

  // note: APP_VERSION cannot be destructured(DefinePlugin / env next)
  return [...extraSurrogateKeys, localeCode, currentRequestUrl, `${process.env.APP_VERSION}`]
    .filter(Boolean)
    .join(" ");
};

export const constructClientApiSurrogateKeys = ({
  operation,
  currentRequestUrl,
  localeCode,
  skipUniqueId,
  ssrUrl,
  ssrRoute,
}: {
  operation: Operation;
  currentRequestUrl: string;
  localeCode: string;
  skipUniqueId?: boolean;
  ssrUrl?: string;
  ssrRoute?: string;
}) => {
  let requestUniqueId = "";
  try {
    if (!skipUniqueId && Object.keys(operation.variables).length > 0) {
      requestUniqueId = encodeURIComponent(
        `${operation.operationName}-${JSON.stringify(operation.variables).replace(
          /[ {}()"\\]+/gi,
          ""
        )}`
      );
    }
    // eslint-disable-next-line no-empty
  } catch {}

  let serverSurrogateKeys;
  let clientSurrogateKeys;

  if (typeof window !== "undefined") {
    clientSurrogateKeys = `clientapi ${constructBaseSurrogateKeys(
      window.location.pathname + window.location.search,
      currentRequestUrl,
      Router.route,
      localeCode,
      operation.operationName
    )} ${requestUniqueId} ${operation.operationName}`;
  } else {
    const ssrSurrogateKeys = constructBaseSurrogateKeys(
      ssrUrl || "",
      currentRequestUrl,
      ssrRoute || "",
      localeCode,
      operation.operationName
    );
    serverSurrogateKeys = `clientapi ${ssrSurrogateKeys} ${requestUniqueId} ${operation.operationName}`;
  }

  return {
    serverSurrogateKeys: prepareSurrogateKeyStr(serverSurrogateKeys) as string,
    clientSurrogateKeys: prepareSurrogateKeyStr(clientSurrogateKeys) as string,
  };
};
