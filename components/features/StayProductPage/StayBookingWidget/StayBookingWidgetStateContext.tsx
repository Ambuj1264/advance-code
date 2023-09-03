import { BookingWidgetView, MealType } from "./types/enums";

import contextFactory from "contexts/contextFactory";

export interface StayBookingWidgetStateContext {
  providerId: string;
  providerName: string;
  selectedDates: SharedTypes.SelectedDates;
  isModalOpen: boolean;
  bookingWidgetView: BookingWidgetView;
  isFormLoading: boolean;
  groupedRates: StayBookingWidgetTypes.QueryGroupedRate[];
  price: number;
  totalPrice?: StayBookingWidgetTypes.StayPriceObject;
  isAvailabilityLoading: boolean;
  cartItem?: StayBookingWidgetTypes.CartStay;
  fromPrice: number;
  placeName?: string;
  placeId?: number;
  placeType?: string;
  slug: string;
  minDays: number;
  accommodationCategory?: AccommodationTypes.Category;
  rooms: AccommodationTypes.Room[];
  roomTypes: StayBookingWidgetTypes.RoomType[];
  roomCombinations: StayBookingWidgetTypes.RoomCombination[];
  preferredMealType?: MealType;
  occupancies: StayBookingWidgetTypes.Occupancy[];
  setContextState: (state: Partial<this>) => void;
}

export const defaultState: StayBookingWidgetStateContext = {
  providerId: "",
  providerName: "",
  selectedDates: { from: undefined, to: undefined },
  isModalOpen: false,
  bookingWidgetView: BookingWidgetView.Default,
  groupedRates: [],
  price: 0,
  totalPrice: undefined,
  isAvailabilityLoading: false,
  isFormLoading: false,
  cartItem: undefined,
  fromPrice: 0,
  placeName: undefined,
  placeId: undefined,
  placeType: undefined,
  slug: "",
  minDays: 1,
  accommodationCategory: undefined,
  rooms: [],
  roomTypes: [],
  roomCombinations: [],
  preferredMealType: undefined,
  occupancies: [
    {
      numberOfAdults: 2,
      childrenAges: [],
    },
  ],
  setContextState: () => {},
};

const { context, Provider, useContext } = contextFactory<StayBookingWidgetStateContext>(
  defaultState,
  "StayBookingWidgetStateContext"
);

export default context;
export const StayBookingWidgetStateContextProvider = Provider;
export const useStayBookingWidgetContext = useContext;
