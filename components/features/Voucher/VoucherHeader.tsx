import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import rgba from "polished/lib/color/rgba";

import { getVoucherTitle } from "./utils/voucherUtils";

import { mqMin, responsiveTypography } from "styles/base";
import { Namespaces } from "shared/namespaces";
import { typographyH4, typographySubtitle1 } from "styles/typography";
import { bittersweetRedColor, borderRadius, gutters } from "styles/variables";
import { useTranslation } from "i18n";

const Header = styled.h1(() => [
  responsiveTypography({ small: typographySubtitle1, large: typographyH4 }),
  css`
    padding: 0 ${gutters.small}px;
  `,
]);

const HeaderContainer = styled.div<{ isError?: boolean }>(({ isError, theme }) => [
  css`
    border-radius: ${borderRadius};
    background-color: ${isError ? rgba(bittersweetRedColor, 0.15) : rgba(theme.colors.action, 0.1)};
    color: ${isError ? bittersweetRedColor : theme.colors.action};
    text-align: center;
  `,
]);

const ContentWrapper = styled.div`
  padding: ${gutters.small}px 0;
  ${mqMin.large} {
    padding: ${gutters.large}px 0;
  }
`;

const VoucherHeader = ({
  numberOfItems,
  orderInfo,
  customHeader,
  isError,
  className,
}: {
  numberOfItems?: number;
  orderInfo?: VoucherTypes.OrderInfo;
  customHeader?: string;
  isError?: boolean;
  className?: string;
}) => {
  const { t } = useTranslation(Namespaces.voucherNs);
  const header = getVoucherTitle({ numberOfItems, t, orderInfo });
  return (
    <HeaderContainer className={className} isError={isError}>
      <ContentWrapper>
        <Header dangerouslySetInnerHTML={{ __html: customHeader ?? header }} />
      </ContentWrapper>
    </HeaderContainer>
  );
};

export default VoucherHeader;
