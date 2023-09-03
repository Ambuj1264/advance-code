import { createContext, SyntheticEvent } from "react";

import { StepsEnum } from "../enums";

export type CarSearchWidgetSharedTypes = {
  onLocationChange: (item?: SharedTypes.AutocompleteItem) => void;
  onPickupTimeChange: (pickup: SharedTypes.Time) => void;
  onDropoffTimeChange: (dropoff: SharedTypes.Time) => void;
};

export type CallbackContext = {
  onDateSelection: (dates: SharedTypes.SelectedDates) => void;
  onDateSelectionWithAdjustedTime: (dates: SharedTypes.SelectedDates) => void;
  onPickupLocationChange: CarSearchWidgetSharedTypes["onLocationChange"];
  onDropoffLocationChange: CarSearchWidgetSharedTypes["onLocationChange"];
  onPickupTimeChange: CarSearchWidgetSharedTypes["onPickupTimeChange"];
  onDropoffTimeChange: CarSearchWidgetSharedTypes["onDropoffTimeChange"];
  onSetHour: (hour: number, timeType: SharedCarTypes.SearchTimeTypes) => void;
  onSetMinute: (minute: number, timeType: SharedCarTypes.SearchTimeTypes) => void;
  onSearchClick: (e: SyntheticEvent) => void;
  onToggleModal: () => void;
  onOpenModal: () => void;
  onCloseModal: () => void;
  onSetSearchWidgetStep: (step: StepsEnum) => void;
  openModalOnStep: (step: StepsEnum) => void;
  onSetCalendarOpen: (isCalendarOpen: boolean) => void;
  onSetDriverAge: (driverAge: string) => void;
  onSetDriverCountry: (driverCountry: string) => void;
};

const context = createContext<CallbackContext>({
  onDateSelection: () => {},
  onDateSelectionWithAdjustedTime: () => {},
  onPickupLocationChange: () => {},
  onDropoffLocationChange: () => {},
  onPickupTimeChange: () => {},
  onDropoffTimeChange: () => {},
  onSetHour: () => {},
  onSetMinute: () => {},
  onSearchClick: () => {},
  onToggleModal: () => {},
  onOpenModal: () => {},
  onCloseModal: () => {},
  onSetSearchWidgetStep: () => {},
  openModalOnStep: () => {},
  onSetCalendarOpen: () => {},
  onSetDriverAge: () => {},
  onSetDriverCountry: () => {},
});

export default context;

export const { Provider } = context;
