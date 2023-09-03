import { MarketplaceName, PageType } from "../types/enums";

import RouterClass from "./LocaleRouter/Router";
import { ROUTE_NAMES } from "./routeNames";

const addPaymentRoutes = (router: RouterClass) => {
  const cartMarketplaces = [
    MarketplaceName.GUIDE_TO_EUROPE,
    MarketplaceName.GUIDE_TO_ICELAND,
    MarketplaceName.ICELAND_PHOTO_TOURS,
    MarketplaceName.GUIDE_TO_THE_PHILIPPINES,
  ];
  router
    .add({
      name: ROUTE_NAMES.CART,
      pattern: `/${PageType.CART}`,
      marketplace: cartMarketplaces,
    })
    .add({
      name: ROUTE_NAMES.MOBILE_PAYMENT,
      pattern: `/${PageType.CART}/${PageType.MOBILE_PAYMENT}`,
      marketplace: cartMarketplaces,
      page: ROUTE_NAMES.MOBILE_PAYMENT,
    })
    .add({
      name: ROUTE_NAMES.PAYMENT_LINK,
      pattern: `/${PageType.PAYMENT_LINK}`,
      marketplace: cartMarketplaces,
    })
    .add({
      name: ROUTE_NAMES.PAYMENT_LINK_PAYMENT,
      pattern: `/${PageType.PAYMENT_LINK}/${PageType.MOBILE_PAYMENT}`,
      marketplace: cartMarketplaces,
      page: ROUTE_NAMES.MOBILE_PAYMENT,
    })
    .add({
      name: ROUTE_NAMES.VOUCHER,
      pattern: `/${PageType.VOUCHER}`,
      marketplace: cartMarketplaces,
    })
    .add({
      name: ROUTE_NAMES.PAYMENT_RECEIPT,
      pattern: `/${PageType.PAYMENT_RECEIPT}`,
      marketplace: cartMarketplaces,
      page: ROUTE_NAMES.VOUCHER,
    })
    .add({
      name: ROUTE_NAMES.PAYMENT_REDIRECT,
      pattern: `/${PageType.PAYMENT_REDIRECT}`,
      marketplace: cartMarketplaces,
    });
};
export default addPaymentRoutes;
