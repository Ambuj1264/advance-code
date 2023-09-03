import React, { createContext, ReactNode, useCallback, useContext } from "react";
import { addDays } from "date-fns";

import {
  constructCarPriceInput,
  constructStayPriceInput,
  extractGroupedDaysValue,
  constructToursPriceInput,
  constructFlightPriceInput,
  getNewSelectedHotels,
  getSelectedHotelsRooms,
  getUpdatedSelectedHotelsRooms,
} from "../utils/vacationPackageUtils";
import { hasCarPriceInputChanged } from "../VPCarSection/vpCarSectionUtils";
import { hasFlightPriceInputChanged } from "../VPFlightSection/vpFlightUtils";
import {
  getPreselectedTourTime,
  isSomeBookingQuestionsEmpty,
  isSomeTravelerQuestionEmpty,
  isSomeTourQuestionsEmpty,
  getUpdatedSelectedTourProducts,
  getUpdatedSelectedTours,
  getNewTourBookingQuestions,
  getNewTourTravelerQuestions,
  doesNewTourOverlapWithOthers,
  hasTourInputChanged,
} from "../VPToursSection/utils/vpToursUtils";
import { isRoomAlreadySelected } from "../VPStaysSection/vpStaysUtils";

import { VPCarCallbackContext, VPCarStateContext } from "./VPCarStateContext";
import { VPPriceCallbackContext, VPPriceStateContext } from "./VPPriceStateContext";
import { VPFlightCallbackContext, VPFlightStateContext } from "./VPFlightStateContext";
import { VPStayCallbackContext, VPStayStateContext } from "./VPStayStateContext";
import { VPTourCallbackContext, VPTourStateContext } from "./VPTourStateContext";
import { VPStateContext, VPCallbackContext } from "./VPStateContext";

