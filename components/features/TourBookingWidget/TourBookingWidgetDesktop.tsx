import React from "react";
import { Option } from "fp-ts/lib/Option";

import {
  getFormErrorText,
  getTourPickup,
  getSelectedPickupTimeMinTravelers,
} from "./utils/tourBookingWidgetUtils";
import { getTotalNumberOfTravelers } from "./Travelers/utils/travelersUtils";
import TourBookingWidgetDesktopBody from "./TourBookingWidgetDesktopBody";
import useBookingButtonCTA from "./hooks/useBookingButtonCTA";

import BookingWidgetDesktopContainer from "components/ui/BookingWidget/BookingWidgetDesktopContainer";
import { BookingWidgetFormError } from "types/enums";
import { Namespaces } from "shared/namespaces";
import { useTranslation } from "i18n";

const TourBookingWidgetDesktop = ({
  id,
  tourType,
  onDateSelection,
  lengthOfTour,
  selectedDates,
  price,
  discount,
  discountValue,
  isPriceLoading,
  isDiscountLoading,
  isGTIVpDefaultOptionsLoading,
  currency,
  numberOfTravelers,
  childrenAges,
  onNumberOfTravelersChange,
  onChildrenAgesChange,
  onSetTravelersPriceGroups,
  onSetSelectedPickupTime,
  selectedPickupTime,
  onSetSelectedTransportLocation,
  selectedTransportLocation,
  availableTimes,
  travelerPrices,
  experiences,
  isLoadingAvailableTimes,
  selectedExperiences,
  onSetSelectedExperience,
  onSetDefaultNumberOfTravelers,
  isFreePickup,
  formErrors,
  transport,
  setHasPickup,
  hasPickup,
  pickupPrice,
  pickupPrices,
  isFormLoading,
  priceSubtext,
  fullPrice,
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
  price: number;
  discount: Option<number>;
  discountValue?: number;
  isPriceLoading: boolean;
  isDiscountLoading?: boolean;
  isGTIVpDefaultOptionsLoading: boolean;
  currency: string;
  lengthOfTour: number;
  selectedDates: SharedTypes.SelectedDates;
  numberOfTravelers: SharedTypes.NumberOfTravelers;
  childrenAges?: number[];
  selectedPickupTime?: string;
  selectedTransportLocation: PickupLocation;
  availableTimes: TourBookingWidgetTypes.AvailableTimes;
  isLoadingAvailableTimes: boolean;
  selectedExperiences: TourBookingWidgetTypes.SelectedExperiences;
  travelerPrices?: TourBookingWidgetTypes.Prices;
  experiences: ExperiencesTypes.Experience[][];
  onSetSelectedPickupTime: (selectedTime: string) => void;
  onSetSelectedTransportLocation: (selectedTransportLocation: PickupLocation) => void;
  onNumberOfTravelersChange: (travelerType: SharedTypes.TravelerType, value: number) => void;
  onChildrenAgesChange: (value: number, index: number) => void;
  onSetTravelersPriceGroups: (value: TravelersTypes.PriceGroup[]) => void;
  onDateSelection: (selectedDates: SharedTypes.SelectedDates) => void;
  onSetSelectedExperience: TourBookingWidgetTypes.OnSetSelectedExperience;
  onSetDefaultNumberOfTravelers: TourBookingWidgetTypes.OnSetDefaultNumberOfTravelers;
  isFreePickup: boolean;
  transport: PickupTransport;
  formErrors: BookingWidgetFormError[];
  setHasPickup: (hasPickup: boolean) => void;
  hasPickup: boolean;
  pickupPrice: number;
  pickupPrices: TourBookingWidgetTypes.PickupPrices;
  isFormLoading: boolean;
  priceSubtext: string;
  fullPrice: number;
  isLoadingOptions: boolean;
  isPrivate: boolean;
  isLivePricing: boolean;
  selectedPrivateOptions: TourBookingWidgetTypes.PrivateOption[];
  togglePrivateState: () => void;
  hasSomeAvailablePickups: boolean;
  maxTravelers?: number;
}) => {
  const { t } = useTranslation(Namespaces.tourBookingWidgetNs);

  return (
    <BookingWidgetDesktopContainer
      footerText={useBookingButtonCTA(tourType)}
      error={
        formErrors.length > 0
          ? getFormErrorText(
              formErrors,
              t,
              getSelectedPickupTimeMinTravelers(availableTimes.times, hasPickup, selectedPickupTime)
            )
          : undefined
      }
      price={price}
      discount={discount}
      discountValue={discountValue}
      isPriceLoading={isPriceLoading}
      isDiscountLoading={isDiscountLoading}
      isButtonDisabled={isLoadingAvailableTimes || isLoadingOptions}
      isFormLoading={isFormLoading}
      isTotalPrice={
        selectedDates.from !== undefined &&
        numberOfTravelers.adults > 0 &&
        (!isLivePricing || (isLivePricing && !isGTIVpDefaultOptionsLoading))
      }
      currency={currency}
      priceSubtext={priceSubtext}
      fullPrice={fullPrice}
      footerPriceInfo={
        numberOfTravelers.adults > 0
          ? t("Price for {numberOfTravelers} travelers", {
              numberOfTravelers: getTotalNumberOfTravelers(numberOfTravelers),
            })
          : undefined
      }
    >
      <TourBookingWidgetDesktopBody
        id={id}
        tourType={tourType}
        onDateSelection={onDateSelection}
        lengthOfTour={lengthOfTour}
        selectedDates={selectedDates}
        numberOfTravelers={numberOfTravelers}
        childrenAges={childrenAges}
        onNumberOfTravelersChange={onNumberOfTravelersChange}
        onChildrenAgesChange={onChildrenAgesChange}
        onSetTravelersPriceGroups={onSetTravelersPriceGroups}
        onSetSelectedPickupTime={onSetSelectedPickupTime}
        selectedPickupTime={selectedPickupTime}
        selectedTransportLocation={selectedTransportLocation}
        onSetSelectedTransportLocation={onSetSelectedTransportLocation}
        availableTimes={availableTimes}
        travelerPrices={travelerPrices}
        experiences={experiences}
        isLoadingAvailableTimes={isLoadingAvailableTimes}
        selectedExperiences={selectedExperiences}
        onSetSelectedExperience={onSetSelectedExperience}
        onSetDefaultNumberOfTravelers={onSetDefaultNumberOfTravelers}
        isFreePickup={isFreePickup}
        formErrors={formErrors}
        transport={transport}
        setHasPickup={setHasPickup}
        hasPickup={getTourPickup(transport.pickupType, hasPickup)}
        pickupPrice={pickupPrice}
        pickupPrices={pickupPrices}
        isLoadingOptions={isLoadingOptions}
        isPrivate={isPrivate}
        isLivePricing={isLivePricing}
        selectedPrivateOptions={selectedPrivateOptions}
        togglePrivateState={togglePrivateState}
        hasSomeAvailablePickups={hasSomeAvailablePickups}
        maxTravelers={maxTravelers}
      />
    </BookingWidgetDesktopContainer>
  );
};
export default TourBookingWidgetDesktop;
