import React, {
  ChangeEvent,
  Context,
  SyntheticEvent,
  useCallback,
  useContext,
  useEffect,
} from "react";
import { useLazyQuery } from "@apollo/react-hooks";
import Router, { useRouter } from "next/router";
import { addDays } from "date-fns";

import { setNumberOfGuestsByTypeUtil, updateChildrenAgesUtil } from "../Filters/utils/filtersUtils";
import { normalizeTourAutocompleteResults } from "../../features/SearchPage/utils/searchUtils";

import {
  encodeAccomodationQueryParams,
  encodeCarQueryParams,
  encodeFlightsQueryParams,
  encodeTourQueryParams,
  encodeVacationSearchQueryParams,
  getPageTypeByTab,
  isCarSearchOrCategory,
  isFlightSearch,
  isStaysSearch,
  isVacationSearch,
  isTourSearch,
} from "./utils/frontUtils";
import {
  FrontSearchStateContext,
  FrontStepKeys,
  useFrontSearchContext,
} from "./FrontSearchStateContext";

import { longCacheHeaders } from "utils/apiUtils";
import {
  CHILDREN_MAX_AGE_DEFAULT,
  INFANT_MAX_AGE_DEFAULT,
} from "components/features/FlightSearchPage/utils/flightSearchUtils";
import SearchPageStateContext from "components/features/SearchPage/SearchPageStateContext";
import { normalizeLocationItems } from "components/features/AccommodationSearchPage/utils/accommodationSearchUtils";
import { addLeadingSlashIfNotPresent, getUUID } from "utils/helperUtils";
import {
  getDepartureDates,
  getReturnDates,
} from "components/ui/FlightSearchWidget/utils/flightSearchWidgetUtils";
import { isProd } from "utils/globalUtils";
import AutocompleteHotelsQuery from "components/features/AccommodationSearchPage/queries/AutocompleteStaysQuery.graphql";
import GTEStaysAutocompleteQuery from "components/features/StaysSearch/queries/GTEStaysAutocompleteQuery.graphql";
import { CarSearchWidgetSharedTypes } from "components/ui/CarSearchWidget/contexts/CarSearchWidgetCallbackContext";
import { CarSearchTimeType, PageType, Marketplace, AutoCompleteType, OrderBy } from "types/enums";
import {
  CarsMobileStepsEnum,
  SearchTabsEnum,
  StaysMobileStepsEnum,
  TripsMobileStepsEnum,
  FlightsMobileStepsEnum,
  VacationsMobileStepEnum,
} from "components/ui/FrontSearchWidget/utils/FrontEnums";
import { changeChildrenAgesLength } from "utils/sharedAccommodationUtils";
import { getShortMonthNumbericDateFormat } from "utils/dateUtils";
import LocaleContext from "contexts/LocaleContext";
import {
  constructQueryFromSelectedDates,
  getAdjustedHourObject,
} from "components/ui/DatePicker/utils/datePickerUtils";
import TourSearchStartingLocationsQuery from "components/features/SearchPage/queries/TourSearchStartingLocationsQuery.graphql";
import GTETourSearchStartingLocationsQuery from "components/features/GTETourSearchPage/queries/GTETourSearchStartingLocationsQuery.graphql";
import GTETourProductUrlQuery from "components/features/GTETourSearchPage/queries/GTETourProductUrlQuery.graphql";
import {
  clearDatesInLocalStorage,
  setAccommodationLocation,
  setDatesInLocalStorage,
  setDriverAgeInLocalStorage,
  setDriverCountryInLocalStorage,
  setFlightsTravellersInLocalstorage,
  setNumberOfGuestsInLocalStorage,
  setNumberOfRoomsInLocalStorage,
  setPickUpDropOffLocations,
  setToursLocation,
  setVpIncludesFlight,
} from "utils/localStorageUtils";
import useActiveLocale from "hooks/useActiveLocale";
import { useSettings } from "contexts/SettingsContext";
import { constructTourStartingLocations } from "components/features/GTETourSearchPage/utils/gteTourSearchUtils";
import useToggle from "hooks/useToggle";
import { useIsMobile } from "hooks/useMediaQueryCustom";
import { hasSameDepartureAndArrivalCities } from "components/features/VacationPackages/utils/vacationPackagesUtils";