import { GTETourBookingWidgetStateContext } from "components/features/GTETourProductPage/GTETourBookingWidget/GTETourBookingWidgetStateContext";
import { Product } from "types/enums";
import { setDatesInLocalStorage } from "utils/localStorageUtils";
import FlightCallbackContext from "components/features/Flight/contexts/FlightCallbackContext";
import CarBookingWidgetStateContext from "components/features/Car/CarBookingWidget/contexts/CarBookingWidgetStateContext";
import CarBookingWidgetCallbackContext from "components/features/Car/CarBookingWidget/contexts/CarBookingWidgetCallbackContext";
import {
  constructBaggage,
  getInitialPassengers,
} from "components/features/Flight/utils/flightUtils";
import { useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";
import { getCondensedFlightItinerary } from "components/ui/FlightsShared/flightsSharedUtils";
import {
  getInitialSelectedTourOption,
  getTotalPrice,
  constructTourQuestions,
  getTotalTravelers,
} from "components/features/GTETourProductPage/GTETourBookingWidget/utils/gteTourBookingWidgetUtils";
import {
  getBookingQuestionAnswers,
  constructGTETourCartInput,
} from "components/features/GTETourProductPage/GTETourBookingWidget/utils/cartUtils";
import { getFormattedDate, yearMonthDayFormat } from "utils/dateUtils";
import { useAddNotification } from "components/features/ProductPageNotification/contexts/NotificationStateHooks";
import { getTravelersFromOccupancies } from "components/ui/RoomAndGuestPicker/utils/roomAndGuestUtils";

type VPActionCallback = {
  onIncludeVPCarsToggle: (checked: boolean) => void;
  onSelectVPCarOffer: (productId: string) => void;
  onSetVPCarOffer: (carOffer: CarTypes.CarOffer) => void;
  onSetVPPrice: (
    price?: number,
    carPrices?: VacationPackageTypes.CarPrice[],
    flightPrices?: VacationPackageTypes.FlightPrice[],
    stayPrices?: VacationPackageTypes.StayPrice[]
  ) => void;
  onIncludeVPFlightsToggle: (checked: boolean) => void;
  onVPFlightTypeChange: (flightType: FlightSearchTypes.FlightType) => void;
  onVPCabinTypeChange: (cabinType: FlightSearchTypes.CabinType) => void;
  onVPFlightItinerarySelect: (selectedProductId: string) => void;
  onVPOriginLocationChange: (id?: string, name?: string, countryCode?: string) => void;
  onSelectVPStayProduct: (day: number, productId: number | string) => void;
  onSelectVPStayProductRooms: (
    day: number,
    productId: number | string,
    roomCombinationId: string,
    availabilityId: string
  ) => void;
  onSubmitVPTourProduct: (
    day: number,
    productId: string,
    tourSelectedDates: SharedTypes.SelectedDates,
    tourNumberOfTravelers: GTETourBookingWidgetTypes.AgeBand[],
    bookingQuestions: GTETourBookingWidgetTypes.TourQuestionAnswer[],
    travelerQuestions: GTETourBookingWidgetTypes.TravelerQuestions[],
    allowCustomTravelerPickup: boolean,
    tourOptions: GTETourBookingWidgetTypes.TourOption[],
    selectedTourOption?: GTETourBookingWidgetTypes.SelectedTourOption,
    durationInMinutes?: number
  ) => void;
  onUpdateSelectedVPToursProductIds: (
    newSelectedToursProductIds: VacationPackageTypes.SelectedToursProductIds[],
    day: number
  ) => void;
  onSetVPFlightPriceInput: (passengers: FlightTypes.PassengerDetails[]) => void;
  onVPFlightBaggageCompleted: (flightData: VacationPackageTypes.FlightIteneraryType) => void;
  onCarEditModalClose: () => void;
  onVPDateSelection: (newSelectedDates: SharedTypes.SelectedDates) => void;
  onSelectVPTourProduct: (day: number, productId: string) => void;
  onSetVPDriverCountryCode: (countryCode: string) => void;
  onSetVPDriverAge: (driverAge: string) => void;
  onVPTourProductCompleted: (
    setContextState: (state: Partial<GTETourBookingWidgetStateContext>) => void,
    vacationPackageTourSingleProduct: GTETourBookingWidgetTypes.TourData,
    editModalActive: boolean,
    dayNumber: number,
    numberOfTravelers: GTETourBookingWidgetTypes.AgeBand[],
    bookingQuestions: GTETourBookingWidgetTypes.TourQuestionAnswer[],
    travelerQuestions: GTETourBookingWidgetTypes.TravelerQuestions[],
    toggleEditModal: (e?: React.SyntheticEvent<Element, Event> | undefined) => void,
    selectedTourOption?: GTETourBookingWidgetTypes.SelectedTourOption,
    formErrorText?: string
  ) => void;
  onCloseVPTourEditModal: (
    setContextState: (state: Partial<GTETourBookingWidgetStateContext>) => void,
    tourSelectedDates: SharedTypes.SelectedDates,
    day: number,
    productId: string,
    bookingQuestions: GTETourBookingWidgetTypes.TourQuestionAnswer[],
    travelerQuestions: GTETourBookingWidgetTypes.TravelerQuestions[],
    allowCustomTravelerPickup: boolean,
    tourNumberOfTravelers: GTETourBookingWidgetTypes.AgeBand[],
    tourOptions: GTETourBookingWidgetTypes.TourOption[],
    selectedTourOption?: GTETourBookingWidgetTypes.SelectedTourOption,
    durationInMinutes?: number
  ) => void;
  onVPOccupanciesChange: (occupancies: StayBookingWidgetTypes.Occupancy[]) => void;
  onVPOccupanciesRoomsChange: (occupancies: StayBookingWidgetTypes.Occupancy[]) => void;
};

const defaultCallbacks: VPActionCallback = {
  onIncludeVPCarsToggle: () => {},
  onSelectVPCarOffer: () => {},
  onSetVPCarOffer: () => {},
  onSetVPPrice: () => {},
  onIncludeVPFlightsToggle: () => {},
  onVPFlightTypeChange: () => {},
  onVPCabinTypeChange: () => {},
  onVPFlightItinerarySelect: () => {},
  onVPOriginLocationChange: () => {},
  onSelectVPStayProduct: () => {},
  onSelectVPStayProductRooms: () => {},
  onSubmitVPTourProduct: () => {},
  onUpdateSelectedVPToursProductIds: () => {},
  onSetVPFlightPriceInput: () => {},
  onVPFlightBaggageCompleted: () => {},
  onCarEditModalClose: () => {},
  onVPDateSelection: () => {},
  onSelectVPTourProduct: () => {},
  onSetVPDriverCountryCode: () => {},
  onSetVPDriverAge: () => {},
  onVPTourProductCompleted: () => {},
  onCloseVPTourEditModal: () => {},
  onVPOccupanciesChange: () => {},
  onVPOccupanciesRoomsChange: () => {},
};

export const VPActionCallbackContext = createContext<VPActionCallback>(defaultCallbacks);

const { Provider: CallbackProvider } = VPActionCallbackContext;

export const VPActionStateContextProvider = ({ children }: { children: ReactNode }) => {
  const { t: flightT } = useTranslation(Namespaces.flightSearchNs);
  const { t: vacationT } = useTranslation(Namespaces.vacationPackageNs);
  const { t: tourBookingT } = useTranslation(Namespaces.tourBookingWidgetNs);
  const { onPassengerReplace } = useContext(FlightCallbackContext);
  const { selectedExtras, selectedInsurances, extrasWithoutAnswers } = useContext(
    CarBookingWidgetStateContext
  );
  const { setSelectedExtra } = useContext(CarBookingWidgetCallbackContext);
  const { onDateSelection } = useContext(VPCallbackContext);
  const {
    onIncludeCarsToggle,
    onSelectCarOffer,
    onSetCarOffer,
    onSortCarsByPrice,
    onSetDestinationId,
    onSetDriverCountryCode,
    onRemoveSelectedCar,
    onSetDriverAge,
  } = useContext(VPCarCallbackContext);
  const {
    onSetIsPriceAvailable,
    onSetCarPriceInput,
    onSetPrice,
    onResetPriceData,
    onSetStayPriceInput,
    onSetTourPriceInput,
    onSetFlightPriceInput,
  } = useContext(VPPriceCallbackContext);
  const {
    onSortFlightsByPrice,
    onIncludeFlightsToggle,
    onCabinTypeChange,
    onFlightTypeChange,
    onSelectFlightItinerary,
    onOriginLocationChange,
    onChangeBaggageText,
    onRemoveSelectedFlight,
  } = useContext(VPFlightCallbackContext);
  const {
    onSortStaysByPrice,
    onRemoveSelectedStays,
    onSelectStayProduct,
    onSelectStayProductRooms,
    onOccupanciesChange,
  } = useContext(VPStayCallbackContext);
  const {
    onRemoveSelectedTours,
    onSubmitTourProduct,
    onUpdateSelectedToursProductIds,
    onSelectTourProduct,
    onSetSingleTourLoading,
  } = useContext(VPTourCallbackContext);
  const { selectedDates } = useContext(VPStateContext);
  const { selectedFlight, hasUserSelectedFlight, flightsResults, originId } =
    useContext(VPFlightStateContext);
  const onAddNotification = useAddNotification();
  const { selectedCarId, driverCountryCode } = useContext(VPCarStateContext);
  const { hotels, occupancies, selectedHotelsRooms } = useContext(VPStayStateContext);
  const {
    selectedTours: vpSelectedTours,
    selectedToursProductIds: vpSelectedToursProductIds,
    toursBookingQuestions,
    toursTravelerQuestions,
    selectedTourDay,
    singleTourLoading,
  } = useContext(VPTourStateContext);
  const { carPriceInput, flightPriceInput, tourPriceInput } = useContext(VPPriceStateContext);
  const { adults, children: vpChildren, infants } = getTravelersFromOccupancies(occupancies);
  const onIncludeVPCarsToggle = useCallback(
    (checked: boolean) => {
      onIncludeCarsToggle(checked);
      onResetPriceData();
    },
    [onIncludeCarsToggle, onResetPriceData]
  );
  const onIncludeVPFlightsToggle = useCallback(
    (checked: boolean) => {
      onPassengerReplace([]);
      onIncludeFlightsToggle(checked);
      onResetPriceData();
    },
    [onIncludeFlightsToggle, onResetPriceData, onPassengerReplace]
  );
  const onSelectVPCarOffer = useCallback(
    (productId: string) => {
      if (productId === selectedCarId) {
        return;
      }
      onSetIsPriceAvailable(false);
      onSelectCarOffer(productId);
      if (selectedCarId !== undefined) {
        const newCarPriceInput = constructCarPriceInput({
          selectedCarId: productId,
          insurances: [],
          extras: [],
        });
        onSetCarPriceInput(newCarPriceInput);
      }
    },
    [onSelectCarOffer, onSetIsPriceAvailable, selectedCarId, onSetCarPriceInput]
  );
  const onSetVPCarOffer = useCallback(
    (carOffer: CarTypes.CarOffer) => {
      onSetCarOffer(carOffer);
    },
    [onSetCarOffer]
  );
  const onSetVPPrice = useCallback(
    (
      price?: number,
      carPrices?: VacationPackageTypes.CarPrice[],
      flightPrices?: VacationPackageTypes.FlightPrice[],
      stayPrices?: VacationPackageTypes.StayPrice[]
    ) => {
      onSetPrice(price);
      onSortCarsByPrice(carPrices);
      onSortFlightsByPrice(flightPrices);
      onSortStaysByPrice(stayPrices);
    },
    [onSetPrice, onSortCarsByPrice, onSortFlightsByPrice, onSortStaysByPrice]
  );
  const onVPFlightTypeChange = useCallback(
    (flightType: FlightSearchTypes.FlightType) => {
      onFlightTypeChange(flightType);
      onResetPriceData();
    },
    [onFlightTypeChange, onResetPriceData]
  );

  const onVPCabinTypeChange = useCallback(
    (cabinType: FlightSearchTypes.CabinType) => {
      onCabinTypeChange(cabinType);
      onResetPriceData();
    },
    [onCabinTypeChange, onResetPriceData]
  );
  const onVPFlightItinerarySelect = useCallback(
    (selectedProductId: string) => {
      const prevSelectedFlightId = selectedFlight?.id;
      if (selectedProductId === prevSelectedFlightId) {
        return;
      }
      const selectedFlightItenerary = flightsResults.find(
        itinerary => itinerary.id === selectedProductId
      );
      if (selectedFlightItenerary) {
        onSetIsPriceAvailable(false);
        onSelectFlightItinerary(selectedFlightItenerary);
        const { lastOutboundFlight } = getCondensedFlightItinerary(selectedFlightItenerary);
        const destinationId = lastOutboundFlight?.destinationId;
        if (destinationId) {
          onSetDestinationId(destinationId);
        }
      }
    },
    [
      onSelectFlightItinerary,
      onSetIsPriceAvailable,
      onSetDestinationId,
      selectedFlight,
      flightsResults,
    ]
  );
  const onVPOccupanciesChange = useCallback(
    (newOccupancies: StayBookingWidgetTypes.Occupancy[]) => {
      onOccupanciesChange(newOccupancies);
      onRemoveSelectedCar();
      onRemoveSelectedFlight();
      onRemoveSelectedTours();
      onResetPriceData();
    },
    [
      onOccupanciesChange,
      onRemoveSelectedCar,
      onResetPriceData,
      onRemoveSelectedFlight,
      onRemoveSelectedTours,
    ]
  );

  const onVPOccupanciesRoomsChange = useCallback(
    (newOccupancies: StayBookingWidgetTypes.Occupancy[]) => {
      onOccupanciesChange(newOccupancies);
      onResetPriceData();
    },
    [onOccupanciesChange, onResetPriceData]
  );
  const onVPOriginLocationChange = useCallback(
    (id?: string, name?: string, countryCode?: string) => {
      if (id !== originId) {
        onResetPriceData();
        onOriginLocationChange(id, name);
        if (id && countryCode && countryCode !== driverCountryCode) {
          onRemoveSelectedCar();
          onSetDriverCountryCode(countryCode);
        }
      }
    },
    [
      onOriginLocationChange,
      onSetDriverCountryCode,
      onResetPriceData,
      onRemoveSelectedCar,
      driverCountryCode,
      originId,
    ]
  );
  const onSelectVPStayProduct = useCallback(
    (day: number, productId: number | string) => {
      const alreadySelected =
        selectedHotelsRooms.filter(
          item =>
            item.productId === Number(productId) && item.groupedWithDays.some(date => date === day)
        ).length > 0;
      if (!alreadySelected) {
        const groupedDays = extractGroupedDaysValue(day, productId, hotels);
        const newHotels = getNewSelectedHotels(groupedDays, productId, hotels);
        const newSelectedHotelsRooms = getSelectedHotelsRooms(newHotels);
        onSelectStayProduct(newHotels, newSelectedHotelsRooms, day);
        onSetIsPriceAvailable(false);
        const stayPriceInput = constructStayPriceInput({
          selectedStayDay: day,
          selectedHotelsRooms: newSelectedHotelsRooms,
        });
        onSetStayPriceInput(stayPriceInput);
      }
    },
    [onSelectStayProduct, onSetStayPriceInput, hotels, onSetIsPriceAvailable, selectedHotelsRooms]
  );

  const onSelectVPStayProductRooms = useCallback(
    (
      day: number,
      productId: number | string,
      roomCombinationId: string,
      availabilityId: string
    ) => {
      const newHotels = hotels.map(hotel => ({
        ...hotel,
        vpPrice: undefined,
      }));
      const newSelectedHotelsRooms = getUpdatedSelectedHotelsRooms(
        day,
        productId,
        roomCombinationId,
        availabilityId,
        selectedHotelsRooms
      );
      const roomAlreadySelected = isRoomAlreadySelected(
        selectedHotelsRooms,
        day,
        productId,
        roomCombinationId,
        availabilityId
      );
      if (!roomAlreadySelected) {
        onSelectStayProductRooms(newHotels, newSelectedHotelsRooms, day);
        onSetIsPriceAvailable(false);
        const stayPriceInput = constructStayPriceInput({
          selectedStayDay: day,
          selectedHotelsRooms: newSelectedHotelsRooms,
        });
        onSetStayPriceInput(stayPriceInput);
      }
    },
    [
      onSelectStayProductRooms,
      onSetStayPriceInput,
      selectedHotelsRooms,
      onSetIsPriceAvailable,
      hotels,
    ]
  );

  const onSubmitVPTourProduct = useCallback(
    (
      day: number,
      productId: string,
      tourSelectedDates: SharedTypes.SelectedDates,
      tourNumberOfTravelers: GTETourBookingWidgetTypes.AgeBand[],
      bookingQuestions: GTETourBookingWidgetTypes.TourQuestionAnswer[],
      travelerQuestions: GTETourBookingWidgetTypes.TravelerQuestions[],
      allowCustomTravelerPickup: boolean,
      tourOptions: GTETourBookingWidgetTypes.TourOption[],
      selectedTourOption?: GTETourBookingWidgetTypes.SelectedTourOption,
      durationInMinutes?: number
    ) => {
      if (!selectedTourOption) {
        onAddNotification({
          ribbonText: tourBookingT(
            "Oops, something happened while updating this tour. Please try again"
          ),
          productType: Product.GTETour,
        });
        return;
      }
      const tour = constructGTETourCartInput({
        productCode: productId,
        travelDate: tourSelectedDates.from!,
        numberOfTravelers: tourNumberOfTravelers,
        bookingQuestions,
        travelerQuestions,
        selectedTourOption: selectedTourOption!,
        productUrl: "",
        allowCustomTravelerPickup,
      });
      const newSelectedToursProductIds: VacationPackageTypes.SelectedToursProductIds[] = (
        vpSelectedToursProductIds ?? []
      ).map(selectedTour => {
        if (selectedTour.productId === productId && selectedTour.day === day) {
          return {
            ...selectedTour,
            optionCode: selectedTourOption!.optionCode,
            optionName: tourOptions.length > 1 ? selectedTourOption!.name : "",
            numberOfTravelers: getTotalTravelers(tourNumberOfTravelers),
            startTime: selectedTourOption!.times.find(time => time.isSelected)?.startTime ?? "",
            durationInMinutes: durationInMinutes || 0,
          };
        }
        return selectedTour;
      });
      const newSelectedTours = getUpdatedSelectedTours(vpSelectedTours, tour);
      const newToursBookingQuestions = getNewTourBookingQuestions(
        toursBookingQuestions,
        bookingQuestions
      );
      const newToursTravelerQuestions = getNewTourTravelerQuestions(
        toursTravelerQuestions,
        travelerQuestions
      );
      onSubmitTourProduct(
        newToursBookingQuestions,
        newToursTravelerQuestions,
        newSelectedTours,
        day,
        newSelectedToursProductIds
      );
      const newTourPriceInput = constructToursPriceInput({
        selectedTourDay: day,
        selectedToursProductIds: newSelectedToursProductIds,
        selectedTours: newSelectedTours,
      });
      const shouldUpdateTourInput = hasTourInputChanged(tourPriceInput, newTourPriceInput);
      if (shouldUpdateTourInput) {
        onSetTourPriceInput(newTourPriceInput);
      }
      onSetSingleTourLoading(false);
      const doesNewTourOverlap = doesNewTourOverlapWithOthers(
        newSelectedToursProductIds,
        day,
        productId
      );
      if (doesNewTourOverlap) {
        onAddNotification({
          ribbonText: tourBookingT("Please note that these experiences overlap"),
          productType: Product.GTETour,
        });
      }
    },
    [
      onSubmitTourProduct,
      onSetTourPriceInput,
      onSetSingleTourLoading,
      vpSelectedTours,
      vpSelectedToursProductIds,
      onAddNotification,
      tourPriceInput,
      tourBookingT,
      toursBookingQuestions,
      toursTravelerQuestions,
    ]
  );

  const onUpdateSelectedVPToursProductIds = useCallback(
    (newSelectedToursProductIds: VacationPackageTypes.SelectedToursProductIds[], day: number) => {
      onUpdateSelectedToursProductIds(newSelectedToursProductIds);
      const newTourPriceInput = constructToursPriceInput({
        selectedTourDay: day,
        selectedToursProductIds: newSelectedToursProductIds,
        selectedTours: vpSelectedTours,
      });
      const shouldUpdateTourInput = hasTourInputChanged(tourPriceInput, newTourPriceInput);
      if (shouldUpdateTourInput) {
        onSetTourPriceInput(newTourPriceInput);
      }
      onSetIsPriceAvailable(true);
    },
    [
      onUpdateSelectedToursProductIds,
      onSetIsPriceAvailable,
      onSetTourPriceInput,
      vpSelectedTours,
      tourPriceInput,
    ]
  );
  const onSetVPFlightPriceInput = useCallback(
    (passengers: FlightTypes.PassengerDetails[]) => {
      const newFlightPriceInput = constructFlightPriceInput({
        flight: selectedFlight,
        passengers,
      });
      const hasPriceInputChanged = hasFlightPriceInputChanged(
        flightPriceInput,
        newFlightPriceInput
      );
      if (hasPriceInputChanged) {
        onSetFlightPriceInput(newFlightPriceInput);
      }
    },
    [selectedFlight, onSetFlightPriceInput, flightPriceInput]
  );

  const onVPFlightBaggageCompleted = useCallback(
    (flightData: VacationPackageTypes.FlightIteneraryType) => {
      const availableBaggages = flightData?.flightCheckFlight?.availableBaggages;
      const bags = constructBaggage(flightT, availableBaggages);
      const initialPassengers = getInitialPassengers(
        adults,
        vpChildren,
        infants,
        bags
      ) as FlightTypes.PassengerDetails[];
      onPassengerReplace(initialPassengers);

      onChangeBaggageText(initialPassengers, vacationT);
      if (hasUserSelectedFlight) {
        onSetVPFlightPriceInput(initialPassengers);
      }
    },
    [
      adults,
      vpChildren,
      infants,
      onPassengerReplace,
      onChangeBaggageText,
      onSetVPFlightPriceInput,
      hasUserSelectedFlight,
      flightT,
      vacationT,
    ]
  );
  const onCarEditModalClose = useCallback(() => {
    if (extrasWithoutAnswers?.length) {
      extrasWithoutAnswers.forEach(extra => setSelectedExtra({ ...extra, count: 0 }));
    }
    const selectedExtrasWithAnswers = selectedExtras.map(selectedExtra => {
      const hasNoAnswer = extrasWithoutAnswers.find(extra => extra.id === selectedExtra.id);
      if (hasNoAnswer) {
        return {
          ...selectedExtra,
          count: 0,
        };
      }
      return selectedExtra;
    });
    const newCarPriceInput = constructCarPriceInput({
      selectedCarId,
      insurances: selectedInsurances,
      extras: selectedExtrasWithAnswers,
    });
    if (hasCarPriceInputChanged(carPriceInput, newCarPriceInput)) {
      onSetCarPriceInput(newCarPriceInput);
    }
  }, [
    extrasWithoutAnswers,
    setSelectedExtra,
    onSetCarPriceInput,
    selectedCarId,
    selectedExtras,
    selectedInsurances,
    hasCarPriceInputChanged,
    carPriceInput,
  ]);

  const onVPDateSelection = useCallback(
    (newSelectedDates: SharedTypes.SelectedDates) => {
      const oldFromDate = selectedDates.from
        ? getFormattedDate(selectedDates.from, yearMonthDayFormat)
        : undefined;
      const newFromDate = newSelectedDates.from
        ? getFormattedDate(newSelectedDates.from, yearMonthDayFormat)
        : undefined;
      if (oldFromDate !== newFromDate) {
        setDatesInLocalStorage(newSelectedDates);
        onRemoveSelectedCar();
        onRemoveSelectedFlight();
        onRemoveSelectedStays();
        onRemoveSelectedTours();
        onResetPriceData();
        onDateSelection(newSelectedDates);
      }
    },
    [
      onDateSelection,
      onResetPriceData,
      onRemoveSelectedCar,
      onRemoveSelectedStays,
      onRemoveSelectedFlight,
      onRemoveSelectedTours,
      selectedDates,
    ]
  );

  const onSelectVPTourProduct = useCallback(
    (day: number, productId: string) => {
      if (singleTourLoading) return;
      onSetIsPriceAvailable(false);
      const newSelectedToursProductIds = getUpdatedSelectedTourProducts(
        day,
        productId,
        vpSelectedToursProductIds
      );
      const wasRemoved = !newSelectedToursProductIds.some(
        tour => tour.productId === productId && tour.day === day
      );
      if (wasRemoved) {
        const travelDate = getFormattedDate(
          addDays(selectedDates.from!, day - 1),
          yearMonthDayFormat
        );
        const newSelectedTours = vpSelectedTours.filter(
          tour => tour.productCode !== productId || tour.travelDate !== travelDate
        );
        onSubmitTourProduct(
          toursBookingQuestions,
          toursTravelerQuestions,
          newSelectedTours,
          day,
          newSelectedToursProductIds
        );
        const newTourPriceInput = constructToursPriceInput({
          selectedTourDay: day,
          selectedToursProductIds: newSelectedToursProductIds,
          selectedTours: newSelectedTours,
        });
        const shouldUpdateTourInput = hasTourInputChanged(tourPriceInput, newTourPriceInput);
        if (shouldUpdateTourInput) {
          onSetTourPriceInput(newTourPriceInput);
        }
      } else {
        onSelectTourProduct(true, vpSelectedTours, selectedTourDay, newSelectedToursProductIds);
      }
    },
    [
      onSelectTourProduct,
      onSetTourPriceInput,
      onSetIsPriceAvailable,
      selectedTourDay,
      vpSelectedTours,
      vpSelectedToursProductIds,
      singleTourLoading,
      selectedDates,
      onSubmitTourProduct,
      toursBookingQuestions,
      toursTravelerQuestions,
      tourPriceInput,
    ]
  );

  const onSetVPDriverCountryCode = useCallback(
    (countryCode: string) => {
      onSetDriverCountryCode(countryCode);
      onResetPriceData();
    },
    [onSetDriverCountryCode, onResetPriceData]
  );
  const onSetVPDriverAge = useCallback(
    (driverAge: string) => {
      onSetDriverAge(driverAge);
      onResetPriceData();
    },
    [onSetDriverAge, onResetPriceData]
  );
  const onVPTourProductCompleted = useCallback(
    (
      setContextState: (state: Partial<GTETourBookingWidgetStateContext>) => void,
      vacationPackageTourSingleProduct: GTETourBookingWidgetTypes.TourData,
      editModalActive: boolean,
      dayNumber: number,
      numberOfTravelers: GTETourBookingWidgetTypes.AgeBand[],
      bookingQuestions: GTETourBookingWidgetTypes.TourQuestionAnswer[],
      travelerQuestions: GTETourBookingWidgetTypes.TravelerQuestions[],
      toggleEditModal: (e?: React.SyntheticEvent<Element, Event> | undefined) => void,
      selectedTourOption?: GTETourBookingWidgetTypes.SelectedTourOption,
      formErrorText?: string
    ) => {
      const tourOptions = vacationPackageTourSingleProduct?.options;
      const tourQuestions = vacationPackageTourSingleProduct?.questions ?? [];
      const durationInMinutes = vacationPackageTourSingleProduct?.durationInMinutes ?? 0;
      if (tourOptions && tourOptions.length > 0 && tourQuestions) {
        const tourWithPreselectedTime = getPreselectedTourTime(
          vpSelectedToursProductIds ?? [],
          tourOptions[0],
          dayNumber,
          durationInMinutes
        );
        const selectedOption = getInitialSelectedTourOption(
          tourOptions[0],
          selectedTourOption || tourWithPreselectedTime
        );
        const shouldAllowCustomTravelerPickup = Boolean(
          vacationPackageTourSingleProduct?.pickup?.allowCustomTravelerPickup
        );
        const missingBookingQuestionAnswers = bookingQuestions.length === 0;
        const missingTravelerQuestionAnswers = travelerQuestions.length === 0;
        const bookingQuestionsToPrefill = missingBookingQuestionAnswers
          ? toursBookingQuestions
          : bookingQuestions;
        const travelerQuestionsToPrefill = missingTravelerQuestionAnswers
          ? toursTravelerQuestions
          : travelerQuestions;
        const { perBooking, perPerson } = constructTourQuestions(
          numberOfTravelers,
          tourQuestions,
          bookingQuestionsToPrefill,
          travelerQuestionsToPrefill
        );
        setContextState({
          tourOptions,
          selectedTourOption: selectedTourOption || selectedOption,
          totalPrice: getTotalPrice(selectedOption),
          isAvailabilityLoading: false,
          bookingQuestions: perBooking,
          travelerQuestions: perPerson,
          allowCustomTravelerPickup: shouldAllowCustomTravelerPickup,
          durationInMinutes,
        });
        const notAllBookingQuestionsPrefilled = isSomeBookingQuestionsEmpty(perBooking);
        const notAllTravelerQuestionsPrefilled = isSomeTravelerQuestionEmpty(perPerson);
        if (
          (notAllBookingQuestionsPrefilled || notAllTravelerQuestionsPrefilled || formErrorText) &&
          !editModalActive
        ) {
          toggleEditModal();
        }
      } else {
        setContextState({
          isError: true,
          isAvailabilityLoading: false,
        });
        if (!editModalActive) {
          toggleEditModal();
        }
      }
    },
    [vpSelectedToursProductIds, toursBookingQuestions, toursTravelerQuestions]
  );

  const onCloseVPTourEditModal = useCallback(
    (
      setContextState: (state: Partial<GTETourBookingWidgetStateContext>) => void,
      tourSelectedDates: SharedTypes.SelectedDates,
      day: number,
      productId: string,
      bookingQuestions: GTETourBookingWidgetTypes.TourQuestionAnswer[],
      travelerQuestions: GTETourBookingWidgetTypes.TravelerQuestions[],
      allowCustomTravelerPickup: boolean,
      tourNumberOfTravelers: GTETourBookingWidgetTypes.AgeBand[],
      tourOptions: GTETourBookingWidgetTypes.TourOption[],
      selectedTourOption?: GTETourBookingWidgetTypes.SelectedTourOption,
      durationInMinutes?: number
    ) => {
      const travelDate = getFormattedDate(tourSelectedDates.from!, yearMonthDayFormat);
      const selectedTour = vpSelectedTours.find(
        tour => tour.productCode === productId && tour.travelDate === travelDate
      );
      if (!selectedTour) {
        // if tour has not already been submitted, then we unselect it on modal close
        const newSelectedToursProductIds = getUpdatedSelectedTourProducts(
          day,
          productId,
          vpSelectedToursProductIds
        );
        onUpdateSelectedVPToursProductIds(newSelectedToursProductIds, day);
      } else {
        const updatedBookingQuestionAnswers = getBookingQuestionAnswers(
          bookingQuestions,
          travelerQuestions,
          allowCustomTravelerPickup
        );
        const hasUnansweredQuestions = isSomeTourQuestionsEmpty(updatedBookingQuestionAnswers);
        if (hasUnansweredQuestions) {
          const newSelectedToursProductIds = vpSelectedToursProductIds?.filter(
            tour => tour.day !== day || tour.productId !== productId
          );
          const newSelectedTours = vpSelectedTours.filter(
            tour => tour.productCode !== productId || tour.travelDate !== travelDate
          );
          onSelectTourProduct(false, newSelectedTours, day, newSelectedToursProductIds);
          const newTourPriceInput = constructToursPriceInput({
            selectedTourDay: day,
            selectedToursProductIds: newSelectedToursProductIds,
            selectedTours: newSelectedTours,
          });
          const shouldUpdateTourInput = hasTourInputChanged(tourPriceInput, newTourPriceInput);
          if (shouldUpdateTourInput) {
            onSetTourPriceInput(newTourPriceInput);
          }
          // if there are any unanswered questions, we dont submit the tour, instead we reset the travelers
          setContextState({
            numberOfTravelers: selectedTour.paxMix,
          });
        } else {
          // if tour is already selected, we need to update the state
          onSubmitVPTourProduct(
            day,
            productId,
            tourSelectedDates,
            tourNumberOfTravelers,
            bookingQuestions,
            travelerQuestions,
            allowCustomTravelerPickup,
            tourOptions,
            selectedTourOption,
            durationInMinutes
          );
        }
      }
      onSetSingleTourLoading(false);
    },
    [
      onSubmitVPTourProduct,
      onSetTourPriceInput,
      onSelectTourProduct,
      onUpdateSelectedVPToursProductIds,
      vpSelectedTours,
      vpSelectedToursProductIds,
      onSetSingleTourLoading,
      tourPriceInput,
    ]
  );
  return (
    <CallbackProvider
      value={{
        onIncludeVPCarsToggle,
        onSelectVPCarOffer,
        onSetVPCarOffer,
        onSetVPPrice,
        onIncludeVPFlightsToggle,
        onVPFlightTypeChange,
        onVPCabinTypeChange,
        onVPFlightItinerarySelect,
        onVPOriginLocationChange,
        onSelectVPStayProduct,
        onSubmitVPTourProduct,
        onUpdateSelectedVPToursProductIds,
        onSetVPFlightPriceInput,
        onVPFlightBaggageCompleted,
        onCarEditModalClose,
        onVPDateSelection,
        onSelectVPTourProduct,
        onSetVPDriverCountryCode,
        onSetVPDriverAge,
        onVPTourProductCompleted,
        onCloseVPTourEditModal,
        onVPOccupanciesChange,
        onVPOccupanciesRoomsChange,
        onSelectVPStayProductRooms,
      }}
    >
      {children}
    </CallbackProvider>
  );
};
