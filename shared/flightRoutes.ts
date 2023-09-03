import { MarketplaceName, PageType } from "../types/enums";

import RouterClass from "./LocaleRouter/Router";
import { ROUTE_NAMES } from "./routeNames";

const marketplacesWithFlights = [
  MarketplaceName.GUIDE_TO_EUROPE,
  MarketplaceName.GUIDE_TO_ICELAND,
  MarketplaceName.GUIDE_TO_THE_PHILIPPINES,
];

const addFlightRoutes = (router: RouterClass) => {
  router
    .add({
      name: ROUTE_NAMES.FLIGHT,
      pattern: `/{flightSearch}/details`,
      marketplace: marketplacesWithFlights,
    })
    .add({
      name: ROUTE_NAMES.FLIGHTPAGE_WITH_SLUG,
      pattern: `/{flightSearch}/:slug/details`,
      page: PageType.FLIGHT,
      marketplace: marketplacesWithFlights,
    })
    .add({
      name: ROUTE_NAMES.FLIGHTPAGE_COUNTRY,
      pattern: `/:country/{flightSearch}/details`,
      page: PageType.FLIGHT,
      marketplace: [MarketplaceName.GUIDE_TO_EUROPE],
    })
    .add({
      name: ROUTE_NAMES.FLIGHTPAGE_COUNTRY_WITH_SLUG,
      pattern: `/:country/{flightSearch}/:slug/details`,
      page: PageType.FLIGHT,
      marketplace: [MarketplaceName.GUIDE_TO_EUROPE],
    })
    .add({
      name: ROUTE_NAMES.FLIGHTSEARCH,
      pattern: `/{flightSearch}`,
      marketplace: marketplacesWithFlights,
    });

  router.add({
    name: ROUTE_NAMES.GTE_FLIGHTSEARCH_WITH_SLUG,
    pattern: `/{flightSearch}/:slug`,
    page: PageType.FLIGHTSEARCH,
    marketplace: marketplacesWithFlights,
  });

  // Ideally routes below are GTE-only, but we need to handle them also for GTI,
  // due to faulty routes in CMS which we need to redirect
  router
    .add({
      name: ROUTE_NAMES.FLIGHTSEARCH_COUNTRY,
      pattern: `/:country/{flightSearch}`,
      page: PageType.FLIGHTSEARCH,
      marketplace: marketplacesWithFlights,
    })
    .add({
      name: ROUTE_NAMES.FLIGHTSEARCH_COUNTRY_WITH_SLUG,
      pattern: `/:country/{flightSearch}/:slug`,
      page: PageType.FLIGHTSEARCH,
      marketplace: marketplacesWithFlights,
    });

  return router;
};

export default addFlightRoutes;
