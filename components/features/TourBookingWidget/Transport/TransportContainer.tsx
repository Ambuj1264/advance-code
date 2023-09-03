import React, { memo } from "react";
import styled from "@emotion/styled";
import rgba from "polished/lib/color/rgba";
import { css } from "@emotion/core";
import Input from "@travelshift/ui/components/Inputs/Input";

import { getPickupLocationId } from "../utils/tourBookingWidgetUtils";

import TransportPrice from "./TransportPrice";

import Dropdown from "components/ui/Inputs/Dropdown/Dropdown";
import DropdownOption from "components/ui/Inputs/Dropdown/DropdownOption";
import TransportHeader from "components/ui/BookingWidget/DropdownHeader";
import { useCurrencyWithDefault } from "hooks/useCurrency";
import { TransportPickup } from "types/enums";
import { useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";
import { gutters } from "styles/variables";
import { typographyBody2 } from "styles/typography";
import PinIcon from "components/icons/pin.svg";

const Wrapper = styled.div(
  typographyBody2,
  css`
    margin-top: ${gutters.small / 2}px;
    #optionLabel {
      max-width: calc(100% - 20px);
    }
  `
);

const StylePinIcon = (theme: Theme) => css`
  width: 18px;
  height: 18px;
  fill: ${theme.colors.primary};
`;

export const TransportWrapper = styled.div`
  margin-top: ${gutters.large}px;
`;

const InputWrapper = styled.div`
  /* stylelint-disable-next-line selector-max-type */
  input {
    box-shadow: none !important;
    border: 1px solid ${rgba(102, 102, 102, 0.5)} !important;
  }
`;

type Props = {
  transport: PickupTransport;
  selectedTransportLocation: PickupLocation;
  onSetSelectedTransportLocation: (selectedTransportLocation: PickupLocation) => void;
  pickupPrices: TourBookingWidgetTypes.PickupPrices;
  setHasPickup: (hasPickup: boolean) => void;
  hasPickup: boolean;
  pickupPrice: number;
  className?: string;
};

const constructOptions = (
  transport: PickupTransport,
  selectedTransportLocation: PickupLocation,
  onSetSelectedTransportLocation: (selectedTransportLocation: PickupLocation) => void,
  notKnownText: string
) => {
  const notKnown = {
    id: 0,
    name: notKnownText,
  };
  const pickupList = transport.enableNotKnown
    ? [notKnown].concat(transport.places)
    : transport.places;
  if (transport.enableNotKnown && selectedTransportLocation.name === "") {
    onSetSelectedTransportLocation(notKnown);
  }
  return pickupList.map((place: PickupLocation) => ({
    value: place.name,
    label: (
      <DropdownOption
        id={`${place.name}DropdownOption`}
        isSelected={selectedTransportLocation.name === place.name}
        label={place.name}
      />
    ),
    nativeLabel: place.name,
  }));
};

const TransportContainerWrapper = styled.div();

const TransportContainer = ({
  transport,
  onSetSelectedTransportLocation,
  selectedTransportLocation,
  pickupPrices,
  hasPickup,
  setHasPickup,
  pickupPrice,
  className,
}: Props) => {
  const { currencyCode, convertCurrency } = useCurrencyWithDefault();
  const { t } = useTranslation(Namespaces.tourBookingWidgetNs);
  const selectPickupLocationText = t("Select pickup location");
  const defaultValue = {
    value: selectPickupLocationText,
    label: (
      <DropdownOption
        id="pickupLocationDefaultOption"
        isSelected={false}
        label={selectPickupLocationText}
      />
    ),
    nativeLabel: selectPickupLocationText,
  };
  const isAddressPickup = transport.pickup === TransportPickup.Address;
  const isListPickup = transport.pickup === TransportPickup.List;
  return isListPickup || isAddressPickup ? (
    <TransportContainerWrapper className={className}>
      {transport.required === false && (
        <TransportPrice
          hasPickup={hasPickup}
          setHasPickup={setHasPickup}
          pickupPrice={pickupPrice}
        />
      )}
      {hasPickup && (
        <TransportWrapper>
          <TransportHeader
            title={t("Pickup location")}
            price={pickupPrices.prices.adults}
            currency={currencyCode}
            convertCurrency={convertCurrency}
            perPerson
            isIncluded={pickupPrices.prices.adults === 0}
          />
          <Wrapper>
            {isAddressPickup ? (
              <InputWrapper>
                <Input
                  value={selectedTransportLocation.name || ""}
                  onChange={event =>
                    onSetSelectedTransportLocation({
                      id: 0,
                      name: event.target.value,
                    })
                  }
                  placeholder={t("Write your pickup location")}
                />
              </InputWrapper>
            ) : (
              <Dropdown
                id="pickupLocationDropdown"
                onChange={event =>
                  onSetSelectedTransportLocation({
                    id: getPickupLocationId(transport, event),
                    name: event,
                  })
                }
                options={constructOptions(
                  transport,
                  selectedTransportLocation,
                  onSetSelectedTransportLocation,
                  t("Not known yet, will message later.")
                )}
                icon={<PinIcon css={StylePinIcon} />}
                selectedValue={selectedTransportLocation.name}
                maxHeight="250px"
                defaultValue={transport.enableNotKnown ? undefined : defaultValue}
                isSearchable
              />
            )}
          </Wrapper>
        </TransportWrapper>
      )}
    </TransportContainerWrapper>
  ) : null;
};

export default memo(TransportContainer);
