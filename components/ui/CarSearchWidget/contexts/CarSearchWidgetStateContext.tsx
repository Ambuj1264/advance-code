import { createContext } from "react";

import { StepsEnum } from "../enums";

export type StateContext = {
  selectedDates: SharedTypes.SelectedDates;
  pickupId?: string;
  dropoffId?: string;
  pickupLocationName?: string;
  dropoffLocationName?: string;
  pickupGeoLocation?: string;
  dropoffGeoLocation?: string;
  times: SharedCarTypes.CarSeachTimes;
  isSearchWidgetOpen: boolean;
  searchWidgetStep: StepsEnum;
  isCalendarOpen: boolean;
  driverAge: number;
  driverCountry?: string;
  carLocationType?: string;
};

const context = createContext<StateContext>({
  selectedDates: { from: undefined, to: undefined },
  pickupId: undefined,
  dropoffId: undefined,
  pickupGeoLocation: undefined,
  dropoffGeoLocation: undefined,
  times: {
    pickup: {
      hour: 0,
      minute: 0,
    },
    dropoff: {
      hour: 0,
      minute: 0,
    },
  },
  isSearchWidgetOpen: false,
  searchWidgetStep: StepsEnum.Details,
  isCalendarOpen: false,
  driverAge: 45,
  driverCountry: undefined,
  carLocationType: undefined,
});

export default context;

export const { Provider } = context;
