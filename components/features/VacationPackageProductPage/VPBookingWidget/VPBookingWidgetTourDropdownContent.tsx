import React, { SyntheticEvent, useCallback, useContext } from "react";
import { range } from "fp-ts/lib/Array";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import rgba from "polished/lib/color/rgba";
import Arrow from "@travelshift/ui/icons/arrow.svg";

import { constructPriceLabel, getVPModalProductId } from "../utils/vacationPackageUtils";
import {
  constructSelectedTourProductSpecs,
  constructTourModalId,
} from "../VPToursSection/utils/vpToursUtils";
import { VPActionCallbackContext } from "../contexts/VPActionStateContext";

import {
  bookingWidgetLabelIconStyles,
  StyledBookingWidgetLabel,
  StyledVPBookingProductSkeleton,
} from "./utils/vpBookingWidgetShared";

import Traveler from "components/icons/traveler.svg";
import useToggle from "hooks/useToggle";
import {
  VPActiveModalTypes,
  VPModalCallbackContext,
} from "components/features/VacationPackageProductPage/contexts/VPModalStateContext";
import { useCurrencyWithDefault } from "hooks/useCurrency";
import {
  BookingWidgetProductSelectContainer,
  BookingWidgetProductSelectItem,
} from "components/ui/BookingWidget/BookingWidgetProductSelectContent";
import { useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";
import { emptyArray } from "utils/constants";
import { gutters } from "styles/variables";
import { typographySubtitle2 } from "styles/typography";
import { useIsMobile } from "hooks/useMediaQueryCustom";

const TravelerIcon = styled(Traveler)(bookingWidgetLabelIconStyles);

const MoreProducts = styled.div(({ theme }) => [
  typographySubtitle2,
  css`
    display: flex;
    align-items: center;
    justify-content: center;
    border-top: 4px solid ${rgba(theme.colors.primary, 0.1)};
    padding-top: ${gutters.small}px;
    color: ${theme.colors.primary};
  `,
]);

export const ArrowIcon = styled(Arrow)(
  ({ theme }) => css`
    margin-left: ${gutters.small / 2}px;
    width: 10px;
    height: 10px;
    fill: ${theme.colors.primary};
  `
);

const VPBookingWidgetTourDropdownContent = ({
  dayNumber,
  tourProducts = emptyArray as never as SharedTypes.Product[],
  selectedTourProductIds,
  onMobileWidget = false,
  isLoading = false,
  className,
  experiencesLabel,
}: {
  dayNumber: number;
  tourProducts?: SharedTypes.Product[];
  selectedTourProductIds?: VacationPackageTypes.SelectedToursProductIds[];
  onMobileWidget?: boolean;
  isLoading?: boolean;
  className?: string;
  experiencesLabel: string;
}) => {
  const { t: commonT } = useTranslation(Namespaces.commonNs);
  const { t: vacationPackageT } = useTranslation(Namespaces.vacationPackageNs);
  const isMobile = useIsMobile();
  const { onSetActiveModal } = useContext(VPModalCallbackContext);
  const { currencyCode, convertCurrency } = useCurrencyWithDefault();
  const { onSelectVPTourProduct } = useContext(VPActionCallbackContext);
  const [areAllToursVisible, toggleAllToursVisible] = useToggle(!isMobile);

  const onSelectHandler = useCallback(
    productId => {
      onSelectVPTourProduct(dayNumber, String(productId));
    },
    [onSelectVPTourProduct, dayNumber]
  );

  if (isLoading) {
    return (
      <BookingWidgetProductSelectContainer className={className}>
        {range(1, 3).map((_, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <StyledVPBookingProductSkeleton key={`tourSkeleton${i}`} />
        ))}
      </BookingWidgetProductSelectContainer>
    );
  }
  const visibleProducts = areAllToursVisible ? tourProducts : tourProducts.slice(0, 3);
  const hasMoreProductsToShow = isMobile && tourProducts.length > 3;
  const moreProductsToShow = isMobile ? tourProducts.length - visibleProducts.length : 0;

  return (
    <BookingWidgetProductSelectContainer
      className={className}
      title={!onMobileWidget ? vacationPackageT(experiencesLabel) : undefined}
    >
      {onMobileWidget && (
        <StyledBookingWidgetLabel isRequired={false}>
          <TravelerIcon />
          {vacationPackageT(experiencesLabel)}
        </StyledBookingWidgetLabel>
      )}
      {visibleProducts.map((tour, index) => {
        const strProductId = String(tour.id);
        const infoModalProductId = getVPModalProductId(dayNumber, strProductId);
        const selectedTour = selectedTourProductIds?.find(
          item => item.productId === strProductId && item.day === dayNumber
        );
        const isSelected = !!selectedTour;
        const priceWithCurrency =
          tour.price !== undefined ? convertCurrency(tour.price) : tour.price;

        const priceLabel =
          isSelected && selectedTour?.numberOfTravelers
            ? vacationPackageT("{numberOfTravelers} travelers", {
                numberOfTravelers: selectedTour.numberOfTravelers,
              })
            : constructPriceLabel({
                tFunction: vacationPackageT,
                currencyCode,
                price: priceWithCurrency,
                isSelected,
              });

        const specs = selectedTour?.startTime
          ? constructSelectedTourProductSpecs(tour.specs, selectedTour, vacationPackageT)
          : tour.specs;
        const extras = [
          {
            name: vacationPackageT("Edit"),
            onClick: (e: SyntheticEvent<HTMLDivElement>) => {
              e.stopPropagation();
              onSetActiveModal(
                VPActiveModalTypes.EditTour,
                constructTourModalId(strProductId, dayNumber)
              );
            },
          },
        ];

        return (
          <BookingWidgetProductSelectItem
            isFirstItem={index === 0}
            sectionName={`tours-${dayNumber}`}
            key={`${dayNumber}-${strProductId}`}
            productId={strProductId}
            productName={tour.headline || ""}
            isSelected={isSelected}
            image={tour?.image}
            priceLabel={priceLabel}
            productSpecs={specs}
            extras={extras}
            onSelectCard={onSelectHandler}
            onMobileWidget={onMobileWidget}
            infoModalId={VPActiveModalTypes.InfoTour}
            modalProductId={infoModalProductId}
            multiSelect
          />
        );
      })}
      {hasMoreProductsToShow && (
        <MoreProducts onClick={toggleAllToursVisible}>
          {moreProductsToShow
            ? vacationPackageT("+{moreProductsToShow} experiences", {
                moreProductsToShow,
              })
            : commonT("Show less")}
          <ArrowIcon
            css={css`
              transform: rotate(${moreProductsToShow ? "90deg" : "270deg"});
            `}
          />
        </MoreProducts>
      )}
    </BookingWidgetProductSelectContainer>
  );
};

export default VPBookingWidgetTourDropdownContent;
