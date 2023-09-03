import React, { useEffect } from "react";
import { useRouter } from "next/router";

import useSession from "hooks/useSession";
import routes from "shared/routes";
import { PAGEVIEW_EVENT_NAME } from "utils/constants";
import { declareDataLayer } from "components/ui/Tracking/declareDataLayer";

export const OnRoutesChangeHandlers = ({
  marketplaceDataLoading,
  marketplaceUrl,
  marketplaceData,
  clientNavRef,
}: {
  marketplaceDataLoading: boolean;
  marketplaceUrl: string;
  marketplaceData?: QueryMarketplaceConfig;
  clientNavRef: React.MutableRefObject<boolean | null>;
}) => {
  const router = useRouter();
  const skip = marketplaceDataLoading || !marketplaceData?.marketplaceConfig;
  const { user, queryCompleted: userQueryCompleted } = useSession(
    marketplaceData?.marketplaceConfig?.marketplace,
    skip
  );

  useEffect(() => {
    const isUserLoggedIn = userQueryCompleted ? user?.id !== undefined : undefined;
    let protectedHandled = false;
    const routeChangeCompleteHandler = (path: string) => {
      declareDataLayer();
      // eslint-disable-next-line functional/immutable-data
      window.dataLayer.push({
        event: PAGEVIEW_EVENT_NAME,
        pagePath: path,
      });
    };
    const beforeHistoryChangehandler = () => {
      if (!clientNavRef.current) {
        // eslint-disable-next-line no-param-reassign
        clientNavRef.current = true;
      }
    };
    const routeChangeStartHandler = (asPath: string) => {
      const match = routes.match(asPath, marketplaceUrl);
      if (!match?.route) return;
      const { isProtected } = match.route;

      if (isUserLoggedIn === undefined && isProtected) {
        // eslint-disable-next-line no-throw-literal
        throw "waiting for user";
      }

      if (isProtected && !protectedHandled && isUserLoggedIn === false) {
        router.events.emit("routeChangeError", {
          protected: true,
          asPath,
        });
        // eslint-disable-next-line no-throw-literal
        throw "protected";
      }

      protectedHandled = false;
    };
    const routeChangeErrorHandler = (e?: { protected: boolean; asPath: string }) => {
      if (e && e.protected) {
        const match = routes.match(e.asPath, marketplaceUrl, true);
        if (!match?.params) return;
        protectedHandled = true;
        router.push(
          {
            pathname: "/auth",
            query: match.query,
          },
          e.asPath
        );
      }
    };

    // Fires pageview event whenever a route is changed on the client
    router.events.on("routeChangeComplete", routeChangeCompleteHandler);
    // set the global flag which is used to disable ssr specific stuff
    router.events.on("beforeHistoryChange", beforeHistoryChangehandler);
    // handle protected routes
    router.events.on("routeChangeError", routeChangeErrorHandler);
    router.events.on("routeChangeStart", routeChangeStartHandler);

    return () => {
      router.events.off("routeChangeComplete", routeChangeCompleteHandler);
      router.events.off("beforeHistoryChange", beforeHistoryChangehandler);
      router.events.off("routeChangeStart", routeChangeStartHandler);
      router.events.off("routeChangeError", routeChangeErrorHandler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientNavRef, user, userQueryCompleted]);

  return null;
};
