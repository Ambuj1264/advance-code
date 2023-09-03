import React, { memo } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import SectionHeader from "../BookingWidgetSectionHeader";

import BaseTravelersInput from "./TravelersInput";
import TravellersHeaderMobile from "./TravellersHeaderMobile";

import { setTravelersInLocalStorage } from "utils/localStorageUtils";
import { DisplayType } from "types/enums";
import MediaQuery from "components/ui/MediaQuery";
import { skeletonPulse, mqMax } from "styles/base";
import { gutters } from "styles/variables";
import { Trans } from "i18n";
import { Namespaces } from "shared/namespaces";

const StyledTravelersInput = styled(BaseTravelersInput)`
  ${mqMax.large} {
    margin-top: ${gutters.small}px;
  }
`;

const DropdownLoading = styled.span([
  skeletonPulse,
  css`
    width: 100%;
    height: 48px;
  `,
]);

const DropdownLoadingLabel = styled.div([
  skeletonPulse,
  css`
    width: 50px;
    height: 16px;
  `,
]);

const LoadingContainer = styled.div`
  margin-top: ${gutters.small * 2}px;
  width: 100%;
`;

const TravelersContainer = ({
  onNumberOfTravelersChange,
  numberOfTravelers,
  travelerPrices,
  maxTravelers,
  priceGroupsMaxAge,
  priceGroups,
  isPriceGroupLoading,
}: {
  numberOfTravelers: SharedTypes.NumberOfTravelers;
  onNumberOfTravelersChange: (travelerType: SharedTypes.TravelerType, value: number) => void;
  travelerPrices?: TourBookingWidgetTypes.Prices;
  maxTravelers?: number;
  priceGroupsMaxAge: { childrenMaxAge: number; teenagerMaxAge: number };
  priceGroups: TravelersTypes.PriceGroup[];
  isPriceGroupLoading: boolean;
}) => {
  if (isPriceGroupLoading || priceGroups.length === 0) {
    return (
      <>
        <MediaQuery toDisplay={DisplayType.Large}>
          <SectionHeader>
            <Trans ns={Namespaces.tourBookingWidgetNs}>Select travellers</Trans>
          </SectionHeader>
        </MediaQuery>
        <LoadingContainer>
          <MediaQuery fromDisplay={DisplayType.Large}>
            <DropdownLoadingLabel />
          </MediaQuery>
          <DropdownLoading />
        </LoadingContainer>
      </>
    );
  }

  return (
    <>
      <TravellersHeaderMobile />
      <StyledTravelersInput
        priceGroups={priceGroups}
        numberOfTravelers={numberOfTravelers}
        travelerPrices={travelerPrices}
        onNumberOfTravelersChange={(travelerType, value) => {
          setTravelersInLocalStorage(numberOfTravelers, travelerType, value, priceGroupsMaxAge);
          onNumberOfTravelersChange(travelerType, value);
        }}
        maxTravelers={maxTravelers}
      />
    </>
  );
};

export default memo(TravelersContainer);
