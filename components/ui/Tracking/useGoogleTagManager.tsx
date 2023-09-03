/* eslint-disable no-underscore-dangle */
import { partytownSnippet } from "@builder.io/partytown/integration";
import getConfig from "next/config";
import useDynamicScript from "@travelshift/ui/hooks/useDynamicScript";

import { isProd } from "utils/globalUtils";
import lazyCaptureException from "lib/lazyCaptureException";

const { SERVICE_WORKER_DEV_MODE } = getConfig().publicRuntimeConfig;
const TIMEOUT_MS = 2500;

const useGoogleTagManager = (isGTE: boolean, isGTI: boolean) => {
  const shouldSkipLoading = !isProd() && !SERVICE_WORKER_DEV_MODE;

  useDynamicScript({
    scriptID: "loadscripts-pt",
    src: "/_next/static/loadAnalytics.js",
    tagAttrs: {
      // @ts-ignore: The spec says it's fine to use boolean attributes like checked=checked same as for async
      // https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#boolean-attributes
      defer: "defer",
    },
    isStartLoading: !shouldSkipLoading,
    callback: () => {
      // eslint-disable-next-line consistent-return
      setTimeout(() => {
        if (!window._travelshift?.initAnalytics) {
          return lazyCaptureException(new Error("Failed to load chunk loadAnalytics.js"), {
            componentName: "Analytics",
          });
        }

        window._travelshift.initAnalytics(partytownSnippet, isGTE, isGTI);
      }, TIMEOUT_MS);
    },
  });
};

export default useGoogleTagManager;
