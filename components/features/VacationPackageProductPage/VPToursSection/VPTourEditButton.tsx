import React, { useEffect, useCallback, useContext } from "react";
import { useQuery } from "@apollo/react-hooks";

import { VPStateContext } from "../contexts/VPStateContext";
import VPProductCardModal from "../VPProductCardModal";
import { EditButtonWrapper, StyledEditIcon } from "../VPProductCardFooter";
import VPSingleTourQuery from "../queries/VPSingleTourQuery.graphql";
import { VPTourCallbackContext, VPTourStateContext } from "../contexts/VPTourStateContext";
import { VPActionCallbackContext } from "../contexts/VPActionStateContext";

import VPTourEditModalContent from "./VPTourEditModalContent";
import { isSomeTravelerQuestionEmpty, isSomeBookingQuestionsEmpty } from "./utils/vpToursUtils";

import { useIsMobile } from "hooks/useMediaQueryCustom";
import { yearMonthDayFormat, getFormattedDate } from "utils/dateUtils";
import { noCacheHeaders } from "utils/apiUtils";
import { useGTETourBookingWidgetContext } from "components/features/GTETourProductPage/GTETourBookingWidget/GTETourBookingWidgetStateContext";
import {
  getTotalTravelers,
  getNumberOfAdults,
} from "components/features/GTETourProductPage/GTETourBookingWidget/utils/gteTourBookingWidgetUtils";
import { SupportedCurrencies } from "types/enums";
import { GTETourProvider } from "components/features/GTETourProductPage/GTETourBookingWidget/types/enums";
import { Namespaces } from "shared/namespaces";
import { useTranslation } from "i18n";
import { getFormErrorText } from "components/features/GTETourProductPage/GTETourBookingWidget/utils/cartUtils";

