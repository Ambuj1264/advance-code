import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import { typographyCaptionSemibold } from "styles/typography";
import { whiteColor, gutters } from "styles/variables";
import { mqMin } from "styles/base";

const MobileFooterBanner = styled.div<{ isPrimary?: boolean }>(({ theme, isPrimary }) => [
  typographyCaptionSemibold,
  css`
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 20px;
    padding: 0 ${gutters.small}px;
    background-color: ${isPrimary ? theme.colors.primary : theme.colors.action};
    color: ${whiteColor};
    line-height: 20px;

    ${mqMin.large} {
      padding: 0 ${gutters.large}px;
    }
  `,
]);

const BookingWidgetFooterBanner = ({
  bannerContent,
  isPrimary = false,
}: {
  bannerContent: React.ReactNode | string;
  isPrimary?: boolean;
}) => {
  return (
    <MobileFooterBanner id="mobileFooterBanner" isPrimary={isPrimary}>
      {bannerContent}
    </MobileFooterBanner>
  );
};

export default BookingWidgetFooterBanner;
