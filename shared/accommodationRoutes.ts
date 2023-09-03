import { MarketplaceName, PageType } from "../types/enums";

import RouterClass from "./LocaleRouter/Router";
import { ROUTE_NAMES } from "./routeNames";

const addAccommodationRoutes = (router: RouterClass) => {
  router
    .add({
      name: ROUTE_NAMES.ACCOMMODATION,
      pattern: "/{accommodation}/:category/:slug",
      marketplace: [MarketplaceName.GUIDE_TO_ICELAND, MarketplaceName.GUIDE_TO_THE_PHILIPPINES],
    })
    .add({
      name: ROUTE_NAMES.ACCOMMODATION_SEARCH,
      pattern: "/{accommodation}",
      marketplace: [MarketplaceName.GUIDE_TO_ICELAND, MarketplaceName.GUIDE_TO_THE_PHILIPPINES],
    })
    .add({
      name: ROUTE_NAMES.ACCOMMODATION_CATEGORY,
      pattern: "/{accommodation}/:slug",
      marketplace: [MarketplaceName.GUIDE_TO_ICELAND, MarketplaceName.GUIDE_TO_THE_PHILIPPINES],
    })
    .add({
      name: ROUTE_NAMES.GTE_STAYSSEARCH,
      pattern: "/{gteStaysSearch}",
      marketplace: [MarketplaceName.GUIDE_TO_EUROPE],
    })
    .add({
      name: ROUTE_NAMES.GTE_STAYSSEARCH_WITH_SLUG,
      pattern: `/{gteStaysSearch}/:slug`,
      page: PageType.GTE_STAYS_SEARCH,
      marketplace: [MarketplaceName.GUIDE_TO_EUROPE],
    })
    .add({
      name: ROUTE_NAMES.GTE_STAYSSEARCH_COUNTRY,
      pattern: `/:country/{gteStaysSearch}`,
      page: PageType.GTE_STAYS_SEARCH,
      marketplace: [MarketplaceName.GUIDE_TO_EUROPE],
    })
    .add({
      name: ROUTE_NAMES.GTE_STAYSSEARCH_COUNTRY_WITH_SLUG,
      pattern: `/:country/{gteStaysSearch}/:slug`,
      page: PageType.GTE_STAYS_SEARCH,
      marketplace: [MarketplaceName.GUIDE_TO_EUROPE],
    })
    .add({
      name: ROUTE_NAMES.GTE_STAY,
      pattern: `/:country/{gteStaysSearch}/details/:slug`,
      page: PageType.GTE_STAY,
      marketplace: [MarketplaceName.GUIDE_TO_EUROPE],
    });

  return router;
};
export default addAccommodationRoutes;
