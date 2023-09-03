import React, { useContext } from "react";
import { css } from "@emotion/core";
import styled from "@emotion/styled";
import Head from "next/head";

import ArticleContext from "components/ui/ArticleLayout/ArticleContext";
import { mediaQuery, mqMin } from "styles/base";
import {
  typographyH3,
  typographyH4,
  typographyH5,
  typographySubtitle1,
  typographySubtitle2,
} from "styles/typography";
import {
  appBarHeight,
  blackColor,
  borderRadiusSmall,
  fontWeightSemibold,
  greyColor,
  gutters,
  guttersPx,
} from "styles/variables";
import { getPageColor } from "components/ui/ArticleLayout/utils/articleLayoutUtils";
import { PageType } from "types/enums";
import { replaceHTML } from "components/ui/ArticleLayout/utils/contentUtils";

const Root = styled.div<{
  pageType?: PageType;
  isFirst?: boolean;
  reducePadding?: boolean;
}>(
  ({ pageType, theme, isFirst, reducePadding }) => css`
    /* stylelint-disable selector-max-type, declaration-bang-space-before */
    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      position: relative;
      clear: both;
    }

    iframe,
    img {
      margin-bottom: ${gutters.small}px;
      border-radius: ${borderRadiusSmall};
    }

    img {
      /* images are clickable - we show gallery on click */
      cursor: pointer;
    }

    h1,
    h2,
    h3,
    h4,
    h5,
    h6,
    li,
    p,
    hr,
    div {
      color: ${greyColor};
      font-family: inherit;
    }

    .iframe-container iframe {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }

    .iframe-container iframe[class$="lazyload"] {
      height: 0;
      overflow: hidden;
    }

    .iframe-container iframe[class$="lazyloaded"] {
      height: 100%;
      overflow: auto;
    }

    /* prevent in-content maps from zooming on page scroll*/
    iframe[data-src*="maps/d/embed"] {
      pointer-events: none;
    }

    table {
      margin-top: ${(gutters.small * 5) / 4}px;
      margin-bottom: ${(gutters.small * 5) / 4}px;
      width: 100% !important;
    }

    /* We need to hide table of content which is inside the page as we are have one on the left side
     * That much attribute to be sure, that we are hiding exact that one */
    table[border="1"][cellpadding="1"][cellspacing="1"] {
      display: none;
    }

    p {
      margin-bottom: ${gutters.small / 2}px;
      line-height: 28px;
    }

    td {
      padding: ${(gutters.small * 5) / 8}px;
    }

    // h2-h5 Headings Should be aligned with UI in admin area
    h2 {
      ${typographyH5};
      margin-top: ${guttersPx.large};
      margin-bottom: ${guttersPx.smallHalf};
      color: ${getPageColor(pageType, theme)};
      ${mqMin.large} {
        ${typographyH3};
        margin-bottom: ${guttersPx.smallHalf};
      }
    }

    h3 {
      margin-top: ${guttersPx.large};
      margin-bottom: ${guttersPx.smallHalf};
      color: ${blackColor};
      font-size: 18px;
      font-weight: ${fontWeightSemibold};
      line-height: 24px;
      ${mqMin.large} {
        ${typographyH4};
        margin-top: ${guttersPx.small};
      }
    }

    h4 {
      ${typographySubtitle1};
      margin-top: ${guttersPx.small};
      margin-bottom: ${guttersPx.small};
      color: ${blackColor};
    }

    h5 {
      ${typographySubtitle2};
      margin-top: 22px;
      margin-bottom: 22px;
      color: ${blackColor};
    }

    a {
      color: ${theme.colors.primary};
      font-weight: ${fontWeightSemibold};
    }

    hr {
      margin-bottom: ${gutters.small}px;
    }

    ul {
      ${mediaQuery({
        paddingLeft: [gutters.large, gutters.large * 2],
      })}
    }

    a.react-gallery-item {
      /* for now in V2 of articles we do nothing if use clicks on image
       * this links are in the content and wrapped around images,
       * they do nothing except showing to the user useless cursor on image - disable pointer
       */
      cursor: auto;
    }

    .iframe-container {
      position: relative;
      display: block;
      margin: ${gutters.small}px auto ${gutters.small}px;
      height: 0;
      padding-bottom: 56.3%;
      cursor: pointer;
      overflow: hidden;

      &:empty {
        display: none;
      }
    }

    .users-anchor {
      position: absolute;
      top: -${appBarHeight}px;
    }

    .lazyContainer {
      margin-top: ${gutters.small}px;
      margin-bottom: ${gutters.small}px;
    }

    .lazyContainer:not(.canceled) {
      position: relative;
      /* to prevent content jumping.
       * calculated approximated ratio for content images of Article pages
       * (height / width) * 100%
       * use to specify similar height of image placeholder and loaded image
       * Note: some loaded image might be cropped on the bottom, but it's not very visible
       */
      padding-bottom: ${reducePadding ? "56%" : "70%"};
      overflow: hidden;

      img {
        position: absolute;
        top: 0;
      }

      img.lazyload {
        width: auto;
        height: 100%;
      }

      img:first-child {
        width: 100%;
      }

      .iframe-container {
        /* fix size of maps which are lazy-loaded */
        position: static;
        /* Due to the fact that it is impossible
         * to get into the parent class and remove extra space.
         * We compensate this with a negative margin.
         */
        margin-bottom: -70.3%;
      }
    }

    /* To keep content columns top margin identical,
     * it is necessary to clear top margin for all first graphic elements
     * such as images, videos, iframes, etc.
     */
    ${isFirst &&
    css`
      & > *:first-child {
        margin-top: 0;

        .iframe-container,
        .lazyContainer {
          margin-top: 0;
        }
      }
    `}
  `
);

type Props = ArticleWidgetTypes.ArticleWidgetHTML & { isFirst?: boolean };

const ArticleWidgetHTML = ({ value, isFirst }: Props) => {
  const { pageType } = useContext(ArticleContext);

  const includesElement = (element: string) => {
    return element.includes('data-src="//www.facebook.com/plugins/video.php?');
  };

  return (
    <>
      <Head>
        <noscript
          // Hide image placeholder when js disabled
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: "<style>.lazyContainer > img { display: none;}</style>",
          }}
        />
      </Head>
      <Root
        dangerouslySetInnerHTML={{ __html: replaceHTML(value) }}
        pageType={pageType}
        isFirst={isFirst}
        reducePadding={includesElement(value)}
      />
    </>
  );
};

export default ArticleWidgetHTML;
