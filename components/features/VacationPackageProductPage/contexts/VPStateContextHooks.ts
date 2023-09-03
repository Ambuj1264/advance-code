import { useMemo } from "react";

import { getVacationPackageDatesWithDefault } from "../utils/vacationPackageUtils";

import { VPState } from "./VPStateContext";
import { VPFlightState } from "./VPFlightStateContext";
import { VPCarState } from "./VPCarStateContext";

import { getUUID } from "utils/helperUtils";
import { getDriverCountryWithDefault } from "components/ui/CarSearchWidget/utils/carSearchWidgetUtils";
import useVPQueryParams from "components/features/VacationPackages/hooks/useVPQueryParams";
import {
  getDriverAgeFromLocalStorage,
  getDriverCountryFromLocalStorage,
  getTravelersFromLocalStorage,
} from "utils/localStorageUtils";
import { driverAgeDefaultValue } from "components/ui/CarSearchWidget/DriverInformation/driverInformationUtils";
import { useSettings } from "contexts/SettingsContext";
import {
  CHILDREN_MAX_AGE_DEFAULT,
  INFANT_MAX_AGE_DEFAULT,
} from "components/features/FlightSearchPage/utils/flightSearchUtils";
import useVacationSearchQueryParams from "components/features/VacationPackages/utils/useVacationSearchQueryParams";
import { getOccupanciesFromTravelers } from "components/ui/RoomAndGuestPicker/utils/roomAndGuestUtils";
import { decodeOccupanciesArray } from "components/features/AccommodationSearchPage/utils/useAccommodationSearchQueryParams";

export const useGetInitialContextValues = ({
  cheapestMonth,
  vacationLength,
  vpCountryCode,
}: {
  cheapestMonth?: string;
  vacationLength: number;
  vpCountryCode: string;
}) => {
  const [{ dateFrom, dateTo, usePrefetch }] = useVPQueryParams();

  const [{ requestId: vpSearchPageRequestId }] = useVacationSearchQueryParams();
  const preFetchRequestId = vpSearchPageRequestId;
  const requestId = getUUID();
  const vpDates = getVacationPackageDatesWithDefault({
    dateFrom,
    dateTo,
    vacationLength,
    cheapestMonth,
  });
  const initialContext: Partial<VPState> = useMemo(
    () => ({
      requestId,
      preFetchRequestId,
      vacationLength,
      selectedDates: vpDates,
      vpCountryCode,
      usePrefetch,
    }),
    [requestId, preFetchRequestId, vacationLength, vpDates, vpCountryCode, usePrefetch]
  );

  return initialContext;
};

export const useGetInitialCarContextValues = ({
  destinationId,
  subType,
}: {
  destinationId?: string;
  subType?: VacationPackageTypes.VacationPackageResult["subType"];
}) => {
  const [{ originCountryId }] = useVPQueryParams();

  const { countryCode } = useSettings();

  const driverAge = getDriverAgeFromLocalStorage() || driverAgeDefaultValue;

  const driverCountryCode =
    originCountryId ||
    getDriverCountryFromLocalStorage() ||
    getDriverCountryWithDefault(countryCode);
  const vacationIncludesCar =
    subType !== "WeekendBreak" && subType !== "CheapHoliday" && subType !== "CityBreak";

  const initialContext: Partial<VPCarState> = useMemo(
    () => ({
      driverCountryCode,
      driverAge: String(driverAge),
      destinationId,
      vacationIncludesCar,
    }),
    [driverCountryCode, driverAge, destinationId, vacationIncludesCar]
  );

  return initialContext;
};

export const useGetInitialFlightContextValues = () => {
  const [{ originId, originName, includeFlights }] = useVPQueryParams();

  const initialContext: Partial<VPFlightState> = useMemo(
    () => ({
      vacationIncludesFlight: includeFlights === undefined ? false : includeFlights,
      originId,
      origin: originName,
    }),
    [includeFlights, originId, originName]
  );

  return initialContext;
};

export const useGetInitialStayContextValues = () => {
  const [{ occupancies }] = useVPQueryParams();

  const {
    adults: lsAdults,
    children: lsInfants,
    teenagers: lsChildren,
  } = getTravelersFromLocalStorage({
    childrenMaxAge: INFANT_MAX_AGE_DEFAULT,
    teenagerMaxAge: CHILDREN_MAX_AGE_DEFAULT,
  });
  const decodedOccupancies = useMemo(() => decodeOccupanciesArray(occupancies), [occupancies]);
  const travelerOccupancies = useMemo(
    () =>
      getOccupanciesFromTravelers(1, lsAdults > 0 ? lsAdults : 2, lsChildren ?? 0, lsInfants ?? 0),
    [lsAdults, lsChildren, lsInfants]
  );
  const isValidOccupancies = decodedOccupancies.every(
    occupancy =>
      !Number.isNaN(occupancy.numberOfAdults) &&
      occupancy.childrenAges.every(childAge => !Number.isNaN(childAge))
  );
  if (decodedOccupancies.length > 0 && isValidOccupancies) {
    return decodedOccupancies;
  }
  return travelerOccupancies;
};
