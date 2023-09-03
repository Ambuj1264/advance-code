import { createContext, SyntheticEvent } from "react";

import { StepsEnum } from "../FlightSearchWidget/enums";

export type CallbackContext = {
  onDepartureDateSelection: (dates: SharedTypes.SelectedDates) => void;
  onReturnDateSelection: (dates: SharedTypes.SelectedDates) => void;
  onOriginLocationChange: (id?: string, name?: string) => void;
  onDestinationLocationChange: (id?: string, name?: string) => void;
  onSearchClick: (e: SyntheticEvent) => void;
  onNumberOfPassengersChange: (
    passengerType: FlightSearchTypes.PassengerType,
    value: number
  ) => void;
  onCabinTypeChange: (cabinType: FlightSearchTypes.CabinType) => void;
  onFlightTypeChange: (flightType: FlightSearchTypes.FlightType) => void;
  onToggleModal: () => void;
  openModal: () => void;
  closeModal: () => void;
  onSetSearchWidgetStep: (step: StepsEnum) => void;
};

const context = createContext<CallbackContext>({
  onDepartureDateSelection: () => {},
  onReturnDateSelection: () => {},
  onOriginLocationChange: () => {},
  onDestinationLocationChange: () => {},
  onSearchClick: () => {},
  onNumberOfPassengersChange: () => {},
  onCabinTypeChange: () => {},
  onFlightTypeChange: () => {},
  onToggleModal: () => {},
  openModal: () => {},
  closeModal: () => {},
  onSetSearchWidgetStep: () => {},
});

export default context;

export const { Provider } = context;
