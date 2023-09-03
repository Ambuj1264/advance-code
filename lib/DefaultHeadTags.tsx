/* eslint-disable react/no-danger */
import React from "react";
import Head from "next/head";
import { useTheme } from "emotion-theming";

import PWAMetaTags from "./PWAMetaTags";

import FontContainer from "components/features/App/FontContainer";
import { useSettings } from "contexts/SettingsContext";
import useActiveLocale from "hooks/useActiveLocale";

const DefaultHeadTags = ({ title }: { title?: string }) => {
  const activeLocale = useActiveLocale();
  const theme: Theme = useTheme();
  const { imageHostingUrl, marketplace } = useSettings();
  return (
    <>
      <Head>
        {typeof window === "undefined" && <meta charSet="utf-8" key="charSet" />}
        <meta name="viewport" content="width=device-width, initial-scale=1.0" key="viewport" />
        {title && <title key="title">{title}</title>}
        <meta name="google" content="notranslate" />
        <meta httpEquiv="Accept-CH" content="DPR, Viewport-Width, Width" />
        <link rel="alternate" type="application/atom+xml" href="/feed.atom" title="Atom Feed" />
      </Head>
      <PWAMetaTags marketplace={marketplace} theme={theme} />
      <FontContainer language={activeLocale} />
      <Head>
        {/* Preconnect hints */}
        {imageHostingUrl && (
          <link rel="preconnect" href={imageHostingUrl} crossOrigin="anonymous" />
        )}
        <link rel="dns-prefetch" href="https://stats.g.doubleclick.net" />
        <link rel="dns-prefetch" href="https://www.google.is" />
        <link rel="dns-prefetch" href="https://www.google.com" />
        {/* 3rd party scripts */}
        {/* Add polyfill for Intl in the current locale which is used by 18next-icu */}
        {typeof window === "undefined" && (
          <script
            type="text/javascript"
            src={`https://polyfill.io/v3/polyfill.min.js?flags=gated&version=3.89.4&features=AbortController%2CDocumentFragment.prototype.append%2CElement.prototype.append%2CString.prototype.normalize%2Ces2015%2Ces2016%2Ces2017%2CObject.values%2CDOMTokenList.prototype.%40%40iterator%2CResizeObserver%2CIntersectionObserver%2CURLSearchParams%2CIntl.~locale.${activeLocale.substr(
              0,
              2
            )}`}
            defer={"defer" as never}
          />
        )}
      </Head>
    </>
  );
};

export default DefaultHeadTags;
