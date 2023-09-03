import React, { useContext, useCallback } from "react";
import { addDays } from "date-fns";

import { VPStateContext } from "../contexts/VPStateContext";
import VPLoadingCardsRow from "../VPLoadingCardsRow";
import { VPActionCallbackContext } from "../contexts/VPActionStateContext";

import VPDayTourCard from "./VPDayTourCard";

import ProductCardRow, { StyledSimilarProductsColumn } from "components/ui/ProductCardRow";
import GTETourBookingWidgetStateContextProviderContainer from "components/features/GTETourProductPage/GTETourBookingWidget/GTETourBookingWidgetStateContextProviderContainer";
import { getFormattedDate, yearMonthDayFormat } from "utils/dateUtils";

const VPDayTours = ({
  dayNumber,
  toursData,
  toursLoading,
}: {
  dayNumber: number;
  toursData: SharedTypes.Product[];
  toursLoading: boolean;
}) => {
  const { selectedDates } = useContext(VPStateContext);
  const { onSelectVPTourProduct } = useContext(VPActionCallbackContext);
  const onSelectHandler = useCallback(
    productId => {
      onSelectVPTourProduct(dayNumber, String(productId));
    },
    [onSelectVPTourProduct, dayNumber]
  );
  if (toursLoading) {
    return <VPLoadingCardsRow />;
  }

  if (!toursData || toursData.length === 0) {
    return null;
  }
  return (
    <ProductCardRow>
      {toursData.map(tour => {
        const tourDate = selectedDates.from
          ? getFormattedDate(addDays(selectedDates.from, dayNumber - 1), yearMonthDayFormat)
          : undefined;

        return (
          <StyledSimilarProductsColumn
            key={`${tour.id}-${dayNumber}}`}
            productsCount={toursData.length}
          >
            <GTETourBookingWidgetStateContextProviderContainer
              key={tour.id}
              numberOfDays={1}
              dateFrom={tourDate}
            >
              <VPDayTourCard
                dayNumber={dayNumber}
                tourDate={tourDate || ""}
                onSelectCard={onSelectHandler}
                tour={tour}
                totalTours={toursData.length}
              />
            </GTETourBookingWidgetStateContextProviderContainer>
          </StyledSimilarProductsColumn>
        );
      })}
    </ProductCardRow>
  );
};

export default VPDayTours;