export const useToggleIsOpen = () => {
  const { setContextState, isSearchModalOpen } = useFrontSearchContext();

  return useCallback(() => {
    setContextState({ isSearchModalOpen: !isSearchModalOpen });
  }, [isSearchModalOpen, setContextState]);
};

export const useOnCarCalendarOpen = (isMobile: boolean, shouldOpen: boolean) => {
  const { setContextState, isDesktopCalendarOpen, isSearchModalOpen, carsCurrentStep } =
    useFrontSearchContext();

  return useCallback(() => {
    setContextState({
      isSearchModalOpen: isMobile ? shouldOpen : isSearchModalOpen,
      carsCurrentStep: isMobile ? CarsMobileStepsEnum.Dates : carsCurrentStep,
      isDesktopCalendarOpen: !isMobile ? shouldOpen : isDesktopCalendarOpen,
    });
    if (shouldOpen && !isMobile) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [
    setContextState,
    isMobile,
    shouldOpen,
    isSearchModalOpen,
    carsCurrentStep,
    isDesktopCalendarOpen,
  ]);
};

/**
 * TODO - fix this for other marketplaces,
 * currently we have a bug on GTI where clicking on car dates does not opening the calendar
 * https://guidetoiceland.is/iceland-car-rentals/4x4-jeeps-and-suvs
 */
export const useToggleCalendarClientSideState = (shouldOpen: boolean) => {
  const [open, toggle] = useToggle(false);
  const isMobile = useIsMobile();
  const { marketplace } = useSettings();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (!isMobile && marketplace === Marketplace.GUIDE_TO_EUROPE && shouldOpen) {
      // should have this timer as by some reason (depends on the components where it's injected)
      // effect can be run multiple times and this causes dropdown flickering
      timer = setTimeout(() => toggle(true), 200);
    } else toggle(false);

    return () => clearTimeout(timer);
  }, [marketplace, open, shouldOpen, toggle]);

  return open;
};

export const useUpdateChildrenAgesInSearchContext = () => {
  const { setContextState, childrenAges, adultsFilter } = useContext(SearchPageStateContext);
  return useCallback(
    (value: number, index: number) => {
      const updatedChildrenAges = updateChildrenAgesUtil(childrenAges, value, index, adultsFilter);
      setContextState({ childrenAges: updatedChildrenAges });
    },
    [adultsFilter, childrenAges, setContextState]
  );
};

type numberOfGuestsType = {
  childrenAges: number[];
  adultsFilter: number;
  childrenFilter: number;
};

export const useSetNumberOfGuestsByTypeInSearchContext = (
  context: Context<
    {
      setContextState: (state: Partial<numberOfGuestsType>) => void;
    } & numberOfGuestsType
  >
) => {
  const { setContextState, childrenAges, adultsFilter } = useContext(context);
  return useCallback(
    (type: SharedTypes.TravelerType, number: number) => {
      const result = setNumberOfGuestsByTypeUtil(type, number, adultsFilter, childrenAges);
      setContextState({
        [`${type}Filter`]: number,
        childrenAges: result.actualChildrenAges,
      });
    },
    [adultsFilter, childrenAges, setContextState]
  );
};

export const useOnGTETourLocationProductClick = () => {
  const locale = useActiveLocale();
  const [fetchProductUrl] = useLazyQuery<{
    tourProductPages: {
      url: string;
    }[];
  }>(GTETourProductUrlQuery, {
    onCompleted: ({ tourProductPages }) => {
      Router.push(
        {
          pathname: tourProductPages.length > 0 ? PageType.GTE_TOUR : PageType.GTE_FRONT_PAGE,
        },
        tourProductPages[0]?.url ?? `/`,
        {
          shallow: true,
        }
      );
    },
  });

  return useCallback(
    (productCode: string) => {
      fetchProductUrl({
        variables: {
          where: {
            tourId: productCode,
          },
          locale,
        },
      });
    },
    [fetchProductUrl, locale]
  );
};

export const useOnTourLocationItemClick = () => {
  const { setContextState } = useFrontSearchContext();
  const { marketplace } = useSettings();
  const isGTE = marketplace === Marketplace.GUIDE_TO_EUROPE;
  const onGTETourLocationProductClick = useOnGTETourLocationProductClick();
  return useCallback(
    (selectedValue?: SharedTypes.AutocompleteItem) => {
      if (selectedValue?.type === AutoCompleteType.PRODUCT && isGTE) {
        onGTETourLocationProductClick(selectedValue!.id);
      } else {
        setContextState({
          tripStartingLocationId: selectedValue?.id,
          tripStartingLocationName: selectedValue?.name,
        });
        setToursLocation({
          id: selectedValue?.id,
          name: selectedValue?.name,
        });
      }
    },
    [setContextState]
  );
};

