import React from "react";
import styled from "@emotion/styled";

import { gutters } from "styles/variables";
import { mqMax } from "styles/base";
import LoadingHeader from "components/ui/Loading/LoadingHeader";
import LoadingDropdown from "components/ui/Loading/LoadingDropdown";

const HeaderWrapper = styled.div`
  margin-left: -${gutters.large}px;
  width: calc(100% + ${gutters.large * 2}px);
  height: 32px;

  ${LoadingHeader} {
    margin-top: ${gutters.small / 2}px;
  }

  ${mqMax.large} {
    margin-left: -${gutters.small}px;
    width: calc(100% + ${gutters.small * 2}px);

    ${LoadingHeader} {
      height: 32px;
    }
  }
`;

const Wrapper = styled.div`
  ${mqMax.large} {
    padding-bottom: 0;
  }
`;

const StyledLoadingDropdown = styled(LoadingDropdown)`
  margin-bottom: ${gutters.small}px;
`;

const VPCarEditModalContentLoading = () => (
  <Wrapper>
    <HeaderWrapper>
      <LoadingHeader />
    </HeaderWrapper>
    <StyledLoadingDropdown />
    <HeaderWrapper>
      <LoadingHeader />
    </HeaderWrapper>
    <LoadingDropdown />
    <LoadingDropdown />
  </Wrapper>
);

export default VPCarEditModalContentLoading;
