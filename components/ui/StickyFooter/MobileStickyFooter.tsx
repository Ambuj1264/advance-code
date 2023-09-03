import React, { ReactNode } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import BookingWidgetFooterBanner from "../BookingWidget/BookingWidgetFooter/BookingWidgetFooterBanner";

import { zIndex, whiteColor, boxShadowTop, gutters } from "styles/variables";
import { mqMin, container, singleLineTruncation } from "styles/base";
import useRepositionContactUsButton from "hooks/useRepositionContactUsButton";
import { ContactUsMobileMargin } from "components/features/ContactUs/ContactUsButton";

export const Container = styled.div<{
  alwaysDisplay?: boolean;
}>(({ alwaysDisplay }) => [
  css`
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: ${zIndex.z10};
    width: 100%;
    max-width: none;
  `,
  !alwaysDisplay &&
    css`
      ${mqMin.large} {
        display: none;
      }
    `,
]);

const RightWrapper = styled.div`
  margin-left: auto;
  width: 50%;
  padding-left: ${gutters.small / 2}px;
  /* stylelint-disable-next-line selector-max-type */
  button {
    ${singleLineTruncation}
  }
`;

export const MobileFooterContainer = styled.div<{
  hasTopContent?: boolean;
}>(({ hasTopContent }) => [
  container,
  css`
    position: relative;
    display: flex;
    flex-grow: 0;
    flex-shrink: 0;
    align-items: center;
    box-shadow: ${hasTopContent ? "none" : boxShadowTop};
    width: 100%;
    height: 56px;
    padding-top: ${gutters.small}px;
    padding-bottom: ${gutters.small}px;
    background-color: ${whiteColor};
  `,
]);

const LeftWrapper = styled.div<{ hasBannerContent: boolean }>(({ hasBannerContent }) => [
  container,
  css`
    flex-basis: 50%;
    margin-bottom: ${hasBannerContent ? -gutters.small : 0}px;
    max-width: 50%;
    padding-right: ${gutters.small / 2}px;
    padding-left: 0;
  `,
]);

export type MobileStickyFooterPropsType = {
  leftContent?: ReactNode;
  rightContent?: ReactNode;
  fullWidthContent?: ReactNode;
  topContent?: ReactNode;
  className?: string;
  bannerContent?: React.ReactNode | string;
  primaryBanner?: boolean;
  alwaysDisplay?: boolean;
  bottomContent?: React.ReactNode;
};

const MobileStickyFooter = ({
  leftContent,
  rightContent,
  fullWidthContent,
  topContent,
  className,
  bannerContent,
  primaryBanner = false,
  alwaysDisplay = false,
  bottomContent,
}: MobileStickyFooterPropsType) => {
  useRepositionContactUsButton({
    bottomPosition: ContactUsMobileMargin.RegularFooter,
    isMobileFooterShown: true,
  });
  return (
    <Container id="stickyFooter" alwaysDisplay={alwaysDisplay} className={className}>
      {topContent}
      <MobileFooterContainer hasTopContent={Boolean(topContent)}>
        {fullWidthContent}
        {!fullWidthContent && (
          <>
            <LeftWrapper hasBannerContent={Boolean(bannerContent)}>{leftContent}</LeftWrapper>
            <RightWrapper>{rightContent}</RightWrapper>{" "}
          </>
        )}

        {bannerContent && (
          <BookingWidgetFooterBanner bannerContent={bannerContent} isPrimary={primaryBanner} />
        )}
      </MobileFooterContainer>
      {bottomContent}
    </Container>
  );
};

export default MobileStickyFooter;
