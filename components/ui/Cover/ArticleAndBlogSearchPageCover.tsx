import React, { ReactNode } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import { CoverPulse } from "./CoverSkeleton";

import {
  CoverHeader,
  CoverStyled,
  CoverDefaultProps,
} from "components/ui/Cover/CountryAndArticleSearchPagesCover";
import { mqMax } from "styles/base";

const MOBILE_HEIGHT = 290;

const ArticleAndBlogCoverStyled = styled(CoverStyled)<{
  loading?: boolean;
}>(({ loading = false }) => [
  css`
    ${mqMax.large} {
      min-height: ${MOBILE_HEIGHT}px;
    }
  `,
  loading
    ? css`
        ${CoverPulse} {
          ${mqMax.large} {
            min-height: ${MOBILE_HEIGHT}px;
          }
        }
      `
    : "",
]);

const ArticleAndBlogCoverDefaultProps = {
  ...CoverDefaultProps,
  height: MOBILE_HEIGHT,
};

const ArticleAndBlogSearchPageCover = ({
  images,
  title,
  description,
  children,
  loading = false,
}: {
  images: Image[];
  title: string;
  description: string;
  children: ReactNode;
  loading?: boolean;
}) => {
  return (
    <ArticleAndBlogCoverStyled
      {...ArticleAndBlogCoverDefaultProps}
      loading={loading}
      headerComponent={
        <CoverHeader title={title} description={description}>
          {children}
        </CoverHeader>
      }
      imageUrls={images}
      reduceMobileQuality
      alt={title}
    />
  );
};

export default ArticleAndBlogSearchPageCover;
