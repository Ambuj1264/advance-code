export type TripPlannerFeedbackType = {
  type: "wrong" | "could be better" | "correct";
};

type TripPlannerUserRatings = {
  userRatingsTotal: number;
  rating: number;
};

type TripPlannerPlaceId = {
  placeId: string;
};

type TripPlannerAirport = TripPlannerPlaceId & {
  airportName: string;
  lng: number | string;
  lat: number | string;
};

type TripPlannerAttraction = TripPlannerUserRatings &
  TripPlannerPlaceId & {
    name: string;
    description: string;
  };

type TripPlannerHotel = TripPlannerUserRatings &
  TripPlannerPlaceId & {
    name: string;
  };

type TripPlannerTripContent = {
  id: string;
  arrivalAirport: TripPlannerAirport;
  departureAirport: TripPlannerAirport;
  days: TripPlannerQueryDay[];
};

export type TripPlannerActivity = {
  id: string;
  name: string;
  Icon: React.FunctionComponent;
};

export type TripPlannerDay = {
  id: number | string;
  itinerary: TripActivity[];
};

export type TripPlannerTrip = {
  id: string;
  days: TripPlannerDay[];
  mapUrl: string;
  tripJSON: string;
};

export type TripPlannerQueryDay = {
  id: string | number;
  attractions: TripPlannerAttraction[];
  hotel: TripPlannerHotel;
  regions: string[];
};

export type TripPlannerQueryTrip = {
  trip: TripPlannerTripContent;
  tripMapHtml: string;
};

export type TripPlannerParameters = {
  duration: number;
  maxDrivingHours: number;
  nightsInSameHotel?: number;
  importanceOfAttractions?: number;
};
