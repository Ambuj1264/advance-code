import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import { useGTETourBookingWidgetContext } from "./GTETourBookingWidgetStateContext";
import { getTourLowestPrice } from "./utils/gteTourBookingWidgetUtils";

import currencyFormatter from "utils/currencyFormatUtils";
import { useCurrencyWithDefault } from "hooks/useCurrency";
import { BookingWidgetProductSelectItem } from "components/ui/BookingWidget/BookingWidgetProductSelectContent";
import { typographySubtitle2, typographyCaption } from "styles/typography";
import { gutters } from "styles/variables";
import { mqMax } from "styles/base";

export const InformationToolTipWrapper = styled.div([
  typographyCaption,
  css`
    line-height: 18px;
  `,
]);

export const InformationTooltipTitle = styled.div([
  typographySubtitle2,
  css`
    margin-bottom: ${gutters.small / 2}px;
  `,
]);

const StyledBookingWidgetProductSelectItem = styled(BookingWidgetProductSelectItem)`
  ${mqMax.large} {
    margin: 0;
  }
`;

export const InformationTooltipContent = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => (
  <InformationToolTipWrapper>
    <InformationTooltipTitle>{title}</InformationTooltipTitle>
    <div
      dangerouslySetInnerHTML={{
        __html: description,
      }}
    />
  </InformationToolTipWrapper>
);

const GTETourOption = ({
  id,
  tourOption,
  isFirstItem,
  onSelectTourOption,
}: {
  id: string;
  tourOption: GTETourBookingWidgetTypes.TourOption;
  isFirstItem: boolean;
  onSelectTourOption: (tourOptionId: string) => void;
}) => {
  const { currencyCode, convertCurrency } = useCurrencyWithDefault();

  const { selectedTourOption } = useGTETourBookingWidgetContext();
  const price = currencyFormatter(convertCurrency(getTourLowestPrice(tourOption.times)));
  return (
    <StyledBookingWidgetProductSelectItem
      isFirstItem={isFirstItem}
      sectionName="options"
      key={id}
      productId={id}
      productName={tourOption.name}
      isSelected={selectedTourOption && tourOption.optionCode === selectedTourOption.optionCode}
      priceLabel={`${price} ${currencyCode}`}
      hideExtras
      onSelectCard={onSelectTourOption}
      onMobileWidget={undefined}
      informationTooltipContent={
        <InformationTooltipContent title={tourOption.name} description={tourOption.description} />
      }
    />
  );
};

export default GTETourOption;
