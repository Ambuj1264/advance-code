import {
  encodeQueryParams,
  NumberParam,
  NumericArrayParam,
  stringify,
  StringParam,
  ArrayParam,
} from "use-query-params";

import { FrontSearchStateContext } from "components/ui/FrontSearchWidget/FrontSearchStateContext";
import { FlightSearchQueryParam } from "components/features/FlightSearchPage/utils/useFlightSearchQueryParams";
import {
  SearchTabsEnum,
  TripsMobileStepsEnum,
  StaysMobileStepsEnum,
  CarsMobileStepsEnum,
  VacationsMobileStepEnum,
  FlightsMobileStepsEnum,
} from "components/ui/FrontSearchWidget/utils/FrontEnums";
import { getTimeString } from "components/ui/TimePicker/mobileTimePickerUtils";
import {
  AccommodationFilterQueryParam,
  CarFilterQueryParam,
  FilterQueryParam,
  PageType,
  SharedFilterQueryParams,
  FilterQueryEnum,
  GraphCMSSubType,
  OrderBy,
  OrderDirection,
} from "types/enums";
import {
  constructSelectedDatesFromQuery,
  constructQueryFromSelectedDates,
} from "components/ui/DatePicker/utils/datePickerUtils";
import { encodeVPSearchQueryParams } from "components/features/VacationPackages/utils/useVacationSearchQueryParams";
import { encodeOccupanciesToArrayString } from "components/features/AccommodationSearchPage/utils/useAccommodationSearchQueryParams";

export const frontGuestGroups: SharedTypes.GuestGroup[] = [
  {
    id: "adults",
    defaultNumberOfType: 1,
    type: "adults",
  },
  {
    id: "children",
    defaultNumberOfType: 0,
    type: "children",
  },
];

export const getSelectedDatesFromString = ({
  dateFrom,
  dateTo,
}: SharedTypes.SelectedDatesQuery): SharedTypes.SelectedDates | undefined =>
  dateFrom || dateTo ? constructSelectedDatesFromQuery({ dateFrom, dateTo }) : undefined;

export const getPageTypeByTab = (
  tab: SearchTabsEnum,
  carPageType: PageType[],
  staysPageType: PageType[],
  tripsPageType: PageType[]
): PageType => {
  if (SearchTabsEnum.Trips === tab && tripsPageType.length > 0) return tripsPageType[0];
  if (SearchTabsEnum.Stays === tab && staysPageType.length > 0) return staysPageType[0];
  if (SearchTabsEnum.Flights === tab) return PageType.FLIGHTSEARCH;
  if (SearchTabsEnum.Cars === tab && carPageType.length > 0) return carPageType[0];
  if (SearchTabsEnum.VacationPackages === tab) return PageType.VACATION_PACKAGES_LANDING;
  return PageType.CARSEARCH;
};

export const encodeTourQueryParams = (context: FrontSearchStateContext, requestId?: string) => {
  const {
    tripStartingLocationId,
    tripStartingLocationName,
    adults,
    childs,
    childrenAges,
    dateFrom,
    dateTo,
  } = context;

  return `?${stringify(
    encodeQueryParams(
      {
        [FilterQueryParam.STARTING_LOCATION_ID]: StringParam,
        [FilterQueryParam.STARTING_LOCATION_NAME]: StringParam,
        [FilterQueryParam.ADULTS]: NumberParam,
        [FilterQueryParam.CHILDREN]: NumberParam,
        [FilterQueryParam.CHILDREN_AGES]: NumericArrayParam,
        [FilterQueryParam.DATE_FROM]: StringParam,
        [FilterQueryParam.DATE_TO]: StringParam,
        [FilterQueryParam.REQUEST_ID]: StringParam,
      },
      {
        [FilterQueryParam.STARTING_LOCATION_ID]: tripStartingLocationId,
        [FilterQueryParam.STARTING_LOCATION_NAME]: tripStartingLocationName,
        [FilterQueryParam.ADULTS]: adults,
        [FilterQueryParam.CHILDREN]: childs,
        [FilterQueryParam.CHILDREN_AGES]: childrenAges,
        [FilterQueryParam.DATE_FROM]: dateFrom,
        [FilterQueryParam.DATE_TO]: dateTo,
        [FilterQueryParam.REQUEST_ID]: requestId,
      }
    )
  )}`;
};

