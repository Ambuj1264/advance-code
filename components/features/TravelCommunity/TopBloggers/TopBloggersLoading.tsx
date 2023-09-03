import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import { range } from "fp-ts/lib/Array";

import { NUMBER_OF_TOP_BLOGGERS } from "../utils/travelCommunityUtils";

import { skeletonPulseBlue, mqMin, column } from "styles/base";
import Row from "components/ui/Grid/Row";
import { gutters, borderRadius } from "styles/variables";

const BloggerCardLoading = styled.div([
  skeletonPulseBlue,
  css`
    border-radius: ${borderRadius};
    height: 115px;
    ${mqMin.large} {
      height: 129px;
    }
  `,
]);

const Column = styled.div([
  column({ small: 1 / 2, medium: 1 / 3, large: 1 / 4, desktop: 1 / 6 }),
  css`
    margin-top: ${gutters.small}px;
  `,
]);

const TopBloggersLoading = ({ itemsCount = NUMBER_OF_TOP_BLOGGERS }: { itemsCount?: number }) => (
  <Row>
    {range(1, itemsCount).map(index => (
      <Column key={index.toString()}>
        <BloggerCardLoading />
      </Column>
    ))}
  </Row>
);

export default TopBloggersLoading;
