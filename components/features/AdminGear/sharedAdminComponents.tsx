import { css } from "@emotion/core";
import styled from "@emotion/styled";

import CartOptionModal from "../Cart/CartOptionModal";

import {
  Container,
  ModalContentWrapper,
  ModalHeading,
  NavigationContainer,
} from "components/ui/Modal/Modal";
import { mqMax, mqMin } from "styles/base";
import { bittersweetRedColor, greyColor, gutters } from "styles/variables";

export const HEADER_ID = "admin-modal-header";

export const StyledModalHeading = styled(ModalHeading)<{ isError: boolean }>(
  ({ isError, theme }) =>
    css`
      color: ${isError ? bittersweetRedColor : theme.colors.primary};
    `
);

export const InfoText = styled.p`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${greyColor};
`;

export const IconWrapper = styled.span<{ isSuccessful?: boolean; isLargeIcon?: boolean }>(
  ({ theme, isSuccessful, isLargeIcon }) => css`
    display: inline-flex;
    align-items: center;
    align-self: flex-start;
    justify-content: center;
    margin-right: ${gutters.small / 4}px;
    width: ${isLargeIcon ? 16 : 12}px;
    height: ${isLargeIcon ? 16 : 12}px;
    padding-top: ${isLargeIcon ? gutters.large / 2 : gutters.small / 2}px;
    svg {
      width: ${isLargeIcon ? 16 : 12}px;
      height: ${isLargeIcon ? 16 : 12}px;
      fill: ${isSuccessful ? theme.colors.action : bittersweetRedColor};
    }
  `
);

export const StyledCartOptionModal = styled(CartOptionModal)<{
  isError: boolean;
}>(
  ({ isError, theme }) => css`
    ${NavigationContainer} {
      background-color: ${isError ? bittersweetRedColor : theme.colors.primary};
    }
    ${Container} {
      width: auto;
      max-width: unset;
      height: 100%;
      padding-bottom: ${gutters.large}px;

      ${mqMin.large} {
        width: 600px;
        height: auto;
      }
    }
    ${ModalContentWrapper} {
      height: auto;
    }
  `
);

export const DoubleButtonWrapper = styled.div(
  css`
    display: flex;
    flex-direction: column-reverse;
    align-items: center;
    justify-content: center;
    text-align: center;
    & > button {
      margin-bottom: ${gutters.small}px;
    }
    ${mqMin.large} {
      flex-direction: row;
      justify-content: space-between;
      & > button {
        margin-bottom: 0;
      }
    }
  `
);

export const columnCommonStyles = css`
  ${mqMax.large} {
    margin-bottom: ${gutters.small}px;
  }
`;
