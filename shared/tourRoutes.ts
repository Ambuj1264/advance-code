import { MarketplaceName, PageType } from "../types/enums";

import RouterClass from "./LocaleRouter/Router";
import { ROUTE_NAMES } from "./routeNames";

const monolithTourMarketplaces = [
  MarketplaceName.GUIDE_TO_ICELAND,
  MarketplaceName.GUIDE_TO_THE_PHILIPPINES,
  MarketplaceName.NORWAY_TRAVEL_GUIDE,
  MarketplaceName.ICELAND_PHOTO_TOURS,
];

const addTourRoutes = (router: RouterClass) =>
  router
    .add({
      name: ROUTE_NAMES.TOURSEARCH_LEGACY,
      pattern:
        "/({tourSearchLegacy}|{tourSearchLegacyGreenland}|{tourSearch}|process/tours/search)",
      page: PageType.TOURSEARCH,
      marketplace: monolithTourMarketplaces,
    })
    .add({
      name: ROUTE_NAMES.TOURCATEGORY_LEGACY,
      pattern: "/{tourSearchLegacy}/:category/:slug?",
      page: PageType.TOURCATEGORY,
      marketplace: monolithTourMarketplaces,
    })
    .add({
      name: ROUTE_NAMES.TOURCATEGORY,
      pattern: "/{tourSearch}/:slug",
      marketplace: monolithTourMarketplaces,
    })
    .add({
      name: ROUTE_NAMES.TOUR_LEGACY,
      pattern: "/({tours-legacy}|{tours-greenland})/:slug",
      page: PageType.TOUR,
      marketplace: monolithTourMarketplaces,
    })
    .add({
      name: ROUTE_NAMES.TOUR,
      pattern: "/{tours}/:category/:slug",
      marketplace: monolithTourMarketplaces,
    })
    .add({
      name: ROUTE_NAMES.GTE_TOURSEARCH,
      pattern: "/{gteTourSearch}",
      marketplace: [MarketplaceName.GUIDE_TO_EUROPE],
    })
    .add({
      name: ROUTE_NAMES.GTE_TOURSEARCH_WITH_SLUG,
      pattern: `/{gteTourSearch}/:slug`,
      page: PageType.GTE_TOUR_SEARCH,
      marketplace: [MarketplaceName.GUIDE_TO_EUROPE],
    })
    .add({
      name: ROUTE_NAMES.GTE_TOURSEARCH_COUNTRY,
      pattern: `/:country/{gteTourSearch}`,
      page: PageType.GTE_TOUR_SEARCH,
      marketplace: [MarketplaceName.GUIDE_TO_EUROPE],
    })
    .add({
      name: ROUTE_NAMES.GTE_TOURSEARCH_COUNTRY_WITH_SLUG,
      pattern: `/:country/{gteTourSearch}/:slug`,
      page: PageType.GTE_TOUR_SEARCH,
      marketplace: [MarketplaceName.GUIDE_TO_EUROPE],
    })
    .add({
      name: ROUTE_NAMES.GTE_TOUR,
      pattern: `/:country/{gteTourSearch}/details/:slug`,
      page: PageType.GTE_TOUR,
      marketplace: [MarketplaceName.GUIDE_TO_EUROPE],
    });

export default addTourRoutes;
