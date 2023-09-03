import React from "react";
import styled from "@emotion/styled";

import { ItemWrapper, CloseButtonWrapper, CloseIcon, ItemContentWrapper } from "./CartComponents";

import { skeletonPulse } from "styles/base";

const LoadingTitle = styled.div`
  ${skeletonPulse};
  width: 197px;
  height: 12px;
`;

const LoadingImageWrapper = styled.div`
  width: 60px;
`;

const StyledCloseButtonWrapper = styled(CloseButtonWrapper)`
  cursor: default;
`;

const MiniCartLoadingItem = () => {
  return (
    <ItemWrapper>
      <LoadingImageWrapper />
      <ItemContentWrapper>
        <LoadingTitle />
        <StyledCloseButtonWrapper onClick={() => {}}>
          <CloseIcon />
        </StyledCloseButtonWrapper>
      </ItemContentWrapper>
    </ItemWrapper>
  );
};

const MiniCartLoading = () => (
  <>
    <MiniCartLoadingItem />
    <MiniCartLoadingItem />
    <MiniCartLoadingItem />
  </>
);

export default MiniCartLoading;