export const encodeAccomodationQueryParams = (
  context: FrontSearchStateContext,
  defaultSortingOrder = OrderBy.POPULARITY
) => {
  const {
    accommodationRooms,
    adults,
    childrenAges,
    dateFrom,
    dateTo,
    accommodationId,
    accommodationAddress,
    accommodationType,
    accommodationSubtype,
    occupancies,
  } = context;
  const category =
    accommodationSubtype !== GraphCMSSubType.STAYS_TOP_LEVEL ? accommodationSubtype : undefined;
  return `?${stringify(
    encodeQueryParams(
      {
        [AccommodationFilterQueryParam.ADDRESS]: StringParam,
        [AccommodationFilterQueryParam.TYPE]: StringParam,
        [AccommodationFilterQueryParam.ID]: StringParam,
        [AccommodationFilterQueryParam.ADULTS]: NumberParam,
        [AccommodationFilterQueryParam.CHILDREN]: NumericArrayParam,
        [AccommodationFilterQueryParam.DATE_FROM]: StringParam,
        [AccommodationFilterQueryParam.DATE_TO]: StringParam,
        [AccommodationFilterQueryParam.ROOMS]: NumberParam,
        [AccommodationFilterQueryParam.ORDER_BY]: StringParam,
        [AccommodationFilterQueryParam.ORDER_DIRECTION]: StringParam,
        [AccommodationFilterQueryParam.STAY_CATEGORIES]: ArrayParam,
        [AccommodationFilterQueryParam.OCCUPANCIES]: ArrayParam,
      },
      {
        [AccommodationFilterQueryParam.ID]: accommodationId,
        [AccommodationFilterQueryParam.TYPE]: accommodationType,
        [AccommodationFilterQueryParam.ADDRESS]: accommodationAddress,
        [AccommodationFilterQueryParam.ADULTS]: adults,
        [AccommodationFilterQueryParam.CHILDREN]: childrenAges,
        [AccommodationFilterQueryParam.DATE_FROM]: dateFrom,
        [AccommodationFilterQueryParam.DATE_TO]: dateTo,
        [AccommodationFilterQueryParam.ROOMS]: accommodationRooms,
        [AccommodationFilterQueryParam.ORDER_BY]: defaultSortingOrder,
        [AccommodationFilterQueryParam.ORDER_DIRECTION]: OrderDirection.DESC,
        [AccommodationFilterQueryParam.OCCUPANCIES]: encodeOccupanciesToArrayString(occupancies),
        [AccommodationFilterQueryParam.STAY_CATEGORIES]: [category as string],
      }
    )
  )}`;
};

// app.graphcms.com/98897ab275b1430bab08d8343fa465d4/master/schema/enumerations#Subtypes
const carGraphCMSSubtypes = {
  Small: 1,
  Medium: 2,
  Large: 3,
  Estate: 4,
  MiniVan: 5,
  JeepSUV: 6,
  Convertible: 7,
  Premium: 8,
  CamperVan: 9,
  MiniCamper: 10,
  Van: 11,
} as { [key: string]: number };

