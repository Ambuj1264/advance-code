import React, { useContext, useState } from "react";
import styled from "@emotion/styled";
import rgba from "polished/lib/color/rgba";
import { css } from "@emotion/core";

import OptionsSectionHeader from "../OptionsSectionHeader";
import CarBookingWidgetConstantContext from "../../contexts/CarBookingWidgetConstantContext";
import CarBookingWidgetStateContext from "../../contexts/CarBookingWidgetStateContext";
import CarBookingWidgetCallbackContext from "../../contexts/CarBookingWidgetCallbackContext";

import InformationTooltip from "components/ui/Tooltip/InformationTooltip";
import AddressIcon from "components/icons/car-garage.svg";
import PlaneIcon from "components/icons/plane-land.svg";
import Input from "components/ui/Inputs/Input";
import { useTranslation, Trans } from "i18n";
import { Namespaces } from "shared/namespaces";
import { mqMin, errorAsterisk } from "styles/base";
import MobileSectionHeading from "components/ui/BookingWidget/MobileSectionHeading";
import MediaQuery from "components/ui/MediaQuery";
import { DisplayType } from "types/enums";
import { typographyBody2, typographyCaption } from "styles/typography";
import { gutters, blackColor, redColor } from "styles/variables";

const InputError = styled.span([
  typographyCaption,
  css`
    align-self: flex-end;
    margin-bottom: ${gutters.small / 2}px;
    color: ${redColor};
    text-align: right;
  `,
]);

const FieldWrapper = styled.div`
  margin-top: ${gutters.small}px;
  margin-bottom: ${gutters.small}px;
  ${mqMin.large} {
    margin-bottom: 0;
  }
`;

const LabelWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  max-width: 70%;
`;

const InformationTooltipWrapper = styled.div`
  padding-right: ${gutters.small / 2}px;

  .infoButton {
    margin-left: 0;
    height: 100%;
    svg {
      margin-bottom: 2px;
    }
  }
`;

const Label = styled.div<{ isRequired?: boolean }>(({ isRequired = false }) => [
  typographyBody2,
  isRequired && errorAsterisk,
  css`
    margin-left: -24px;
    color: ${rgba(blackColor, 0.7)};
    text-indent: 24px;
  `,
]);

const SectionValueWrapper = styled.div`
  margin-top: ${gutters.small / 2}px;
`;

const PickupDetailsContainer = () => {
  const { isAirportPickup, isHotelPickup, isHotelDropoff } = useContext(
    CarBookingWidgetConstantContext
  );
  const { pickupSpecify, dropoffSpecify } = useContext(CarBookingWidgetStateContext);
  const { setSpecifiedPickup, setSpecifiedDropoff } = useContext(CarBookingWidgetCallbackContext);
  const { t } = useTranslation(Namespaces.carBookingWidgetNs);
  const sectionTitle = () => {
    if (isAirportPickup && isHotelDropoff) {
      return t("Add flight number & drop-off address");
    }
    if (isAirportPickup) {
      return t("Add flight number");
    }
    if (isHotelPickup && !isHotelDropoff) {
      return t("Pickup address");
    }
    return t("Add pickup & drop-off address");
  };
  const pickupTitle = isAirportPickup ? t("Airport pickup") : t("Pickup");
  const pickupPlaceholder = isAirportPickup ? t("Type in your flight number") : t("Pickup address");
  const [pickupBlurred, setPickupBlurred] = useState(false);
  const [dropoffBlurred, setDropoffBlurred] = useState(false);
  const hasPickupError = pickupBlurred && !isAirportPickup && pickupSpecify === "";
  const hasDropoffError = dropoffBlurred && isHotelDropoff && dropoffSpecify === "";
  if (!isAirportPickup && !isHotelPickup && !isHotelDropoff) {
    return null;
  }
  const showDetails = isAirportPickup || isHotelPickup || isHotelDropoff;
  if (!showDetails) {
    return null;
  }
  const showPickup = isAirportPickup || isHotelPickup;
  const showAddressTooltip = isHotelPickup || isHotelDropoff;
  return (
    <>
      <MediaQuery fromDisplay={DisplayType.Large}>
        <OptionsSectionHeader title={sectionTitle()} />
      </MediaQuery>
      <MediaQuery toDisplay={DisplayType.Large}>
        <MobileSectionHeading>{sectionTitle()}</MobileSectionHeading>
      </MediaQuery>
      {showPickup && (
        <FieldWrapper>
          {showAddressTooltip && (
            <LabelWrapper>
              {isHotelPickup && (
                <InformationTooltipWrapper>
                  <InformationTooltip
                    direction="right"
                    information={t("The car rental will pick you up at the address given")}
                  />
                </InformationTooltipWrapper>
              )}
              <Label isRequired={isHotelPickup}>{pickupTitle}</Label>
            </LabelWrapper>
          )}
          <SectionValueWrapper>
            <Input
              Icon={isAirportPickup ? PlaneIcon : AddressIcon}
              placeholder={pickupPlaceholder}
              value={pickupSpecify}
              onChange={e => setSpecifiedPickup(e.target.value)}
              useDebounce={false}
              onBlur={() => {
                setPickupBlurred(true);
              }}
              lighterBorder
              type="search"
            />
            {hasPickupError && (
              <InputError>
                <Trans ns={Namespaces.commonBookingWidgetNs}>Fields with * are required</Trans>
              </InputError>
            )}
          </SectionValueWrapper>
        </FieldWrapper>
      )}
      {isHotelDropoff && (
        <FieldWrapper>
          <LabelWrapper>
            <InformationTooltipWrapper>
              <InformationTooltip
                direction="right"
                information={t(
                  "After you have returned the car the car rental will drop you off at the address given"
                )}
              />
            </InformationTooltipWrapper>
            <Label isRequired>{t("Dropoff")}</Label>
          </LabelWrapper>
          <SectionValueWrapper>
            <Input
              Icon={AddressIcon}
              placeholder={t("Dropoff address")}
              value={dropoffSpecify}
              onChange={e => setSpecifiedDropoff(e.target.value)}
              useDebounce={false}
              onBlur={() => setDropoffBlurred(true)}
              lighterBorder
              type="search"
            />
            {hasDropoffError && (
              <InputError>
                <Trans ns={Namespaces.commonBookingWidgetNs}>Fields with * are required</Trans>
              </InputError>
            )}
          </SectionValueWrapper>
        </FieldWrapper>
      )}
    </>
  );
};

export default PickupDetailsContainer;