export const useSetSingleDate = () => {
  const { setContextState } = useFrontSearchContext();
  return useCallback(
    (dates: SharedTypes.SelectedDates) => {
      setDatesInLocalStorage({ from: dates.from, to: dates.from });
      const queryDates = constructQueryFromSelectedDates(dates);
      setContextState({
        dateFrom: queryDates.dateFrom,
        dateTo: queryDates.dateFrom,
      });
    },
    [setContextState]
  );
};

export const useSetRangeDates = () => {
  const { setContextState } = useFrontSearchContext();
  return useCallback(
    (dates: SharedTypes.SelectedDates) => {
      setDatesInLocalStorage(dates);
      const queryDates = constructQueryFromSelectedDates(dates);
      setContextState({
        dateFrom: queryDates.dateFrom,
        dateTo: queryDates.dateTo,
      });
    },
    [setContextState]
  );
};

export const useSetRangeDatesWithTime = () => {
  const { setContextState, carTimes } = useFrontSearchContext();

  return useCallback(
    ({ from, to }: SharedTypes.SelectedDates) => {
      const adjustedPickupHour = getAdjustedHourObject(from, carTimes.pickup);
      const adjustedDropoffHour = getAdjustedHourObject(to, carTimes.dropoff);

      const newDates = {
        from: from && adjustedPickupHour.isNextDay ? addDays(from, 1) : from,
        to: to && adjustedDropoffHour.isNextDay ? addDays(to, 1) : to,
      };
      setDatesInLocalStorage(newDates);
      const constructedDates = constructQueryFromSelectedDates(newDates);
      setContextState({
        ...constructedDates,
        carTimes: {
          ...carTimes,
          [CarSearchTimeType.PICKUP]: {
            ...carTimes[CarSearchTimeType.PICKUP],
            hour: adjustedPickupHour.hour,
          },
          [CarSearchTimeType.DROPOFF]: {
            ...carTimes[CarSearchTimeType.DROPOFF],
            hour: adjustedDropoffHour.hour,
          },
        },
      });
    },
    [carTimes, setContextState]
  );
};

export const useOnIncludeFlightsToggle = () => {
  const { setContextState } = useFrontSearchContext();

  return useCallback(
    (checked: boolean) => {
      setVpIncludesFlight(checked);
      setContextState({
        vacationIncludesFlight: checked,
        ...(!checked
          ? {
              vacationOriginName: undefined,
              vacationOriginId: undefined,
              vacationDefaultOriginId: undefined,
              vacationDefaultOriginName: undefined,
            }
          : {}),
      });
    },
    [setContextState]
  );
};

export const useSetNumberOfGuestsByType = () => {
  const { setContextState, childrenAges, adults } = useFrontSearchContext();

  return useCallback(
    (type: SharedTypes.TravelerType, number: number) => {
      const result = setNumberOfGuestsByTypeUtil(type, number, adults, childrenAges);
      setContextState({
        [result.type]: number,
        childrenAges: result.actualChildrenAges,
      });
    },
    [adults, childrenAges, setContextState]
  );
};

export const useSetNumberOfGuests = () => {
  const { setContextState, childrenAges, childs: contextChildren } = useFrontSearchContext();

  return useCallback(
    (adults: number, children: number) => {
      const actualChildrenAges =
        children !== contextChildren
          ? changeChildrenAgesLength(childrenAges, children)
          : childrenAges;

      setNumberOfGuestsInLocalStorage({ adults, children: actualChildrenAges });

      setContextState({
        adults,
        childs: children,
        childrenAges: actualChildrenAges,
      });
    },
    [childrenAges, contextChildren, setContextState]
  );
};

export const useUpdateChildrenAges = () => {
  const { setContextState, childrenAges, adults } = useFrontSearchContext();

  return useCallback(
    (value: number, index: number) => {
      const updatedChildrenAges = updateChildrenAgesUtil(childrenAges, value, index, adults);
      setContextState({ childrenAges: updatedChildrenAges });
    },
    [adults, childrenAges, setContextState]
  );
};