export const encodeCarQueryParams = (context: FrontSearchStateContext, subtype?: string) => {
  let carType;

  if (subtype?.length) {
    carType = carGraphCMSSubtypes[subtype];
  }
  const {
    dateFrom,
    dateTo,
    carPickupLocationId,
    carDropoffLocationId,
    carPickupGeoLocation,
    carDropoffGeoLocation,
    carDropoffLocationName,
    carPickupLocationName,
    carTimes: { pickup, dropoff },
    carDriverAge,
    carDriverCountry,
    carLocationType,
  } = context;

  return `?${stringify(
    encodeQueryParams(
      {
        [CarFilterQueryParam.PICKUP_LOCATION_ID]: StringParam,
        [CarFilterQueryParam.DROPOFF_LOCATION_ID]: StringParam,
        [CarFilterQueryParam.PICKUP_GEO_LOCATION]: StringParam,
        [CarFilterQueryParam.DROPOFF_GEO_LOCATION]: StringParam,
        [CarFilterQueryParam.PICKUP_LOCATION_NAME]: StringParam,
        [CarFilterQueryParam.DROPOFF_LOCATION_NAME]: StringParam,
        [CarFilterQueryParam.DATE_FROM]: StringParam,
        [CarFilterQueryParam.DATE_TO]: StringParam,
        [CarFilterQueryParam.DRIVER_AGE]: NumberParam,
        [CarFilterQueryParam.DRIVER_COUNTRY]: StringParam,
        [CarFilterQueryParam.CAR_TYPE]: NumberParam,
        [CarFilterQueryParam.CAR_LOCATION_TYPE]: StringParam,
      },
      {
        [CarFilterQueryParam.PICKUP_LOCATION_ID]: carPickupLocationId,
        [CarFilterQueryParam.DROPOFF_LOCATION_ID]: carDropoffLocationId,
        [CarFilterQueryParam.PICKUP_GEO_LOCATION]: carPickupGeoLocation,
        [CarFilterQueryParam.DROPOFF_GEO_LOCATION]: carDropoffGeoLocation,
        [CarFilterQueryParam.DATE_FROM]: `${dateFrom} ${getTimeString(pickup.hour, pickup.minute)}`,
        [CarFilterQueryParam.DATE_TO]: `${dateTo} ${getTimeString(dropoff.hour, dropoff.minute)}`,
        [CarFilterQueryParam.DRIVER_AGE]: carDriverAge,
        [CarFilterQueryParam.DRIVER_COUNTRY]: carDriverCountry,
        [CarFilterQueryParam.DROPOFF_LOCATION_NAME]: carDropoffLocationName,
        [CarFilterQueryParam.PICKUP_LOCATION_NAME]: carPickupLocationName,
        [CarFilterQueryParam.CAR_TYPE]: carType,
        [CarFilterQueryParam.CAR_LOCATION_TYPE]: carLocationType,
      }
    )
  )}`;
};

export const encodeFlightsQueryParams = (context: FrontSearchStateContext) => {
  const {
    flightDepartureDates,
    flightReturnDates,
    flightOriginId,
    flightOriginName,
    flightDestinationId,
    flightDefaultDestinationId,
    flightDefaultDestinationName,
    flightDestinationName,
    flightPassengers,
    flightCabinType,
    flightType,
  } = context;

  const destinationId =
    flightDestinationId === undefined &&
    flightDestinationName?.toLowerCase() === flightDefaultDestinationName?.toLowerCase()
      ? flightDefaultDestinationId
      : flightDestinationId;

  const { dateFrom: returnDateFrom, dateTo: returnDateTo } =
    constructQueryFromSelectedDates(flightReturnDates);
  const { dateFrom, dateTo } = constructQueryFromSelectedDates(flightDepartureDates);
  return `?${stringify(
    encodeQueryParams(
      {
        [SharedFilterQueryParams.DATE_FROM]: StringParam,
        [SharedFilterQueryParams.DATE_TO]: StringParam,
        [FlightSearchQueryParam.RETURN_DATE_FROM]: StringParam,
        [FlightSearchQueryParam.RETURN_DATE_TO]: StringParam,
        [FlightSearchQueryParam.ORIGIN_ID]: StringParam,
        [FlightSearchQueryParam.DESTINATION_ID]: StringParam,
        [FlightSearchQueryParam.DESTINATION_NAME]: StringParam,
        [FlightSearchQueryParam.ORIGIN_NAME]: StringParam,
        [FilterQueryEnum.ADULTS]: NumberParam,
        [FilterQueryEnum.CHILDREN]: NumberParam,
        [FlightSearchQueryParam.INFANTS]: NumberParam,
        [FlightSearchQueryParam.CABIN_TYPE]: StringParam,
        [FlightSearchQueryParam.FLIGHT_TYPE]: StringParam,
        [FlightSearchQueryParam.MAX_STOPS]: StringParam,
      },
      {
        [SharedFilterQueryParams.DATE_FROM]: dateFrom,
        [SharedFilterQueryParams.DATE_TO]: dateTo,
        [FlightSearchQueryParam.RETURN_DATE_FROM]: returnDateFrom,
        [FlightSearchQueryParam.RETURN_DATE_TO]: returnDateTo,
        [FlightSearchQueryParam.ORIGIN_ID]: flightOriginId,
        [FlightSearchQueryParam.DESTINATION_ID]: destinationId,
        [FlightSearchQueryParam.DESTINATION_NAME]: flightDestinationName,
        [FlightSearchQueryParam.ORIGIN_NAME]: flightOriginName,
        [FilterQueryEnum.ADULTS]: flightPassengers.adults,
        [FilterQueryEnum.CHILDREN]: flightPassengers.children,
        [FlightSearchQueryParam.INFANTS]: flightPassengers.infants,
        [FlightSearchQueryParam.CABIN_TYPE]: flightCabinType,
        [FlightSearchQueryParam.FLIGHT_TYPE]: flightType,
        [FlightSearchQueryParam.MAX_STOPS]: "any",
      }
    )
  )}`;
};

