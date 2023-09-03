import React, { SyntheticEvent, useMemo } from "react";
import { range } from "fp-ts/lib/Array";

import { constructFlightProductSpecs } from "./utils/vpBookingWidgetUtils";
import VPBookingProductSkeleton from "./VPBookingProductSkeleton";

import { useOnToggleModal } from "components/features/VacationPackageProductPage/contexts/VPStateHooks";
import {
  constructPriceLabel,
  getFlightTitleByRanking,
} from "components/features/VacationPackageProductPage/utils/vacationPackageUtils";
import { VPActiveModalTypes } from "components/features/VacationPackageProductPage/contexts/VPModalStateContext";
import { useCurrencyWithDefault } from "hooks/useCurrency";
import {
  BookingWidgetProductSelectContainer,
  BookingWidgetProductSelectItem,
} from "components/ui/BookingWidget/BookingWidgetProductSelectContent";
import { useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";

const VPBookingWidgetFlightDropdownContent = ({
  flightSearchResults,
  selectedFlightId,
  onItinerarySelect,
  onMobileWidget = false,
  isLoading = false,
  className,
}: {
  flightSearchResults: VacationPackageTypes.VacationFlightItinerary[];
  selectedFlightId?: string;
  onItinerarySelect: (productId: string) => void;
  onMobileWidget?: boolean;
  isLoading?: boolean;
  className?: string;
}) => {
  const { t: vacationPackageT } = useTranslation(Namespaces.vacationPackageNs);
  const { t: flightSearchT } = useTranslation(Namespaces.flightSearchNs);
  const [, toggleFlightExtrasEditModal] = useOnToggleModal(
    VPActiveModalTypes.EditFlight,
    selectedFlightId
  );
  const { currencyCode, convertCurrency } = useCurrencyWithDefault();

  const extras = useMemo(
    () => [
      {
        name: vacationPackageT("Bags"),
        onClick: (e: SyntheticEvent<HTMLDivElement>) => {
          e.stopPropagation();
          toggleFlightExtrasEditModal(e);
        },
      },
    ],
    [toggleFlightExtrasEditModal, vacationPackageT]
  );

  if (isLoading) {
    return (
      <BookingWidgetProductSelectContainer className={className}>
        {range(1, 3).map((_, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <VPBookingProductSkeleton key={`bookingflightskeleton${i}`} />
        ))}
      </BookingWidgetProductSelectContainer>
    );
  }

  return (
    <BookingWidgetProductSelectContainer
      title={!onMobileWidget ? vacationPackageT("Flights") : undefined}
      className={className}
    >
      {flightSearchResults.map((itinerary: VacationPackageTypes.VacationFlightItinerary, index) => {
        const productId = itinerary.id;
        const isSelected = productId === selectedFlightId;
        const { fullName } = getFlightTitleByRanking(itinerary.flightRanking, vacationPackageT);
        const priceWithCurrency =
          itinerary.vpPrice !== undefined ? convertCurrency(itinerary.vpPrice) : itinerary.vpPrice;
        const priceLabel = constructPriceLabel({
          tFunction: vacationPackageT,
          currencyCode,
          price: priceWithCurrency,
          isSelected,
        });

        return (
          <BookingWidgetProductSelectItem
            isFirstItem={index === 0}
            sectionName="flights"
            key={productId}
            productId={productId}
            productName={fullName}
            isSelected={isSelected}
            priceLabel={priceLabel}
            productSpecs={constructFlightProductSpecs({
              itinerary,
              flightSearchT,
            })}
            extras={extras}
            onSelectCard={onItinerarySelect}
            infoModalId={VPActiveModalTypes.InfoFlight}
            modalProductId={productId}
          />
        );
      })}
    </BookingWidgetProductSelectContainer>
  );
};

export default VPBookingWidgetFlightDropdownContent;
