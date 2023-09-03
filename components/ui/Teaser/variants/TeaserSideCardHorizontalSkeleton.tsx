import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import { range } from "fp-ts/lib/Array";

import { skeletonPulse, skeletonPulseBlue } from "styles/base";
import {
  StyledCard,
  StyledCardImage,
  StyledCardTitle,
  StyledCardContent,
  StyledDescription,
  TeaserSize,
} from "components/ui/Teaser/variants/TeaserSideCardHorizontal";

const ImagePulse = styled.div(skeletonPulseBlue);

const CardTitlePulse = styled(StyledCardTitle)<{ showPulse: boolean }>(({ showPulse }) => [
  showPulse && skeletonPulse,
  css`
    &:after {
      content: ".";
      visibility: hidden;
    }
  `,
]).withComponent("div");

const DescriptionLinePulse = styled.div([
  skeletonPulse,
  css`
    height: 14px;
  `,
]);

const TeaserSideCardHorizontalSkeleton = ({
  title,
  description,
  url = "",
  teaserSize = "large",
}: {
  title?: string;
  description?: string;
  url?: string;
  teaserSize?: TeaserSize;
}) => {
  return (
    <StyledCard hasShadow hasMaxWidth={false}>
      <a href={url}>
        <StyledCardImage teaserSize={teaserSize}>
          <ImagePulse />
        </StyledCardImage>
        <StyledCardContent>
          <CardTitlePulse showPulse={!title}>{title}</CardTitlePulse>
          <StyledDescription isSmallTeaser={teaserSize === "small"}>
            {description || range(1, 4).map(key => <DescriptionLinePulse key={key} />)}
          </StyledDescription>
        </StyledCardContent>
      </a>
    </StyledCard>
  );
};

export default TeaserSideCardHorizontalSkeleton;
