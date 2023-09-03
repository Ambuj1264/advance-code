import { MarketplaceName, PageType } from "../types/enums";

import RouterClass from "./LocaleRouter/Router";
import { ROUTE_NAMES } from "./routeNames";

const addCarRoutes = (router: RouterClass) =>
  router
    .add({
      name: ROUTE_NAMES.CAR,
      pattern: "/({car-legacy}|{car})/search-results/book/:carName/:carId",
      marketplace: [MarketplaceName.GUIDE_TO_ICELAND, MarketplaceName.GUIDE_TO_THE_PHILIPPINES],
    })
    // Legacy car page and most likely results in a 404 due to missing query params
    .add({
      page: PageType.CAR,
      pattern: "/({car-legacy}|{car})/:category/:carName/:carId",
      name: ROUTE_NAMES.GTI_LEGACY_CAR,
      marketplace: [MarketplaceName.GUIDE_TO_ICELAND, MarketplaceName.GUIDE_TO_THE_PHILIPPINES],
    })
    .add({
      name: ROUTE_NAMES.GTE_CAR_PRODUCT,
      pattern: "/{gteCarSearch}/details/:carName/:carId",
      page: PageType.CAR,
      marketplace: [MarketplaceName.GUIDE_TO_EUROPE],
    })
    .add({
      name: ROUTE_NAMES.GTE_CAR_PRODUCT_WITH_SLUG,
      pattern: `/{gteCarSearch}/:slug/details/:carName/:carId`,
      page: PageType.CAR,
      marketplace: [MarketplaceName.GUIDE_TO_EUROPE],
    })
    .add({
      name: ROUTE_NAMES.GTE_CAR_PRODUCT_COUNTRY,
      pattern: `/:country/{gteCarSearch}/details/:carName/:carId`,
      page: PageType.CAR,
      marketplace: [MarketplaceName.GUIDE_TO_EUROPE],
    })
    .add({
      name: ROUTE_NAMES.GTE_CAR_PRODUCT_COUNTRY_WITH_SLUG,
      pattern: `/:country/{gteCarSearch}/:slug/details/:carName/:carId`,
      page: PageType.CAR,
      marketplace: [MarketplaceName.GUIDE_TO_EUROPE],
    })
    .add({
      name: ROUTE_NAMES.CARSEARCH,
      pattern: "/({car-search-legacy}|{car})",
      marketplace: [MarketplaceName.GUIDE_TO_ICELAND, MarketplaceName.GUIDE_TO_THE_PHILIPPINES],
    })
    .add({
      name: ROUTE_NAMES.CAR_CATEGORY,
      pattern: "/({car}|{car-search-legacy})/:slug",
      marketplace: [MarketplaceName.GUIDE_TO_ICELAND, MarketplaceName.GUIDE_TO_THE_PHILIPPINES],
    })
    .add({
      name: ROUTE_NAMES.GTE_CARSEARCH,
      pattern: "/{gteCarSearch}",
      marketplace: [MarketplaceName.GUIDE_TO_EUROPE],
    })
    .add({
      name: ROUTE_NAMES.GTE_CARSEARCH_WITH_SLUG,
      pattern: `/{gteCarSearch}/:slug`,
      page: PageType.GTE_CAR_SEARCH,
      marketplace: [MarketplaceName.GUIDE_TO_EUROPE],
    })
    .add({
      name: ROUTE_NAMES.GTE_CARSEARCH_COUNTRY,
      pattern: `/:country/{gteCarSearch}`,
      page: PageType.GTE_CAR_SEARCH,
      marketplace: [MarketplaceName.GUIDE_TO_EUROPE],
    })
    .add({
      name: ROUTE_NAMES.GTE_CARSEARCH_COUNTRY_WITH_SLUG,
      pattern: `/:country/{gteCarSearch}/:slug`,
      page: PageType.GTE_CAR_SEARCH,
      marketplace: [MarketplaceName.GUIDE_TO_EUROPE],
    });

export default addCarRoutes;
