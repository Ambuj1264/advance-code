import React, { useCallback, useRef, useContext } from "react";
import styled from "@emotion/styled";
import { none } from "fp-ts/lib/Option";

import { VPStateContext } from "../contexts/VPStateContext";
import { VPStayStateContext } from "../contexts/VPStayStateContext";
import { VPTourStateContext } from "../contexts/VPTourStateContext";
import { VPPriceStateContext } from "../contexts/VPPriceStateContext";
import { VPActionCallbackContext } from "../contexts/VPActionStateContext";

import { getVPFooterPrice } from "./utils/vpBookingWidgetUtils";
import VPDatePicker from "./VPDatePicker";
import { VPBookingWidgetDesktopDays } from "./VPBookingWidgetDesktopDays";
import VPBookingWidgetFlightsSection from "./VPBookingWidgetFlightsSection";
import VPBookingWidgetCarSection from "./VPBookingWidgetCarSection";
import { useDropdownActiveState } from "./utils/vpBookingWidgetHooks";

import { Trans, useTranslation } from "i18n";
import BookingWidgetDesktopContainer from "components/ui/BookingWidget/BookingWidgetDesktopContainer";
import { Namespaces } from "shared/namespaces";
import { useCurrencyWithDefault } from "hooks/useCurrency";
import { fontWeightBold, gutters, zIndex } from "styles/variables";
import BookingWidgetControlRow from "components/ui/BookingWidget/BookingWidgetControlRow";
import VPBookingWidgetSectionHeader from "components/ui/BookingWidget/BookingWidgetSectionHeader";
import { BannerText } from "components/ui/BookingWidget/BookingWidgetHeader/BookingWidgetTopBanner";
import { Container } from "components/ui/BookingWidget/BookingWidgetFooter/BookingWidgetFooter";
import NewDesktopRoomAndGuestPicker from "components/ui/RoomAndGuestPicker/NewDesktopRoomAndGuestPicker";

const BookingWidgetBody = styled.div`
  margin: 0 ${gutters.large}px ${gutters.large * 2}px ${gutters.large}px;
`;

const StyledBookingWidgetDesktopContainer = styled(BookingWidgetDesktopContainer)`
  ${BannerText} {
    font-weight: ${fontWeightBold};
  }
  ${Container} {
    z-index: ${zIndex.z4};
  }
`;

const VPBookingWidgetDesktop = ({
  onAddToCart,
  destinationName,
  destinationId,
  vacationPackageDays,
  isVPPriceAvailable,
  isAddToCartLoading,
}: {
  onAddToCart: () => void;
  destinationName?: string;
  destinationId?: string;
  vacationPackageDays: VacationPackageTypes.VacationPackageDay[];
  isVPPriceAvailable: boolean;
  isAddToCartLoading: boolean;
}) => {
  const { t: commonT } = useTranslation(Namespaces.commonNs);
  const { t: vacationPackageT } = useTranslation(Namespaces.vacationPackageNs);
  const { currencyCode, convertCurrency } = useCurrencyWithDefault();

  const { selectedDates, vacationLength, unavailableDatesRange, isSadPathWithoutParams } =
    useContext(VPStateContext);
  const { vpPrice, fromPrice } = useContext(VPPriceStateContext);
  const { selectedToursProductIds } = useContext(VPTourStateContext);
  const { occupancies } = useContext(VPStayStateContext);
  const { onVPOccupanciesChange, onVPOccupanciesRoomsChange } = useContext(VPActionCallbackContext);
  const priceWithCurrency = vpPrice !== undefined ? convertCurrency(vpPrice) : undefined;

  const {
    activeDropdown,
    onDatesOpenStateChangeHandler,
    onTravelersOpenStateChangeHandler,
    onFlightOpenStateChangeHandler,
    onCarOpenStateChangeHandler,
    createOnStayOpenStateChangeHandler,
    createOnTourOpenStateChangeHandler,
  } = useDropdownActiveState();

  const buttonText = isSadPathWithoutParams
    ? vacationPackageT("Select dates")
    : commonT("Continue");

  const isLoading = !isSadPathWithoutParams && !isVPPriceAvailable;

  const dateInputRef = useRef<VacationPackageTypes.dateInputRef>(null);

  const dateInputToggle = useCallback(() => {
    if (dateInputRef.current?.toggleCalendarCb && isSadPathWithoutParams)
      dateInputRef.current?.toggleCalendarCb();
  }, [isSadPathWithoutParams]);

  return (
    <StyledBookingWidgetDesktopContainer
      footerText={buttonText}
      price={!isSadPathWithoutParams ? priceWithCurrency : convertCurrency(fromPrice)}
      discount={none}
      isPriceLoading={isLoading}
      isFormLoading={isLoading || isAddToCartLoading}
      isTotalPrice={!isSadPathWithoutParams}
      currency={currencyCode}
      priceSubtext={getVPFooterPrice(vpPrice, occupancies, selectedDates, commonT)}
      pricePlaceholder={vacationPackageT("Finding best price")}
      onFooterButtonClick={isSadPathWithoutParams ? dateInputToggle : onAddToCart}
      showOverlay={Boolean(activeDropdown)}
    >
      <BookingWidgetControlRow
        title={vacationPackageT("Dates")}
        isOpen={activeDropdown === "dates"}
      >
        <VPDatePicker
          unavailableDatesRange={unavailableDatesRange}
          selectedDates={selectedDates}
          vacationLength={vacationLength}
          isSadPathWithoutParams={isSadPathWithoutParams}
          onOpenStateChange={onDatesOpenStateChangeHandler}
          dateInputRef={dateInputRef}
        />
      </BookingWidgetControlRow>

      <BookingWidgetControlRow
        title={vacationPackageT("Travelers")}
        rightTitle={vacationPackageT("Rooms")}
        isOpen={activeDropdown === "travelers"}
      >
        <NewDesktopRoomAndGuestPicker
          occupancies={occupancies}
          onOpenStateChange={onTravelersOpenStateChangeHandler}
          onSetOccupancies={onVPOccupanciesChange}
          onSetRooms={onVPOccupanciesRoomsChange}
          withLabelWrapper={false}
        />
      </BookingWidgetControlRow>

      <VPBookingWidgetSectionHeader>
        <Trans ns={Namespaces.vacationPackageNs}>Flights</Trans>
      </VPBookingWidgetSectionHeader>
      <VPBookingWidgetFlightsSection
        destinationName={destinationName}
        destinationId={destinationId}
        onOpenStateChange={onFlightOpenStateChangeHandler}
        activeDropdown={activeDropdown}
      />

      <VPBookingWidgetSectionHeader>
        <Trans ns={Namespaces.vacationPackageNs}>Car</Trans>
      </VPBookingWidgetSectionHeader>
      <VPBookingWidgetCarSection
        activeDropdown={activeDropdown}
        onOpenStateChange={onCarOpenStateChangeHandler}
      />

      <VPBookingWidgetDesktopDays
        selectedToursProductIds={selectedToursProductIds}
        selectedDates={selectedDates}
        vacationPackageDays={vacationPackageDays}
        createOnStayOpenStateChangeHandler={createOnStayOpenStateChangeHandler}
        createOnTourOpenStateChangeHandler={createOnTourOpenStateChangeHandler}
        activeDropdown={activeDropdown}
      />

      <BookingWidgetBody />
    </StyledBookingWidgetDesktopContainer>
  );
};

export default VPBookingWidgetDesktop;
