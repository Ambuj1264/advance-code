import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import TravellerIcon from "components/icons/traveler.svg";
import CheckIcon from "components/icons/check-shield.svg";
import AwardIcon from "components/icons/award-ribbon-star.svg";
import { gutters, whiteColor, zIndex } from "styles/variables";
import { typographyCaptionSemibold } from "styles/typography";
import { Namespaces } from "shared/namespaces";
import { Trans } from "i18n";

const Container = styled.div(
  ({ theme }) => css`
    position: fixed;
    bottom: 0;
    z-index: ${zIndex.z10};
    display: flex;
    align-items: center;
    justify-content: space-around;
    width: 100%;
    height: ${gutters.large * 2}px;
    background-color: ${theme.colors.action};
  `
);

const Label = styled.div([
  typographyCaptionSemibold,
  css`
    display: flex;
    align-items: center;
    min-width: 215px;
    color: ${whiteColor};
  `,
]);

const Text = styled.div(
  `
  margin-left: ${gutters.large / 4}px;
  `
);

const TravellerIconStyled = styled(TravellerIcon)(
  ({ theme }) => css`
    border-radius: 100%;
    width: 20px;
    height: 20px;
    padding: 3px;
    background-color: ${whiteColor};
    fill: ${theme.colors.action};
  `
);

const iconStyles = () => css`
  width: 20px;
  height: 20px;
  fill: ${whiteColor};
`;

const BottomInfo = () => {
  return (
    <Container>
      <Label>
        <TravellerIconStyled />
        <Text>
          <Trans ns={Namespaces.carBookingWidgetNs}>Largest selection of travel services</Trans>
        </Text>
      </Label>
      <Label>
        <AwardIcon css={iconStyles} />
        <Text>
          <Trans ns={Namespaces.carBookingWidgetNs}>Easy booking & cancellation</Trans>
        </Text>
      </Label>
      <Label>
        <CheckIcon css={iconStyles} />
        <Text>
          <Trans ns={Namespaces.carBookingWidgetNs}>Best price guarantee</Trans>
        </Text>
      </Label>
    </Container>
  );
};

export default BottomInfo;
