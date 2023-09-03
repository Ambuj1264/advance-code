import React from "react";
import { css } from "@emotion/core";
import styled from "@emotion/styled";
import rgba from "polished/lib/color/rgba";
import { useTranslation } from "react-i18next";

import EmailIcon from "components/icons/email.svg";
import CloseIcon from "components/icons/remove-circle.svg";
import DownloadIcon from "components/icons/download-thick.svg";
import Container from "components/ui/Grid/Container";
import { mqMin } from "styles/base";
import { fontWeightBold, greyColor, gutters, whiteColor } from "styles/variables";
import { Button } from "components/ui/Modal/Modal";
import { ProductCardFooterContainer } from "components/ui/ProductCard/ProductcardFooterContainer";
import { TooltipWrapper } from "components/ui/Tooltip/Tooltip";
import { Namespaces } from "shared/namespaces";
import { Header } from "components/ui/Section/SectionWithTitle";
import { StyledSectionContainer } from "components/features/Voucher/Voucher";
import { typographyH4, typographySubtitle1 } from "styles/typography";
import {
  ProductCardOverviewList,
  ProductCardOverviewTile,
} from "components/ui/ProductCard/ProductCardOverview";
import ProductCardActionHeader from "components/ui/ProductCard/ProductCardActionHeader";

export const travelplanModalContentStyles = css`
  --mapHeight: calc(100% - 50px);

  display: flex;
  flex-flow: column wrap;
  align-items: center;

  height: var(--mapHeight);

  ${mqMin.medium} {
    height: var(--mapHeight);
  }
`;

export const StyledReservationsTitle = styled.h1(
  ({ theme }) => css`
    margin: ${gutters.small}px auto;
    color: ${theme.colors.primary};
    ${typographySubtitle1};
    font-weight: ${fontWeightBold};
    text-align: center;

    ${mqMin.medium} {
      margin: ${gutters.large}px auto;
      ${typographyH4};
    }
  `
);

export const TravelplanContentWrapper = styled.div(travelplanModalContentStyles);

export const StyledContainer = styled(Container)`
  width: 100%;
`;

export const StyledProductCardsRowWrapper = styled.div`
  display: flex;
  flex-flow: column;
  align-items: center;

  ${mqMin.large} {
    align-items: normal;
  }
`;

export const StyledProductCardRow = styled.div`
  margin-bottom: ${gutters.small}px;

  ${mqMin.large} {
    margin-bottom: ${gutters.large}px;
  }
`;

const modalHeaderIconStyles = css`
  width: 20px;
  height: 20px;
  fill: ${whiteColor};
`;

const StyledButton = styled(Button)([
  ({ theme }) => css`
    left: auto;
    justify-content: center;
    width: 56px;
    background-color: ${rgba(theme.colors.primary, 0.8)};
    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 1px;
      height: 100%;
      background: ${whiteColor};
    }
    &:hover {
      background-color: ${rgba(theme.colors.primary, 0.7)};
    }
  `,
]);

export const ModalCloseButton = ({
  onClick,
  className,
}: {
  onClick: () => void;
  className?: string;
}) => (
  <StyledButton onClick={onClick} className={className}>
    <CloseIcon css={modalHeaderIconStyles} />
  </StyledButton>
);

export const ModalDownloadButton = ({ onClick }: { onClick: () => void }) => (
  <StyledButton onClick={onClick}>
    <DownloadIcon css={modalHeaderIconStyles} />
  </StyledButton>
);

export const ModalMailButton = ({ onClick }: { onClick: () => void }) => (
  <StyledButton onClick={onClick}>
    <EmailIcon css={modalHeaderIconStyles} />
  </StyledButton>
);

export const StyledProductCardFooterContainer = styled(ProductCardFooterContainer)(
  ({ grayOut }: { grayOut: boolean }) => [
    css`
      position: relative;
    `,
    grayOut &&
      css`
        background-color: ${rgba(greyColor, 0.05)};
      `,
  ]
);

const grayOutStyle = ({ grayOut }: { grayOut: boolean }) => [
  grayOut &&
    css`
      filter: grayscale(1);
    `,
];

export const StyledProductCardOverviewTile = styled(ProductCardOverviewTile)(grayOutStyle);

export const StyledProductCardActionHeader = styled(ProductCardActionHeader)(grayOutStyle);

export const StyledProductCardOverviewList = styled(ProductCardOverviewList)(grayOutStyle);

export const PhoneTooltip = ({ phoneno }: { phoneno: string }) => {
  const { t: postbookingT } = useTranslation(Namespaces.postBookingNs);

  return (
    <TooltipWrapper elementDirection="left">
      {postbookingT(`Phone {phoneno} has been copied to your clipboard`, {
        phoneno,
      })}
    </TooltipWrapper>
  );
};

export const StyledPBProductCardsWrapper = styled.div<{
  noMaxWidthOnMobile?: boolean;
}>(
  ({ noMaxWidthOnMobile = false }) =>
    css`
      max-width: ${noMaxWidthOnMobile ? "none" : "380px"};
      ${mqMin.large} {
        max-width: none;
      }
    `
);

export const commonVoucherStyles = css`
  min-height: 100%;
  ${mqMin.large} {
    margin-top: 0;
    border: none;
    border-radius: 0;
  }
  ${Header} {
    ${mqMin.large} {
      display: none;
    }
  }
  ${StyledSectionContainer} {
    ${mqMin.large} {
      padding-bottom: 50px;
    }
  }
`;

export const PBHeading = styled.h1(
  ({ theme }) => css`
    margin: ${gutters.small}px 0;
    padding: ${gutters.small / 2}px;
    background: ${rgba(theme.colors.action, 0.05)};
    color: ${theme.colors.action};
    ${typographySubtitle1};
    font-weight: ${fontWeightBold};
    text-align: center;
    ${mqMin.medium} {
      display: inline-block;
      margin: ${gutters.large * 2}px auto;
      padding: ${gutters.small}px ${gutters.large * 2}px;
      ${typographyH4};
      font-weight: ${fontWeightBold};
    }
  `
);
