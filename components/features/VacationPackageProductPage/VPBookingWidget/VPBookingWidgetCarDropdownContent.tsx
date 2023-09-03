import React, { SyntheticEvent, useMemo } from "react";
import { range } from "fp-ts/lib/Array";
import { css } from "@emotion/core";
import styled from "@emotion/styled";

import { constructPriceLabel } from "../utils/vacationPackageUtils";

import VPBookingProductSkeleton from "./VPBookingProductSkeleton";
import VPBookingWidgetCarExtras, {
  StyledNationalityCountryLabel,
  StyledNationalityDropdownContainer,
} from "./VPBookingWidgetCarExtras";

import { VPActiveModalTypes } from "components/features/VacationPackageProductPage/contexts/VPModalStateContext";
import { useOnToggleModal } from "components/features/VacationPackageProductPage/contexts/VPStateHooks";
import { useCurrencyWithDefault } from "hooks/useCurrency";
import {
  BookingWidgetProductSelectContainer,
  BookingWidgetProductSelectItem,
} from "components/ui/BookingWidget/BookingWidgetProductSelectContent";
import { useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";
import { ArrowIcon, DisplayValue } from "components/ui/Inputs/ContentDropdown";
import { fontWeightRegular, gutters } from "styles/variables";
import { DisplayWrapper } from "components/ui/Inputs/RadioSelectionDropdown";
import { StyledRadioSelectionDropdown } from "components/ui/BookingWidget/BookingWidgetExtras";

const StyledVPBookingWidgetCarExtras = styled(VPBookingWidgetCarExtras)<{
  onMobileWidget?: boolean;
}>(({ theme, onMobileWidget }) => [
  !onMobileWidget &&
    css`
      flex-wrap: wrap;
      justify-content: flex-end;
    `,
  css`
    ${StyledRadioSelectionDropdown} {
      ${DisplayWrapper} {
        margin-left: ${gutters.small}px;
        color: ${theme.colors.action};
        font-weight: ${fontWeightRegular};
      }

      ${DisplayValue} {
        ${ArrowIcon} {
          width: 8px;
          height: 8px;
          fill: ${theme.colors.action};
        }
      }
    }
    ${StyledNationalityDropdownContainer} {
      ${StyledNationalityCountryLabel} {
        margin-left: 0;
        color: ${theme.colors.action};
        font-weight: ${fontWeightRegular};
      }
      ${ArrowIcon} {
        width: 8px;
        height: 8px;
        fill: ${theme.colors.action};
      }
    }
  `,
]);

const CarExtrasWrapper = styled.div`
  width: 100%;
`;

const VPBookingWidgetCarDropdownContent = ({
  selectedCarId,
  sortedCars,
  onSelectCarOffer,
  onMobileWidget = false,
  isLoading = false,
  className,
}: {
  selectedCarId: string;
  sortedCars: VacationPackageTypes.VPCarSearch[];
  onSelectCarOffer: (productId: string) => void;
  onMobileWidget?: boolean;
  isLoading?: boolean;
  className?: string;
}) => {
  const { t: vacationPackageT } = useTranslation(Namespaces.vacationPackageNs);

  const { currencyCode, convertCurrency } = useCurrencyWithDefault();
  const [, toggleCarExtrasEditModal] = useOnToggleModal(VPActiveModalTypes.EditCar, selectedCarId);

  const extras = useMemo(
    () => [
      {
        name: vacationPackageT("Extras"),
        onClick: (e: SyntheticEvent<HTMLDivElement>) => {
          e.stopPropagation();
          toggleCarExtrasEditModal(e);
        },
      },
    ],
    [toggleCarExtrasEditModal, vacationPackageT]
  );

  if (isLoading) {
    return (
      <BookingWidgetProductSelectContainer className={className}>
        {range(1, 3).map((_, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <VPBookingProductSkeleton key={`bookingcarskeleton${i}`} />
        ))}
      </BookingWidgetProductSelectContainer>
    );
  }

  return (
    <BookingWidgetProductSelectContainer
      title={!onMobileWidget ? vacationPackageT("Car") : undefined}
      className={className}
    >
      {sortedCars.map((car: VacationPackageTypes.VPCarSearch, index) => {
        const productId = String(car.id);
        const priceWithCurrency =
          car.vpPrice !== undefined ? convertCurrency(car.vpPrice) : car.vpPrice;

        const isSelected = productId === selectedCarId;
        const priceLabel = constructPriceLabel({
          tFunction: vacationPackageT,
          currencyCode,
          price: priceWithCurrency,
          isSelected,
        });
        return (
          <BookingWidgetProductSelectItem
            isFirstItem={index === 0}
            sectionName="cars"
            key={productId}
            productId={productId}
            productName={car.headline}
            isSelected={isSelected}
            image={car.image}
            priceLabel={priceLabel}
            productSpecs={car.carSpecs}
            extrasContent={
              onMobileWidget ? (
                <CarExtrasWrapper>
                  <StyledVPBookingWidgetCarExtras onMobileWidget={onMobileWidget} />
                </CarExtrasWrapper>
              ) : undefined
            }
            extras={!onMobileWidget ? extras : undefined}
            onSelectCard={onSelectCarOffer}
            onMobileWidget={onMobileWidget}
            inCarSection
            infoModalId={VPActiveModalTypes.InfoCar}
            modalProductId={productId}
          />
        );
      })}
    </BookingWidgetProductSelectContainer>
  );
};

export default VPBookingWidgetCarDropdownContent;
