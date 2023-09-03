import React from "react";

import Header from "components/features/Header/MainHeader";
import { getInitialProps } from "components/features/BloggerSearch/utils/bloggerSearchUtils";
import { LandingPageType } from "types/enums";
import BloggerSearchContainer from "components/features/BloggerSearch/BloggerSearchContainer";
import QueryParamProvider from "components/ui/Filters/QueryParamProvider";

const BloggerSearchPage = () => {
  return (
    <>
      <Header />
      <QueryParamProvider>
        <BloggerSearchContainer />
      </QueryParamProvider>
    </>
  );
};

BloggerSearchPage.getInitialProps = getInitialProps({
  landingPageType: LandingPageType.TRAVELSEARCH,
});

export default BloggerSearchPage;