export const useSetRoomsNumber = () => {
  const { setContextState } = useFrontSearchContext();

  return useCallback(
    (rooms: number) => {
      setNumberOfRoomsInLocalStorage(rooms);

      setContextState({
        accommodationRooms: rooms,
      });
    },
    [setContextState]
  );
};

export const useSetOccupancies = () => {
  const { setContextState } = useFrontSearchContext();

  return useCallback(
    (occupancies: StayBookingWidgetTypes.Occupancy[]) => {
      setContextState({
        occupancies,
      });
    },
    [setContextState]
  );
};

export const useOnDatesClear = () => {
  const { setContextState } = useFrontSearchContext();

  return useCallback(() => {
    clearDatesInLocalStorage();
    setContextState({
      dateFrom: undefined,
      dateTo: undefined,
    });
  }, [setContextState]);
};

export const useOpenParticularTabModal = () => {
  const { setContextState } = useFrontSearchContext();

  return useCallback(
    (step: SearchTabsEnum, contextKey: keyof FrontSearchStateContext) => () =>
      setContextState({
        [contextKey]: 0,
        isSearchModalOpen: true,
        activeSearchTab: step,
      }),
    [setContextState]
  );
};

export const useOnTripsClick = () =>
  useOpenParticularTabModal()(SearchTabsEnum.Trips, FrontStepKeys.tripsCurrentStep);

export const useOnStaysClick = () =>
  useOpenParticularTabModal()(SearchTabsEnum.Stays, FrontStepKeys.staysCurrentStep);

export const useOnCarsClick = () =>
  useOpenParticularTabModal()(SearchTabsEnum.Cars, FrontStepKeys.carsCurrentStep);

export const useOnFlightsClick = () =>
  useOpenParticularTabModal()(SearchTabsEnum.Flights, FrontStepKeys.flightsCurrentStep);

export const useOnVacationsClick = () =>
  useOpenParticularTabModal()(SearchTabsEnum.VacationPackages, FrontStepKeys.vacationsCurrentStep);

export const useDatesShort = (selectedDates?: SharedTypes.SelectedDates) => {
  const activeLocale = useContext(LocaleContext);

  const startDateShort =
    selectedDates?.from && getShortMonthNumbericDateFormat(selectedDates.from, activeLocale);
  const endDateShort =
    selectedDates?.to && getShortMonthNumbericDateFormat(selectedDates.to, activeLocale);

  return { startDateShort, endDateShort };
};

export const useGetParticularStepOpenHandler = <T>(contextKey: keyof FrontSearchStateContext) => {
  const {
    setContextState,
    isSearchModalOpen,
    staysOpenedStep,
    tripsOpenedStep,
    carsOpenedStep,
    flightsOpenedStep,
    vpOpenedStep,
  } = useFrontSearchContext();
  return useCallback(
    (step: T, additionalState?: Partial<FrontSearchStateContext>) => () => {
      const isStaysTab = contextKey === FrontStepKeys.staysCurrentStep;
      const isCarsTab = contextKey === FrontStepKeys.carsCurrentStep;
      const isFlightsTab = contextKey === FrontStepKeys.flightsCurrentStep;
      const isVPTab = contextKey === FrontStepKeys.vacationsCurrentStep;
      const isTripsTab = contextKey === FrontStepKeys.tripsCurrentStep;
      setContextState({
        [contextKey]: step,
        staysOpenedStep: isStaysTab ? (step as unknown as StaysMobileStepsEnum) : staysOpenedStep,
        tripsOpenedStep: isTripsTab ? (step as unknown as TripsMobileStepsEnum) : tripsOpenedStep,
        carsOpenedStep: isCarsTab ? (step as unknown as CarsMobileStepsEnum) : carsOpenedStep,
        flightsOpenedStep: isFlightsTab
          ? (step as unknown as FlightsMobileStepsEnum)
          : flightsOpenedStep,
        vpOpenedStep: isVPTab ? (step as unknown as VacationsMobileStepEnum) : vpOpenedStep,
        isSearchModalOpen: !isSearchModalOpen,
        activeSearchTab:
          // eslint-disable-next-line no-nested-ternary
          isCarsTab
            ? SearchTabsEnum.Cars
            : // eslint-disable-next-line no-nested-ternary
            isStaysTab
            ? SearchTabsEnum.Stays
            : // eslint-disable-next-line no-nested-ternary
            isFlightsTab
            ? SearchTabsEnum.Flights
            : // eslint-disable-next-line no-nested-ternary
            isVPTab
            ? SearchTabsEnum.VacationPackages
            : SearchTabsEnum.Trips,
        ...(additionalState || null),
      });
    },
    [contextKey, isSearchModalOpen, setContextState]
  );
};

