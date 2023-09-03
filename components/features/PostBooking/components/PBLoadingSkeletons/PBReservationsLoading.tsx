import React from "react";
import { css } from "@emotion/core";
import styled from "@emotion/styled";

import { StyledReservationsTitle } from "../PBSharedComponents";

import PBCardsLoading from "./PBCardsLoading";

import { mqMin, skeletonPulse } from "styles/base";
import { whiteColor, zIndex } from "styles/variables";

export const ModalHeader = styled.div([
  skeletonPulse,
  ({ theme }) => css`
    display: block;
    height: 40px;
    background-color: ${theme.colors.primary};
    ${mqMin.large} {
      display: none;
    }
  `,
]);

export const ModalLoading = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  z-index: ${zIndex.max};
  width: 100%;
  background-color: ${whiteColor};
  ${mqMin.large} {
    position: relative;
    z-index: 0;
    background-color: transparent;
  }
`;

const PBReservationsLoading = ({ t }: { t: TFunction }) => {
  return (
    <ModalLoading>
      <ModalHeader />
      <StyledReservationsTitle>{t("My reservations")}</StyledReservationsTitle>
      <PBCardsLoading />
    </ModalLoading>
  );
};

export default PBReservationsLoading;
