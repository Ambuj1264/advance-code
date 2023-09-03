import React from "react";
import Head from "next/head";

import { fontsHost } from "styles/fonts";
import { breakpointsMin } from "styles/variables";

const FontContainer = ({ language }: { language: string }) => {
  return (
    <Head>
      {/* 
        Preload fonts 
        Let's schedule a preload for the desired website language first
      */}
      {language === "pl" && (
        <>
          <link
            rel="preload"
            href={`${fontsHost}/fonts/open-sans-v17-latin-ext-regular.woff2`}
            as="font"
            crossOrigin="anonymous"
            media={`(min-width: ${breakpointsMin.large}px)`}
          />
          <link
            rel="preload"
            href={`${fontsHost}/fonts/open-sans-v17-latin-ext-600.woff2`}
            as="font"
            crossOrigin="anonymous"
            media={`(min-width: ${breakpointsMin.large}px)`}
          />
          <link
            rel="preload"
            href={`${fontsHost}/fonts/open-sans-v17-latin-ext-700.woff2`}
            as="font"
            crossOrigin="anonymous"
            media={`(min-width: ${breakpointsMin.large}px)`}
          />
        </>
      )}
      {language === "ru" && (
        <>
          <link
            rel="preload"
            href={`${fontsHost}/fonts/open-sans-v17-cyrillic-regular.woff2`}
            as="font"
            crossOrigin="anonymous"
            media={`(min-width: ${breakpointsMin.large}px)`}
          />
          <link
            rel="preload"
            href={`${fontsHost}/fonts/open-sans-v17-cyrillic-600.woff2`}
            as="font"
            crossOrigin="anonymous"
            media={`(min-width: ${breakpointsMin.large}px)`}
          />
          <link
            rel="preload"
            href={`${fontsHost}/fonts/open-sans-v17-cyrillic-700.woff2`}
            as="font"
            crossOrigin="anonymous"
            media={`(min-width: ${breakpointsMin.large}px)`}
          />
        </>
      )}
      <link
        rel="preload"
        href={`${fontsHost}/fonts/open-sans-v17-latin-regular.woff2`}
        as="font"
        crossOrigin="anonymous"
        media={`(min-width: ${breakpointsMin.large}px)`}
      />
      <link
        rel="preload"
        href={`${fontsHost}/fonts/open-sans-v17-latin-600.woff2`}
        as="font"
        crossOrigin="anonymous"
        media={`(min-width: ${breakpointsMin.large}px)`}
      />
      <link
        rel="preload"
        href={`${fontsHost}/fonts/open-sans-v17-latin-700.woff2`}
        as="font"
        crossOrigin="anonymous"
        media={`(min-width: ${breakpointsMin.large}px)`}
      />
    </Head>
  );
};

export default FontContainer;
