import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import { typographyH4, typographyH5 } from "styles/typography";
import { gutters } from "styles/variables";
import { mqMin, clampLinesWithFixedHeight } from "styles/base";

const TitleWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  ${mqMin.large} {
    height: 72px;
  }
`;

export const Title = styled.h1(({ theme }) => [
  typographyH5,
  css`
    margin: 0 ${gutters.small}px;
    color: ${theme.colors.primary};
    text-align: center;
    ${mqMin.large} {
      ${typographyH4};
      ${clampLinesWithFixedHeight({ numberOfLines: 2, lineHeight: 34 })};
      position: absolute;
    }
  `,
]);

const ProductHeader = ({ title, className }: { title: string; className?: string }) => {
  return (
    <TitleWrapper className={className}>
      <Title dangerouslySetInnerHTML={{ __html: title }} />
    </TitleWrapper>
  );
};

export default ProductHeader;
