import React from "react";

import Header from "components/features/Header/MainHeader";
import AttractionContainer from "components/features/Attraction/AttractionContainer";
import getInitialProps from "components/features/Attraction/utils/getInitialProps";

const AttractionPage = ({ slug }: { slug: string }) => {
  return (
    <>
      <Header />
      <AttractionContainer slug={slug} />
    </>
  );
};

AttractionPage.getInitialProps = getInitialProps;

export default AttractionPage;