const VPTourEditButton = ({
  productId,
  editModalTitle,
  isFormEditModal = false,
  dayNumber,
  isProductSubmitted,
  editModalActive,
  toggleEditModal,
}: {
  productId: string;
  editModalTitle?: { Icon: React.ElementType; title: string };
  isFormEditModal?: boolean;
  dayNumber: number;
  isProductSubmitted: boolean;
  editModalActive: boolean;
  toggleEditModal: (e?: React.SyntheticEvent<Element, Event> | undefined) => void;
}) => {
  const isMobile = useIsMobile();
  const { t } = useTranslation(Namespaces.tourNs);
  const { requestId } = useContext(VPStateContext);
  const { selectedTours, singleTourLoading } = useContext(VPTourStateContext);
  const { onSetSingleTourLoading } = useContext(VPTourCallbackContext);
  const { onVPTourProductCompleted, onCloseVPTourEditModal, onSubmitVPTourProduct } =
    useContext(VPActionCallbackContext);
  const {
    selectedDates,
    numberOfTravelers,
    setContextState,
    bookingQuestions,
    travelerQuestions,
    requiresAdultForBooking,
    selectedTourOption,
    priceGroups,
    allowCustomTravelerPickup,
    isError,
    tourOptions,
    durationInMinutes,
  } = useGTETourBookingWidgetContext();
  const travelDate = selectedDates.from
    ? getFormattedDate(selectedDates.from, yearMonthDayFormat)
    : undefined;
  const totalTravellers = getTotalTravelers(numberOfTravelers);
  const numberOfAdults = getNumberOfAdults(numberOfTravelers);
  const missingRequiredAdults = requiresAdultForBooking && numberOfAdults === 0;
  const formErrorText = getFormErrorText(
    selectedDates,
    numberOfTravelers,
    bookingQuestions,
    travelerQuestions,
    priceGroups,
    allowCustomTravelerPickup,
    t,
    isError ? t("There is no availability for the selected period") : undefined
  );
  const skipVPSingleTourQuery =
    missingRequiredAdults || totalTravellers === 0 || !selectedDates.from;
  const { loading } = useQuery<{
    vacationPackageTourSingleProduct: GTETourBookingWidgetTypes.TourData;
  }>(VPSingleTourQuery, {
    variables: {
      input: {
        requestId,
        dayNumber,
        productCode: productId,
        currency: SupportedCurrencies.EURO,
        paxMix: numberOfTravelers.filter(age => age.numberOfTravelers > 0),
        travelDate,
        provider: GTETourProvider.VIATOR,
      },
    },
    skip: skipVPSingleTourQuery,
    fetchPolicy: "cache-and-network",
    context: {
      headers: noCacheHeaders,
    },
    onError: () => {
      setContextState({
        isError: true,
        isAvailabilityLoading: false,
      });
      if (!editModalActive) {
        toggleEditModal();
      }
      onSetSingleTourLoading(false);
    },
    onCompleted: ({ vacationPackageTourSingleProduct }) => {
      onVPTourProductCompleted(
        setContextState,
        vacationPackageTourSingleProduct,
        editModalActive,
        dayNumber,
        numberOfTravelers,
        bookingQuestions,
        travelerQuestions,
        toggleEditModal,
        selectedTourOption,
        formErrorText
      );
    },
  });
  const hasUnansweredBookingQuestions = isSomeBookingQuestionsEmpty(bookingQuestions);
  const hasUnansweredTravelerQuestions = isSomeTravelerQuestionEmpty(travelerQuestions);
  const isTourAlreadySelected = selectedTours.some(
    tour => tour.productCode === productId && tour.travelDate === travelDate
  );

  const onSubmit = useCallback(() => {
    if (editModalActive) {
      toggleEditModal();
    }
    onSubmitVPTourProduct(
      dayNumber,
      productId,
      selectedDates,
      numberOfTravelers,
      bookingQuestions,
      travelerQuestions,
      allowCustomTravelerPickup,
      tourOptions,
      selectedTourOption,
      durationInMinutes
    );
  }, [
    onSubmitVPTourProduct,
    toggleEditModal,
    dayNumber,
    productId,
    selectedDates,
    numberOfTravelers,
    bookingQuestions,
    travelerQuestions,
    allowCustomTravelerPickup,
    tourOptions,
    selectedTourOption,
    durationInMinutes,
    editModalActive,
  ]);

  useEffect(() => {
    if (loading) {
      setContextState({
        isAvailabilityLoading: true,
        isError: false,
      });
    } else if (!skipVPSingleTourQuery && singleTourLoading) {
      onSetSingleTourLoading(false);
    }
    if (
      selectedTourOption &&
      !hasUnansweredBookingQuestions &&
      !hasUnansweredTravelerQuestions &&
      !isTourAlreadySelected &&
      !editModalActive
    ) {
      onSubmit();
    }
  }, [
    setContextState,
    skipVPSingleTourQuery,
    loading,
    onSubmit,
    editModalActive,
    selectedTourOption,
    hasUnansweredBookingQuestions,
    hasUnansweredTravelerQuestions,
    isTourAlreadySelected,
    onSetSingleTourLoading,
  ]);

  const onCloseModal = useCallback(() => {
    toggleEditModal();
    onCloseVPTourEditModal(
      setContextState,
      selectedDates,
      dayNumber,
      productId,
      bookingQuestions,
      travelerQuestions,
      allowCustomTravelerPickup,
      numberOfTravelers,
      tourOptions,
      selectedTourOption,
      durationInMinutes
    );
  }, [
    onCloseVPTourEditModal,
    toggleEditModal,
    setContextState,
    selectedDates,
    dayNumber,
    productId,
    bookingQuestions,
    travelerQuestions,
    allowCustomTravelerPickup,
    numberOfTravelers,
    tourOptions,
    selectedTourOption,
    durationInMinutes,
  ]);

  return (
    <>
      {isProductSubmitted && (
        <EditButtonWrapper onClick={toggleEditModal}>
          <StyledEditIcon />
        </EditButtonWrapper>
      )}
      {editModalActive && (
        <VPProductCardModal
          modalContent={
            <VPTourEditModalContent productId={productId} editModalTitle={editModalTitle?.title} />
          }
          modalId="editVPTourModal"
          onToggleModal={onCloseModal}
          modalTitle={isMobile ? undefined : editModalTitle}
          isForm={isFormEditModal}
          noMinHeight={false}
          onSubmit={onSubmit}
          error={formErrorText}
        />
      )}
    </>
  );
};

export default VPTourEditButton;
