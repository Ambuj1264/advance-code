import React, { useCallback } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import { useTheme } from "emotion-theming";
import rgba from "polished/lib/color/rgba";

import { getIncludedItems } from "../utils/stayBookingWidgetUtils";

import {
  AdditionalInformation,
  Item,
  iconStyles as additionalIconStyles,
} from "./StayRoomIncrementPicker";

import { useCurrencyWithDefault } from "hooks/useCurrency";
import currencyFormatter, { getPriceSign } from "utils/currencyFormatUtils";
import ImageComponent from "components/ui/ImageComponent";
import { gutters, greyColor, blackColor, zIndex, borderRadius, guttersPx } from "styles/variables";
import { typographyBody2, typographySubtitle2 } from "styles/typography";
import { Namespaces } from "shared/namespaces";
import { useTranslation } from "i18n";
import useActiveLocale from "hooks/useActiveLocale";
import RadioButton from "components/ui/Inputs/RadioButton";
import { mqMin, mqMax, skeletonPulse } from "styles/base";

const Price = styled.span(
  typographySubtitle2,
  ({ theme }) =>
    css`
      color: ${theme.colors.action};
    `
);

export const Header = styled.div`
  display: flex;
  align-items: center;
  padding-right: 5px;
  color: ${rgba(blackColor, 0.7)};
  :first-letter {
    text-transform: uppercase;
  }
`;

const HeaderWrapper = styled.div([
  typographyBody2,
  css`
    display: flex;
    flex-direction: column;
    max-width: 90%;
    color: ${greyColor};
  `,
]);

const Wrapper = styled.div<{ isInModal?: boolean }>(
  ({ isInModal = false }) => css`
    position: relative;
    display: flex;
    align-items: center;
    margin: ${gutters.small}px 0;
    ${mqMin.large} {
      margin: ${isInModal ? gutters.small : 0}px 0 ${gutters.small}px 0;
    }
  `
);

const RadioButtonStyled = styled(RadioButton)`
  position: absolute;
  top: 55%;
  right: -${gutters.large / 4}px;
  z-index: ${zIndex.z1};
  width: 20px;
  height: 100%;
  text-align: center;
  transform: translate(-50%, -50%);
`;

const ImageComponentStyled = styled(ImageComponent)`
  display: inline;
  height: 64px;
  vertical-align: middle;
`;

const ImageWrapper = styled.div`
  margin-right: ${guttersPx.large};
  border-radius: ${borderRadius};
  width: 70px;
  height: 64px;
  text-align: center;
  overflow: hidden;

  ${mqMax.desktop} {
    width: 50px;
    height: 50px;
  }
`;

export const LoadingPrice = styled.span([
  skeletonPulse,
  css`
    display: inline-block;
    width: 50px;
    height: 20px;
  `,
]);

const StayRoomCombinationAvailability = ({
  availability,
  roomCombinationId,
  image,
  onRoomCombinationSelect,
  isVP = false,
  className,
  isLoading = false,
  isInModal = false,
}: {
  availability: StayBookingWidgetTypes.RoomCombinationAvailability;
  roomCombinationId: string;
  image?: Image;
  className?: string;
  onRoomCombinationSelect: (roomCombinationId: string, availabilityId: string) => void;
  isVP?: boolean;
  isLoading?: boolean;
  isInModal?: boolean;
}) => {
  const { currencyCode, convertCurrency } = useCurrencyWithDefault();
  const { t } = useTranslation(Namespaces.accommodationNs);
  const theme: Theme = useTheme();
  const locale = useActiveLocale();
  const {
    priceObject,
    mealType,
    cancellationType,
    freeCancellationUntil,
    isSelected,
    availabilityId,
  } = availability;
  const includedItems = getIncludedItems(
    locale,
    t,
    mealType,
    cancellationType,
    freeCancellationUntil
  );
  const onAvailabilitySelect = useCallback(() => {
    onRoomCombinationSelect(roomCombinationId, availabilityId);
  }, [roomCombinationId, availabilityId, onRoomCombinationSelect]);
  const price = isVP
    ? currencyFormatter(convertCurrency(Math.abs(priceObject.price)))
    : priceObject.priceDisplayValue;
  const currency = isVP ? currencyCode : priceObject.currency;
  const priceSign = isVP ? getPriceSign(priceObject.price) : "";
  const priceDisplay =
    isVP && priceObject.price === 0 && isSelected
      ? t("Selected")
      : `${priceSign}${price} ${currency}`;
  return (
    <Wrapper className={className} onClick={onAvailabilitySelect} isInModal={isInModal}>
      {image && (
        <ImageWrapper>
          <ImageComponentStyled imageUrl={image.url} imageAlt={image.name} width={70} height={60} />
        </ImageWrapper>
      )}
      <HeaderWrapper>
        <AdditionalInformation>
          {includedItems.map(({ Icon: IncludedIcon, title: includedTitle, isIncluded }) => (
            <Item isIncluded={isIncluded}>
              <IncludedIcon css={additionalIconStyles(theme, isIncluded)} />
              {includedTitle}
            </Item>
          ))}
        </AdditionalInformation>
        {isLoading ? <LoadingPrice /> : <Price>{priceDisplay}</Price>}
      </HeaderWrapper>
      <RadioButtonStyled
        id={`${availabilityId}-radio-button`}
        checked={isSelected}
        label=""
        name={`${availabilityId}-radio`}
        value={availabilityId}
      />
    </Wrapper>
  );
};

export default StayRoomCombinationAvailability;
