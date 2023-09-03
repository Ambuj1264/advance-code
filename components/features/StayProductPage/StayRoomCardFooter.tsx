import React, { useCallback } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import currencyFormatter from "utils/currencyFormatUtils";
import { SupportedCurrencies, Marketplace } from "types/enums";
import {
  LoadingFooterContent,
  TextWrapper,
  Wrapper,
  EditButtonWrapper,
  StyledEditIcon,
} from "components/features/VacationPackageProductPage/VPProductCardFooter";
import { Wrapper as PriceWrapper } from "components/ui/Search/Price";
import { gutters, whiteColor } from "styles/variables";
import { typographySubtitle2 } from "styles/typography";
import { Namespaces } from "shared/namespaces";
import Checkbox, { HiddenInput, Label } from "components/ui/Inputs/Checkbox";
import { useTranslation } from "i18n";
import { skeletonPulse } from "styles/base";
import { useCurrencyWithDefault } from "hooks/useCurrency";
import RadioButton, { RadioButtonLabel } from "components/ui/Inputs/RadioButton";
import { useSettings } from "contexts/SettingsContext";

const StyledWrapper = styled(Wrapper)`
  &:hover {
    cursor: pointer;
  }
`;
const CheckboxStyled = styled(Checkbox)`
  ${HiddenInput}::after {
    align-self: center;
  }
  ${Label}::after {
    margin-left: ${gutters.large / 2}px;
    background-color: ${whiteColor};
  }
`;

export const LoadingFooterText = styled.span([
  skeletonPulse,
  css`
    display: inline-block;
    width: 70px;
    height: 24px;
  `,
]);

export const StyledPriceWrapper = styled(PriceWrapper)([
  typographySubtitle2,
  css`
    line-height: 28px;
  `,
]);

export const PriceContainer = styled.span<{ isSelected: boolean }>(
  ({ isSelected, theme }) => css`
    margin-right: ${gutters.small / 4}px;
    color: ${isSelected ? theme.colors.action : theme.colors.primary};
  `
);

export const Currency = styled.span<{ isSelected: boolean }>(
  ({ isSelected, theme }) => css`
    color: ${isSelected ? theme.colors.action : theme.colors.primary};
  `
);

const StyledRadioButton = styled(RadioButton)`
  margin-right: -${gutters.large / 4}px;
  ${RadioButtonLabel} {
    padding-right: ${gutters.small * 2}px;
    &:before {
      background: ${whiteColor};
    }
  }
`;

const FromText = styled.span`
  font-weight: 500;
`;

const PriceWithoutTotal = ({
  className,
  value,
  priceDisplayValue,
  isSelected = false,
  isTotalPrice = false,
  currency,
}: {
  className?: string;
  value: number;
  priceDisplayValue?: string;
  isSelected?: boolean;
  isTotalPrice?: boolean;
  currency?: SupportedCurrencies;
}) => {
  const { marketplace } = useSettings();
  const isGTE = marketplace === Marketplace.GUIDE_TO_EUROPE;
  const { t } = useTranslation(Namespaces.accommodationNs);
  const { currencyCode, convertCurrency } = useCurrencyWithDefault();
  const priceWithCurrency = isGTE ? value : convertCurrency(value);
  const formattedPrice = priceDisplayValue || currencyFormatter(priceWithCurrency);
  return (
    <StyledPriceWrapper className={className}>
      {!isTotalPrice && <FromText>{t("From")} </FromText>}
      <PriceContainer data-testid="productPrice" isSelected={isSelected}>
        {t("{price}", { price: formattedPrice })}
      </PriceContainer>
      <Currency isSelected={isSelected}>{currency || currencyCode}</Currency>
    </StyledPriceWrapper>
  );
};

const FooterInfo = ({
  isSelected,
  value,
  priceDisplayValue,
  price,
  currency,
}: {
  isSelected: boolean;
  priceDisplayValue?: string;
  value: string;
  price: number;
  currency?: SupportedCurrencies;
}) => {
  const { t } = useTranslation(Namespaces.accommodationNs);
  if (isSelected && value !== "") {
    return (
      <TextWrapper>
        {t("{numberOfRooms} rooms", {
          numberOfRooms: value,
        })}
      </TextWrapper>
    );
  }
  return (
    <PriceWithoutTotal value={price} currency={currency} priceDisplayValue={priceDisplayValue} />
  );
};

const StayRoomCardFooter = ({
  priceDisplayValue,
  price,
  currency,
  className,
  checkboxValue,
  isSelected,
  isCardDisabled = false,
  onSelectCard,
  roomTypeId,
  isCheckbox = false,
  skipFooter = false,
  isTotalPrice = true,
  editModalContent,
  toggleEditModal,
}: {
  priceDisplayValue?: string;
  price: number;
  currency?: SupportedCurrencies;
  className?: string;
  checkboxValue: string;
  isSelected: boolean;
  isCardDisabled?: boolean;
  onSelectCard: (productId: string) => void;
  roomTypeId: string;
  isCheckbox?: boolean;
  skipFooter?: boolean;
  isTotalPrice?: boolean;
  editModalContent?: React.ReactNode;
  toggleEditModal: (e: any) => void;
}) => {
  const { t } = useTranslation(Namespaces.accommodationNs);
  const handleSelectCard = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      onSelectCard(roomTypeId);
    },
    [onSelectCard, roomTypeId]
  );
  if (skipFooter) {
    return <StyledWrapper className={className} isSelected={false} />;
  }
  return isCardDisabled || price === undefined ? (
    <Wrapper className={className} isSelected={isSelected}>
      <LoadingFooterContent />
    </Wrapper>
  ) : (
    <StyledWrapper className={className} isSelected={isSelected} onClick={handleSelectCard}>
      {isCheckbox ? (
        <CheckboxStyled
          id={`${roomTypeId}-checkbox`}
          name="rooms-checkbox"
          checked={isSelected}
          value={checkboxValue}
          reverse
          label={
            <FooterInfo
              isSelected={isSelected}
              value={checkboxValue}
              priceDisplayValue={priceDisplayValue}
              price={price}
              currency={currency}
            />
          }
        />
      ) : (
        <>
          {" "}
          {isSelected ? (
            <TextWrapper>
              {t("See choices")}
              {editModalContent && (
                <EditButtonWrapper onClick={toggleEditModal}>
                  <StyledEditIcon />
                </EditButtonWrapper>
              )}
            </TextWrapper>
          ) : (
            <StyledRadioButton
              readonly
              id={`${roomTypeId}-radio-button`}
              name="rooms-radio-button"
              checked={isSelected}
              value={checkboxValue}
              reverse
              label={
                <PriceWithoutTotal
                  value={price}
                  priceDisplayValue={priceDisplayValue}
                  isSelected={isSelected}
                  isTotalPrice={isTotalPrice}
                  currency={currency}
                />
              }
            />
          )}
        </>
      )}
    </StyledWrapper>
  );
};

export default StayRoomCardFooter;
