import React, { ReactNode, useMemo } from "react";

import {
  getAccommodationLocation,
  getAdjustedDatesInLocalStorage,
  getDriverCountryFromLocalStorage,
  getGuestsFromLocalStorage,
  getNumberOfRoomsFromLocalStorage,
  getPickUpDropOffLocations,
  getToursLocation,
  getTravelersFromLocalStorage,
} from "utils/localStorageUtils";
import {
  FrontSearchStateContext,
  FrontSearchStateContextProvider,
} from "components/ui/FrontSearchWidget/FrontSearchStateContext";
import { constructQueryFromSelectedDates } from "components/ui/DatePicker/utils/datePickerUtils";
import { useSettings } from "contexts/SettingsContext";
import { Marketplace } from "types/enums";

const FrontSearchStateContextProviderContainer = ({
  children,
  context,
  skipCarLsLocation = false,
}: {
  children: ReactNode;
  context: FrontSearchStateContext;
  skipCarLsLocation?: boolean;
}) => {
  const { marketplace } = useSettings();
  const {
    carPickupLocationId,
    carDropoffLocationId,
    accommodationId,
    accommodationAddress,
    accommodationType,
    tripStartingLocationName,
    tripStartingLocationId,
    carPickupLocationName,
    carDropoffLocationName,
  } = context;
  const { adults, children: childrenAges } = getGuestsFromLocalStorage();
  const { dateFrom, dateTo } = constructQueryFromSelectedDates(getAdjustedDatesInLocalStorage());
  const {
    adults: flightsAdults,
    children: flightsInfants,
    teenagers: flightsChildren,
  } = getTravelersFromLocalStorage({
    childrenMaxAge: 2,
    teenagerMaxAge: 11,
  });

  const rooms = getNumberOfRoomsFromLocalStorage();
  const lsCarLocations = useMemo(getPickUpDropOffLocations, []);
  const lsTripLocation = useMemo(getToursLocation, []);
  const lsAccommodationLocation = useMemo(getAccommodationLocation, []);
  const contextCarPickupLocationId =
    carPickupLocationId ||
    (!skipCarLsLocation && lsCarLocations?.pickupId && lsCarLocations?.pickupLocationName
      ? lsCarLocations?.pickupId
      : undefined);
  // eslint-disable-next-line no-nested-ternary
  const contextCarPickupLocatioName = carPickupLocationId
    ? carPickupLocationName
    : !skipCarLsLocation && lsCarLocations?.pickupId && lsCarLocations?.pickupLocationName
    ? lsCarLocations?.pickupLocationName
    : carPickupLocationName;
  const contextCarDropoffId =
    carDropoffLocationId ||
    (!skipCarLsLocation && lsCarLocations?.dropoffId && lsCarLocations?.dropoffLocationName
      ? lsCarLocations?.dropoffId
      : undefined);
  // eslint-disable-next-line no-nested-ternary
  const contextCarDropoffLocatioName = carDropoffLocationId
    ? carDropoffLocationName
    : !skipCarLsLocation && lsCarLocations?.dropoffId && lsCarLocations?.dropoffLocationName
    ? lsCarLocations?.dropoffLocationName
    : carDropoffLocationName;
  const lsCarDriverCountry = useMemo(getDriverCountryFromLocalStorage, []);
  const combinedContext = {
    ...context,
    ...(adults && { adults }),
    ...(childrenAges.length && { childs: childrenAges.length, childrenAges }),
    ...(dateFrom && { dateFrom }),
    ...(dateTo && { dateTo }),
    ...(rooms && { accommodationRooms: rooms }),
    carPickupLocationId: contextCarPickupLocationId,
    carDropoffLocationId: contextCarDropoffId,
    carPickupLocationName: contextCarPickupLocatioName,
    carDropoffLocationName: contextCarDropoffLocatioName,
    carDriverCountry: lsCarDriverCountry,
    tripStartingLocationId: tripStartingLocationId || lsTripLocation?.id,
    tripStartingLocationName: tripStartingLocationName || lsTripLocation?.name,
    accommodationAddress: accommodationAddress || lsAccommodationLocation?.name,
    accommodationId:
      accommodationId || (accommodationAddress ? undefined : lsAccommodationLocation?.id),
    accommodationType: accommodationType || lsAccommodationLocation?.type,
    flightPassengers: {
      adults: flightsAdults || 1,
      children: flightsChildren || 0,
      infants: flightsInfants || 0,
    },
    ...(dateFrom
      ? {
          flightDepartureDates: {
            from: new Date(dateFrom),
            to: undefined,
          },
        }
      : {}),
    ...(dateTo
      ? {
          flightReturnDates: {
            from: new Date(dateTo),
            to: undefined,
          },
        }
      : {}),
    vacationDates: {
      from: dateFrom ? new Date(dateFrom) : undefined,
      to: dateTo ? new Date(dateTo) : undefined,
    },
    useNewGuestPicker: marketplace === Marketplace.GUIDE_TO_EUROPE,
  } as FrontSearchStateContext;
  return (
    <FrontSearchStateContextProvider {...combinedContext}>
      {children}
    </FrontSearchStateContextProvider>
  );
};

export default FrontSearchStateContextProviderContainer;