export const useOnGTETourLocationInputChange = () => {
  const { setContextState } = useFrontSearchContext();

  const [fetchGTETourSearchLocations] = useLazyQuery<{
    toursAndTicketsLocations: GTETourSearchTypes.QueryStartingLocation[];
  }>(GTETourSearchStartingLocationsQuery, {
    onCompleted: tourLocationsData => {
      setContextState({
        tripStartingLocationItems: constructTourStartingLocations(
          tourLocationsData.toursAndTicketsLocations
        ),
      });
    },
  });

  return useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const searchValue = e.target.value || "";
      setContextState({
        tripStartingLocationName: searchValue,
      });
      fetchGTETourSearchLocations({
        variables: {
          query: searchValue,
        },
      });
      if (!searchValue) {
        setToursLocation(undefined);
      }
    },
    [fetchGTETourSearchLocations, setContextState]
  );
};

export const useOnTourLocationInputChange = () => {
  const { setContextState } = useFrontSearchContext();

  const [fetchTourSearchLocations] = useLazyQuery<SharedTypes.QueryTourSearchStartingLocations>(
    TourSearchStartingLocationsQuery,
    {
      context: { headers: longCacheHeaders },
      onCompleted: tourSearchLocationsData => {
        setContextState({
          tripStartingLocationItems: normalizeTourAutocompleteResults(tourSearchLocationsData),
        });
      },
    }
  );

  return useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      fetchTourSearchLocations({
        variables: {
          name: e.target.value,
        },
      });

      if (!e.target.value) {
        setContextState({
          tripStartingLocationId: undefined,
          tripStartingLocationName: undefined,
        });
        setToursLocation(undefined);
      }
    },
    [fetchTourSearchLocations, setContextState]
  );
};

export const useToursLocationHooks = (marketplace: Marketplace) => {
  const onLocationInputChange = useOnTourLocationInputChange();
  const onGTELocationInputChange = useOnGTETourLocationInputChange();
  const onLocationItemClick = useOnTourLocationItemClick();
  return {
    onLocationInputChange:
      marketplace === Marketplace.GUIDE_TO_EUROPE
        ? onGTELocationInputChange
        : onLocationInputChange,
    onLocationItemClick,
  };
};

export const useOnStaysLocationInputChange = () => {
  const { setContextState } = useFrontSearchContext();
  const [fetchAutocompletePlaces] =
    useLazyQuery<AccommodationSearchTypes.QueryAccommodationAutoComplete>(AutocompleteHotelsQuery, {
      onCompleted: ({ autoCompletePlaces }) =>
        setContextState({
          accommodationLocationItems: normalizeLocationItems(autoCompletePlaces),
        }),
    });
  return useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const searchValue = e.target.value;

      setContextState({
        accommodationAddress: searchValue,
      });
      fetchAutocompletePlaces({
        variables: {
          text: searchValue,
        },
      });

      if (!searchValue) {
        setAccommodationLocation(undefined);
      }
    },
    [fetchAutocompletePlaces, setContextState]
  );
};

export const useOnGTEStaysLocationInputChange = () => {
  const { setContextState } = useFrontSearchContext();
  const [fetchAutocompletePlaces] = useLazyQuery<{
    staysLocations: SharedTypes.AutocompleteItem[];
  }>(GTEStaysAutocompleteQuery, {
    onCompleted: ({ staysLocations }) =>
      setContextState({
        accommodationLocationItems: normalizeLocationItems(staysLocations),
      }),
  });
  return useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const searchValue = e.target.value;

      setContextState({
        accommodationAddress: searchValue,
      });
      fetchAutocompletePlaces({
        variables: {
          request: {
            searchTerm: searchValue,
          },
        },
      });

      if (!searchValue) {
        setAccommodationLocation(undefined);
      }
    },
    [fetchAutocompletePlaces, setContextState]
  );
};

export const useOnStaysLocationItemClick = () => {
  const { setContextState } = useFrontSearchContext();

  return useCallback(
    (selectedValue?: SharedTypes.AutocompleteItem) => {
      if (selectedValue) {
        const { id, type, name } = selectedValue;

        setContextState({
          accommodationAddress: name,
          accommodationType: type,
          accommodationId: id,
        });
        setAccommodationLocation({
          name,
          type,
          id,
        });
      }
    },
    [setContextState]
  );
};

