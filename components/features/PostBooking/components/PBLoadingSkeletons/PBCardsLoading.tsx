import React from "react";

import { MaxWidthWrapper } from "../MaxWidthWrapper";
import {
  StyledContainer,
  StyledProductCardRow,
  StyledProductCardsRowWrapper,
  TravelplanContentWrapper,
} from "../PBSharedComponents";

import PBCardLoadingSkeleton from "./PBCardLoadingSkeleton";

const PBCardsLoading = () => {
  return (
    <TravelplanContentWrapper>
      <StyledContainer>
        <MaxWidthWrapper>
          {[...Array(3)].map((_, i) => (
            // eslint-disable-next-line react/no-array-index-key
            <StyledProductCardRow key={`card-loading${i}`}>
              <StyledProductCardsRowWrapper>
                <PBCardLoadingSkeleton />
              </StyledProductCardsRowWrapper>
            </StyledProductCardRow>
          ))}
        </MaxWidthWrapper>
      </StyledContainer>
    </TravelplanContentWrapper>
  );
};

export default PBCardsLoading;
