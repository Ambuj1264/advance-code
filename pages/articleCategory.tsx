import React from "react";

import Header from "components/features/Header/MainHeader";
import ArticleSearchContainer from "components/features/Article/ArticleSearchContainer";
import QueryParamProvider from "components/ui/Filters/QueryParamProvider";
import { getArticleSearchInitialProps } from "components/features/Article/utils/getInitialProps";

const ArticleCategoryPage = ({ slug }: { slug: string }) => {
  return (
    <>
      <Header />
      <QueryParamProvider>
        <ArticleSearchContainer slug={slug} isArticleCategory />
      </QueryParamProvider>
    </>
  );
};

ArticleCategoryPage.getInitialProps = getArticleSearchInitialProps({
  isArticleCategory: true,
});

export default ArticleCategoryPage;