export const useStaysLocationHooks = (marketplace: Marketplace) => {
  const onLocationInputChange = useOnStaysLocationInputChange();
  const onGTELocationInputChange = useOnGTEStaysLocationInputChange();
  const onLocationItemClick = useOnStaysLocationItemClick();
  return {
    onLocationInputChange:
      marketplace === Marketplace.GUIDE_TO_EUROPE
        ? onGTELocationInputChange
        : onLocationInputChange,
    onLocationItemClick,
  };
};

export const useOnCarsHourChange = () => {
  const { setContextState, carTimes } = useFrontSearchContext();

  return useCallback(
    (hour: number, timeType: SharedCarTypes.SearchTimeTypes) =>
      setContextState({
        carTimes: {
          ...carTimes,
          [timeType]: {
            ...carTimes[timeType],
            hour,
          },
        },
      }),
    [carTimes, setContextState]
  );
};

export const useOnCarsMinuteChange = () => {
  const { setContextState, carTimes } = useFrontSearchContext();

  return useCallback(
    (minute: number, timeType: SharedCarTypes.SearchTimeTypes) =>
      setContextState({
        carTimes: {
          ...carTimes,
          [timeType]: {
            ...carTimes[timeType],
            minute,
          },
        },
      }),
    [carTimes, setContextState]
  );
};

export const useOnCarsPickupTimeChange = () => {
  const { setContextState, carTimes } = useFrontSearchContext();

  return useCallback(
    (pickup: SharedTypes.Time) =>
      setContextState({
        carTimes: {
          ...carTimes,
          pickup,
        },
      }),
    [carTimes, setContextState]
  );
};

export const useOnCarsDropoffTimeChange = () => {
  const { setContextState, carTimes } = useFrontSearchContext();

  return useCallback(
    (dropoff: SharedTypes.Time) =>
      setContextState({
        carTimes: {
          ...carTimes,
          dropoff,
        },
      }),
    [carTimes, setContextState]
  );
};

export const useOnCarsPickupLocationItemClick = () => {
  const { setContextState } = useFrontSearchContext();

  return useCallback<CarSearchWidgetSharedTypes["onLocationChange"]>(
    item => {
      if (!item) return;
      setContextState({
        carPickupLocationId: item.id,
        carPickupGeoLocation: item.geoLocation,
        carPickupLocationName: item.name,
        carDropoffLocationId: item.id,
        carDropoffGeoLocation: item.geoLocation,
        carDropoffLocationName: item.name,
        carLocationType: item.type,
      });
      setPickUpDropOffLocations({
        pickupId: item.id,
        pickupLocationName: item.name,
        dropoffId: item.id,
        dropoffLocationName: item.name,
      });
    },
    [setContextState]
  );
};

export const useOnCarsDropoffLocationItemClick = () => {
  const { setContextState } = useFrontSearchContext();

  return useCallback<CarSearchWidgetSharedTypes["onLocationChange"]>(
    item => {
      if (!item) return;
      setContextState({
        carDropoffLocationId: item.id,
        carDropoffLocationName: item.name,
        carDropoffGeoLocation: item.geoLocation,
      });
      setPickUpDropOffLocations({
        dropoffId: item.id,
        dropoffLocationName: item.name,
      });
    },
    [setContextState]
  );
};

export const useOnCarLocationClear = () => {
  const { setContextState } = useFrontSearchContext();

  return useCallback(
    (pickupDropoff?: "pickup" | "dropoff") => {
      if (!pickupDropoff) return;
      if (pickupDropoff === "pickup") {
        setContextState({
          carPickupLocationId: undefined,
          carPickupLocationName: undefined,
        });
      }
      if (pickupDropoff === "dropoff") {
        setContextState({
          carDropoffLocationId: undefined,
          carDropoffLocationName: undefined,
        });
      }
    },
    [setContextState]
  );
};

export const useOnCarsDriverAgeChange = () => {
  const { setContextState } = useFrontSearchContext();

  return useCallback(
    (driverAge: string) => {
      setDriverAgeInLocalStorage(driverAge);
      setContextState({
        carDriverAge: Number(driverAge),
      });
    },
    [setContextState]
  );
};

