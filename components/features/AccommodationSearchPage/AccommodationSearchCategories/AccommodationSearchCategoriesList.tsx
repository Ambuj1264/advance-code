import React from "react";
import { css } from "@emotion/core";

import TopServices, {
  StyledProductCardLink,
  StyledScrollSnapWrapper,
} from "components/ui/ImageCategoriesGrid";
import { mqMin } from "styles/base";
import { gutters } from "styles/variables";

const MAX_ITEMS = 6;
const MIN_ITEMS = 4;
const CARD_HEIGHT = 153;
const CARD_WIDTH = 300;

const StyledTopServices = css`
  ${StyledScrollSnapWrapper} {
    ${mqMin.desktop} {
      margin-top: ${-gutters.large}px;
      ${StyledProductCardLink} {
        margin-top: ${gutters.large}px;
      }
    }
  }
`;

const AccommodationSearchCategoriesList = ({
  metadata,
  searchCategories,
  isFirstSection,
}: {
  metadata: SharedTypes.QuerySearchMetadata;
  searchCategories: SharedTypes.PageCategoryItemType[];
  isFirstSection?: boolean;
}) => {
  const searchCategoriesLength = searchCategories.length;
  const columnsInRow = Math.min(Math.max(searchCategoriesLength, MIN_ITEMS), MAX_ITEMS);
  return (
    <TopServices
      css={StyledTopServices}
      isFirstSection={isFirstSection}
      metadata={metadata}
      categories={searchCategories}
      cardHeight={CARD_HEIGHT}
      cardWidth={CARD_WIDTH}
      columnSizes={{
        small: 1,
        medium: 1,
        large: 1 / 3,
        desktop: 1 / columnsInRow,
      }}
    />
  );
};

export default AccommodationSearchCategoriesList;
