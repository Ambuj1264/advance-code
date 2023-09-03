import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import {
  isFlightSearch,
  isCarSearchOrCategory,
  isStaysSearch,
  isTourSearch,
} from "./utils/frontUtils";

import { typographyBody2 } from "styles/typography";
import TravelerIcon from "components/icons/traveler.svg";
import HotelIcon from "components/icons/house-heart.svg";
import CarIcon from "components/icons/car.svg";
import FlightIcon from "components/icons/plane-1.svg";
import VacationIcon from "components/icons/tour-route.svg";
import { Namespaces } from "shared/namespaces";
import { Trans } from "i18n";
import { DisplayType, PageType } from "types/enums";
import { whiteColor, zIndex, gutters } from "styles/variables";
import { mqMin, column } from "styles/base";
import MediaQuery from "components/ui/MediaQuery";
import useVpPackages from "hooks/useVpPackages";

const FrontStickyFooter = styled.div(
  ({ theme }) => css`
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: ${zIndex.z10};
    display: flex;
    justify-content: center;

    box-shadow: 0px 0px 16px rgba(102, 102, 102, 0.24);
    width: 100%;
    height: 65px;
    background-color: ${whiteColor};
    color: ${theme.colors.primary};
    text-align: center;
  `
);

const iconStyles = ({ theme }: { theme: Theme }) => css`
  margin-right: ${gutters.small / 2}px;
  max-width: 20px;
  height: 20px;
  fill: ${theme.colors.primary};
`;

const TravelerIconStyled = styled(TravelerIcon)<{}>([iconStyles]);
const BedroomIconStyled = styled(HotelIcon)<{}>([iconStyles]);
const CarIconStyled = styled(CarIcon)<{}>([iconStyles]);
const FlightIconStyled = styled(FlightIcon)<{}>([iconStyles]);
const VacationIconStyled = styled(VacationIcon)<{}>([iconStyles]);

const TabLink = styled.a<{ isSmallLinks: boolean }>(({ isSmallLinks }) => [
  css`
    display: flex;
    align-items: center;
  `,
  isSmallLinks && typographyBody2,
  isSmallLinks &&
    css`
      padding: 0 ${gutters.small}px;
    `,
]);

const Wrapper = styled.div<{ isAllServicesEnabled: boolean }>(({ isAllServicesEnabled }) => [
  column({ small: 1, medium: 1 / 2 }),
  css`
    display: flex;
    align-items: center;
    justify-content: ${isAllServicesEnabled ? "center" : "space-between"};
    margin: 0 ${isAllServicesEnabled ? gutters.large / 2 : gutters.large}px;
    height: 100%;
    ${mqMin.medium} {
      justify-content: space-around;
    }
  `,
  isAllServicesEnabled &&
    css`
      flex-wrap: wrap;
    `,
]);

const FrontMobileFooter = ({
  onTripsClick,
  onStaysClick,
  onCarsClick,
  onFlightsClick,
  onVacationsClick,
  activeServiceTypes,
}: {
  onTripsClick: () => void;
  onStaysClick: () => void;
  onCarsClick: () => void;
  onFlightsClick: () => void;
  onVacationsClick: () => void;
  activeServiceTypes: string[];
}) => {
  const shouldShowVacationPackages = useVpPackages();

  const isAllServicesEnabled = activeServiceTypes.length >= 4 || shouldShowVacationPackages;

  return (
    <MediaQuery toDisplay={DisplayType.Large}>
      <FrontStickyFooter id="FrontStickyFooter">
        <Wrapper isAllServicesEnabled={isAllServicesEnabled}>
          {shouldShowVacationPackages && (
            <TabLink onClick={onVacationsClick} isSmallLinks={isAllServicesEnabled}>
              <VacationIconStyled />
              <Trans ns={Namespaces.countryNs}>Vacations</Trans>
            </TabLink>
          )}
          {activeServiceTypes.some(pageType => isTourSearch(pageType as PageType)) && (
            <TabLink onClick={onTripsClick} isSmallLinks={isAllServicesEnabled}>
              <TravelerIconStyled />
              <Trans ns={Namespaces.countryNs}>Trips</Trans>
            </TabLink>
          )}
          {activeServiceTypes.some(pageType => isStaysSearch(pageType as PageType)) && (
            <TabLink onClick={onStaysClick} isSmallLinks={isAllServicesEnabled}>
              <BedroomIconStyled />
              <Trans ns={Namespaces.countryNs}>Stays</Trans>
            </TabLink>
          )}
          {activeServiceTypes.some(pageType => isCarSearchOrCategory(pageType as PageType)) && (
            <TabLink onClick={onCarsClick} isSmallLinks={isAllServicesEnabled}>
              <CarIconStyled />
              <Trans ns={Namespaces.countryNs}>Cars</Trans>
            </TabLink>
          )}
          {activeServiceTypes.some(pageType => isFlightSearch(pageType as PageType)) && (
            <TabLink onClick={onFlightsClick} isSmallLinks={isAllServicesEnabled}>
              <FlightIconStyled />
              <Trans ns={Namespaces.countryNs}>Flights</Trans>
            </TabLink>
          )}
        </Wrapper>
      </FrontStickyFooter>
    </MediaQuery>
  );
};

export default FrontMobileFooter;
