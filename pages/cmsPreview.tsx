import React from "react";
import { NextPageContext } from "next";

import Header from "components/features/Header/MainHeader";
import usePreview from "hooks/usePreview";
import { setCookie } from "utils/cookieUtils";
import { useClientSideRedirect } from "hooks/useRedirect";
import DefaultPageLoading from "components/ui/Loading/DefaultLoadingPage";

const PreviewPage = ({ to, cookie }: { to: string; cookie?: string }) => {
  const { isValidatingPreview, isInvalidPreview } = usePreview(cookie);
  useClientSideRedirect({
    to,
    condition: !isValidatingPreview && !isInvalidPreview,
  });

  return (
    <>
      <Header />
      <DefaultPageLoading />
    </>
  );
};

PreviewPage.getInitialProps = ({ res, query }: NextPageContext) => {
  const {
    uri,
  }: {
    uri?: string;
  } = query;
  const to = uri && uri !== "null" ? uri : "/";
  setCookie("preview", "1", 0, res);
  return {
    to,
    namespacesRequired: [],
  };
};

export default PreviewPage;