export const encodeVacationSearchQueryParams = (context: FrontSearchStateContext) => {
  const {
    vacationDates,
    vacationDestinationId,
    vacationDestinationName,
    vacationOriginId,
    vacationOriginName,
    vacationOriginCountryId,
    vacationIncludesFlight,
    occupancies,
    vacationType,
  } = context;
  const { dateFrom, dateTo } = constructQueryFromSelectedDates(vacationDates);

  return `?${encodeVPSearchQueryParams({
    dateFrom,
    dateTo,
    originId: vacationOriginId,
    originName: vacationOriginName,
    originCountryId: vacationOriginCountryId,
    destinationId: vacationDestinationId,
    destinationName: vacationDestinationName,
    occupancies: encodeOccupanciesToArrayString(occupancies),
    includeFlights: vacationIncludesFlight,
    types: vacationType,
  })}`;
};

export const getActiveService = ({
  activeServiceType,
  onTripsClick,
  onStaysClick,
  onCarsClick,
  onFlightsClick,
  onVacationsClick,
}: {
  activeServiceType: PageType;
  onTripsClick: () => void;
  onStaysClick: () => void;
  onCarsClick: () => void;
  onFlightsClick: () => void;
  onVacationsClick: () => void;
}) => {
  switch (activeServiceType) {
    case PageType.FLIGHTSEARCH:
      return {
        onClick: onFlightsClick,
      };
    case PageType.CARSEARCH:
    case PageType.CARCATEGORY:
    case PageType.GTE_CAR_SEARCH:
      return {
        onClick: onCarsClick,
      };
    case PageType.ACCOMMODATION_SEARCH:
    case PageType.GTE_STAYS_SEARCH:
      return {
        onClick: onStaysClick,
      };
    case PageType.VACATION_PACKAGES_LANDING:
      return {
        onClick: onVacationsClick,
      };
    default:
      return {
        onClick: onTripsClick,
      };
  }
};

export const isCarSearchOrCategory = (pageType: PageType) =>
  pageType === PageType.CARSEARCH ||
  pageType === PageType.CARCATEGORY ||
  pageType === PageType.GTE_CAR_SEARCH;

export const isFlightSearch = (pageType: PageType) => pageType === PageType.FLIGHTSEARCH;

export const isStaysSearch = (pageType: PageType) =>
  pageType === PageType.ACCOMMODATION_SEARCH || pageType === PageType.GTE_STAYS_SEARCH;

export const isVacationSearch = (pageType: PageType) =>
  pageType === PageType.VACATION_PACKAGES_LANDING;

export const isTourSearch = (pageType: PageType) =>
  pageType === PageType.TOURSEARCH || pageType === PageType.GTE_TOUR_SEARCH;

