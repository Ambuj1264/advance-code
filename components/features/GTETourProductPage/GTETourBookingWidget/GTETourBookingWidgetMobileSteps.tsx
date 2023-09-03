import React, { useCallback } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import GTETourDatePickerContainer from "./GTETourDatePickerContainer";
import GTETravelersContainer from "./GTETravelersContainer";
import GTETourOptionContainer from "./GTETourOptionContainer";
import GTETourOptionTimeContainer from "./GTETourOptionTimeContainer";
import GTETourOptionLanguagesContainer from "./GTETourOptionLanguagesContainer";
import GTETourBookingQuestions from "./GTETourBookingQuestions";
import GTETourTravelerQuestionsContainer from "./GTETourTravelerQuestionsContainer";
import NoTourAvailability from "./NoTourAvailability";
import { useOnBookingWidgetViewChange } from "./gteTourHooks";

import MobileSectionHeading from "components/ui/BookingWidget/MobileSectionHeading";
import { gutters } from "styles/variables";
import { Namespaces } from "shared/namespaces";
import { useTranslation } from "i18n";
import BookingWidgetView from "components/features/TourBookingWidget/types/enums";

export const StyledMobileSectionHeading = styled(MobileSectionHeading)`
  margin: ${gutters.large}px -${gutters.small}px;
`;

const SectionWrapper = styled.div(
  () => css`
    margin: ${gutters.small}px 0;
  `
);

const GTETourBookingWidgetMobileSteps = ({
  bookingWidgetView,
  numberOfDays,
  productId,
  hideContent,
  isError = false,
}: {
  bookingWidgetView: BookingWidgetView;
  numberOfDays: number;
  productId: string;
  hideContent: boolean;
  isError?: boolean;
}) => {
  const { t } = useTranslation(Namespaces.tourBookingWidgetNs);

  const onBookingWidgetViewChange = useOnBookingWidgetViewChange();
  const openDatesStep = useCallback(() => {
    onBookingWidgetViewChange(BookingWidgetView.Dates);
  }, [onBookingWidgetViewChange]);

  const openTravelersStep = useCallback(() => {
    onBookingWidgetViewChange(BookingWidgetView.Travelers);
  }, [onBookingWidgetViewChange]);

  return (
    <>
      {bookingWidgetView === BookingWidgetView.Default && (
        <>
          <MobileSectionHeading>{t("Travel details")}</MobileSectionHeading>
          <SectionWrapper>
            <GTETourDatePickerContainer
              lengthOfTour={numberOfDays}
              productId={productId}
              onDropdownDateInputClick={openDatesStep}
              viewType="dropdown"
              isMobileSteps
            />
            <GTETravelersContainer
              isMobileSteps
              onOpenStateChange={openTravelersStep}
              viewType="dropdown"
            />
          </SectionWrapper>

          {isError && (
            <SectionWrapper>
              <NoTourAvailability />
            </SectionWrapper>
          )}
          {!hideContent && !isError && (
            <>
              <MobileSectionHeading>{t("Tour details")}</MobileSectionHeading>
              <SectionWrapper>
                <GTETourOptionContainer />
                <GTETourOptionTimeContainer />
                <GTETourOptionLanguagesContainer />
              </SectionWrapper>
            </>
          )}
          <SectionWrapper>
            <GTETourBookingQuestions productCode={productId} />
            <GTETourTravelerQuestionsContainer productCode={productId} />
          </SectionWrapper>
        </>
      )}
      {bookingWidgetView === BookingWidgetView.Dates && (
        <GTETourDatePickerContainer
          lengthOfTour={numberOfDays}
          productId={productId}
          viewType="calendar"
          isMobileSteps
        />
      )}
      {bookingWidgetView === BookingWidgetView.Travelers && (
        <GTETravelersContainer viewType="list" />
      )}
    </>
  );
};

export default GTETourBookingWidgetMobileSteps;
