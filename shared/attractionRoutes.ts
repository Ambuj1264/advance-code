import { joinRoutes, getTranslatedRoutesFormatted } from "../utils/routerUtils";
import { MarketplaceName } from "../types/enums";

import RouterClass from "./LocaleRouter/Router";
import { ROUTE_NAMES } from "./routeNames";

const translatedRoutes = ["attraction", "attraction-greenland", "attraction-iceland-photo-tours"];

const legacyRoutes = [
  "travel-iceland/drive",
  "destinations-and-attractions", // Guide to Europe
  "travel-greenland/drive", // Guide to Greenland
  "travel-norway/drive", // Guide to Norway
];

const attractionPLPMarketplaces = [
  MarketplaceName.GUIDE_TO_ICELAND,
  MarketplaceName.ICELAND_PHOTO_TOURS,
  MarketplaceName.GUIDE_TO_THE_PHILIPPINES,
  MarketplaceName.NORWAY_TRAVEL_GUIDE,
];

export default function addAttractionRoutes(router: RouterClass) {
  const translatedRoutesFormatted = getTranslatedRoutesFormatted(translatedRoutes);

  const legacyRoutesFormatted = joinRoutes(legacyRoutes);
  const attractionRoutes = `${translatedRoutesFormatted}|${legacyRoutesFormatted}`;
  router
    .add({
      name: ROUTE_NAMES.ATTRACTION,
      pattern: `/(${attractionRoutes})/:slug`,
      marketplace: attractionPLPMarketplaces,
    })
    .add({
      name: ROUTE_NAMES.BEST_PLACES,
      pattern: `/(${attractionRoutes})`,
      marketplace: attractionPLPMarketplaces,
    });
}
