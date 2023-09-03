import React from "react";

import {
  isGTELanguageIndexed,
  getMetadataTitle,
  constructCommonLandingHreflangs,
} from "components/ui/utils/uiUtils";
import useActiveLocale from "hooks/useActiveLocale";
import { defaultSEOImage } from "components/ui/LandingPages/utils/landingPageUtils";
import SEO from "components/features/SEO/SEO";
import { useSettings } from "contexts/SettingsContext";
import { GraphCMSPageType, Marketplace, OpenGraphType } from "types/enums";
import DefaultHeadTags from "lib/DefaultHeadTags";
import { decodeHTMLTitle } from "utils/helperUtils";

const GraphCmsSEOContainer = ({
  metadata,
  isIndexed = true,
  ogImages,
  openGraphType,
  funnelType,
  pagePlace,
}: {
  metadata: LandingPageTypes.Metadata;
  isIndexed?: boolean;
  ogImages?: Image[];
  openGraphType: OpenGraphType;
  funnelType?: GraphCMSPageType;
  pagePlace?: LandingPageTypes.Place;
}) => {
  const { websiteName, marketplaceUrl, marketplace } = useSettings();
  const { metadataTitle, metadataDescription, hreflangs, images, canonicalUri, review } = metadata;
  const isGTE = marketplace === Marketplace.GUIDE_TO_EUROPE;
  const locale = useActiveLocale();
  const title = getMetadataTitle(metadataTitle, websiteName);
  const decodedTitle = decodeHTMLTitle(title);
  const constructedHreflangs = constructCommonLandingHreflangs(
    hreflangs || [],
    marketplaceUrl,
    marketplace
  );
  const seoImages = ogImages || images || [defaultSEOImage];
  return (
    <>
      <DefaultHeadTags title={decodedTitle} />
      <SEO
        isIndexed={isGTE ? isGTELanguageIndexed(locale, isIndexed) : isIndexed}
        images={seoImages}
        hreflangs={constructedHreflangs}
        title={title}
        description={metadataDescription}
        openGraphType={openGraphType}
        alternateCanonicalUrl={`${marketplaceUrl}${canonicalUri === "/" ? "" : canonicalUri}`}
        placeInfo={pagePlace}
        funnelType={funnelType}
        review={review}
      />
    </>
  );
};

export default GraphCmsSEOContainer;
