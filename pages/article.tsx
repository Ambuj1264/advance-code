import React from "react";

import Header from "components/features/Header/MainHeader";
import ArticleContainer from "components/features/Article/ArticleContainer";
import { getArticlePageInitialProps } from "components/features/Article/utils/getInitialProps";

const ArticlePage = ({ slug, categorySlug }: { slug: string; categorySlug: string }) => {
  return (
    <>
      <Header />
      <ArticleContainer slug={slug} categorySlug={categorySlug} />
    </>
  );
};

ArticlePage.getInitialProps = getArticlePageInitialProps;

export default ArticlePage;
