import React, { useCallback, useContext } from "react";

import BookingWidgetMobileSteps from "./TourBookingWidgetMobileSteps";
import BookingWidgetView from "./types/enums";
import BookingWidgetFooterMobileContainer from "./TourBookingWidgetFooterMobileContainer";

import BookingWidgetMobile, {
  OnCurrentStepChangeType,
} from "components/ui/BookingWidget/BookingWidgetMobile";
import { getShortMonthNumbericDateFormat } from "utils/dateUtils";
import LocaleContext from "contexts/LocaleContext";

const TourBookingWidgetMobile = ({
  id,
  tourType,
  bookingWidgetView,
  onBookingWidgetViewChange,
  lengthOfTour,
  onDateSelection,
  selectedDates,
  onSetSelectedPickupTime,
  selectedPickupTime,
  numberOfTravelers,
  childrenAges,
  onNumberOfTravelersChange,
  onChildrenAgesChange,
  onSetTravelersPriceGroups,
  availableTimes,
  experiences,
  isLoadingAvailableTimes,
  selectedExperiences,
  onSetSelectedExperience,
  onSetDefaultNumberOfTravelers,
  travelerPrices,
  isFreePickup,
  transport,
  selectedTransportLocation,
  onSetSelectedTransportLocation,
  toggleModal,
  isModalOpen,
  setHasPickup,
  hasPickup,
  pickupPrice,
  pickupPrices,
  cartItem,
  isLoadingOptions,
  isPrivate,
  isLivePricing,
  selectedPrivateOptions,
  togglePrivateState,
  hasSomeAvailablePickups,
  maxTravelers,
}: {
  id: number;
  tourType: string;
  bookingWidgetView: BookingWidgetView;
  selectedDates: SharedTypes.SelectedDates;
  numberOfTravelers: SharedTypes.NumberOfTravelers;
  childrenAges: number[];
  lengthOfTour: number;
  selectedPickupTime?: string;
  availableTimes: TourBookingWidgetTypes.AvailableTimes;
  isLoadingAvailableTimes: boolean;
  selectedExperiences: TourBookingWidgetTypes.SelectedExperiences;
  travelerPrices?: TourBookingWidgetTypes.Prices;
  experiences: ExperiencesTypes.Experience[][];
  onSetSelectedPickupTime: (selectedTime: string) => void;
  onDateSelection: (selectedDates: SharedTypes.SelectedDates) => void;
  onBookingWidgetViewChange: (bookingWidgetView: BookingWidgetView) => void;
  onNumberOfTravelersChange: (travelerType: SharedTypes.TravelerType, value: number) => void;
  onChildrenAgesChange: (value: number, index: number) => void;
  onSetTravelersPriceGroups: (value: TravelersTypes.PriceGroup[]) => void;
  onSetSelectedExperience: TourBookingWidgetTypes.OnSetSelectedExperience;
  onSetDefaultNumberOfTravelers: TourBookingWidgetTypes.OnSetDefaultNumberOfTravelers;
  isFreePickup: boolean;
  transport: PickupTransport;
  selectedTransportLocation: PickupLocation;
  onSetSelectedTransportLocation: (selectedTransportLocation: PickupLocation) => void;
  toggleModal: () => void;
  isModalOpen: boolean;
  setHasPickup: (hasPickup: boolean) => void;
  hasPickup: boolean;
  pickupPrice: number;
  pickupPrices: TourBookingWidgetTypes.PickupPrices;
  cartItem?: TourBookingWidgetTypes.EditItem;
  isLoadingOptions: boolean;
  isPrivate: boolean;
  isLivePricing: boolean;
  selectedPrivateOptions: TourBookingWidgetTypes.PrivateOption[];
  togglePrivateState: () => void;
  hasSomeAvailablePickups: boolean;
  maxTravelers?: number;
}) => {
  const activeLocale = useContext(LocaleContext);
  const startDate =
    selectedDates.from && getShortMonthNumbericDateFormat(selectedDates.from, activeLocale);
  const endDate =
    selectedDates.to && getShortMonthNumbericDateFormat(selectedDates.to, activeLocale);

  const onPreviousClick = useCallback(() => {
    onBookingWidgetViewChange(BookingWidgetView.Default);
  }, [onBookingWidgetViewChange]);

  const onModalClose = useCallback(() => {
    if (bookingWidgetView === BookingWidgetView.Dates && !selectedDates.from) {
      toggleModal();
      return;
    }
    if (bookingWidgetView !== BookingWidgetView.Default) {
      onPreviousClick();
    } else {
      toggleModal();
    }
  }, [bookingWidgetView, onPreviousClick, selectedDates.from, toggleModal]);

  const onCurrentStepChange: OnCurrentStepChangeType = useCallback((modal, newStep) => {
    if (newStep !== BookingWidgetView.Dates) {
      modal.current?.scrollTo({ top: 0 });
    }
  }, []);

  return (
    <BookingWidgetMobile
      onModalClose={onModalClose}
      onPreviousClick={onPreviousClick}
      currentStep={bookingWidgetView}
      onCurrentStepChange={onCurrentStepChange}
      skipReset
      footer={
        <BookingWidgetFooterMobileContainer toggleModal={onModalClose} isModalOpen={isModalOpen} />
      }
    >
      <BookingWidgetMobileSteps
        id={id}
        tourType={tourType}
        bookingWidgetView={bookingWidgetView}
        lengthOfTour={lengthOfTour}
        selectedDates={selectedDates}
        onDateSelection={onDateSelection}
        onNumberOfTravelersChange={onNumberOfTravelersChange}
        onChildrenAgesChange={onChildrenAgesChange}
        onSetTravelersPriceGroups={onSetTravelersPriceGroups}
        selectedPickupTime={selectedPickupTime}
        onSetSelectedPickupTime={onSetSelectedPickupTime}
        numberOfTravelers={numberOfTravelers}
        childrenAges={childrenAges}
        availableTimes={availableTimes}
        isLoadingAvailableTimes={isLoadingAvailableTimes}
        selectedExperiences={selectedExperiences}
        onSetSelectedExperience={onSetSelectedExperience}
        onSetDefaultNumberOfTravelers={onSetDefaultNumberOfTravelers}
        travelerPrices={travelerPrices}
        experiences={experiences}
        isFreePickup={isFreePickup}
        startDate={startDate}
        endDate={endDate}
        transport={transport}
        selectedTransportLocation={selectedTransportLocation}
        onSetSelectedTransportLocation={onSetSelectedTransportLocation}
        setHasPickup={setHasPickup}
        hasPickup={hasPickup}
        pickupPrice={pickupPrice}
        pickupPrices={pickupPrices}
        cartItem={cartItem}
        isLoadingOptions={isLoadingOptions}
        isPrivate={isPrivate}
        isLivePricing={isLivePricing}
        selectedPrivateOptions={selectedPrivateOptions}
        togglePrivateState={togglePrivateState}
        hasSomeAvailablePickups={hasSomeAvailablePickups}
        maxTravelers={maxTravelers}
        onBookingWidgetViewChange={onBookingWidgetViewChange}
      />
    </BookingWidgetMobile>
  );
};

export default TourBookingWidgetMobile;
