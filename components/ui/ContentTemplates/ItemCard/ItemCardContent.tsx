import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import ItemFacts from "./ItemCardFacts";

import { typographyBody2 } from "styles/typography";
import { gutters, greyColor } from "styles/variables";

const Paragraph = styled.p([
  typographyBody2,
  css`
    margin-top: ${gutters.small / 4}px;
    color: ${greyColor};
  `,
]);

const ItemCardContent = ({ content }: { content: string | SharedTypes.ProductSpec[] }) => {
  return typeof content === "string" ? (
    <Paragraph>{content}</Paragraph>
  ) : (
    <ItemFacts itemFacts={content} />
  );
};

export default ItemCardContent;
