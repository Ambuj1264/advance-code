import { createContext } from "react";
import { Option, none } from "fp-ts/lib/Option";

import BookingWidgetView, { OrderBookingWidgetView } from "../types/enums";

import { BookingWidgetFormError } from "types/enums";

export type StateContext = {
  price: number;
  fullPrice: number;
  basePrice?: number;
  isPriceLoading: boolean;
  isGTIVpDefaultOptionsLoading: boolean;
  isGTIVpLivePriceLoading: boolean;
  isSelectedNonDefaultOption: boolean;
  isLoadingAvailableTimes: boolean;
  isDiscountLoading?: boolean;
  currency: string;
  bookingWidgetView: BookingWidgetView;
  orderBookingWidgetView: OrderBookingWidgetView;
  selectedDates: SharedTypes.SelectedDates;
  datesInitialized: boolean;
  numberOfTravelers: SharedTypes.NumberOfTravelers;
  childrenAges: number[];
  priceGroups?: TravelersTypes.PriceGroup[];
  selectedPickupTime?: string;
  availableTimes: TourBookingWidgetTypes.AvailableTimes;
  selectedExperiences: TourBookingWidgetTypes.SelectedExperiences;
  travelerPrices?: TourBookingWidgetTypes.Prices;
  experiences: ExperiencesTypes.Experience[][];
  selectedTransportLocation: PickupLocation;
  formErrors: BookingWidgetFormError[];
  hasPickup: boolean;
  isFormLoading: boolean;
  orderPrice: number;
  contactInformation: TourOrderTypes.ContactInformation;
  pickupInformation: TourOrderTypes.PickupInformation;
  isLoadingOptions: boolean;
  discount: Option<number>;
  discountValue?: number;
  baseDiscountValue?: number;
  isPrivate: boolean;
  isLivePricing: boolean;
  livePricingUuid?: string;
  livePricingNonDefaultUuid?: string;
  availablePrivateOptions: TourBookingWidgetTypes.PrivateOption[];
  selectedPrivateOptions: TourBookingWidgetTypes.PrivateOption[];
  maxTravelers?: number;
};

const context = createContext<StateContext>({
  price: 0,
  fullPrice: 0,
  isPriceLoading: true,
  isGTIVpDefaultOptionsLoading: false,
  isGTIVpLivePriceLoading: false,
  isSelectedNonDefaultOption: false,
  currency: "",
  bookingWidgetView: BookingWidgetView.Default,
  orderBookingWidgetView: OrderBookingWidgetView.TravelInformation,
  selectedDates: { from: undefined, to: undefined },
  datesInitialized: false,
  selectedTransportLocation: { id: 0, name: "" },
  numberOfTravelers: {
    adults: 0,
    teenagers: 0,
    children: 0,
  },
  childrenAges: [],
  availableTimes: {
    isFlexible: false,
    times: [],
  },
  selectedExperiences: [],
  travelerPrices: {
    adults: 0,
    teenagers: 0,
    children: 0,
  },
  experiences: [],
  isLoadingAvailableTimes: false,
  formErrors: [],
  hasPickup: true,
  isDiscountLoading: false,
  isFormLoading: false,
  orderPrice: 0,
  contactInformation: {
    name: "",
    email: "",
    phone: "",
    country: "",
  },
  pickupInformation: {
    pickupType: "",
    pickupTime: "",
    pickupAddress: "",
    placeId: 0,
    pickupFlightNumber: "",
    dropoffTime: "",
    dropoffPlaceId: 0,
    dropoffAddress: "",
    dropoffType: "",
    dropoffFlightNumber: "",
    specialRequest: "",
  },
  isLoadingOptions: false,
  discount: none,
  isPrivate: false,
  isLivePricing: false,
  livePricingUuid: undefined,
  availablePrivateOptions: [],
  selectedPrivateOptions: [],
  maxTravelers: undefined,
});

export default context;

export const { Provider } = context;
