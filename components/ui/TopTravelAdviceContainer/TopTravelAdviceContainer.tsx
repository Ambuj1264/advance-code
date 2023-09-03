import React, { useState, useCallback } from "react";
import styled from "@emotion/styled";

import { GridColumn, OneLineColumn, StyledScrollSnapWrapper } from "./TopTravelAdviceShared";
import TopTravelAdviceSkeleton from "./TopTravelAdviceSkeleton";
import TeaserCard from "./TeaserCard";

import { getTotalPages } from "utils/helperUtils";
import SectionRow from "components/ui/Section/SectionRow";
import { useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";
import { convertImageWithNumberId } from "utils/imageUtils";
import PaginatedContent from "components/ui/PaginatedContent/PaginatedContent";
import PaginatedContentSkeleton from "components/ui/PaginatedContent/PaginatedContentSkeleton";
import { PageType } from "types/enums";

const articlesOnPage = 6;

const StyledOneLineColumn = styled(OneLineColumn)`
  a {
    max-width: 212px;
  }
`;
const ArticleGrid = ({
  articles,
  metadata,
  isGrid,
  pageType,
}: {
  articles: SharedTypes.TopArticle[];
  metadata: SharedTypes.PageSectionMetadata;
  isGrid: boolean;
  pageType: PageType;
}) => {
  const { t } = useTranslation(Namespaces.countryNs);
  const ColumnComponent = isGrid ? GridColumn : StyledOneLineColumn;
  if (articles.length === 0) return null;
  return (
    <SectionRow
      title={metadata.title}
      subtitle={metadata.subtitle}
      categoryLink={metadata.url}
      categoryLinkTitle={t("See all travel information")}
      CustomRowWrapper={StyledScrollSnapWrapper}
      isLegacyRoute
    >
      {articles.map(article => {
        const image: Image = convertImageWithNumberId(article.image);

        return (
          <ColumnComponent key={article.id}>
            <TeaserCard {...article} image={image} pageType={pageType} />
          </ColumnComponent>
        );
      })}
    </SectionRow>
  );
};
const TopTravelAdviceContainer = ({
  articles,
  metadata,
  loading = false,
  isGrid = false,
  usePagination = false,
  pageType,
}: {
  articles: SharedTypes.TopArticle[];
  metadata: SharedTypes.PageSectionMetadata;
  loading?: boolean;
  isGrid?: boolean;
  usePagination?: boolean;
  pageType: PageType;
}) => {
  const [travelAdvicePage, setTravelAdvicePage] = useState(1);
  const totalPages = getTotalPages(articles.length, articlesOnPage);
  const pageChangeHandler = useCallback(({ current }) => {
    setTravelAdvicePage(current);
  }, []);

  if (!usePagination) {
    return loading ? (
      <TopTravelAdviceSkeleton isGrid={isGrid} categoryLink={metadata.url} />
    ) : (
      <ArticleGrid articles={articles} metadata={metadata} isGrid={isGrid} pageType={pageType} />
    );
  }

  const slicedArticles = articles.slice(
    (travelAdvicePage - 1) * articlesOnPage,
    travelAdvicePage * articlesOnPage
  );

  return loading ? (
    <PaginatedContentSkeleton>
      <TopTravelAdviceSkeleton isGrid={isGrid} categoryLink={metadata.url} />
    </PaginatedContentSkeleton>
  ) : (
    <PaginatedContent
      name="travelAdvicePage"
      isLoading={false}
      initialPage={travelAdvicePage}
      totalPages={totalPages}
      onPageChange={pageChangeHandler}
    >
      <ArticleGrid
        articles={slicedArticles}
        metadata={metadata}
        isGrid={isGrid}
        pageType={pageType}
      />
    </PaginatedContent>
  );
};

export default TopTravelAdviceContainer;
