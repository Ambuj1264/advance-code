import React, { useContext } from "react";
import styled from "@emotion/styled";

import OptionsSectionHeader from "../OptionsSectionHeader";
import CarBookingWidgetConstantContext from "../../contexts/CarBookingWidgetConstantContext";
import CarBookingWidgetStateContext from "../../contexts/CarBookingWidgetStateContext";
import CarBookingWidgetCallbackContext from "../../contexts/CarBookingWidgetCallbackContext";

import AddressIcon from "components/icons/car-garage.svg";
import PlaneIcon from "components/icons/plane-land.svg";
import Input from "components/ui/Inputs/Input";
import { useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";
import { mqMin } from "styles/base";
import MobileSectionHeading from "components/ui/BookingWidget/MobileSectionHeading";
import MediaQuery from "components/ui/MediaQuery";
import { DisplayType } from "types/enums";
import { gutters } from "styles/variables";

const FieldWrapper = styled.div`
  margin-top: ${gutters.small}px;
  :last-of-type {
    margin-bottom: ${gutters.large}px;
    ${mqMin.large} {
      margin-bottom: 0;
    }
  }
`;

const SectionValueWrapper = styled.div`
  margin-top: ${gutters.small / 2}px;
`;

const AirportPickupDetailsContainer = () => {
  const { isAirportPickup } = useContext(CarBookingWidgetConstantContext);
  const { pickupSpecify } = useContext(CarBookingWidgetStateContext);
  const { setSpecifiedPickup } = useContext(CarBookingWidgetCallbackContext);
  const { t } = useTranslation(Namespaces.carBookingWidgetNs);
  return isAirportPickup ? (
    <>
      <MediaQuery fromDisplay={DisplayType.Large}>
        <OptionsSectionHeader title={t("Add flight number")} />
      </MediaQuery>
      <MediaQuery toDisplay={DisplayType.Large}>
        <MobileSectionHeading>{t("Add flight number")}</MobileSectionHeading>
      </MediaQuery>
      <FieldWrapper>
        <SectionValueWrapper>
          <Input
            Icon={isAirportPickup ? PlaneIcon : AddressIcon}
            placeholder={t("Type in your flight number")}
            value={pickupSpecify}
            onChange={e => setSpecifiedPickup(e.target.value)}
            useDebounce={false}
            lighterBorder
            type="search"
          />
        </SectionValueWrapper>
      </FieldWrapper>
    </>
  ) : null;
};

export default AirportPickupDetailsContainer;
