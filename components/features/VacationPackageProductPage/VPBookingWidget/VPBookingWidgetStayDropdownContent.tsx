import React, { SyntheticEvent, useCallback, useMemo, useContext } from "react";
import { range } from "fp-ts/lib/Array";
import styled from "@emotion/styled";

import {
  constructPriceLabel,
  constructStaysQuickFacts,
  findSelectedStayByDay,
  getVPModalProductId,
} from "../utils/vacationPackageUtils";
import { VPActionCallbackContext } from "../contexts/VPActionStateContext";
import { VPStayStateContext } from "../contexts/VPStayStateContext";

import {
  bookingWidgetLabelIconStyles,
  StyledBookingWidgetLabel,
  StyledVPBookingProductSkeleton,
} from "./utils/vpBookingWidgetShared";

import { useOnToggleModal } from "components/features/VacationPackageProductPage/contexts/VPStateHooks";
import Hotel from "components/icons/house-heart.svg";
import { VPActiveModalTypes } from "components/features/VacationPackageProductPage/contexts/VPModalStateContext";
import { useCurrencyWithDefault } from "hooks/useCurrency";
import {
  BookingWidgetProductSelectContainer,
  BookingWidgetProductSelectItem,
} from "components/ui/BookingWidget/BookingWidgetProductSelectContent";
import { useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";
import { constructGraphCMSImage } from "components/ui/LandingPages/utils/landingPageUtils";
import { GraphCMSPageType } from "types/enums";
import { getTotalNumberOfGuests } from "components/ui/RoomAndGuestPicker/utils/roomAndGuestUtils";

const HotelIcon = styled(Hotel)(bookingWidgetLabelIconStyles);

const VPBookingWidgetStayDropdownContent = ({
  dayNumber,
  stayProducts,
  onMobileWidget = false,
  isLoading = false,
  className,
  onOpenStateChange,
}: {
  dayNumber: number;
  stayProducts: VacationPackageTypes.VacationPackageStayProduct[];
  onMobileWidget?: boolean;
  isLoading?: boolean;
  className?: string;
} & BookingWidgetTypes.onOpenStateChange) => {
  const { t: vacationPackageT } = useTranslation(Namespaces.vacationPackageNs);
  const { t: quickFactsT } = useTranslation(Namespaces.accommodationNs);
  const { currencyCode, convertCurrency } = useCurrencyWithDefault();
  const { onSelectVPStayProduct } = useContext(VPActionCallbackContext);
  const { occupancies, selectedHotelsRooms } = useContext(VPStayStateContext);
  const totalGuests = getTotalNumberOfGuests(occupancies);
  const selectedStay = findSelectedStayByDay({
    dayNumber,
    stayProducts,
    selectedHotelsRooms,
  });
  const selectedHotelRooms = selectedHotelsRooms.find(
    item =>
      item.productId === selectedStay?.productId &&
      item.groupedWithDays.some(date => date === dayNumber)
  );
  const selectedStayRoomType =
    selectedHotelRooms?.roomCombinations.find(room => room.isSelected)?.title ?? "";
  const selectedStayProductId = String(selectedStay?.productId || "");
  const modalProductId = getVPModalProductId(dayNumber, selectedStayProductId);
  const [, toggleStayExtrasEditModal] = useOnToggleModal(
    VPActiveModalTypes.EditStay,
    modalProductId
  );
  const extras = useMemo(
    () => [
      {
        name: selectedStayRoomType,
        onClick: (e: SyntheticEvent<HTMLDivElement>) => {
          e.stopPropagation();
          toggleStayExtrasEditModal(e);
        },
      },
    ],
    [toggleStayExtrasEditModal, selectedStayRoomType]
  );

  const onSelectHandler = useCallback(
    productId => {
      onSelectVPStayProduct(dayNumber, productId);
      onOpenStateChange?.(false);
    },
    [onOpenStateChange, onSelectVPStayProduct, dayNumber]
  );

  if (isLoading) {
    return (
      <BookingWidgetProductSelectContainer className={className}>
        {range(1, 3).map((_, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <StyledVPBookingProductSkeleton key={`bookingstayskeleton${i}`} />
        ))}
      </BookingWidgetProductSelectContainer>
    );
  }

  return (
    <BookingWidgetProductSelectContainer
      className={className}
      title={!onMobileWidget ? vacationPackageT("Hotels") : undefined}
    >
      {onMobileWidget && (
        <StyledBookingWidgetLabel isRequired={false}>
          <HotelIcon />
          {vacationPackageT("Hotels")}
        </StyledBookingWidgetLabel>
      )}
      {stayProducts.map((stay: VacationPackageTypes.VacationPackageStayProduct, index) => {
        const productId = String(stay.productId);
        const infoModalProductId = getVPModalProductId(dayNumber, productId);
        const isSelected = productId === selectedStayProductId;
        const priceWithCurrency =
          stay.vpPrice !== undefined ? convertCurrency(stay.vpPrice) : stay.vpPrice;
        const priceLabel = constructPriceLabel({
          tFunction: vacationPackageT,
          currencyCode,
          price: priceWithCurrency,
          isSelected,
          isPricePerDay: true,
        });
        return (
          <BookingWidgetProductSelectItem
            isFirstItem={index === 0}
            sectionName={`stays-${dayNumber}`}
            key={`${dayNumber}-${productId}`}
            productId={productId}
            productName={stay.name || ""}
            isSelected={isSelected}
            image={constructGraphCMSImage(GraphCMSPageType.Stays, stay?.mainImage)}
            priceLabel={priceLabel}
            productSpecs={constructStaysQuickFacts(stay, totalGuests, quickFactsT, false)}
            extras={extras}
            onSelectCard={onSelectHandler}
            onMobileWidget={onMobileWidget}
            infoModalId={VPActiveModalTypes.InfoStay}
            modalProductId={infoModalProductId}
          />
        );
      })}
    </BookingWidgetProductSelectContainer>
  );
};

export default VPBookingWidgetStayDropdownContent;
