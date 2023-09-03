import React from "react";
import styled from "@emotion/styled";

import { gutters } from "styles/variables";
import { mqMax } from "styles/base";
import LoadingHeader from "components/ui/Loading/LoadingHeader";
import LoadingDropdown from "components/ui/Loading/LoadingDropdown";

const HeaderWrapper = styled.div`
  margin: 0 -${gutters.large}px;
`;

const Wrapper = styled.div`
  ${mqMax.large} {
    margin-bottom: ${gutters.small * 5}px;
  }
`;

const AvailabilityLoading = () => (
  <Wrapper>
    <HeaderWrapper>
      <LoadingHeader />
    </HeaderWrapper>
    <LoadingDropdown />
    <LoadingDropdown />
  </Wrapper>
);

export default AvailabilityLoading;
