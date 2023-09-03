import React, { forwardRef, Ref } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import { fontWeightSemibold, fontSizeCaption, gutters } from "styles/variables";
import { singleLineTruncation } from "styles/base";
import LazyHydrateWrapper from "components/ui/LazyHydrateWrapper";
import InformationCircle from "components/icons/information-circle.svg";

export const Wrapper = styled.div(
  ({ theme }) => css`
    display: flex;
    align-items: center;
    height: 20px;
    color: ${theme.colors.action};
    font-size: ${fontSizeCaption};
    font-weight: ${fontWeightSemibold};
    line-height: 20px;
    white-space: nowrap;
  `
);

export const Title = styled.div`
  display: inline;
  ${singleLineTruncation}
`;

const LoadableSvgIconWrapper = styled.div(
  ({ theme }) => css`
    display: inline-block;
    flex-shrink: 0;
    margin-right: ${gutters.large / 4}px;
    line-height: 1;
    vertical-align: middle;

    svg {
      height: 14px;
      fill: ${theme.colors.action};
    }
  `
);

const InformationCircleStyled = styled(InformationCircle)(
  ({ theme }) => css`
    margin-left: ${gutters.large / 4}px;
    width: 12px;
    height: 12px;
    opacity: 0.7;
    fill: ${theme.colors.action};
  `
);

const ProductFeature = (
  {
    Icon,
    title,
    description,
    className,
  }: SharedTypes.ProductProp & {
    className?: string;
  },
  ref: Ref<HTMLDivElement>
) => {
  return (
    <Wrapper className={className}>
      <LazyHydrateWrapper ssrOnly>
        <LoadableSvgIconWrapper>
          <Icon />
        </LoadableSvgIconWrapper>
      </LazyHydrateWrapper>
      <Title ref={ref}>{title}</Title>
      {description && <InformationCircleStyled />}
    </Wrapper>
  );
};

export default forwardRef(ProductFeature);
