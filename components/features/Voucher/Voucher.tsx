import React, { Fragment, ElementType } from "react";
import { css } from "@emotion/core";
import { useTheme } from "emotion-theming";
import styled from "@emotion/styled";
import QRCode from "qrcode.react";

import VoucherHeaderActions from "./VoucherHeaderActions";
import { EditableStatus } from "./types/VoucherEnums";

import {
  HourItem,
  OpeningHourTitle,
  OpeningHourWrapper,
} from "components/features/Car/CarLocationDetails/OpeningHours";
import MarketplaceInformation from "components/ui/Order/MarketplaceInformation";
import SectionWithTitle, { HeaderLeftContent } from "components/ui/Section/SectionWithTitle";
import {
  VoucherSection,
  SectionContainer,
  SectionSeperator,
} from "components/ui/Order/OrderComponents";
import { mqMin, mqPrint, responsiveTypography, singleLineTruncation } from "styles/base";
import { borderRadiusSmall, gutters, whiteColor } from "styles/variables";
import MarketplaceLogo from "components/ui/Logo/MarketplaceLogo";
import { typographyBody2, typographyBody1 } from "styles/typography";

export const StyledSectionContainer = styled(SectionContainer)<{
  backgroundColor: string;
}>(
  ({ backgroundColor }) =>
    css`
      margin: 0;
      border-top-left-radius: 0;
      border-top-right-radius: 0;

      ${OpeningHourWrapper}.active-hours {
        ${HourItem},
        ${OpeningHourTitle} {
          color: ${backgroundColor};
        }
      }
    `
);

const iconStyles = css`
  margin: 0 ${gutters.large / 2}px;
  width: 18px;
  height: 18px;
  fill: ${whiteColor};

  ${mqMin.large} {
    margin: 0 ${gutters.small / 2}px;
  }
`;

const VoucherFooter = styled.div`
  display: none;
  ${mqPrint} {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: ${gutters.large}px;
    break-inside: avoid;
  }
`;

export const QRCodeWrapper = styled.div`
  display: none;
  ${mqMin.large} {
    position: absolute;
    right: 24px;
    display: block;
    svg {
      border-radius: ${borderRadiusSmall};
    }
  }
`;

const StyledMarketplaceLogo = styled(MarketplaceLogo)`
  width: auto;
  height: 36px;
`;

export const ProductTitle = styled.span([
  singleLineTruncation,
  responsiveTypography({ small: typographyBody2, large: typographyBody1 }),
  css`
    max-width: 57%;

    @media only screen {
      display: none;
      ${mqMin.large} {
        display: block;
      }
    }
  `,
]);

export const StyledSectionWithTitle = styled(SectionWithTitle)`
  ${HeaderLeftContent} {
    left: 0;
    display: flex;
    align-items: center;
    width: 100%;
    height: 100%;
    ${mqMin.large} {
      left: 24px;
    }
  }

  ${mqPrint} {
    // apply page break to all StyledSectionWithTitle elements except last one, which is 3rd last-child element
    &:not(&:nth-last-of-type(-n + 3)) {
      break-after: always;
    }
  }
`;

const Voucher = ({
  voucherSections,
  onEditClick,
  editableStatus,
  advanceNoticeSec,
  voucherId,
  defaultEmail,
  productTitle,
  Icon,
  pdfUrl,
  voucherColor,
  isVoucherReady,
  showHeaderEmailIcon,
  className,
  resendVoucherModalCustomZIndex,
}: {
  voucherSections: OrderTypes.VoucherProduct[];
  onEditClick?: () => void;
  editableStatus: EditableStatus;
  advanceNoticeSec?: number;
  voucherId: string;
  defaultEmail: string;
  productTitle?: string;
  Icon: ElementType;
  pdfUrl?: string;
  voucherColor?: string;
  isVoucherReady: boolean;
  showHeaderEmailIcon?: boolean;
  className?: string;
  resendVoucherModalCustomZIndex?: number;
}) => {
  const theme: Theme = useTheme();
  const voucherColorScheme = voucherColor || theme.colors.primary;

  return (
    <StyledSectionWithTitle
      className={className}
      color={voucherColorScheme}
      headerLeftContent={
        <>
          <Icon css={iconStyles} />
          <ProductTitle title={productTitle} data-testid="voucherProductTitle">
            {productTitle}
          </ProductTitle>
        </>
      }
      headerRightContent={
        <VoucherHeaderActions
          onEditClick={onEditClick}
          editableStatus={editableStatus}
          advanceNoticeSec={advanceNoticeSec}
          voucherId={voucherId}
          defaultEmail={defaultEmail}
          pdfUrl={pdfUrl}
          showEmailIcon={showHeaderEmailIcon}
          resendVoucherModalCustomZIndex={resendVoucherModalCustomZIndex}
        />
      }
    >
      <StyledSectionContainer backgroundColor={voucherColorScheme}>
        <QRCodeWrapper>
          {typeof window !== "undefined" && (
            <QRCode
              value={window.location.href.replace("&checkout=true", "")}
              fgColor={voucherColorScheme}
              renderAs="svg"
              size={95}
            />
          )}
        </QRCodeWrapper>

        {voucherSections.map((section, index) => (
          <Fragment key={section.title}>
            {index !== 0 && <SectionSeperator />}
            <VoucherSection
              voucherSection={section}
              voucherColor={voucherColorScheme}
              isVoucherReady={isVoucherReady}
            />
          </Fragment>
        ))}
        <VoucherFooter>
          <StyledMarketplaceLogo />
          <MarketplaceInformation showContent />
        </VoucherFooter>
      </StyledSectionContainer>
    </StyledSectionWithTitle>
  );
};

export default Voucher;
