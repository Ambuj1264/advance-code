import { TripPlannerTrip } from "../types/tripPlannerTypes";

import contextFactory from "contexts/contextFactory";

export type TripPlannerStateContext = {
  isFetchingTrips: boolean;
  fetchingError: string;
  noDataError: string;
  duration: number;
  maxDrivingHours: number;
  trips?: TripPlannerTrip[];
  selectedTrip?: TripPlannerTrip;
  selectedCountry?: { id: string; name: string; airports: string[] };
};

export const defaultState: TripPlannerStateContext = {
  isFetchingTrips: false,
  fetchingError: "",
  noDataError: "",
  duration: 1,
  maxDrivingHours: 1,
  trips: undefined,
  selectedTrip: undefined,
  selectedCountry: undefined,
};

const { context, Provider } = contextFactory<TripPlannerStateContext>(defaultState);

export default context;
export const TripPlannerStateContextProvider = Provider;
