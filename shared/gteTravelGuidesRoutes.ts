import { MarketplaceName, PageType } from "../types/enums";

import RouterClass from "./LocaleRouter/Router";
import { ROUTE_NAMES } from "./routeNames";

const addGteTravelGuidesRoutes = (router: RouterClass) => {
  router
    .add({
      name: ROUTE_NAMES.TRAVEL_GUIDE_DESTINATION,
      page: PageType.TRAVEL_GUIDE_DESTINATION,
      pattern: "/:country/destinations/:slug",
      marketplace: [MarketplaceName.GUIDE_TO_EUROPE],
    })
    .add({
      name: ROUTE_NAMES.TRAVEL_GUIDE_LANDING,
      page: PageType.TRAVEL_GUIDE_LANDING,
      pattern: "/destinations",
      marketplace: [MarketplaceName.GUIDE_TO_EUROPE],
    })
    .add({
      name: ROUTE_NAMES.TRAVEL_GUIDE_LANDING_COUNTRY,
      page: PageType.TRAVEL_GUIDE_LANDING,
      pattern: "/:country/destinations",
      marketplace: [MarketplaceName.GUIDE_TO_EUROPE],
    })
    // old routes to redirect correctly..
    .add({
      name: `deprecated${ROUTE_NAMES.TRAVEL_GUIDE_DESTINATION}`,
      page: PageType.TRAVEL_GUIDE_DESTINATION,
      pattern: "/:country/best-places/destinations/:slug",
      marketplace: [MarketplaceName.GUIDE_TO_EUROPE],
    })
    .add({
      name: `deprecated${ROUTE_NAMES.TRAVEL_GUIDE_LANDING}`,
      page: PageType.TRAVEL_GUIDE_LANDING,
      pattern: "/best-places/destinations",
      marketplace: [MarketplaceName.GUIDE_TO_EUROPE],
    })
    .add({
      name: `deprecated${ROUTE_NAMES.TRAVEL_GUIDE_LANDING_COUNTRY}`,
      page: PageType.TRAVEL_GUIDE_LANDING,
      pattern: "/:country/best-places/destinations",
      marketplace: [MarketplaceName.GUIDE_TO_EUROPE],
    });
};
export default addGteTravelGuidesRoutes;
