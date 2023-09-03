import React, { useEffect } from "react";

// eslint-disable-next-line import/no-unresolved
import layer0StatusCodes, { Layer0StatusCodesType } from "./layer0StatusCodes";

import { fetchPageQueries } from "lib/apollo/withApolloClient";
import { SupportedLanguages } from "types/enums";
import initApollo from "lib/apollo/initApollo";
import { Namespaces } from "shared/namespaces";
import { captureException } from "lib/sentry";
import ErrorPage from "pages/_error";
import { getCookie, setCookie } from "utils/cookieUtils";

const isHttpErrorCode = (errorCode: string) =>
  parseInt(errorCode, 10) >= 500 && parseInt(errorCode, 10) <= 529;

export const StaticErrorPage = (props: any) => {
  useEffect(() => {
    const [l0StatusCode, l0RequestId, l0Status] = getCookie("error-context").split(" // ");
    const defaultStatusMessage = "Upstream server error";
    const statusMessage = isHttpErrorCode(l0StatusCode)
      ? defaultStatusMessage
      : layer0StatusCodes[l0StatusCode as Layer0StatusCodesType];
    const fullStatusCode = `${l0StatusCode} - ${statusMessage}`;

    captureException(new Error(`Serverless error: ${fullStatusCode}`), {
      forceSSR: true,
      res: { statusCode: fullStatusCode },
      errorInfo: {
        url: window.location.href,
        query: window.location.search,
        pathname: window.location.pathname,
        marketplace: window.location.host,
        method: "GET",
        headers: {
          "x-request-id": l0RequestId,
          "x-0-status": l0Status,
        },
      },
    });

    setCookie("error-context", "", -1000);
  }, []);

  return <ErrorPage {...props} />;
};

export const getErrorPageStaticProps = (clientApiUri: string) => async () => {
  const locale = SupportedLanguages.English;
  const currentRequestUrl = `https://${clientApiUri}`;
  const pageSurrogateKeys = `error ${locale} /error`;
  const ctx = {
    asPath: `${currentRequestUrl}/error`,
    req: {
      url: currentRequestUrl,
      headers: { "x-travelshift-url-front": currentRequestUrl },
    },
    query: { currentRequestUrl },
  };
  const apollo = initApollo(
    null,
    locale,
    currentRequestUrl,
    null,
    undefined,
    "",
    `${pageSurrogateKeys} clientapi`,
    currentRequestUrl
  );
  const errorStatusCode = await fetchPageQueries({
    key: "_error",
    pageQueries: [],
    apollo,
    locale,
    ctx,
    shouldManuallyCheckForRedirect: false,
    namespacesRequired: [Namespaces.errorNs, Namespaces.headerNs, Namespaces.footerNs],
    abortController: undefined,
  });
  const apolloState = apollo.cache.extract();

  return {
    props: {
      statusCode: 500,
      namespacesRequired: [Namespaces.errorNs, Namespaces.headerNs, Namespaces.footerNs],
      initialLanguage: locale,
      locale,
      apolloState,
      absoluteUrl: currentRequestUrl,
      currentRequestUrl,
      errorStatusCode: errorStatusCode || null,
      pageSurrogateKeys,
      queries: [],
      redirectCheck: false,
      hidePageFooter: false,
      isTopServicesHidden: true,
      isSubscriptionFormHidden: true,
    },
  };
};
