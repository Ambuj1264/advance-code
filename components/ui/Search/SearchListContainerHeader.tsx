import React, { ReactNode } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import rgba from "polished/lib/color/rgba";

import { blackColor, breakpointsMin, breakpointsMax, gutters } from "styles/variables";
import { skeletonPulse, column } from "styles/base";
import { typographyH5 } from "styles/typography";

const H2 = styled.div([
  column({ small: 1, large: 1 / 2 }),
  typographyH5,
  css`
    padding: ${gutters.small}px 0;
    color: ${rgba(blackColor, 0.7)};
    text-align: center;
    ${`@media (min-width: ${breakpointsMin.large}px) and (max-width: ${breakpointsMax.desktop}px) `} {
      text-align: left;
    }
  `,
]);

const ListHeaderTitleSkeleton = styled.span([
  skeletonPulse,
  css`
    margin-left: ${gutters.large / 2}px;
    width: 50%;
    height: 28px;
  `,
]);

const SearchListContainerHeader = ({
  loading,
  children,
}: {
  loading: boolean;
  children?: ReactNode;
}) => {
  if (loading) {
    return <ListHeaderTitleSkeleton />;
  }
  return <H2>{children}</H2>;
};

export default SearchListContainerHeader;
