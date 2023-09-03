import { createContext } from "react";

import { BookingWidgetView } from "../../types/CarEnums";

import { BookingWidgetFormError } from "types/enums";

type StateContext = {
  price: number;
  fullPrice?: number;
  isModalOpen: boolean;
  isFormLoading: boolean;
  isPriceLoading: boolean;
  selectedExtras: CarBookingWidgetTypes.SelectedExtra[];
  extras: OptionsTypes.Option[];
  selectedInsurances: CarBookingWidgetTypes.SelectedInsurance[];
  insurances: OptionsTypes.Option[];
  bookingWidgetView: BookingWidgetView;
  isCalendarOpen: boolean;
  pickupSpecify: string;
  dropoffSpecify: string;
  priceOnArrival: number;
  payOnArrival: CarBookingWidgetTypes.PriceBreakdownItem[];
  priceBreakdown: CarBookingWidgetTypes.PriceBreakdownItem[];
  formErrors: BookingWidgetFormError[];
  extrasWithoutAnswers: CarBookingWidgetTypes.SelectedExtra[];
};

const context = createContext<StateContext>({
  price: 0,
  fullPrice: 0,
  isModalOpen: false,
  isFormLoading: false,
  isPriceLoading: false,
  selectedExtras: [],
  extras: [],
  selectedInsurances: [],
  insurances: [],
  bookingWidgetView: BookingWidgetView.Default,
  isCalendarOpen: false,
  pickupSpecify: "",
  dropoffSpecify: "",
  priceOnArrival: 0,
  payOnArrival: [],
  priceBreakdown: [],
  formErrors: [],
  extrasWithoutAnswers: [],
});

export default context;

export const { Provider } = context;
