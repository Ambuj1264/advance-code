import { MarketplaceName, PageType } from "../types/enums";

import RouterClass from "./LocaleRouter/Router";
import { ROUTE_NAMES } from "./routeNames";

const addGteVacationPackagesRoutes = (router: RouterClass) => {
  router
    .add({
      name: ROUTE_NAMES.GTE_VACATION_PACKAGES_LANDING,
      pattern: "/{vacationPackages}",
      page: PageType.VACATION_PACKAGES_LANDING,
      marketplace: [MarketplaceName.GUIDE_TO_EUROPE],
    })
    .add({
      name: ROUTE_NAMES.GTE_VACATION_PACKAGES_LANDING_WITH_SLUG,
      pattern: "/{vacationPackages}/:slug",
      page: PageType.VACATION_PACKAGES_LANDING,
      marketplace: [MarketplaceName.GUIDE_TO_EUROPE],
    })
    .add({
      name: ROUTE_NAMES.GTE_VACATION_PACKAGES_LANDING_COUNTRY,
      pattern: "/:country/{vacationPackages}",
      page: PageType.VACATION_PACKAGES_LANDING,
      marketplace: [MarketplaceName.GUIDE_TO_EUROPE],
    })
    .add({
      name: ROUTE_NAMES.GTE_VACATION_PACKAGES_LANDING_COUNTRY_WITH_SLUG,
      pattern: "/:country/{vacationPackages}/:slug",
      page: PageType.VACATION_PACKAGES_LANDING,
      marketplace: [MarketplaceName.GUIDE_TO_EUROPE],
    })
    .add({
      name: ROUTE_NAMES.GTE_VACATION_PACKAGE,
      pattern: "/:country/{vacationPackages}/:section/:slug",
      page: PageType.VACATION_PACKAGE,
      marketplace: [MarketplaceName.GUIDE_TO_EUROPE],
    });

  if (process.env.RUNTIME_ENV !== "prod") {
    router.add({
      name: ROUTE_NAMES.GTE_VACATION_PACKAGE_PREVIEW,
      pattern: "/preview/vp-product/:id",
      page: PageType.VACATION_PACKAGE,
      marketplace: [MarketplaceName.GUIDE_TO_EUROPE],
    });
  }
};
export default addGteVacationPackagesRoutes;
