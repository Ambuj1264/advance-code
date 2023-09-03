import React, { useMemo, useContext, useCallback } from "react";
import { useMediaQuery } from "react-responsive";

import TourBookingWidgetDesktop from "./TourBookingWidgetDesktop";
import TourBookingWidgetMobile from "./TourBookingWidgetMobile";
import bookingWidgetStateContext from "./contexts/BookingWidgetStateContext";
import bookingWidgetCallbackContext from "./contexts/BookingWidgetCallbackContext";
import bookingWidgetConstantContext from "./contexts/BookingWidgetConstantContext";
import {
  constructFormData,
  getPickupPrices,
  calculatePickupPrice,
  travelerText,
} from "./utils/tourBookingWidgetUtils";
import TourBookingWidgetFormInputs from "./TourBookingWidgetFormInputs";

import { Product, TransportPickup, SupportedCurrencies } from "types/enums";
import { breakpointsMax } from "styles/variables";
import {
  addToCartDataLayerPush,
  datalayerAddProductToCart,
} from "components/ui/Tracking/trackingUtils";
import { Namespaces } from "shared/namespaces";
import { useTranslation } from "i18n";
import { useSettings } from "contexts/SettingsContext";
import useSimilarToursDateFromChanged from "components/contexts/Tours/toursStateHooks";
import BookingWidgetForm from "components/ui/BookingWidget/BookingWidgetForm";

type Props = {
  toggleModal: () => void;
  isModalOpen: boolean;
  bookUrl: string;
};

