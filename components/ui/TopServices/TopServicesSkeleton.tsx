import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import { range } from "fp-ts/lib/Array";

import { StyledScrollSnapWrapper, topServiceStyles } from "./TopServicesShared";

import { skeletonPulseBlue } from "styles/base";
import SectionRowSkeleton from "components/ui/Section/SectionRowSkeleton";
import { teaserHeight } from "styles/variables";

const ServiceWrapper = styled.div(topServiceStyles);

const ServicePulse = styled.div([
  skeletonPulseBlue,
  css`
    border-radius: 6px;
    height: ${teaserHeight.small}px;
  `,
]);

const TopServicesSkeleton = () => {
  return (
    <SectionRowSkeleton CustomRowWrapper={StyledScrollSnapWrapper}>
      {range(1, 8).map(key => (
        <ServiceWrapper key={key}>
          <ServicePulse />
        </ServiceWrapper>
      ))}
    </SectionRowSkeleton>
  );
};

export default TopServicesSkeleton;
