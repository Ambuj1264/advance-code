import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import { constructTileCardBlog } from "./utils/bloggerSearchUtils";

import { gutters } from "styles/variables";
import TeaserCard from "components/ui/TopTravelAdviceContainer/TeaserCard";
import { convertImageWithNumberId } from "utils/imageUtils";
import { column } from "styles/base";
import useActiveLocale from "hooks/useActiveLocale";

export const ItemWrapper = styled.div(
  [column({ small: 1, medium: 1 / 2, desktop: 1 / 3 })],
  css`
    margin-bottom: ${gutters.large}px;
  `
);

const TileBlogCardGridElement = ({ product }: { product: BloggerSearchTypes.SearchBlog }) => {
  const activeLocale = useActiveLocale();
  const image: Image = convertImageWithNumberId(product.image);
  const blogs = constructTileCardBlog(product, activeLocale);
  return (
    <ItemWrapper>
      <TeaserCard {...blogs} image={image} />
    </ItemWrapper>
  );
};
export default TileBlogCardGridElement;
