import { constructClientTours } from "../components/features/SearchPage/utils/searchUtils";

// eslint-disable-next-line camelcase
export const parseDisplayPrice = (price?: { display_price: string }) =>
  parseFloat(`${price?.display_price.replace(/,/g, "")}`);

export const convertAlternateQuerySSRTour = (
  tour: SharedTypes.QueryTourAlternate
): SharedTypes.QueryTour => ({
  ...tour,
  price: parseDisplayPrice(tour.price),
  ssrPrice: parseDisplayPrice(tour.ssrPrice),
});

export const convertAlternateQueryClientTour = (
  tour: SharedTypes.QueryClientTourAlternate
): SharedTypes.TourClientData => ({
  ...tour,
  price: parseDisplayPrice(tour.price),
});

export const constructTours = (
  serverTours: SharedTypes.QueryTourAlternate[] = [],
  clientTours: SharedTypes.QueryClientTourAlternate[] = []
): SharedTypes.Product[] =>
  constructClientTours(
    serverTours.map(convertAlternateQuerySSRTour),
    clientTours?.map(convertAlternateQueryClientTour)
  );

export const arrayQueryParam = <T = string>(
  queryParam?: string | string[],
  cb = (value: string): T => value as any
) => {
  if (typeof queryParam === "undefined") return;
  // eslint-disable-next-line consistent-return
  return typeof queryParam === "string" ? [cb(queryParam)] : (queryParam as string[]).map(cb);
};
