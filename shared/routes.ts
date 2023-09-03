import { MarketplaceName, PageType } from "../types/enums";

import allTranslations from "./translations";
import LocaleRouter from "./LocaleRouter/Router";
import addAttractionRoutes from "./attractionRoutes";
import addArticleRoutes from "./articleRoutes";
import addBlogRoutes from "./blogRoutes";
import addCarRoutes from "./carRoutes";
import addTourRoutes from "./tourRoutes";
import addAccommodationRoutes from "./accommodationRoutes";
import addFlightRoutes from "./flightRoutes";
import addCountryPageRoutes from "./countryPageRoutes";
import addTripPlannerRoutes from "./tripPlannerRoutes";
import addGteVacationPackagesRoutes from "./gteVacationPackagesRoutes";
import { ROUTE_NAMES } from "./routeNames";
import addPaymentRoutes from "./paymentRoutes";
import addGteTravelGuidesRoutes from "./gteTravelGuidesRoutes";

/* if adding a marketplace specific route with the same pattern as another page,
  the marketplace route needs to be before the other route */

const routes = new LocaleRouter()
  .add({
    name: ROUTE_NAMES.INDEX,
    pattern: "/",
    marketplace: [
      MarketplaceName.GUIDE_TO_ICELAND,
      MarketplaceName.ICELAND_PHOTO_TOURS,
      MarketplaceName.GUIDE_TO_THE_PHILIPPINES,
      MarketplaceName.NORWAY_TRAVEL_GUIDE,
    ],
  })
  .add({
    name: ROUTE_NAMES.GTE_FRONT_PAGE,
    pattern: "/",
    marketplace: [MarketplaceName.GUIDE_TO_EUROPE],
  })
  .add({
    name: ROUTE_NAMES.PREVIEW,
    pattern: "/preview",
    page: "cmsPreview",
  })
  .add({
    name: ROUTE_NAMES.GTE_USER_SYSTEM,
    pattern: `/${PageType.GTE_USER_SYSTEM}`,
    marketplace: [MarketplaceName.GUIDE_TO_EUROPE],
    isProtected: true,
  })
  .add({
    page: ROUTE_NAMES.GTE_USER_SYSTEM,
    name: ROUTE_NAMES.GTE_USER_SYSTEM_PAYMENT,
    pattern: `/${PageType.GTE_USER_SYSTEM}/payment-methods`,
    marketplace: [MarketplaceName.GUIDE_TO_EUROPE],
    isProtected: true,
  })
  .add({
    name: ROUTE_NAMES.GTE_POST_BOOKING,
    page: PageType.GTE_POST_BOOKING,
    pattern: "/{gtePostBooking}/:slug?",
    marketplace: [MarketplaceName.GUIDE_TO_EUROPE],
    isProtected: true,
  })
  .add({
    name: ROUTE_NAMES.GTE_SEARCH_RESULTS,
    page: PageType.GTE_SEARCH_RESULTS,
    pattern: "/search-results",
    marketplace: [MarketplaceName.GUIDE_TO_EUROPE],
  });
addPaymentRoutes(routes);
addFlightRoutes(routes);
addTourRoutes(routes);
addAccommodationRoutes(routes);
addCarRoutes(routes);
addBlogRoutes(routes);
addAttractionRoutes(routes);
addArticleRoutes(routes);
addCountryPageRoutes(routes);
addTripPlannerRoutes(routes);
addGteVacationPackagesRoutes(routes);
addGteTravelGuidesRoutes(routes);

if (typeof window !== "undefined") {
  // eslint-disable-next-line no-underscore-dangle
  const {
    initialLanguage,
  }: // eslint-disable-next-line @typescript-eslint/no-explicit-any
  { initialLanguage: keyof typeof allTranslations } = (<any>window).__NEXT_DATA__.props;

  routes.setTranslations({
    [initialLanguage]: allTranslations[initialLanguage],
  });
} else {
  routes.setTranslations(allTranslations, "en");
}

export default routes;
export const { Link } = routes;
export const Router = routes.NextRouter;
