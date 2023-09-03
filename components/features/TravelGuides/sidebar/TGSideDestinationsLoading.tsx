import React from "react";
import { useTheme } from "emotion-theming";
import { css } from "@emotion/core";
import styled from "@emotion/styled";
import rgba from "polished/lib/color/rgba";

import { landingPageCardSkeletonStyles } from "components/ui/LandingPages/LandingPageCardContainer";
import { skeletonPulse } from "styles/base";
import { greyColor, gutters } from "styles/variables";
import { GraphCMSDisplayType } from "types/enums";

const SideBarHeadingLoading = styled.div([
  skeletonPulse,
  css`
    width: 250px;
    height: 24px;
  `,
]);

const CardWrapper = styled.div`
  border-bottom: 1px solid ${rgba(greyColor, 0.3)};
  padding-top: ${gutters.small}px;
  padding-bottom: ${gutters.small}px;
`;

const TGSideDestinationsLoading = ({ className }: { className?: string }) => {
  const theme: Theme = useTheme();
  const SkeletonComp = landingPageCardSkeletonStyles[GraphCMSDisplayType.SIDE_IMAGE];
  return (
    <div className={className}>
      <SideBarHeadingLoading />
      {[...Array(5)].map((_, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <CardWrapper key={`dest-skeleton-${i}`}>
          <SkeletonComp theme={theme} />
        </CardWrapper>
      ))}
    </div>
  );
};

export default TGSideDestinationsLoading;
