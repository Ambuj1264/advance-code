import contextFactory from "contexts/contextFactory";
import BookingWidgetView from "components/features/TourBookingWidget/types/enums";

export interface GTETourBookingWidgetStateContext {
  numberOfTravelers: GTETourBookingWidgetTypes.AgeBand[];
  selectedDates: SharedTypes.SelectedDates;
  priceGroups: GTETourBookingWidgetTypes.PriceGroup[];
  maxTravelersPerBooking: number;
  selectedTourOption?: GTETourBookingWidgetTypes.SelectedTourOption;
  tourOptions: GTETourBookingWidgetTypes.TourOption[];
  isAvailabilityLoading: boolean;
  isError: boolean;
  bookingQuestions: GTETourBookingWidgetTypes.TourQuestionAnswer[];
  travelerQuestions: GTETourBookingWidgetTypes.TravelerQuestions[];
  bookingWidgetView: BookingWidgetView;
  totalPrice: number;
  allowCustomTravelerPickup: boolean;
  requiresAdultForBooking: boolean;
  tourDestinationId?: string;
  tourDestinationName?: string;
  areDatesLoading: boolean;
  durationInMinutes?: number;
  startingPlace?: string;
  endingPlace?: string;
  setContextState: (state: Partial<this>) => void;
}

export const defaultState: GTETourBookingWidgetStateContext = {
  numberOfTravelers: [],
  selectedDates: { from: undefined, to: undefined },
  priceGroups: [],
  maxTravelersPerBooking: 0,
  selectedTourOption: undefined,
  tourOptions: [],
  isAvailabilityLoading: false,
  isError: false,
  bookingQuestions: [],
  travelerQuestions: [],
  bookingWidgetView: BookingWidgetView.Default,
  totalPrice: 0,
  allowCustomTravelerPickup: false,
  requiresAdultForBooking: false,
  tourDestinationId: undefined,
  tourDestinationName: undefined,
  areDatesLoading: true,
  durationInMinutes: undefined,
  startingPlace: undefined,
  endingPlace: undefined,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setContextState: () => {},
};

const { context, Provider, useContext } = contextFactory<GTETourBookingWidgetStateContext>(
  defaultState,
  "GTETourBookingWidgetContext"
);

export default context;
export const GTETourBookingWidgetStateContextProvider = Provider;
export const useGTETourBookingWidgetContext = useContext;
