import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import rgba from "polished/lib/color/rgba";

import { skeletonPulse } from "styles/base";
import { LoadingPriceSkeleton } from "components/ui/BookingWidget/BookingWidgetProductSelectContent";
import { Content } from "components/ui/Search/ListProductCardSkeleton";
import Row from "components/ui/Grid/Row";
import { gutters } from "styles/variables";

const Wrapper = styled.div(
  ({ theme }) => css`
    position: relative;
    border-top: 4px solid ${rgba(theme.colors.primary, 0.1)};
    padding-top: ${gutters.small / 2}px;
    padding-bottom: ${gutters.small / 2}px;
    :first-of-type {
      border: none;
      padding-top: 0;
    }
  `
);

const RowWrapper = styled.div``;

const TitleFirstLine = styled.span([
  skeletonPulse,
  css`
    width: 95px;
    height: 24px;
    padding-bottom: ${gutters.small / 2}px;
  `,
]);

const StyledLoadingPriceSkeleton = styled(LoadingPriceSkeleton)`
  margin-top: ${gutters.small / 2}px;
  height: 24px;
`;

const SpecsPlaceholder = styled.div([
  skeletonPulse,
  css`
    margin-right: ${gutters.large}px;
    max-width: 130px;
    height: 58px;
  `,
]);

const ContentRow = styled(Row)([
  css`
    justify-content: flex-start;
    margin: 0;
  `,
]);

const RadioButtonWrapper = styled.div`
  position: absolute;
  top: 50%;
  right: -12px;
  display: flex;
  align-items: center;
  height: 100%;
  text-align: center;
  -webkit-transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
`;

const RadioButtonLoading = styled.div([
  skeletonPulse,
  ({ theme }) => css`
    border: 1px solid ${rgba(theme.colors.primary, 0.1)};
    border-radius: 50%;
    width: 24px;
    height: 24px;
  `,
]);

const VPBookingProductSkeleton = ({ className }: { className?: string }) => (
  <Wrapper className={className}>
    <RowWrapper>
      <TitleFirstLine />
    </RowWrapper>
    <Content>
      <ContentRow>
        <SpecsPlaceholder />
        <SpecsPlaceholder />
      </ContentRow>
    </Content>
    <RowWrapper>
      <StyledLoadingPriceSkeleton />
    </RowWrapper>
    <RadioButtonWrapper>
      <RadioButtonLoading />
    </RadioButtonWrapper>
  </Wrapper>
);

export default VPBookingProductSkeleton;
