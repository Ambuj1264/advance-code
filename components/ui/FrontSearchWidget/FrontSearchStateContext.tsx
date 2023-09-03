import {
  CarsMobileStepsEnum,
  SearchTabsEnum,
  StaysMobileStepsEnum,
  TripsMobileStepsEnum,
  FlightsMobileStepsEnum,
  ActiveLocationAutocomplete,
  VacationsMobileStepEnum,
} from "./utils/FrontEnums";

import contextFactory from "contexts/contextFactory";
import { GraphCMSSubType } from "types/enums";

export enum FrontStepKeys {
  tripsCurrentStep = "tripsCurrentStep",
  staysCurrentStep = "staysCurrentStep",
  carsCurrentStep = "carsCurrentStep",
  flightsCurrentStep = "flightsCurrentStep",
  vacationsCurrentStep = "vacationsCurrentStep",
}

export interface FrontSearchStateContext {
  activeSearchTab: SearchTabsEnum;
  isSearchModalOpen: boolean;
  isDesktopCalendarOpen: boolean;
  activeLocationAutocomplete: ActiveLocationAutocomplete;
  [FrontStepKeys.tripsCurrentStep]: TripsMobileStepsEnum;
  [FrontStepKeys.staysCurrentStep]: StaysMobileStepsEnum;
  [FrontStepKeys.carsCurrentStep]: CarsMobileStepsEnum;
  [FrontStepKeys.flightsCurrentStep]: FlightsMobileStepsEnum;
  [FrontStepKeys.vacationsCurrentStep]: VacationsMobileStepEnum;
  staysOpenedStep: StaysMobileStepsEnum;
  tripsOpenedStep: TripsMobileStepsEnum;
  carsOpenedStep: CarsMobileStepsEnum;
  flightsOpenedStep: FlightsMobileStepsEnum;
  vpOpenedStep: VacationsMobileStepEnum;
  // shared between tabs
  adults: number;
  childs?: number;
  childrenAges: number[];
  dateFrom?: string;
  dateTo?: string;
  isSingleDate: boolean;

  occupancies: StayBookingWidgetTypes.Occupancy[];
  useNewGuestPicker: boolean;

  tripStartingLocationId?: string;
  tripStartingLocationName?: string;
  tripStartingLocationItems?: SharedTypes.AutocompleteItem[];
  defaultTripStartingLocationName?: string;

  accommodationRooms: number;
  accommodationId?: string;
  accommodationAddress?: string;
  accommodationType?: string;
  accommodationSubtype?: GraphCMSSubType;
  accommodationLocationItems?: SharedTypes.AutocompleteItem[];
  defaultaccommodationAddress?: string;

  carPickupLocationName?: string;
  carDropoffLocationName?: string;
  carPickupLocationId?: string;
  carDropoffLocationId?: string;
  carPickupGeoLocation?: string;
  carDropoffGeoLocation?: string;
  carLocationItems: SharedTypes.AutocompleteItem[];
  carTimes: SharedCarTypes.CarSeachTimes;
  carDriverAge: number;
  carDriverCountry?: string;
  countryCode?: string;
  carLocationType?: string;

  flightDepartureDates: SharedTypes.SelectedDates;
  flightReturnDates: SharedTypes.SelectedDates;
  flightOriginId?: string;
  flightOriginName?: string;
  flightDestinationId?: string;
  flightDestinationName?: string;
  flightDefaultOriginId?: string;
  flightDefaultOriginName?: string;
  flightDefaultDestinationId?: string;
  flightDefaultDestinationName?: string;
  flightPassengers: FlightSearchTypes.Passengers;
  flightType: FlightSearchTypes.FlightType;
  flightCabinType: FlightSearchTypes.CabinType;

  vacationDefaultOriginId?: string;
  vacationDefaultOriginName?: string;
  vacationOriginCountryId?: string;
  vacationDefaultDestinationId?: string;
  vacationDefaultDestinationName?: string;
  vacationOriginId?: string;
  vacationOriginName?: string;
  vacationDestinationId?: string;
  vacationDestinationName?: string;
  vacationDates: SharedTypes.SelectedDates;
  vacationIncludesFlight: boolean;
  destinationCountryCode?: string;
  vacationType?: string[];

