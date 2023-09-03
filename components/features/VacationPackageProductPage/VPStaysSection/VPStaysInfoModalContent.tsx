import React from "react";
import styled from "@emotion/styled";

import StayContentContainer from "components/features/StayProductPage/StayContentContainer";
import { mqMax, column } from "styles/base";
import { gutters } from "styles/variables";

const StyledStayContentContainer = styled(StayContentContainer)`
  ${column({ small: 1, large: 1, desktop: 1 })}
`;

const Wrapper = styled.div`
  margin: 0 -${gutters.small}px;
  margin-top: ${gutters.large}px;

  ${mqMax.large} {
    margin: 0 -${gutters.small + gutters.small / 2}px;
    margin-top: ${gutters.small}px;
  }
`;

const VPStaysInfoModalContent = ({
  attractionsConditions,
  productId,
  queryCondition,
  searchUrl,
}: StayTypes.StayContentQueryParams) => {
  return (
    <Wrapper>
      <StyledStayContentContainer
        productId={productId}
        attractionsConditions={attractionsConditions}
        queryCondition={queryCondition}
        searchUrl={searchUrl}
        isModalView
      />
    </Wrapper>
  );
};

export default VPStaysInfoModalContent;
