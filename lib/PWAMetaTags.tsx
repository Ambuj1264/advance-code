import React from "react";
import Head from "next/head";
import getConfig from "next/config";

import { Marketplace } from "types/enums";

const { isServerless, assetPrefix } = getConfig().publicRuntimeConfig;

const PWAMetaTags = ({ marketplace, theme }: { marketplace: string; theme: Theme }) => {
  const overrideIconMarketplace =
    marketplace.includes("traveldev") ||
    marketplace.includes("uniquetrips") ||
    marketplace === "guidetoiceland" // staging.guidetoiceland.is
      ? Marketplace.GUIDE_TO_ICELAND
      : marketplace;
  const staticCdnUrl = process.env.NODE_ENV === "production" && !isServerless ? "" : assetPrefix;
  return (
    <Head>
      <meta
        name="msapplication-config"
        content={`${staticCdnUrl}/_next/static/browserconfig-${overrideIconMarketplace}.xml`}
      />
      <link rel="manifest" href={`/_next/static/manifest-${overrideIconMarketplace}.json`} />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href={`${staticCdnUrl}/_next/static/icons/${overrideIconMarketplace}-favicon-32x32.png`}
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href={`${staticCdnUrl}/_next/static/icons/${overrideIconMarketplace}-favicon-16x16.png`}
      />
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href={`${staticCdnUrl}/_next/static/icons/${overrideIconMarketplace}-apple-touch-icon.png`}
      />
      <meta name="theme-color" content={`${theme.colors.primary}`} />
      <link
        rel="mask-icon"
        href={`${staticCdnUrl}/_next/static/icons/${overrideIconMarketplace}-travelmarketplaces-com-safari-pinned-tab.svg`}
        color={`${theme.colors.primary}`}
      />
    </Head>
  );
};

export default PWAMetaTags;
