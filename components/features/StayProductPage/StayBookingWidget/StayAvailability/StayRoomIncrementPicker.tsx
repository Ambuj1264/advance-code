import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import { useTheme } from "emotion-theming";

import { useUpdateSelectedRooms } from "../stayHooks";
import { getIncludedItems } from "../utils/stayBookingWidgetUtils";

import RoomIcon from "components/icons/hotel-bedroom.svg";
import { capitalize } from "utils/globalUtils";
import { IncrementPicker } from "components/ui/RoomAndGuestPicker/DesktopRoomAndGuestPicker";
import currencyFormatter from "utils/currencyFormatUtils";
import { useCurrencyWithDefault } from "hooks/useCurrency";
import { typographyCaption } from "styles/typography";
import { useIsMobile } from "hooks/useMediaQueryCustom";
import { Namespaces } from "shared/namespaces";
import { useTranslation } from "i18n";
import useActiveLocale from "hooks/useActiveLocale";
import { useSettings } from "contexts/SettingsContext";
import { Marketplace } from "types/enums";
import { gutters } from "styles/variables";

export const AdditionalInformation = styled.div`
  margin: 4px 0;
`;
export const Item = styled.div<{ isIncluded: boolean }>(({ theme, isIncluded }) => [
  typographyCaption,
  css`
    display: flex;
    align-items: center;
    margin-bottom: ${gutters.small / 4}px;
    color: ${isIncluded ? theme.colors.action : theme.colors.primary};
  `,
]);

export const iconStyles = (theme: Theme, isIncluded: boolean) => css`
  margin-right: 6px;
  max-width: 12px;
  height: 12px;
  fill: ${isIncluded ? theme.colors.action : theme.colors.primary};
`;

const StayRoomIncrementPicker = ({
  room,
  roomTypeId,
  canSelectMoreRooms,
}: {
  room: StayBookingWidgetTypes.RoomOffer;
  roomTypeId: string;
  canSelectMoreRooms: boolean;
}) => {
  const { marketplace } = useSettings();
  const isGTE = marketplace === Marketplace.GUIDE_TO_EUROPE;
  const { t: accommodationT } = useTranslation(Namespaces.accommodationNs);
  const { t } = useTranslation(Namespaces.accommodationBookingWidgetNs);
  const isMobile = useIsMobile();
  const theme: Theme = useTheme();
  const locale = useActiveLocale();
  const {
    roomOfferName,
    priceObject,
    mealType,
    cancellationType,
    freeCancellationUntil,
    availableRooms,
    numberOfSelectedRooms,
  } = room;
  const updateSelectedRooms = useUpdateSelectedRooms();
  const { currencyCode, convertCurrency } = useCurrencyWithDefault();
  const includedItems = getIncludedItems(
    locale,
    accommodationT,
    mealType,
    cancellationType,
    freeCancellationUntil
  );
  const customPrice = isGTE
    ? priceObject.priceDisplayValue
    : currencyFormatter(convertCurrency(Math.round(priceObject.price)));
  const usedCurrency = isGTE ? priceObject.currency : currencyCode;
  return (
    <>
      <IncrementPicker
        key={roomOfferName}
        id={roomOfferName}
        canDecrement={numberOfSelectedRooms > 0}
        canIncrement={availableRooms > numberOfSelectedRooms && canSelectMoreRooms}
        count={numberOfSelectedRooms}
        title={capitalize(roomOfferName.toLowerCase())}
        onChange={(value: number) => {
          updateSelectedRooms(room, roomTypeId, value);
        }}
        price={priceObject.price}
        customPrice={`${customPrice} ${usedCurrency} ${
          numberOfSelectedRooms > 1 ? `/ ${t("Per room")}` : ""
        }`}
        Icon={isMobile ? RoomIcon : undefined}
        additionalInformation={
          includedItems.length > 0 &&
          !isMobile && (
            <AdditionalInformation>
              {includedItems.map(({ Icon, title, isIncluded }) => (
                <Item isIncluded={isIncluded}>
                  <Icon css={iconStyles(theme, isIncluded)} />
                  {title}
                </Item>
              ))}
            </AdditionalInformation>
          )
        }
      />
      {isMobile && includedItems.length > 0 && (
        <AdditionalInformation>
          {includedItems.map(({ Icon, title, isIncluded }) => (
            <Item isIncluded={isIncluded}>
              <Icon css={iconStyles(theme, isIncluded)} />
              {title}
            </Item>
          ))}
        </AdditionalInformation>
      )}
    </>
  );
};

export default StayRoomIncrementPicker;