export const useOnCarsDriverCountryChange = () => {
  const { setContextState } = useFrontSearchContext();
  return useCallback(
    (driverCountry: string) => {
      setDriverCountryInLocalStorage(driverCountry);
      setContextState({
        carDriverCountry: driverCountry,
      });
    },
    [setContextState]
  );
};

export const useOnFlightsDepartureDateSelection = () => {
  const { setContextState, flightReturnDates } = useFrontSearchContext();
  return useCallback(
    (selectedDepartureDates: SharedTypes.SelectedDates) => {
      setDatesInLocalStorage({ from: selectedDepartureDates.from });
      setContextState({
        flightDepartureDates: selectedDepartureDates,
        flightReturnDates: getReturnDates(selectedDepartureDates, flightReturnDates),
      });
    },
    [flightReturnDates, setContextState]
  );
};

export const useOnFlightsReturnDateSelection = () => {
  const { setContextState, flightDepartureDates } = useFrontSearchContext();
  return useCallback(
    (selectedReturnDates: SharedTypes.SelectedDates) => {
      setDatesInLocalStorage({ to: selectedReturnDates.from });
      setContextState({
        flightReturnDates: selectedReturnDates,
        flightDepartureDates: getDepartureDates(flightDepartureDates, selectedReturnDates),
      });
    },
    [flightDepartureDates, setContextState]
  );
};

export const useOnClearFlightDates = () => {
  const { setContextState } = useFrontSearchContext();

  return useCallback(() => {
    clearDatesInLocalStorage();
    setContextState({
      flightDepartureDates: { from: undefined, to: undefined },
      flightReturnDates: { from: undefined, to: undefined },
    });
  }, [setContextState]);
};

export const useOnFlightsOriginChange = () => {
  const { setContextState } = useFrontSearchContext();
  return useCallback(
    (id?: string, name?: string) => {
      setContextState({
        flightOriginId: id,
        flightOriginName: name,
      });
    },
    [setContextState]
  );
};

export const useOnFlightsDestinationChange = () => {
  const { setContextState } = useFrontSearchContext();
  return useCallback(
    (id?: string, name?: string) => {
      setContextState({
        flightDestinationId: id,
        flightDestinationName: name,
      });
    },
    [setContextState]
  );
};

export const useOnFlightTypeChange = () => {
  const { setContextState, flightReturnDates } = useFrontSearchContext();
  return useCallback(
    (flightType: FlightSearchTypes.FlightType) => {
      const selectedReturnDates =
        flightType === "oneway" ? { from: undefined, to: undefined } : flightReturnDates;
      setContextState({
        flightType,
        flightReturnDates: selectedReturnDates,
      });
    },
    [flightReturnDates, setContextState]
  );
};

export const useOnFlightsPassengersChange = () => {
  const { setContextState, flightPassengers } = useFrontSearchContext();
  return useCallback(
    (passengerType: FlightSearchTypes.PassengerType, value: number) => {
      const passengers = {
        ...flightPassengers,
        [passengerType]: value,
      };
      setFlightsTravellersInLocalstorage({
        newValue: value,
        passengerType,
        infantMaxAge: INFANT_MAX_AGE_DEFAULT,
        childrenMaxAge: CHILDREN_MAX_AGE_DEFAULT,
        numberOfChildren: flightPassengers.children,
        numberOfInfants: flightPassengers.infants,
      });
      setContextState({
        flightPassengers: passengers,
      });
    },
    [flightPassengers, setContextState]
  );
};

export const useOnFlightsCabinTypeChange = () => {
  const { setContextState } = useFrontSearchContext();
  return useCallback(
    (cabinType: FlightSearchTypes.CabinType) => {
      setContextState({
        flightCabinType: cabinType,
      });
    },
    [setContextState]
  );
};

export const useOnVacationsOriginChange = () => {
  const { setContextState } = useFrontSearchContext();
  return useCallback(
    (id?: string, name?: string, countryCode?: string) => {
      setContextState({
        vacationOriginId: id,
        vacationOriginName: name,
        vacationOriginCountryId: countryCode,
      });
    },
    [setContextState]
  );
};

export const useOnVacationsDestinationChange = () => {
  const { setContextState } = useFrontSearchContext();
  return useCallback(
    (id?: string, name?: string) => {
      setContextState({
        vacationDestinationId: id,
        vacationDestinationName: name,
      });
    },
    [setContextState]
  );
};

