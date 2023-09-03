import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import { NO_CHECKED_BAGGAGE_ID } from "./utils/flightUtils";

import { gutters } from "styles/variables";
import { typographySubtitle2 } from "styles/typography";
import Checkbox from "components/ui/Inputs/Checkbox";
import RadioButton from "components/ui/Inputs/RadioButton";
import currencyFormatter from "utils/currencyFormatUtils";
import { useCurrencyWithDefault } from "hooks/useCurrency";
import { useTranslation } from "i18n";

const Wrapper = styled.div(({ theme }) => [
  typographySubtitle2,
  css`
    position: absolute;
    top: 0;
    right: 0;
    display: flex;
    align-items: center;
    margin-right: ${gutters.large / 2}px;
    height: 100%;
    label {
      height: 24px;
      padding-right: ${gutters.small * 2}px;
      color: ${theme.colors.action};
      line-height: 24px;
      ${typographySubtitle2};
    }
  `,
]);

const FlightExtraSelector = ({
  id,
  extraId,
  isSelected,
  isIncluded,
  inputType = "checked",
  price,
  currency,
  onChange,
  dataTestid,
}: {
  id: string;
  extraId: string;
  isSelected?: boolean;
  isIncluded?: boolean;
  price: number;
  currency: string;
  inputType: "checked" | "radio";
  onChange: (id: string) => void;
  dataTestid?: string;
}) => {
  const { convertCurrency } = useCurrencyWithDefault();
  const { t } = useTranslation();
  const Input = inputType === "checked" ? Checkbox : RadioButton;
  const includedText = extraId === NO_CHECKED_BAGGAGE_ID ? "" : t("Free");
  return (
    <Wrapper>
      <Input
        id={`${id}${extraId}`}
        label={
          isIncluded ? includedText : `${currencyFormatter(convertCurrency(price))} ${currency}`
        }
        checked={isSelected}
        name={id}
        onChange={() => onChange(extraId)}
        color="action"
        reverse
        value={extraId}
        dataTestid={dataTestid}
      />
    </Wrapper>
  );
};

export default FlightExtraSelector;
