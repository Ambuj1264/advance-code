import React from "react";
import styled from "@emotion/styled";

import { mqMin } from "styles/base";
import LoadingCover from "components/ui/Loading/LoadingCover";
import LoadingQuickFacts from "components/ui/Loading/LoadingQuickFacts";
import Section from "components/ui/Section/Section";
import { MobileContainer } from "components/ui/Grid/Container";

const StyledLoadingCover = styled(LoadingCover)`
  height: 210px;
  ${mqMin.large} {
    height: 359px;
  }
`;

const ProductInfoLoading = () => (
  <>
    <MobileContainer>
      <StyledLoadingCover />
    </MobileContainer>
    <Section>
      <MobileContainer>
        <LoadingQuickFacts />
      </MobileContainer>
    </Section>
  </>
);

export default ProductInfoLoading;
