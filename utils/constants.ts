import { Marketplace } from "../types/enums";

export const oneHourSeconds = 60 * 60;
export const oneDaySeconds = oneHourSeconds * 24;
export const oneWeekSeconds = oneDaySeconds * 7;
export const oneMonthSeconds = oneDaySeconds * 30;

export const PRODUCT_SEARCH_RESULT_LIMIT = 24;
export const PAGEVIEW_EVENT_NAME = "Pageview";
export const intercomConfig = {
  [Marketplace.GUIDE_TO_EUROPE]: "i9kvknw5",
  [Marketplace.GUIDE_TO_ICELAND]: "x23n5hij",
  [Marketplace.GUIDE_TO_THE_PHILIPPINES]: "sgbufds8",
  [Marketplace.ICELAND_PHOTO_TOURS]: "qlocujn3",
  [Marketplace.NORWAY_TRAVEL_GUIDE]: undefined,
};
export const TRAVELSHIFT_EXPERIMENT_COOKIE_NAME = "travelshift_experiments";
export const emptyArray = [] as const as never;
export const SECTIONS_TO_RENDER_ON_SSR = 3;
export const mapboxAccessToken =
  "pk.eyJ1Ijoic2lndXJkdXJndWRiciIsImEiOiJjbDhjeTh6NGIwNTI4M3ZuemQ1cGlrcjlmIn0.Ex3FDde1nJ3HwdiVlEL7JA";
export const GRAPH_ASSETS_URL = "https://media.graphassets.com/";
