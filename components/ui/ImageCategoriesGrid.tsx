import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import ClientLinkPrefetch from "./ClientLinkPrefetch";

import { gutters } from "styles/variables";
import { isProd } from "utils/globalUtils";
import { getProductSlugFromHref } from "utils/routerUtils";
import ScrollSnapWrapper from "components/ui/ScrollSnapWrapper";
import TeaserImageTitleOnly, {
  TitleHolder,
} from "components/ui/Teaser/variants/TeaserImageTitleOnly";
import { column, mqMin, mqMax } from "styles/base";
import SectionRow from "components/ui/Section/SectionRow";
import { TeaserVariant } from "types/enums";

export const StyledScrollSnapWrapper = styled(ScrollSnapWrapper)`
  ${mqMin.large} {
    flex-wrap: wrap;
  }
`;

export const imageCategoryGridStyles = css`
  ${mqMax.large} {
    &:last-of-type {
      padding-right: ${gutters.small}px;
    }
  }
  ${mqMin.medium} {
    min-width: 280px;
  }
  ${mqMin.large} {
    &:nth-of-type(-n + 4) {
      margin-bottom: ${gutters.small}px;
    }
  }
  ${mqMin.desktop} {
    &:nth-of-type(-n + 4) {
      margin-bottom: 0;
    }
  }
`;

export const StyledProductCardLink = styled(ClientLinkPrefetch)<{
  columnSizes: SharedTypes.ColumnSizes;
}>(({ columnSizes }) => [
  column(columnSizes),
  imageCategoryGridStyles,
  css`
    ${TitleHolder} {
      padding-right: ${gutters.small / 3}px;
      padding-left: ${gutters.small / 3}px;
    }
  `,
]);

export const ImageCategoriesItem = ({
  service,
  columnSizes = { small: 1 / 2, large: 1 / 4, desktop: 1 / 8 },
  cardHeight,
  cardWidth,
  isSmallTitle,
  className,
  imgixParams,
  dataTestid,
}: {
  service: SharedTypes.PageCategoryItemType;
  columnSizes?: SharedTypes.ColumnSizes;
  cardHeight?: number;
  cardWidth?: number;
  isSmallTitle?: boolean;
  className?: string;
  imgixParams?: SharedTypes.ImgixParams;
  dataTestid?: string;
}) => {
  const { image } = service;
  const shouldUseRegularLink = service.isLegacy && isProd();

  return (
    <StyledProductCardLink
      className={className}
      linkUrl={service.uri}
      columnSizes={columnSizes}
      key={service.pageType}
      clientRoute={
        service.clientRoute || !shouldUseRegularLink
          ? {
              query: {
                slug: getProductSlugFromHref(service.uri),
              },
              as: service.uri,
              route: `/${service.pageType}`,
            }
          : undefined
      }
      title={service.title}
      // dataTestid={service.title}
      dataTestid={dataTestid}
    >
      <TeaserImageTitleOnly
        variant={TeaserVariant.IMAGE_TITLE_ONLY}
        url={service.uri}
        image={{ ...image, name: service.title }}
        title={service.title}
        city={service.city}
        smallTitle={isSmallTitle}
        height={cardHeight}
        width={cardWidth}
        imgixParams={imgixParams}
      />
    </StyledProductCardLink>
  );
};

const ImageCategoriesGrid = ({
  className,
  isFirstSection,
  metadata,
  categories,
  columnSizes,
  cardHeight,
  cardWidth,
  isSmallTitle = true,
  imgixParams,
  dataTestid,
}: {
  className?: string;
  isFirstSection?: boolean;
  metadata: SharedTypes.PageCategoriesMetaType;
  categories: SharedTypes.PageCategoryItemType[];
  columnSizes?: SharedTypes.ColumnSizes;
  cardHeight?: number;
  cardWidth?: number;
  isSmallTitle?: boolean;
  imgixParams?: SharedTypes.ImgixParams;
  dataTestid?: string;
}) => (
  <SectionRow
    title={metadata.title}
    subtitle={metadata.subtitle}
    CustomRowWrapper={StyledScrollSnapWrapper}
    className={className}
    isFirstSection={isFirstSection}
    dataTestid={dataTestid}
  >
    {categories.map((service, index) => (
      <ImageCategoriesItem
        key={service.id}
        service={service}
        columnSizes={columnSizes}
        cardHeight={cardHeight}
        cardWidth={cardWidth}
        isSmallTitle={isSmallTitle}
        imgixParams={imgixParams}
        dataTestid={`top-services-itesms-${index}`}
      />
    ))}
  </SectionRow>
);

export default React.memo(ImageCategoriesGrid);
