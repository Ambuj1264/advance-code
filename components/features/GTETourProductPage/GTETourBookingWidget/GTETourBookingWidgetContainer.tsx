import React, { useEffect, useCallback, FormEvent } from "react";
import { useQuery } from "@apollo/react-hooks";

import GTETourAvailabilityQuery from "./queries/GTETourAvailabilityQuery.graphql";
import { useGTETourBookingWidgetContext } from "./GTETourBookingWidgetStateContext";
import {
  getInitialSelectedTourOption,
  getTotalPrice,
  constructTourQuestions,
  getTotalTravelers,
  getNumberOfAdults,
  getTravelerErrorMessage,
} from "./utils/gteTourBookingWidgetUtils";
import useAddGTETourToCart from "./useAddGTETourToCart";
import { getFormErrorText } from "./utils/cartUtils";
import { GTETourProvider } from "./types/enums";
import GTETourBookingWidgetMobile from "./GTETourBookingWidgetMobile";
import GTETourBookingWidgetDesktop from "./GTETourBookingWidgetDesktop";

import lazyCaptureException from "lib/lazyCaptureException";
import { useIsMobile } from "hooks/useMediaQueryCustom";
import { yearMonthDayFormat, getFormattedDate } from "utils/dateUtils";
import { cacheOnClient30M } from "utils/apiUtils";
import { Namespaces } from "shared/namespaces";
import { useTranslation } from "i18n";
import { SupportedCurrencies } from "types/enums";
import BookingWidgetForm from "components/ui/BookingWidget/BookingWidgetForm";

const GTETourBookingWidgetContainer = ({
  toggleModal,
  isModalOpen,
  productUrl,
  productId,
  numberOfDays,
  fromPrice,
  title,
}: {
  toggleModal: () => void;
  isModalOpen: boolean;
  productUrl: string;
  productId: string;
  numberOfDays: number;
  fromPrice: number;
  title?: string;
}) => {
  const { t } = useTranslation(Namespaces.tourBookingWidgetNs);
  const {
    selectedDates,
    numberOfTravelers,
    setContextState,
    totalPrice,
    bookingQuestions,
    travelerQuestions,
    priceGroups,
    requiresAdultForBooking,
    areDatesLoading,
    selectedTourOption,
  } = useGTETourBookingWidgetContext();
  const isMobile = useIsMobile();
  const { addToCartMutation, addToCartLoading } = useAddGTETourToCart({
    productCode: productId || "",
    productUrl,
    title,
  });
  const totalTravellers = getTotalTravelers(numberOfTravelers);
  const numberOfAdults = getNumberOfAdults(numberOfTravelers);
  const missingRequiredAdults = requiresAdultForBooking && numberOfAdults === 0;
  const shouldSkipQuery =
    !selectedDates.from ||
    totalTravellers === 0 ||
    !productId ||
    missingRequiredAdults ||
    areDatesLoading;
  const { data, loading } = useQuery<{
    toursAndTicketsSingleProduct: GTETourBookingWidgetTypes.TourData;
  }>(GTETourAvailabilityQuery, {
    variables: {
      input: {
        // TODO: add correct currency
        productCode: productId,
        currency: SupportedCurrencies.EURO,
        paxMix: numberOfTravelers.filter(age => age.numberOfTravelers > 0),
        travelDate: selectedDates.from
          ? getFormattedDate(selectedDates.from, yearMonthDayFormat)
          : undefined,
        provider: GTETourProvider.VIATOR,
      },
    },
    skip: shouldSkipQuery,
    fetchPolicy: "cache-and-network",
    context: { headers: cacheOnClient30M },
    onCompleted: completedData => {
      const tourOptions = completedData?.toursAndTicketsSingleProduct?.options.filter(option =>
        option.times.some(time => time.available)
      );
      const tourQuestions = completedData?.toursAndTicketsSingleProduct?.questions;

      let selectedOption;
      let splitQuestions;
      if (tourOptions && tourOptions.length) {
        selectedOption = getInitialSelectedTourOption(tourOptions[0], selectedTourOption);
        if (tourQuestions && tourQuestions.length) {
          splitQuestions = constructTourQuestions(
            numberOfTravelers,
            tourQuestions,
            bookingQuestions,
            travelerQuestions
          );
        }
      }

      setContextState({
        isAvailabilityLoading: false,
        isError: tourOptions.length === 0,
        tourOptions,
        startingPlace: completedData?.toursAndTicketsSingleProduct?.startingPlace,
        endingPlace: completedData?.toursAndTicketsSingleProduct?.endingPlace,
        allowCustomTravelerPickup:
          !!completedData?.toursAndTicketsSingleProduct?.pickup?.allowCustomTravelerPickup,
        ...(selectedOption
          ? {
              selectedTourOption: selectedOption,
              totalPrice: getTotalPrice(selectedOption),
            }
          : null),
        ...(splitQuestions
          ? {
              bookingQuestions: splitQuestions.perBooking,
              travelerQuestions: splitQuestions.perPerson,
            }
          : null),
      });
    },
    onError: e => {
      setContextState({
        isError: true,
        isAvailabilityLoading: false,
      });
      lazyCaptureException(e);
    },
  });
  const travelerErrorMessage = getTravelerErrorMessage(
    totalTravellers,
    missingRequiredAdults,
    priceGroups,
    t,
    Boolean(data)
  );

  useEffect(() => {
    if (loading) {
      setContextState({
        isAvailabilityLoading: true,
        isError: false,
      });
    }
  }, [loading, setContextState]);

  const allowCustomTravelerPickup =
    !!data?.toursAndTicketsSingleProduct?.pickup?.allowCustomTravelerPickup;
  const formErrorText = getFormErrorText(
    selectedDates,
    numberOfTravelers,
    bookingQuestions,
    travelerQuestions,
    priceGroups,
    allowCustomTravelerPickup,
    t,
    travelerErrorMessage
  );

  const onAddToCart = useCallback(
    (e?: FormEvent<HTMLFormElement>) => {
      e?.preventDefault();
      if (totalPrice > 0 && !formErrorText) {
        addToCartMutation();
      }
    },
    [addToCartMutation, formErrorText, totalPrice]
  );
  return (
    <BookingWidgetForm id="gte-tourbookingwidget-form">
      {isMobile && isModalOpen && (
        <GTETourBookingWidgetMobile
          isModalOpen={isModalOpen}
          toggleModal={toggleModal}
          onAddToCart={onAddToCart}
          numberOfDays={numberOfDays}
          productId={productId}
          formErrorText={formErrorText}
          isFormLoading={addToCartLoading}
          hideContent={shouldSkipQuery}
          travelerErrorMessage={travelerErrorMessage}
          fromPrice={fromPrice}
        />
      )}
      {!isMobile && (
        <GTETourBookingWidgetDesktop
          onAddToCart={onAddToCart}
          isFormLoading={addToCartLoading}
          numberOfDays={numberOfDays}
          productId={productId}
          formErrorText={formErrorText}
          hideContent={shouldSkipQuery}
          travelerErrorMessage={travelerErrorMessage}
          fromPrice={fromPrice}
        />
      )}
    </BookingWidgetForm>
  );
};

export default GTETourBookingWidgetContainer;
