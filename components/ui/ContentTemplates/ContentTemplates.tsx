import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import ItemCard, { Carousel } from "./ItemCard/ItemCard";
import ItemCardContent from "./ItemCard/ItemCardContent";

import { mqMin } from "styles/base";
import { gutters } from "styles/variables";
import Column from "components/ui/Grid/Column";
import Row from "components/ui/Grid/Row";

const ColumnStyles = css`
  display: flex;
  margin-top: ${gutters.small}px;

  ${mqMin.large} {
    margin-top: ${gutters.large}px;
  }
`;

const StyledItemCard = styled(ItemCard)<{
  isSingleItem: boolean;
}>(
  ({ isSingleItem }) =>
    css`
      ${Carousel} {
        img {
          height: ${isSingleItem ? 272 : 210}px;
        }
      }
    `
);

const ContentTemplates = ({
  id,
  items,
  columns,
  className,
  hideModalGallery = false,
}: {
  id?: string;
  items: SharedTypes.ItemCardContent[];
  columns: SharedTypes.Columns;
  className?: string;
  hideModalGallery?: boolean;
}) => (
  <Row className={className}>
    {items.map((item: SharedTypes.ItemCardContent) => (
      <Column key={item.id} columns={columns} css={ColumnStyles}>
        <StyledItemCard
          id={`${id || item.id}${item.name}`}
          name={item.name}
          images={item.images}
          isSingleItem={items.length === 1}
          additionalInformation={item?.additionalInformation}
          hideModalGallery={hideModalGallery}
        >
          {item.information && <ItemCardContent content={item.information} />}
        </StyledItemCard>
      </Column>
    ))}
  </Row>
);

export default ContentTemplates;
