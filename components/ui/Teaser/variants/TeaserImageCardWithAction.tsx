import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import { TeaserImageCard } from "../TeaserComponents";
import TeaserTitle from "../TeaserTitle";

import ArrowRightIcon from "components/icons/arrow-right.svg";
import { fontWeightBold, gutters, teaserHeight, whiteColor } from "styles/variables";
import { typographyBody2, typographySubtitle2, typographyH5 } from "styles/typography";
import ImageComponent from "components/ui/ImageComponent";
import { mqMin } from "styles/base";

export const TitleHolder = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  z-index: 2;
  padding: ${gutters.small / 2}px;
  color: ${whiteColor};
`;
const SubTitle = styled.div(typographySubtitle2);

const Title = styled(TeaserTitle)`
  font-size: 28px;
  font-weight: ${fontWeightBold};
  line-height: 32px;
  ${typographyH5}
  &::first-letter {
    text-transform: capitalize;
  }
`;

const ActionBar = styled.div([
  typographyBody2,
  css`
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    display: flex;
    align-items: center;
    height: 32px;
    padding: 0 32px 0 ${gutters.small}px;
    background: rgba(0, 0, 0, 0.4);
    color: ${whiteColor};
  `,
]);

const ActionBarIcon = styled(ArrowRightIcon)`
  position: absolute;
  top: 50%;
  right: 14px;
  width: 12px;
  transform: translateY(-50%);
  fill: ${whiteColor};
`;

export const StyledTeaserImageCard = styled(TeaserImageCard)`
  margin: ${gutters.small / 2}px;
  height: ${teaserHeight.large}px;
  &::before {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1;
    display: block;
    background: linear-gradient(360deg, rgba(0, 0, 0, 0) 60%, rgba(0, 0, 0, 0.5) 85.44%);
  }
  ${mqMin.large} {
    margin: 0;
  }
`;

const TeaserImageCardWithAction = ({
  title,
  width = 330,
  smallTitle,
  imageUrl,
  imageAlt,
  action,
  overlay,
  imgixParams,
  shouldUseLazyImage,
  className,
  tagType = "h3",
}: {
  title: string;
  width?: number;
  smallTitle?: string | React.ReactNode;
  imageUrl?: string;
  imageAlt?: string;
  action?: string;
  overlay?: React.ReactNode;
  imgixParams?: SharedTypes.ImgixParams;
  shouldUseLazyImage?: boolean;
  className?: string;
  tagType?: React.ElementType;
}) => {
  return (
    <StyledTeaserImageCard hasShadow className={className}>
      {overlay}
      <ImageComponent
        imageUrl={imageUrl}
        height={teaserHeight.large}
        width={width}
        imgixParams={imgixParams}
        imageAlt={imageAlt}
        lazy={shouldUseLazyImage}
      />
      <TitleHolder>
        {smallTitle && <SubTitle>{smallTitle}</SubTitle>}
        <Title as={tagType}>{title}</Title>
      </TitleHolder>

      {action && (
        <ActionBar>
          <span>{action}</span>
          <ActionBarIcon />
        </ActionBar>
      )}
    </StyledTeaserImageCard>
  );
};

export default TeaserImageCardWithAction;
