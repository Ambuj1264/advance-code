import React, { useCallback } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import Section from "../Section/Section";
import SectionHeading from "../Section/SectionHeading";
import SectionSubHeading from "../Section/SectionSubHeading";
import ContentCarousel from "../ContentCarousel";
import ErrorBoundary from "../ErrorBoundary";
import Row from "../Grid/Row";
import { ImageCategoriesItem } from "../ImageCategoriesGrid";
import { DesktopContentWrapper, MobileContentWrapper } from "../utils/uiUtils";

import { mqMin } from "styles/base";
import { gutters } from "styles/variables";
import ScrollSnapWrapper from "components/ui/ScrollSnapWrapper";

const StyledRow = styled(Row)`
  flex-wrap: nowrap;
`;

const SectionContentWrapper = styled.div`
  margin-top: ${gutters.large}px;
`;

const StyledImageCategoriesItem = styled(ImageCategoriesItem)<{
  isVisible?: boolean;
}>(
  ({ isVisible = true }) => css`
    display: ${isVisible ? "block" : "none"};

    ${mqMin.desktop} {
      min-width: unset;
    }
  `
);

export const ITEMS_PER_PAGE = 8;

const TopServicesWithCarousel = ({
  className,
  isFirstSection,
  metadata,
  categories,
  columnSizes = { small: 1 / 2, large: 1 / 4, desktop: 1 / 8 },
  cardHeight,
  isSmallTitle = true,
}: {
  className?: string;
  isFirstSection?: boolean;
  metadata: SharedTypes.PageCategoriesMetaType;
  categories: SharedTypes.PageCategoryItemType[];
  columnSizes?: SharedTypes.ColumnSizes;
  cardHeight?: number;
  isSmallTitle?: boolean;
}) => {
  const categoriesLength = categories.length;
  const itemsPerPage = Math.min(categoriesLength, ITEMS_PER_PAGE);
  const renderCarouselContent = useCallback(
    (firstIndexOfPage, lastIndexOfPage) =>
      categories.map((service, index) => (
        <StyledImageCategoriesItem
          key={service.title}
          service={service}
          isSmallTitle={isSmallTitle}
          cardHeight={cardHeight}
          columnSizes={{
            ...columnSizes,
            desktop: 1 / itemsPerPage,
          }}
          isVisible={index >= firstIndexOfPage && index <= lastIndexOfPage}
        />
      )),
    [cardHeight, categories, columnSizes, isSmallTitle, itemsPerPage]
  );

  return (
    <ErrorBoundary>
      <Section className={className} isFirstSection={isFirstSection}>
        <SectionHeading>{metadata.title}</SectionHeading>
        {metadata.subtitle && <SectionSubHeading>{metadata.subtitle}</SectionSubHeading>}
        <SectionContentWrapper>
          <MobileContentWrapper>
            <ScrollSnapWrapper needResetMinWidth={false}>
              {categories.map(service => (
                <StyledImageCategoriesItem
                  key={`${service.title}Mobile`}
                  service={service}
                  cardHeight={cardHeight}
                  isSmallTitle={isSmallTitle}
                  columnSizes={columnSizes}
                />
              ))}
            </ScrollSnapWrapper>
          </MobileContentWrapper>
          <DesktopContentWrapper>
            <ContentCarousel
              totalItems={categories.length}
              itemsPerPage={itemsPerPage}
              fixedHeight={cardHeight}
              ContentWrapper={StyledRow}
              renderCarouselContent={renderCarouselContent}
            />
          </DesktopContentWrapper>
        </SectionContentWrapper>
      </Section>
    </ErrorBoundary>
  );
};

export default React.memo(TopServicesWithCarousel);
