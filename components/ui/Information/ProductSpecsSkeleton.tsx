import React from "react";
import styled from "@emotion/styled";
import { range } from "fp-ts/lib/Array";
import { useTheme } from "emotion-theming";

import { QFGroup } from "../SimilarProducts/SimilarProductsLoading";

import { QuickFact, StyledBox, Wrapper } from "./ProductSpecs";

export const StyledQFGroup = styled(QFGroup)`
  margin-bottom: 0;
  width: 85%;
`;

const ProductSpecsSkeleton = ({
  itemsCount = 6,
  fullWidth = false,
  className,
}: {
  itemsCount?: number;
  fullWidth?: boolean;
  className?: string;
}) => {
  const theme: Theme = useTheme();

  return (
    <StyledBox theme={theme} fullWidth={fullWidth}>
      <Wrapper className={className}>
        {range(1, itemsCount).map((_, index) => (
          <QuickFact fullWidth={fullWidth} key={`quickFactSkeleton-${index.toString()}`}>
            <StyledQFGroup />
          </QuickFact>
        ))}
      </Wrapper>
    </StyledBox>
  );
};

export default ProductSpecsSkeleton;
