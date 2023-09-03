import contextFactory from "contexts/contextFactory";

export const defaultState: StateContext = {
  occupancies: [
    {
      numberOfAdults: 2,
      childrenAges: [],
    },
  ],
  defaultOrigin: "",
  defaultDestination: "",
  defaultOriginId: "",
  defaultDestinationId: "",
  origin: "",
  destination: "",
  originPlaceholder: "",
  destinationPlaceholder: "",
  vacationIncludesFlight: true,
  datePickerSelectedDates: {
    from: undefined,
    to: undefined,
  },
  datePickerInitialMonth: new Date(),
  datePickerDisabled: false,
};

export type StateContext = {
  occupancies: StayBookingWidgetTypes.Occupancy[];
  defaultOrigin?: string;
  defaultDestination?: string;
  defaultOriginId?: string;
  defaultDestinationId?: string;
  origin?: string;
  originId?: string;
  originCountryId?: string;
  destination?: string;
  destinationId?: string;
  originPlaceholder?: string;
  destinationPlaceholder?: string;
  vacationIncludesFlight: boolean;
  datePickerSelectedDates: SharedTypes.SelectedDates;
  datePickerInitialMonth?: Date;
  datePickerDisabled?: boolean;
};

export const { Provider: VPSearchWidgetProvider, useContext: useVPSearchWidgetContext } =
  contextFactory<StateContext>(defaultState);
