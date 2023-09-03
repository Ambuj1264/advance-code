import React, { useContext, SyntheticEvent, useMemo } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import { format } from "date-fns";

import MobileSectionHeading from "../BookingWidget/MobileSectionHeading";
import { StyledMobileDatePickerSectionHeading } from "../DatePicker/MobileDateRangePicker";
import BookingWidgetFooterDate from "../BookingWidget/BookingWidgetFooter/BookingWidgetFooterDate";

import CarSearchWidgetStateContext from "./contexts/CarSearchWidgetStateContext";
import DatePickerContainer from "./DatePicker/CarDatePickerContainer";
import PickupInfoMobile, { StyledPickupInfoMobileSectionHeading } from "./PickupInfoMobile";
import { getSearchPageLink } from "./utils/carSearchWidgetUtils";
import CarSearchWidgetCallbackContext from "./contexts/CarSearchWidgetCallbackContext";

import SearchWidgetMobile from "components/ui/SearchWidget/SearchWidgetMobile";
import SearchWidgetFooterMobile from "components/ui/SearchWidget/SearchWidgetFooterMobile";
import { useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";
import { getAvailableTime } from "components/ui/DatePicker/utils/datePickerUtils";
import { shortMonthDayFormat } from "utils/dateUtils";
import { whiteColor, zIndex } from "styles/variables";

const StyledMobileSectionHeadingWrapper = styled.div(
  () => css`
    position: sticky;
    top: 0;
    z-index: ${zIndex.z1};
    background: ${whiteColor};
  `
);

const StyledDatePickerContainer = styled(DatePickerContainer)(
  () => css`
    ${StyledMobileDatePickerSectionHeading} {
      display: none;
    }
  `
);

const StyledPickupInfoMobile = styled(PickupInfoMobile)(
  () => css`
    ${StyledPickupInfoMobileSectionHeading} {
      display: none;
    }
  `
);

const CarSearchWidgetMobileStickyHeading = () => {
  const { t: carSearchT } = useTranslation(Namespaces.carSearchNs);

  return (
    <StyledMobileSectionHeadingWrapper>
      <MobileSectionHeading>
        {carSearchT("Search again and see all available cars")}
      </MobileSectionHeading>
    </StyledMobileSectionHeadingWrapper>
  );
};

const CarSearchWidgetMobile = ({
  currentStep,
  onPreviousClick,
  onModalClose,
  searchWidgetView,
  onFooterButtonClick,
  searchLink,
  showBackButtonOnFirstStep = false,
  isBookingWidgetView = false,
}: {
  currentStep: number;
  onPreviousClick: () => void;
  onModalClose: () => void;
  searchWidgetView: "pickupInfo" | "dates";
  onFooterButtonClick: (e: SyntheticEvent) => void;
  searchLink?: string;
  showBackButtonOnFirstStep?: boolean;
  isBookingWidgetView?: boolean;
}) => {
  const {
    selectedDates,
    pickupId,
    dropoffId,
    times,
    driverAge,
    driverCountry,
    pickupLocationName,
    dropoffLocationName,
  } = useContext(CarSearchWidgetStateContext);
  const {
    onPickupLocationChange,
    onDropoffLocationChange,
    onPickupTimeChange,
    onDropoffTimeChange,
    onSetDriverAge,
    onSetDriverCountry,
  } = useContext(CarSearchWidgetCallbackContext);

  const { t } = useTranslation(Namespaces.commonBookingWidgetNs);
  const { t: commonSearchT } = useTranslation(Namespaces.commonSearchNs);
  const isDateView = searchWidgetView === "dates";
  const isPickupInfoView = searchWidgetView === "pickupInfo";
  const isFormValid = isDateView
    ? selectedDates.from && selectedDates.to && pickupId && dropoffId
    : true;

  const pickupAvailableTime = getAvailableTime(selectedDates.from);
  const dropoffAvailableTime = getAvailableTime(selectedDates.to);

  const ctaButtonLabel = useMemo(() => {
    if (isBookingWidgetView) {
      return isDateView ? commonSearchT("Continue") : t("Search");
    }

    return isDateView ? commonSearchT("Search") : t("Continue");
  }, [isBookingWidgetView, isDateView, commonSearchT, t]);

  const ctaButtonHref = useMemo(() => {
    if (isBookingWidgetView) {
      return isPickupInfoView && searchLink && pickupId && dropoffId
        ? getSearchPageLink({
            searchLink,
            selectedDates,
            pickupId,
            dropoffId,
            driverAge,
            driverCountry,
            pickupLocationName,
            dropoffLocationName,
          })
        : undefined;
    }
    return isDateView && searchLink && pickupId && dropoffId
      ? getSearchPageLink({
          searchLink,
          selectedDates,
          pickupId,
          dropoffId,
          driverAge,
          driverCountry,
          pickupLocationName,
          dropoffLocationName,
        })
      : undefined;
  }, [
    driverAge,
    driverCountry,
    dropoffId,
    dropoffLocationName,
    isBookingWidgetView,
    isDateView,
    isPickupInfoView,
    pickupId,
    pickupLocationName,
    searchLink,
    selectedDates,
  ]);

  const leftContent = useMemo(
    () =>
      selectedDates.from && selectedDates.to ? (
        <BookingWidgetFooterDate
          startDate={format(selectedDates.from, shortMonthDayFormat)}
          endDate={format(selectedDates.to, shortMonthDayFormat)}
        />
      ) : null,
    [selectedDates.from, selectedDates.to]
  );

  return (
    <SearchWidgetMobile
      currentStep={currentStep}
      onPreviousClick={onPreviousClick}
      onModalClose={onModalClose}
      showBackButton={!(searchWidgetView === "pickupInfo" && !showBackButtonOnFirstStep)}
      footer={
        <SearchWidgetFooterMobile
          onButtonClick={onFooterButtonClick}
          buttonCallToAction={ctaButtonLabel}
          href={ctaButtonHref}
          leftContent={leftContent}
          tooltipErrorMessage={
            !isFormValid ? commonSearchT("Please fill in your search information") : undefined
          }
        />
      }
    >
      {searchWidgetView === "pickupInfo" && (
        <>
          <StyledMobileSectionHeadingWrapper>
            <CarSearchWidgetMobileStickyHeading />
          </StyledMobileSectionHeadingWrapper>
          <StyledPickupInfoMobile
            times={times}
            pickupName={pickupLocationName}
            pickupId={pickupId}
            dropoffName={dropoffLocationName}
            dropoffId={dropoffId}
            onPickupLocationChange={onPickupLocationChange}
            onDropoffLocationChange={onDropoffLocationChange}
            onPickupTimeChange={onPickupTimeChange}
            onDropoffTimeChange={onDropoffTimeChange}
            pickupAvailableTime={pickupAvailableTime}
            dropoffAvailableTime={dropoffAvailableTime}
            driverAge={driverAge}
            setDriverAge={onSetDriverAge}
            driverCountry={driverCountry}
            setDriverCountry={onSetDriverCountry}
          />
        </>
      )}
      {searchWidgetView === "dates" && (
        <>
          <StyledMobileSectionHeadingWrapper>
            <CarSearchWidgetMobileStickyHeading />
          </StyledMobileSectionHeadingWrapper>
          <StyledDatePickerContainer selectedDates={selectedDates} isMobile />
        </>
      )}
    </SearchWidgetMobile>
  );
};

export default CarSearchWidgetMobile;