export const getTripsMobileSteps = (
  tripsCurrentStep: TripsMobileStepsEnum,
  dateFrom?: string,
  dateTo?: string,
  tripStartingLocationName?: string
) => {
  const onDatesWithMissingDetails =
    tripsCurrentStep === TripsMobileStepsEnum.Dates && !tripStartingLocationName;
  const onDetailsWithDates =
    tripsCurrentStep === TripsMobileStepsEnum.Details && dateFrom && dateTo;
  if (onDatesWithMissingDetails || onDetailsWithDates) {
    return [TripsMobileStepsEnum.Dates, TripsMobileStepsEnum.Details];
  }
  return [TripsMobileStepsEnum.Details, TripsMobileStepsEnum.Dates];
};

export const getStaysMobileSteps = (
  staysCurrentStep: StaysMobileStepsEnum,
  dateFrom?: string,
  dateTo?: string,
  accommodationAddress?: string
) => {
  const onDatesWithMissingDetails =
    staysCurrentStep === StaysMobileStepsEnum.Dates && !accommodationAddress;
  const onDetailsWithDates =
    staysCurrentStep === StaysMobileStepsEnum.Details && dateFrom && dateTo;
  if (onDatesWithMissingDetails || onDetailsWithDates) {
    return [StaysMobileStepsEnum.Dates, StaysMobileStepsEnum.Details];
  }
  return [StaysMobileStepsEnum.Details, StaysMobileStepsEnum.Dates];
};

export const getCarsMobileSteps = (
  carsCurrentStep: CarsMobileStepsEnum,
  dateFrom?: string,
  dateTo?: string,
  carPickupLocationName?: string,
  carDropoffLocationName?: string
) => {
  const isMissingDetails = !carPickupLocationName || !carDropoffLocationName;
  const onDatesWithMissingDetails =
    carsCurrentStep === CarsMobileStepsEnum.Dates && isMissingDetails;
  const onDetailsWithDates = carsCurrentStep === CarsMobileStepsEnum.Details && dateFrom && dateTo;
  if (onDatesWithMissingDetails || onDetailsWithDates) {
    return [CarsMobileStepsEnum.Dates, CarsMobileStepsEnum.Details];
  }
  return [CarsMobileStepsEnum.Details, CarsMobileStepsEnum.Dates];
};

export const getVPMobileSteps = (
  isSearchResults: boolean,
  vacationsCurrentStep: VacationsMobileStepEnum,
  vacationIncludesFlight: boolean,
  vacationDates: SharedTypes.SelectedDates,
  vacationOriginName?: string,
  vacationDestinationName?: string
) => {
  const { from, to } = vacationDates;
  const isMissingDetails = vacationIncludesFlight
    ? !vacationOriginName || !vacationDestinationName
    : !vacationDestinationName;
  const onDatesWithMissingDetails =
    vacationsCurrentStep === VacationsMobileStepEnum.Dates && isMissingDetails;
  const onDetailsWithDates = vacationsCurrentStep === VacationsMobileStepEnum.Details && from && to;
  if (!isSearchResults && (onDatesWithMissingDetails || onDetailsWithDates)) {
    return [VacationsMobileStepEnum.Dates, VacationsMobileStepEnum.Details];
  }
  return [VacationsMobileStepEnum.Details, VacationsMobileStepEnum.Dates];
};

export const getFlightsMobileSteps = (
  flightsCurrentStep: FlightsMobileStepsEnum,
  onlyDeparture: boolean,
  departureDateFrom?: Date,
  returnDateFrom?: Date,
  flightOriginName?: string,
  flightDestinationName?: string
) => {
  const onDatesWithMissingDetails =
    flightsCurrentStep === FlightsMobileStepsEnum.Dates &&
    (!flightOriginName || !flightDestinationName);
  const hasDates = onlyDeparture ? departureDateFrom : departureDateFrom && returnDateFrom;
  const onDetailsWithDates = flightsCurrentStep === FlightsMobileStepsEnum.Details && hasDates;
  if (onDatesWithMissingDetails || onDetailsWithDates) {
    return [FlightsMobileStepsEnum.Dates, FlightsMobileStepsEnum.Details];
  }
  return [FlightsMobileStepsEnum.Details, FlightsMobileStepsEnum.Dates];
};
