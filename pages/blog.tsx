import React from "react";

import Header from "components/features/Header/MainHeader";
import BlogContainer from "components/features/Blog/BlogContainer";
import getInitialProps from "components/features/Blog/utils/getInitialProps";

const BlogPage = ({ slug }: { slug: string }) => {
  return (
    <>
      <Header />
      <BlogContainer slug={slug} />
    </>
  );
};

BlogPage.getInitialProps = getInitialProps;

export default BlogPage;
