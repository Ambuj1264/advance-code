import React from "react";
import styled, { StyledComponent } from "@emotion/styled";
import { css } from "@emotion/core";

import { IMAGE_TEASER_HEIGHT, TeaserImageCard, teaserImageStyles } from "../TeaserComponents";

import ArrowRightIcon from "components/icons/arrow-right.svg";
import { fontWeightBold, gutters, whiteColor } from "styles/variables";
import LazyImage from "components/ui/Lazy/LazyImage";
import { typographyBody2, typographySubtitle1 } from "styles/typography";

const TitleHolder = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  z-index: 2;
  padding: ${gutters.small}px;
  color: ${whiteColor};
`;
const SubTitle = styled.div(typographySubtitle1);

const Title = styled.h3`
  font-size: 28px;
  font-weight: ${fontWeightBold};
  line-height: 32px;
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

const TeaserImageWithAction = ({
  url,
  image,
  LinkComponent,
  title,
  upperTitle,
  subtitle,
  action,
}: TeaserTypes.Teaser & {
  LinkComponent: StyledComponent<{ href: string }, { href: string }, Theme>;
}) => {
  if (!image) {
    return null;
  }

  return (
    <LinkComponent href={url}>
      <TeaserImageCard responsiveHeight={[`${IMAGE_TEASER_HEIGHT}px`]} hasShadow hasInnerTopShadow>
        <LazyImage
          src={image.url}
          styles={teaserImageStyles}
          alt={image.name}
          height={IMAGE_TEASER_HEIGHT}
        />

        <TitleHolder>
          {upperTitle && <SubTitle>{upperTitle}</SubTitle>}
          <Title>{title}</Title>
          {subtitle && <SubTitle>{subtitle}</SubTitle>}
        </TitleHolder>

        <ActionBar>
          <span>{action}</span>
          <ActionBarIcon />
        </ActionBar>
      </TeaserImageCard>
    </LinkComponent>
  );
};

export default TeaserImageWithAction;