  setContextState: (state: Partial<this>) => void;
}

export const defaultState: FrontSearchStateContext = {
  activeSearchTab: SearchTabsEnum.Trips,
  isSearchModalOpen: false,
  isDesktopCalendarOpen: false,
  activeLocationAutocomplete: ActiveLocationAutocomplete.None,
  [FrontStepKeys.tripsCurrentStep]: TripsMobileStepsEnum.Details,
  [FrontStepKeys.staysCurrentStep]: StaysMobileStepsEnum.Details,
  [FrontStepKeys.carsCurrentStep]: CarsMobileStepsEnum.Details,
  [FrontStepKeys.flightsCurrentStep]: FlightsMobileStepsEnum.Details,
  [FrontStepKeys.vacationsCurrentStep]: VacationsMobileStepEnum.Details,
  staysOpenedStep: StaysMobileStepsEnum.Details,
  tripsOpenedStep: TripsMobileStepsEnum.Details,
  carsOpenedStep: CarsMobileStepsEnum.Details,
  flightsOpenedStep: FlightsMobileStepsEnum.Details,
  vpOpenedStep: VacationsMobileStepEnum.Details,
  // shared between tabs
  adults: 2,
  childs: undefined,
  childrenAges: [],
  dateFrom: undefined,
  dateTo: undefined,
  isSingleDate: false,

  tripStartingLocationId: undefined,
  tripStartingLocationName: undefined,
  tripStartingLocationItems: undefined,
  defaultTripStartingLocationName: undefined,

  accommodationRooms: 1,
  accommodationId: undefined,
  accommodationAddress: undefined,
  accommodationType: undefined,
  accommodationLocationItems: undefined,

  occupancies: [{ numberOfAdults: 2, childrenAges: [] }],
  useNewGuestPicker: false,

  defaultaccommodationAddress: undefined,
  carPickupLocationId: undefined,
  carDropoffLocationId: undefined,
  carPickupGeoLocation: undefined,
  carDropoffGeoLocation: undefined,
  carDropoffLocationName: undefined,
  carPickupLocationName: undefined,
  carLocationItems: [],
  carTimes: {
    pickup: {
      hour: 10,
      minute: 0,
    },
    dropoff: {
      hour: 10,
      minute: 0,
    },
  },
  carDriverAge: 45,
  carDriverCountry: undefined,
  countryCode: undefined,
  carLocationType: undefined,

  flightDepartureDates: { from: undefined, to: undefined },
  flightReturnDates: { from: undefined, to: undefined },
  flightOriginId: undefined,
  flightOriginName: undefined,
  flightDestinationId: undefined,
  flightDestinationName: undefined,
  flightDefaultOriginId: undefined,
  flightDefaultOriginName: undefined,
  flightDefaultDestinationId: undefined,
  flightDefaultDestinationName: undefined,
  flightPassengers: { adults: 2, children: 0, infants: 0 },
  flightType: "round" as FlightSearchTypes.FlightType,
  flightCabinType: "M" as FlightSearchTypes.CabinType,

  vacationDefaultOriginId: undefined,
  vacationDefaultOriginName: undefined,
  vacationDefaultDestinationId: undefined,
  vacationDefaultDestinationName: undefined,
  vacationOriginId: undefined,
  vacationOriginName: undefined,
  vacationOriginCountryId: undefined,
  vacationDestinationId: undefined,
  vacationDestinationName: undefined,
  vacationDates: { from: undefined, to: undefined },
  vacationIncludesFlight: true,
  destinationCountryCode: undefined,
  vacationType: undefined,

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setContextState: () => {},
};
const { context, Provider, useContext } = contextFactory<FrontSearchStateContext>(defaultState);

export default context;
export const FrontSearchStateContextProvider = Provider;
export const useFrontSearchContext = useContext;
