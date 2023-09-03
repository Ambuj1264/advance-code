import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import { StyledProductCardFooterContainer } from "../PBSharedComponents";

import { ProductCardContainer } from "components/ui/ProductCard/ProductCardContainer";
import {
  Actions,
  Product,
  ProductHeaderContainer,
} from "components/ui/ProductCard/ProductCardActionHeader";
import { mqMax, mqMin, skeletonPulse } from "styles/base";
import { borderRadius, gutters, whiteColor } from "styles/variables";
import {
  QuickFact,
  QuickFactsWrapper,
  TextContentWrapper,
} from "components/ui/ProductCard/QuickFactsWithoutModals";
import { iconStyles } from "components/ui/Information/ProductSpecs";

const LoadingIconWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const HeaderIconSkeleton = styled.div([
  skeletonPulse,
  css`
    margin: 0 ${gutters.large / 2}px;
    border-radius: 50%;
    width: 14px;
    height: 14px;
    fill: ${whiteColor};
    ${mqMin.large} {
      margin: 0 ${gutters.small / 2}px;
    }
  `,
]);

const QuickFactIconLoading = styled.div([
  skeletonPulse,
  iconStyles("none"),
  css`
    margin-right: ${gutters.small / 2}px;
    border-radius: ${borderRadius};
  `,
]);

const TopLeftIcon = styled(QuickFactIconLoading)`
  margin-left: ${gutters.large / 4}px;
`;

const CardTitleSkeleton = styled.div([
  skeletonPulse,
  css`
    border-radius: ${borderRadius};
    width: 100px;
    max-width: calc(100% - 110px);
    height: 18px;
    ${mqMin.large} {
      max-width: calc(100% - 92px);
    }
  `,
]);

const ContentWrapper = styled.div`
  display: flex;
  margin: 0 -${gutters.large / 2}px 0 -${gutters.large / 2}px;
  overflow: hidden;
  ${mqMax.large} {
    flex-direction: column;
  }
`;

const LeftColumn = styled.div`
  position: static;
  width: 212px;
  height: auto;
  ${mqMax.large} {
    width: 100%;
  }
`;

const RightColumn = styled.div`
  width: 100%;
  padding-top: ${gutters.small / 2}px;
  padding-right: ${gutters.small * 2}px;
  padding-bottom: ${gutters.small / 2}px;
  padding-left: ${gutters.large}px;
  overflow: hidden;
`;

const ProductImageLoading = styled.div([
  skeletonPulse,
  css`
    display: inline-block;
    margin: 0 auto;
    min-width: 212px;
    max-width: 100%;
    height: 100%;
    max-height: 190px;
    object-fit: cover;
    ${mqMax.large} {
      height: 250px;
    }
  `,
]);

const VPTitleLoading = styled.div([
  skeletonPulse,
  css`
    border-radius: ${borderRadius};
    width: 280px;
    height: 19px;
    padding-top: 5px;
  `,
]);

const QuickFactLabelLoading = styled.div([
  skeletonPulse,
  css`
    margin-top: ${gutters.small / 8}px;
    width: 70px;
    height: 16px;
  `,
]);

const QuickFactValueLoading = styled(QuickFactLabelLoading)`
  width: 50px;
  height: 12px;
`;

const StyledProductCardContainer = styled(ProductCardContainer)`
  max-width: 380px;
  ${mqMin.large} {
    max-width: 100%;
  }
`;

const PBCardLoadingSkeleton = ({ className }: { className?: string }) => {
  return (
    <StyledProductCardContainer themeBorderColor className={className}>
      <ProductHeaderContainer>
        <Product isExpiredOffer={false}>
          <TopLeftIcon />
          <CardTitleSkeleton />
        </Product>
        <Actions>
          <LoadingIconWrapper>
            <HeaderIconSkeleton />
          </LoadingIconWrapper>
        </Actions>
      </ProductHeaderContainer>
      <ContentWrapper>
        <LeftColumn>
          <ProductImageLoading />
        </LeftColumn>
        <RightColumn>
          <VPTitleLoading />
          <QuickFactsWrapper>
            {[...Array(6)].map((_, i) => (
              // eslint-disable-next-line react/no-array-index-key
              <QuickFact key={`quickfact-loading${i}`}>
                <QuickFactIconLoading />
                <TextContentWrapper>
                  <QuickFactLabelLoading />
                  <QuickFactValueLoading />
                </TextContentWrapper>
              </QuickFact>
            ))}
          </QuickFactsWrapper>
        </RightColumn>
      </ContentWrapper>
      <StyledProductCardFooterContainer grayOut={false} />
    </StyledProductCardContainer>
  );
};

export default PBCardLoadingSkeleton;
