import { createContext } from "react";

import { StepsEnum } from "../FlightSearchWidget/enums";

export type State = {
  selectedDepartureDates: SharedTypes.SelectedDates;
  selectedReturnDates: SharedTypes.SelectedDates;
  originId?: string;
  destinationId?: string;
  passengers: FlightSearchTypes.Passengers;
  cabinType: FlightSearchTypes.CabinType;
  flightType: FlightSearchTypes.FlightType;
  isSearchWidgetOpen: boolean;
  searchWidgetStep: StepsEnum;
  destinationName?: string;
  originName?: string;
};

const context = createContext<State>({
  selectedDepartureDates: { from: undefined, to: undefined },
  selectedReturnDates: { from: undefined, to: undefined },
  originId: undefined,
  destinationId: undefined,
  passengers: {
    adults: 1,
    children: 0,
    infants: 0,
  },
  cabinType: "M" as FlightSearchTypes.CabinType,
  flightType: "round" as FlightSearchTypes.FlightType,
  isSearchWidgetOpen: false,
  searchWidgetStep: StepsEnum.Details,
});

export default context;

export const { Provider } = context;