export const useOnVacationsDateSelection = () => {
  const { setContextState } = useFrontSearchContext();
  return useCallback(
    (selectedDates: SharedTypes.SelectedDates) => {
      setDatesInLocalStorage(selectedDates);
      setContextState({
        vacationDates: selectedDates,
      });
    },
    [setContextState]
  );
};

export const useOnClearVacationsDates = () => {
  const { setContextState } = useFrontSearchContext();

  return useCallback(() => {
    clearDatesInLocalStorage();
    setContextState({
      vacationDates: { from: undefined, to: undefined },
    });
  }, [setContextState]);
};

export const useOnSetOccupancies = () => {
  const { setContextState } = useFrontSearchContext();
  return useCallback(
    (occupancies: StayBookingWidgetTypes.Occupancy[]) => {
      setContextState({
        occupancies,
      });
    },
    [setContextState]
  );
};

export const useOnSearchClick = (
  activeServices: SharedTypes.PageItemType[],
  isCategoryPage?: boolean
) => {
  const router = useRouter();
  const activeLocale = useActiveLocale();
  const context = useFrontSearchContext();
  const { marketplace } = useSettings();
  return useCallback(
    (e: SyntheticEvent) => {
      e.preventDefault();

      const { activeSearchTab } = context;

      const { carPageType, staysPageType, tripsPageType } = activeServices.reduce(
        (acc, service) => {
          if (isCarSearchOrCategory(service.pageType)) {
            // eslint-disable-next-line functional/immutable-data
            acc.carPageType.push(service.pageType);
          } else if (isStaysSearch(service.pageType)) {
            // eslint-disable-next-line functional/immutable-data
            acc.staysPageType.push(service.pageType);
          } else if (isTourSearch(service.pageType)) {
            // eslint-disable-next-line functional/immutable-data
            acc.tripsPageType.push(service.pageType);
          }
          return acc;
        },
        {
          carPageType: [] as PageType[],
          staysPageType: [] as PageType[],
          tripsPageType: [] as PageType[],
        }
      );

      let pageType = getPageTypeByTab(activeSearchTab, carPageType, staysPageType, tripsPageType);

      const categorySettings = activeServices.find(c => c.pageType === pageType);
      const as = categorySettings?.uri || "";
      const isLegacy = Boolean(categorySettings?.isLegacy && isProd()) || activeLocale === "zh_CN";
      let encodedParams;

      if (isTourSearch(pageType)) {
        encodedParams = encodeTourQueryParams(
          context,
          marketplace === Marketplace.GUIDE_TO_EUROPE ? getUUID() : undefined
        );
        pageType = isCategoryPage ? PageType.TOURCATEGORY : pageType;
      } else if (isVacationSearch(pageType)) {
        const isFlightDepartureAndArrivalSame =
          context.vacationIncludesFlight &&
          hasSameDepartureAndArrivalCities(context.vacationOriginId, context.vacationDestinationId);

        encodedParams = encodeVacationSearchQueryParams(
          isFlightDepartureAndArrivalSame ? { ...context, vacationIncludesFlight: false } : context
        );

        if (isFlightDepartureAndArrivalSame) {
          context.setContextState({
            vacationIncludesFlight: false,
          });
        }
      } else if (isStaysSearch(pageType)) {
        encodedParams = encodeAccomodationQueryParams(
          context,
          marketplace === Marketplace.GUIDE_TO_EUROPE ? OrderBy.POPULARITY : undefined
        );
      } else if (isCarSearchOrCategory(pageType)) {
        encodedParams = encodeCarQueryParams(context, categorySettings?.subtype);
      } else if (isFlightSearch(pageType)) {
        encodedParams = encodeFlightsQueryParams(context);
      }

      if (isLegacy) {
        // eslint-disable-next-line functional/immutable-data
        window.location.assign(
          `${window.location.origin}${addLeadingSlashIfNotPresent(as)}${encodedParams}`
        );
      } else {
        // eslint-disable-next-line functional/immutable-data
        router
          .push(
            {
              pathname: `/${pageType}`,
              search: encodedParams,
            },
            `${addLeadingSlashIfNotPresent(as)}${encodedParams}`,
            { shallow: true }
          )
          .then(() => window.scrollTo(0, 0));
      }
    },
    [activeLocale, activeServices, context, isCategoryPage, marketplace, router]
  );
};
