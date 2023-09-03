import React from "react";
import { css } from "@emotion/core";
import styled from "@emotion/styled";
import rgba from "polished/lib/color/rgba";

import { typographyH4 } from "styles/typography";
import { blackColor, borderRadius, borderRadiusSmall, gutters, whiteColor } from "styles/variables";
import { mqMin, clampLinesWithFixedHeight } from "styles/base";

export const Heading1 = styled.h1<{ numberOfLines?: number }>(({ numberOfLines }) => [
  typographyH4,
  numberOfLines && clampLinesWithFixedHeight({ numberOfLines, lineHeight: 34 }),
  css`
    border-radius: ${borderRadiusSmall};
    padding: ${gutters.small / 2}px 35px;
    background-color: ${rgba(blackColor, 0.2)};
    color: ${whiteColor};
    text-align: center;

    @media (max-width: 375px) {
      padding: ${gutters.small / 2}px;
      font-size: 20px;
    }

    ${mqMin.large} {
      border-radius: ${borderRadius};
    }
  `,
]);

const Heading1Container = styled.div`
  position: absolute;
  top: 68px;
  right: ${gutters.large * 2}px;
  left: ${gutters.large * 2}px;
  display: flex;
  align-items: center;
  justify-content: center;
  @media (max-width: 375px) {
    top: ${gutters.small}px;
    right: ${gutters.small}px;
    left: ${gutters.small}px;
  }
`;

const Cover = ({
  title,
  className,
  numberOfLines,
}: {
  title: string;
  className?: string;
  numberOfLines?: number;
}) => {
  return (
    <Heading1Container className={className}>
      <Heading1 dangerouslySetInnerHTML={{ __html: title }} numberOfLines={numberOfLines} />
    </Heading1Container>
  );
};

export default Cover;
