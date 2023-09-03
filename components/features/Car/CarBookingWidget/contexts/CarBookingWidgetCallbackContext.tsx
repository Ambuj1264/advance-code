import { createContext } from "react";

import { BookingWidgetView } from "../../types/CarEnums";

type CallbackContext = {
  toggleModal: (isOpen?: boolean) => void;
  toggleIsFormLoading: () => void;
  setSelectedExtra: (selectedExtra: CarBookingWidgetTypes.SelectedExtra) => void;
  setSelectedInsurance: (selectedInsurance: CarBookingWidgetTypes.OnSelectedInsuranceInput) => void;
  setBookingWidgetView: (bookingWidgetView: BookingWidgetView) => void;
  toggleIsCalendarOpen: () => void;
  setSpecifiedPickup: (pickupSpecify: string) => void;
  setSpecifiedDropoff: (dropoffSpecify: string) => void;
  setSelectedExtraQuestionAnswers: (
    selectedExtraId: string,
    answer: CarBookingWidgetTypes.SelectedExtraQuestionAnswer
  ) => void;
  resetExtrasAndInsurances: () => void;
};

const context = createContext<CallbackContext>({
  toggleModal: () => {},
  toggleIsFormLoading: () => {},
  setSelectedExtra: () => {},
  setSelectedInsurance: () => {},
  setBookingWidgetView: () => {},
  toggleIsCalendarOpen: () => {},
  setSpecifiedPickup: () => {},
  setSpecifiedDropoff: () => {},
  setSelectedExtraQuestionAnswers: () => {},
  resetExtrasAndInsurances: () => {},
});

export default context;

export const { Provider } = context;
