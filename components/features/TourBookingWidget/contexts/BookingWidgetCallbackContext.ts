import { createContext } from "react";

import BookingWidgetView, { OrderBookingWidgetView } from "../types/enums";

import { BookingWidgetFormError } from "types/enums";

type CallbackContext = {
  setSelectedDates: (selectedDates: SharedTypes.SelectedDates) => void;
  setSelectedPickupTime: (selectedTime: string) => void;
  setNumberOfTravelers: (travelerType: SharedTypes.TravelerType, value: number) => void;
  setChildrenAges: (value: number, index: number) => void;
  setTravelersPriceGroups: (priceGroups: TravelersTypes.PriceGroup[]) => void;
  setDefaultNumberOfTravelers: TourBookingWidgetTypes.OnSetDefaultNumberOfTravelers;
  setInitialNumberOfTravelers: TourBookingWidgetTypes.OnSetInitialNumberOfTravelers;
  setSelectedExperience: (selectedExperience: TourBookingWidgetTypes.SelectedExperience) => void;
  setBookingWidgetView: (bookingWidgetView: BookingWidgetView) => void;
  setOrderBookingWidgetView: (bookingWidgetView: OrderBookingWidgetView) => void;
  setSelectedTransportLocation: (selectedTransportLocation: PickupLocation) => void;
  updateEmptyAnswerError: (formError?: BookingWidgetFormError) => void;
  setHasPickup: (hasPickup: boolean) => void;
  toggleIsFormLoading: () => void;
  setContactInformation: (contactInformation: TourOrderTypes.ContactInformation) => void;
  setPickupInformation: (pickupInformation: TourOrderTypes.PickupInformation) => void;
  togglePrivateState: () => void;
};

const context = createContext<CallbackContext>({
  setSelectedDates: () => {},
  setSelectedPickupTime: () => {},
  setNumberOfTravelers: () => {},
  setChildrenAges: () => {},
  setTravelersPriceGroups: () => {},
  setDefaultNumberOfTravelers: () => {},
  setInitialNumberOfTravelers: () => {},
  setSelectedExperience: () => {},
  setBookingWidgetView: () => {},
  setOrderBookingWidgetView: () => {},
  setSelectedTransportLocation: () => {},
  updateEmptyAnswerError: () => {},
  setHasPickup: () => {},
  toggleIsFormLoading: () => {},
  setContactInformation: () => {},
  setPickupInformation: () => {},
  togglePrivateState: () => {},
});

export default context;

export const { Provider } = context;
