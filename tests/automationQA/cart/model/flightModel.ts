export type AirlineType = {
  code: string;
  name: string;
  imageUrl: string;
  __typename: string;
};

export const getAirlineModel = (): AirlineType => ({
  code: "BA",
  name: "British Airways",
  imageUrl: "https://images.kiwi.com/airlines/64/BA.png",
  __typename: "OrderAirline",
});

export type CityFromOrCityToType = {
  code?: null;
  name: string;
  __typename: string;
};

export const getCityFromOrCityToModel = (): CityFromOrCityToType => ({
  code: null,
  name: "London",
  __typename: "OrderCity",
});

export type FlyFromOrFlyToType = {
  code: string;
  name: string;
  __typename: string;
};

export const getFlyFromOrFlyToModel = (): FlyFromOrFlyToType => ({
  code: "FRA",
  name: "Frankfurt International Airport",
  __typename: "OrderAirport",
});

export type RouteEntityType = {
  airline: AirlineType;
  cityFrom: CityFromOrCityToType;
  cityTo: CityFromOrCityToType;
  flightClass: string;
  flightNumber: string;
  flyFrom: FlyFromOrFlyToType;
  flyTo: FlyFromOrFlyToType;
  layOverSec: number;
  durationSec: number;
  localArrival: string;
  bagsRecheckRequired: boolean;
  localDeparture: string;
  __typename: string;
};

export const getRouteEntityModel = (): RouteEntityType => ({
  airline: getAirlineModel(),
  cityFrom: getCityFromOrCityToModel(),
  cityTo: getCityFromOrCityToModel(),
  flightClass: "Economy",
  flightNumber: "906",
  flyFrom: getFlyFromOrFlyToModel(),
  flyTo: getFlyFromOrFlyToModel(),
  layOverSec: 0,
  durationSec: 6000,
  localArrival: "2022-01-14T11:05:00.000Z",
  localDeparture: "2022-01-14T08:25:00.000Z",
  bagsRecheckRequired: false,
  __typename: "OrderedFlight",
});

export type BaggageEntityType = {
  id: string;
  category: string;
  price: number;
  length: number;
  width: number;
  height: number;
  count: number;
  weight: number;
  __typename: string;
};

export const getBaggageEntityModel = (): BaggageEntityType => ({
  category: "personal_item",
  count: 1,
  height: 25,
  id: "personal_item",
  length: 40,
  price: 0,
  weight: 10,
  width: 20,
  __typename: "OrderedBaggage",
});

export type FlightModelType = {
  id?: null;
  bookingToken?: null;
  title: string;
  cartItemId: string;
  available: boolean;
  adults: number;
  children: number;
  infants: number;
  numberOfPassengers: number;
  nightsInDestination: number;
  inboundDurationSec: number;
  outboundDurationSec: number;
  totalDurationSec: number;
  baggage?: BaggageEntityType[] | null;
  isEditable: boolean;
  expiredTime: string;
  price: number;
  outboundRoute?: RouteEntityType[] | null;
  inboundRoute?: RouteEntityType[] | null;
  __typename: string;
};

export const getflightModel = (): FlightModelType => ({
  id: null,
  bookingToken: null,
  title: "Test Flight",
  cartItemId: "13619a86-99a0-460d-811a-fd50f5ea9324",
  available: false,
  adults: 1,
  children: 0,
  infants: 0,
  numberOfPassengers: 1,
  nightsInDestination: 13,
  inboundDurationSec: 1,
  outboundDurationSec: 5700,
  totalDurationSec: 11700,
  baggage: [getBaggageEntityModel()],
  isEditable: false,
  expiredTime: "2021-12-23T17:34:55.212Z",
  price: 21712.72,
  outboundRoute: [getRouteEntityModel()],
  inboundRoute: [getRouteEntityModel()],
  __typename: "OrderFlightCartInfo",
});
