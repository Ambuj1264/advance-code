import { NextPageContext } from "next";

import { TRAVELSHIFT_EXPERIMENT_COOKIE_NAME } from "utils/constants";
import { getCookie } from "utils/cookieUtils";

export const getOptimizeExperiments = (ctx?: NextPageContext) => {
  const value = getCookie(TRAVELSHIFT_EXPERIMENT_COOKIE_NAME, ctx?.req);
  if (!value) return [];
  return value.split(";").map(cookieSplitValue => {
    const [experimentName, experimentId, variationId] = cookieSplitValue.split(",");
    return {
      experimentId,
      experimentName,
      variationId,
    };
  });
};