const TourBookingWidgetContainer = ({ toggleModal, isModalOpen, bookUrl }: Props) => {
  const { marketplace } = useSettings();
  const { t } = useTranslation(Namespaces.commonNs);
  const {
    selectedDates,
    selectedPickupTime,
    numberOfTravelers,
    childrenAges,
    selectedExperiences,
    availableTimes,
    isPriceLoading,
    isDiscountLoading,
    isLoadingAvailableTimes,
    price,
    currency,
    experiences,
    travelerPrices,
    bookingWidgetView,
    selectedTransportLocation,
    hasPickup,
    formErrors,
    isFormLoading,
    fullPrice,
    isLoadingOptions,
    discount,
    discountValue,
    isPrivate,
    isLivePricing,
    livePricingUuid,
    livePricingNonDefaultUuid,
    isGTIVpDefaultOptionsLoading,
    selectedPrivateOptions,
    maxTravelers,
  } = useContext(bookingWidgetStateContext);

  const {
    setSelectedDates,
    setNumberOfTravelers,
    setChildrenAges,
    setTravelersPriceGroups,
    setSelectedPickupTime,
    setSelectedExperience,
    setDefaultNumberOfTravelers,
    setBookingWidgetView,
    setSelectedTransportLocation,
    setHasPickup,
    toggleIsFormLoading,
    togglePrivateState,
  } = useContext(bookingWidgetCallbackContext);

  const {
    id,
    tourType,
    lengthOfTour,
    isFreePickup,
    transport,
    editItem,
    lowestPriceGroupSize,
    title,
  } = useContext(bookingWidgetConstantContext);
  const setSimilarToursDateFrom = useSimilarToursDateFromChanged();

  const onSetSelectedDates = useCallback(
    (newSelectedDates?: SharedTypes.SelectedDates) => {
      if (newSelectedDates) {
        setSelectedDates(newSelectedDates);
        setSimilarToursDateFrom?.(newSelectedDates.from);
      } else {
        setSelectedDates({ from: undefined, to: undefined });
      }
    },
    [setSelectedDates, setSimilarToursDateFrom]
  );

  const formData = useMemo(
    () =>
      constructFormData({
        tourId: id,
        selectedDates,
        selectedPickupTime,
        numberOfTravelers,
        childrenAges,
        isFlexible: availableTimes.isFlexible,
        pickupType: transport.pickupType,
        pickupPlace: selectedTransportLocation.name,
        pickupPlaceId: selectedTransportLocation.id,
        hasPickup,
        isPrivate,
        selectedPrivateOptions,
        livePricingUuid,
        livePricingNonDefaultUuid,
      }),
    [
      id,
      selectedDates,
      selectedPickupTime,
      numberOfTravelers,
      childrenAges,
      availableTimes,
      transport.pickupType,
      selectedTransportLocation.name,
      selectedTransportLocation.id,
      hasPickup,
      isPrivate,
      selectedPrivateOptions,
      livePricingUuid,
      livePricingNonDefaultUuid,
    ]
  );
  const pickupPrice = useMemo(
    () => calculatePickupPrice(numberOfTravelers, availableTimes.times, selectedPickupTime),
    [availableTimes.times, numberOfTravelers, selectedPickupTime]
  );
  const pickupPrices = useMemo(
    () => getPickupPrices(availableTimes.times, selectedPickupTime),
    [availableTimes.times, selectedPickupTime]
  );
  const isMobile = useMediaQuery({ maxWidth: breakpointsMax.large });
  const priceSubtext = travelerText(t, numberOfTravelers, lowestPriceGroupSize);
  const hasSomeAvailablePickups = availableTimes.times.some(time => time.isPickupAvailable);

  const content = () => {
    if (isMobile && isModalOpen) {
      return (
        <TourBookingWidgetMobile
          id={id}
          tourType={tourType}
          bookingWidgetView={bookingWidgetView}
          onBookingWidgetViewChange={setBookingWidgetView}
          selectedDates={selectedDates}
          selectedPickupTime={selectedPickupTime}
          lengthOfTour={lengthOfTour}
          onDateSelection={onSetSelectedDates}
          onSetSelectedPickupTime={setSelectedPickupTime}
          onNumberOfTravelersChange={setNumberOfTravelers}
          onChildrenAgesChange={setChildrenAges}
          numberOfTravelers={numberOfTravelers}
          onSetTravelersPriceGroups={setTravelersPriceGroups}
          availableTimes={availableTimes}
          isLoadingAvailableTimes={isLoadingAvailableTimes}
          selectedExperiences={selectedExperiences}
          onSetSelectedExperience={setSelectedExperience}
          onSetDefaultNumberOfTravelers={setDefaultNumberOfTravelers}
          travelerPrices={travelerPrices}
          experiences={experiences}
          childrenAges={childrenAges}
          isFreePickup={isFreePickup}
          transport={transport}
          selectedTransportLocation={selectedTransportLocation}
          onSetSelectedTransportLocation={setSelectedTransportLocation}
          toggleModal={toggleModal}
          isModalOpen={isModalOpen}
          setHasPickup={setHasPickup}
          hasPickup={hasPickup}
          pickupPrice={pickupPrice}
          pickupPrices={pickupPrices}
          cartItem={editItem}
          isLoadingOptions={isLoadingOptions}
          isPrivate={isPrivate}
          isLivePricing={isLivePricing}
          selectedPrivateOptions={selectedPrivateOptions}
          togglePrivateState={togglePrivateState}
          hasSomeAvailablePickups={hasSomeAvailablePickups}
          maxTravelers={maxTravelers}
        />
      );
    }
    if (!isMobile) {
      return (
        <TourBookingWidgetDesktop
          id={id}
          tourType={tourType}
          price={price}
          discount={discount}
          discountValue={discountValue}
          isPriceLoading={isPriceLoading}
          isDiscountLoading={isDiscountLoading}
          currency={currency}
          selectedDates={selectedDates}
          lengthOfTour={lengthOfTour}
          onDateSelection={onSetSelectedDates}
          onNumberOfTravelersChange={setNumberOfTravelers}
          onChildrenAgesChange={setChildrenAges}
          onSetTravelersPriceGroups={setTravelersPriceGroups}
          onSetSelectedPickupTime={setSelectedPickupTime}
          selectedPickupTime={selectedPickupTime}
          onSetSelectedTransportLocation={setSelectedTransportLocation}
          selectedTransportLocation={selectedTransportLocation}
          numberOfTravelers={numberOfTravelers}
          availableTimes={availableTimes}
          isLoadingAvailableTimes={isLoadingAvailableTimes}
          selectedExperiences={selectedExperiences}
          onSetSelectedExperience={setSelectedExperience}
          onSetDefaultNumberOfTravelers={setDefaultNumberOfTravelers}
          travelerPrices={travelerPrices}
          childrenAges={childrenAges}
          experiences={experiences}
          isFreePickup={isFreePickup}
          transport={transport}
          formErrors={formErrors}
          setHasPickup={setHasPickup}
          hasPickup={hasPickup}
          pickupPrice={pickupPrice}
          pickupPrices={pickupPrices}
          isFormLoading={isFormLoading}
          priceSubtext={priceSubtext}
          fullPrice={fullPrice}
          isLoadingOptions={isLoadingOptions}
          isPrivate={isPrivate}
          isLivePricing={isLivePricing}
          isGTIVpDefaultOptionsLoading={isGTIVpDefaultOptionsLoading}
          selectedPrivateOptions={selectedPrivateOptions}
          togglePrivateState={togglePrivateState}
          hasSomeAvailablePickups={hasSomeAvailablePickups}
          maxTravelers={maxTravelers}
        />
      );
    }
    return null;
  };

  return (
    <BookingWidgetForm
      id="booking-widget-form"
      action={`/${bookUrl}/${id}${editItem ? `?cart_item=${editItem.itemId}` : ""}`}
      method="POST"
      onSubmit={e => {
        if (formErrors.length > 0 || isFormLoading) {
          e.preventDefault();
        } else {
          toggleIsFormLoading();
          addToCartDataLayerPush(currency, title, id, price);
          datalayerAddProductToCart(
            {
              id: id.toString(),
              price: price.toString(),
              name: title,
              marketplace,
              productType: Product.TOUR,
            },
            currency as SupportedCurrencies
          );
        }
      }}
    >
      <TourBookingWidgetFormInputs formData={formData} isLivePricing={isLivePricing} />
      {formData.pickupType === TransportPickup.List && (
        <input type="hidden" name="place_id" value={formData.pickupPlaceId} />
      )}
      {(formData.pickupType === TransportPickup.List ||
        formData.pickupType === TransportPickup.Address) && (
        <input type="hidden" name={formData.pickupName} value={formData.pickupPlace} />
      )}
      {content()}
    </BookingWidgetForm>
  );
};
export default TourBookingWidgetContainer;
