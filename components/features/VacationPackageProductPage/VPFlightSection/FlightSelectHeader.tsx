import React, { useCallback } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import { useTheme } from "emotion-theming";

import { getFlightTitleByRanking } from "../utils/vacationPackageUtils";
import VPCardBanner from "../VPCardBanner";
import { InfoButtonWrapper, StyledInformationIcon } from "../VPProductCard";

import { Namespaces } from "shared/namespaces";
import { FlightRanking } from "types/enums";
import { useTranslation } from "i18n";

const VacationPackageFlightHeaderContainer = styled.div<{
  isSelected: boolean;
}>(
  ({ theme, isSelected }) => css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 40px;
    ${StyledInformationIcon} {
      cursor: pointer;
      fill: ${isSelected ? theme.colors.action : theme.colors.primary};
    }
  `
);

const FlightRankingBannerContainer = styled.div`
  height: 100%;
`;

const FlightSelectHeader = ({
  isSelected,
  flightRanking,
  onInfoBtnClick,
}: {
  isSelected: boolean;
  flightRanking?: FlightRanking;
  onInfoBtnClick: () => void;
}) => {
  const theme: Theme = useTheme();
  const { t: vacationPackageT } = useTranslation(Namespaces.vacationPackageNs);
  const { shortName, Icon } = getFlightTitleByRanking(flightRanking!, vacationPackageT);

  const onInfoClickHandler = useCallback(
    e => {
      e.stopPropagation();
      onInfoBtnClick();
    },
    [onInfoBtnClick]
  );

  return (
    <VacationPackageFlightHeaderContainer theme={theme} isSelected={isSelected}>
      <FlightRankingBannerContainer>
        <VPCardBanner isSelected={isSelected} isTopBanner bannerContent={shortName} Icon={Icon} />
      </FlightRankingBannerContainer>
      <InfoButtonWrapper onClick={onInfoClickHandler} isCardSelected={isSelected}>
        <StyledInformationIcon theme={theme} />
      </InfoButtonWrapper>
    </VacationPackageFlightHeaderContainer>
  );
};

export default FlightSelectHeader;
