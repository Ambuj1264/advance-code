import { joinRoutes, getTranslatedRoutesFormatted } from "../utils/routerUtils";
import { MarketplaceName, PageType } from "../types/enums";

import RouterClass from "./LocaleRouter/Router";
import { ROUTE_NAMES } from "./routeNames";

const articleSearchPageRoutesNonLocalized = ["about-europe", "about-norway"];

const articleCategoryNTG = [
  "city-guides",
  "best-of-norway",
  "self-drive-itineraries",
  "norwegian-culture",
  "norwegian-nature",
  "norways-national-parks",
];

const articleCategoryPageRoutes = [
  "nature-info", // Nature In Iceland
  "travel-info", // Travel Information
  "history-culture", // History & Culture
  "music-of-iceland", // Music In Iceland
  "the-northern-lights", // The Northern Lights
  "best-of-iceland", // Best of Iceland
  "you-guide", // Itineraries
  "reykjavik-guide", // Reykjavik Guide
];

const articlePLPMarketplaces = [
  MarketplaceName.GUIDE_TO_ICELAND,
  MarketplaceName.ICELAND_PHOTO_TOURS,
  MarketplaceName.GUIDE_TO_THE_PHILIPPINES,
  MarketplaceName.NORWAY_TRAVEL_GUIDE,
];

const articleCategoryRoutes = `${joinRoutes([
  ...articleCategoryNTG,
])}|${getTranslatedRoutesFormatted(articleCategoryPageRoutes)}`;

const addArticleRoutes = (router: RouterClass) => {
  router
    // Article categories
    .add({
      name: ROUTE_NAMES.ARTICLECATEGORY_LEGACY,
      pattern: `/(${articleCategoryRoutes})`,
      page: PageType.ARTICLECATEGORY,
      marketplace: articlePLPMarketplaces,
    })
    .add({
      name: ROUTE_NAMES.ARTICLECATEGORY,
      pattern: `/{articles}/:category`,
      marketplace: articlePLPMarketplaces,
    })
    // Article search
    .add({
      name: ROUTE_NAMES.ARTICLESEARCH,
      pattern: `/({articleSearchGTI}|${joinRoutes(
        articleSearchPageRoutesNonLocalized
      )}|{articles})`,
      marketplace: articlePLPMarketplaces,
    });
  // Article pages
  router
    .add({
      name: ROUTE_NAMES.ARTICLE_LEGACY_NOT_TRANSLATED,
      pattern: "/{articles}/:category/:slug",
      page: PageType.ARTICLE,
    })
    .add({
      name: ROUTE_NAMES.ARTICLE,
      pattern: `/(${articleCategoryRoutes})/:slug`,
    });
};

export default addArticleRoutes;
