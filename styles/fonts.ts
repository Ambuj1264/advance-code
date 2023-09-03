import { css } from "@emotion/core";
import getConfig from "next/config";

const { isServerless, RUNTIME_ENV } = getConfig().publicRuntimeConfig;

export const fontsHost = isServerless || RUNTIME_ENV ? "" : "https://assets.web.prod.tshiftcdn.com";

/**
 * order and unicode-range of fonts is the same as here:
 * https://fonts.googleapis.com/css2?family=Open+Sans:wght@600
 */
const fonts = () => css`
  /* cyrillic */
  @font-face {
    font-family: "Open Sans";
    font-style: normal;
    font-weight: 400;
    font-display: swap;
    src: local("Open Sans Regular"), local("OpenSans-Regular"),
      url(${fontsHost}/fonts/open-sans-v17-cyrillic-regular.woff2) format("woff2"),
      url(${fontsHost}/fonts/open-sans-v17-cyrillic-regular.woff) format("woff");
    unicode-range: U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
  }

  /* cyrillic */
  @font-face {
    font-family: "Open Sans";
    font-style: normal;
    font-weight: 600;
    font-display: swap;
    src: local("Open Sans SemiBold"), local("OpenSans-SemiBold"),
      url(${fontsHost}/fonts/open-sans-v17-cyrillic-600.woff2) format("woff2"),
      url(${fontsHost}/fonts/open-sans-v17-cyrillic-600.woff) format("woff");
    unicode-range: U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
  }

  /* cyrillic */
  @font-face {
    font-family: "Open Sans";
    font-style: normal;
    font-weight: 700;
    font-display: swap;
    src: local("Open Sans Bold"), local("OpenSans-Bold"),
      url(${fontsHost}/fonts/open-sans-v17-cyrillic-700.woff2) format("woff2"),
      url(${fontsHost}/fonts/open-sans-v17-cyrillic-700.woff) format("woff");
    unicode-range: U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
  }

  /* latin-ext */
  @font-face {
    font-family: "Open Sans";
    font-style: normal;
    font-weight: 400;
    font-display: swap;
    src: local("Open Sans Regular"), local("OpenSans-Regular"),
      url(${fontsHost}/fonts/open-sans-v17-latin-ext-regular.woff2) format("woff2"),
      url(${fontsHost}/fonts/open-sans-v17-latin-ext-regular.woff) format("woff");
    unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113,
      U+2C60-2C7F, U+A720-A7FF;
  }

  /* latin-ext */
  @font-face {
    font-family: "Open Sans";
    font-style: normal;
    font-weight: 600;
    font-display: swap;
    src: local("Open Sans SemiBold"), local("OpenSans-SemiBold"),
      url(${fontsHost}/fonts/open-sans-v17-latin-ext-600.woff2) format("woff2"),
      url(${fontsHost}/fonts/open-sans-v17-latin-ext-600.woff) format("woff");
    unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113,
      U+2C60-2C7F, U+A720-A7FF;
  }

  /* latin-ext */
  @font-face {
    font-family: "Open Sans";
    font-style: normal;
    font-weight: 700;
    font-display: swap;
    src: local("Open Sans Bold"), local("OpenSans-Bold"),
      url(${fontsHost}/fonts/open-sans-v17-latin-ext-700.woff2) format("woff2"),
      url(${fontsHost}/fonts/open-sans-v17-latin-ext-700.woff) format("woff");
    unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113,
      U+2C60-2C7F, U+A720-A7FF;
  }

  /* latin */
  @font-face {
    font-family: "Open Sans";
    font-style: normal;
    font-weight: 400;
    font-display: swap;
    src: local("Open Sans Regular"), local("OpenSans-Regular"),
      url(${fontsHost}/fonts/open-sans-v17-latin-regular.woff2) format("woff2"),
      url(${fontsHost}/fonts/open-sans-v17-latin-regular.woff) format("woff");
    unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC,
      U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
  }

  /* latin */
  @font-face {
    font-family: "Open Sans";
    font-style: normal;
    font-weight: 600;
    font-display: swap;
    src: local("Open Sans SemiBold"), local("OpenSans-SemiBold"),
      url(${fontsHost}/fonts/open-sans-v17-latin-600.woff2) format("woff2"),
      url(${fontsHost}/fonts/open-sans-v17-latin-600.woff) format("woff");
    unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC,
      U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
  }

  /* latin */
  @font-face {
    font-family: "Open Sans";
    font-style: normal;
    font-weight: 700;
    font-display: swap;
    src: local("Open Sans Bold"), local("OpenSans-Bold"),
      url(${fontsHost}/fonts/open-sans-v17-latin-700.woff2) format("woff2"),
      url(${fontsHost}/fonts/open-sans-v17-latin-700.woff) format("woff");
    unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC,
      U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
  }
`;

export default fonts;
