import React, { memo } from "react";

import TopArticleGridList from "./TopArticleGridList";

const TopArticleContainer = ({
  metadata,
  articles,
  loading,
  totalArticles,
  isArticleCategory,
  totalPages,
  currentPage,
}: {
  metadata: SharedTypes.PageSectionMetadata;
  articles: SharedTypes.TopArticle[];
  loading: boolean;
  totalArticles: number;
  isArticleCategory: boolean;
  totalPages: number;
  currentPage: number;
}) => {
  if (totalArticles === 0 && !loading) return null;

  return (
    <TopArticleGridList
      metadata={metadata}
      articles={articles}
      loading={loading}
      isArticleCategory={isArticleCategory}
      totalPages={totalPages}
      currentPage={currentPage}
    />
  );
};

export default memo(TopArticleContainer);
