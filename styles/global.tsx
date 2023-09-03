import { css } from "@emotion/core";

import { TabLabel } from "../components/ui/Tabs/RoundedTabs";

import { mqMax, mqMin, mqPrint } from "./base";
import { placeholderColor, fontFamily, fallbackFontFamily } from "./variables";
import { resetAnchor, resetButton, resetHeading, resetParagraph, resetSelect } from "./reset";
import slickStyles from "./react-slick";
import fonts from "./fonts";

import { TabContent } from "components/ui/SearchWidget/SearchWidgetShared";
import { TitleHolder } from "components/ui/Teaser/variants/TeaserImageTitleOnly";
import SectionSubHeading from "components/ui/Section/SectionSubHeading";
import { ProductPropositionsValue } from "components/ui/ProductPropositions";
import { StyledDescription } from "components/ui/Teaser/variants/TeaserSideCardHorizontal";

const getGlobalStyles = (theme: Theme) => [
  fonts(),
  css`
    /* stylelint-disable selector-max-type */
    html,
    body {
      min-height: 100vh;
      max-height: 100%;
    }

    html,
    input {
      font-family: ${fallbackFontFamily};
      letter-spacing: 0.2px;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;

      ${mqMin.large} {
        font-family: ${fontFamily};
        letter-spacing: normal;
      }
    }

    html {
      box-sizing: border-box;

      -webkit-overflow-scrolling: touch;
      overflow-x: hidden;

      scroll-behavior: auto;
      ${mqPrint} {
        width: 1140px;
        height: 11in;
        zoom: 80%;
      }
    }

    body {
      position: relative;
      margin: 0;

      line-height: 1.5;
      text-size-adjust: 100%; /* iOS on orientation change */
    }

    img {
      display: block;
      width: 100%;
      height: auto;
    }

    *,
    *::before,
    *::after {
      box-sizing: inherit;
    }

    a {
      ${resetAnchor};
    }

    button {
      ${resetButton};

      &:hover:disabled {
        cursor: not-allowed;
      }
    }

    p {
      ${resetParagraph};
    }

    select {
      ${resetSelect};
    }

    ${TabContent} p,
      ${TabContent} span,
      form p,
      form span,
      label,
      input {
      letter-spacing: normal;
    }

    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      ${resetHeading};
    }

    ${mqMax.large} {
      body {
        @supports not (-webkit-touch-callout: none) {
          h1,
          ${ProductPropositionsValue} {
            letter-spacing: 0.3px;
          }
          h2 {
            letter-spacing: 0.1px;
          }
          ${SectionSubHeading} {
            font-size: 15px;
            letter-spacing: 0.1px;
          }
          ${StyledDescription} {
            font-size: 15px;
            letter-spacing: 0.2px;
          }
          ${TabLabel} {
            letter-spacing: 0.4px;
          }
          button[type="submit"] {
            font-size: 17px;
            letter-spacing: 0.5px;
          }
        }

        @supports (-webkit-touch-callout: none) {
          h1,
          ${TitleHolder}, button[type="submit"] {
            letter-spacing: 0.5px;
          }
          ${TabLabel} {
            font-weight: 500;
            letter-spacing: 0.4px;
          }
          ${SectionSubHeading} {
            line-height: 18px;
          }
        }
      }

      input.chunked-scripts-loading {
        opacity: 0.5 !important;
      }
    }

    input,
    textarea,
    select {
      &::-webkit-input-placeholder {
        color: ${placeholderColor};
      }

      &::-moz-placeholder {
        color: ${placeholderColor};
        opacity: 1;
      }

      &:-ms-input-placeholder {
        color: ${placeholderColor};
      }
      &::placeholder {
        color: ${placeholderColor};
      }
    }

    input[type="search"] {
      background-color: white;
    }

    #cookiebanner_v2 .c-button {
      background: ${theme.colors.primary} !important;
    }

    #cookiebanner_v2 .c-link {
      color: ${theme.colors.primary} !important;
    }
  `,
  slickStyles,
  css`
    @page {
      margin-top: 0;
      margin-bottom: 0;
      size: A4;
    }
  `,
];

export default getGlobalStyles;
