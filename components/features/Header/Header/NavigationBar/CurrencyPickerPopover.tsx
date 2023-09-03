import React from "react";
import rgba from "polished/lib/color/rgba";
import { toUndefined } from "fp-ts/lib/Option";
import LabelBadge from "@travelshift/ui/components/Header/NavigationBar/LabelBadge";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import { StyledRow } from "./UserMenu/UserMenuActions";

import PopoverButton from "components/ui/Popover/PopoverButton";
import Popover from "components/ui/Popover/Popover";
import CurrencyIcon from "components/icons/currency-euro-dollar-exchange.svg";
import useCurrency from "hooks/useCurrency";
import { gutters, greyColor } from "styles/variables";
import { typographyOverline } from "styles/typography";
import { resetButton } from "styles/reset";
import { column, mqMax, mqMin } from "styles/base";
import { useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";

const IconButton = styled.button(({ theme }) => [
  resetButton,
  css`
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 2px;
    width: 32px;
    height: 20px;
    background-color: ${theme.colors.primary};
  `,
]);

export const PopoverInnerWrapper = styled.div`
  margin-top: -${gutters.large}px;
  width: 100%;
  ${mqMin.desktop} {
    width: 450px;
  }
`;

export const Column = styled.div(
  column({ small: 1 / 2 }),
  css`
    margin-top: ${gutters.small}px;
    ${mqMax.medium} {
      display: flex;
      height: ${gutters.large + 12}px;
    }
  `
);

export const BadgeWrapper = styled.div<{ background?: string }>(({ background }) => [
  css`
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: ${gutters.large / 2}px;
    border-radius: 2px;
    width: 32px;
    height: 20px;
  `,
  background &&
    css`
      background: ${background};
    `,
  !background &&
    css`
      border: 1px solid ${rgba(greyColor, 0.4)};
    `,
]);

const Label = styled.span(({ theme }) => [
  typographyOverline,
  css`
    color: ${theme.colors.primary};
    text-indent: 1.5px;
  `,
]);

export const CurrencyPopoverContent = ({
  currencies,
  activeCurrency,
  updateActiveCurrency,
}: {
  currencies: ReadonlyArray<Currency>;
  activeCurrency?: string;
  updateActiveCurrency: (activeCurrency: string) => void;
}) => {
  return (
    <PopoverInnerWrapper>
      <StyledRow>
        {currencies.map((currency: Currency) => (
          <Column key={currency.currencyCode}>
            <PopoverButton
              id={`${currency.currencyCode}currencyPickerOption`}
              key={currency.currencyCode}
              text={currency.name}
              selected={Boolean(activeCurrency) && currency.currencyCode === activeCurrency}
              onClick={() => updateActiveCurrency(currency.currencyCode)}
            >
              <BadgeWrapper>
                <Label>{currency.currencyCode}</Label>
              </BadgeWrapper>
            </PopoverButton>
          </Column>
        ))}
      </StyledRow>
    </PopoverInnerWrapper>
  );
};

const CurrencyPickerPopover = ({ currencies }: { currencies: ReadonlyArray<Currency> }) => {
  const { t } = useTranslation(Namespaces.headerNs);
  const { currencyCode, updateActiveCurrency } = useCurrency();
  const activeCurrency = toUndefined(currencyCode);
  return (
    <Popover
      title={t("Currencies")}
      Icon={CurrencyIcon}
      trigger={
        <IconButton
          id="navBarCurrencyPicker"
          type="button"
          data-testid={activeCurrency ? "navBarCurrencyPicker" : ""}
        >
          <LabelBadge>{activeCurrency || "• • •"}</LabelBadge>
        </IconButton>
      }
    >
      <CurrencyPopoverContent
        currencies={currencies}
        activeCurrency={activeCurrency}
        updateActiveCurrency={updateActiveCurrency}
      />
    </Popover>
  );
};

export default CurrencyPickerPopover;
