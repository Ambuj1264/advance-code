import { MarketplaceName, PageType } from "../types/enums";

import RouterClass from "./LocaleRouter/Router";
import { ROUTE_NAMES } from "./routeNames";

const blogPaths =
  "({bloggers}|{bloggers-profiles}|{bloggers-locals}|{blogs-and-tips}|traveler-profiles|blogs-and-tips)";

const addBlogRoutes = (router: RouterClass) =>
  router
    .add({
      name: ROUTE_NAMES.BLOG,
      pattern: `/${blogPaths}/:category/:slug`,
      marketplace: [
        MarketplaceName.GUIDE_TO_ICELAND,
        MarketplaceName.NORWAY_TRAVEL_GUIDE,
        MarketplaceName.ICELAND_PHOTO_TOURS,
      ],
    })
    .add({
      name: ROUTE_NAMES.TRAVELCOMMUNITY,
      pattern: "/({bloggers}|{photo-guides})",
      marketplace: [MarketplaceName.GUIDE_TO_ICELAND, MarketplaceName.NORWAY_TRAVEL_GUIDE],
    })
    .add({
      name: ROUTE_NAMES.LOCALCOMMUNITY,
      pattern: "/({bloggers-locals})",
      marketplace: [MarketplaceName.GUIDE_TO_ICELAND, MarketplaceName.NORWAY_TRAVEL_GUIDE],
    })
    .add({
      name: ROUTE_NAMES.BLOGGERSEARCH,
      pattern: "/({bloggers}|{bloggers-locals})/search",
      marketplace: [MarketplaceName.GUIDE_TO_ICELAND, MarketplaceName.NORWAY_TRAVEL_GUIDE],
    })
    .add({
      name: ROUTE_NAMES.BLOG_IPT,
      pattern: `/({photo-guides}|photo-guides)/:category/:slug`,
      marketplace: [MarketplaceName.ICELAND_PHOTO_TOURS],
      page: PageType.BLOG,
    })
    .add({
      name: ROUTE_NAMES.LOCALCOMMUNITY_IPT,
      pattern: "/({photo-guides}|{photo-locals})",
      marketplace: [MarketplaceName.ICELAND_PHOTO_TOURS],
      page: PageType.LOCALCOMMUNITY,
    })
    .add({
      name: ROUTE_NAMES.BLOGGERSEARCH_IPT,
      pattern: "/({photo-guides}|{photo-locals})/search",
      marketplace: [MarketplaceName.ICELAND_PHOTO_TOURS],
      page: PageType.BLOGGERSEARCH,
    });

export default addBlogRoutes;
