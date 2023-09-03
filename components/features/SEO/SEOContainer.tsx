import React from "react";

import SEO from "components/features/SEO/SEO";
import usePageMetadata from "hooks/usePageMetadata";
import DefaultHeadTags from "lib/DefaultHeadTags";
import { OpenGraphType } from "types/enums";
import { constructImage } from "utils/globalUtils";

const SEOContainer = ({
  isIndexed,
  images,
  openGraphType,
  fallbackMetadata,
  canonicalQueryParams,
  alternateCanonicalUrl,
}: {
  isIndexed: boolean;
  images: Image[];
  openGraphType?: OpenGraphType;
  fallbackMetadata?: PageMetadata;
  canonicalQueryParams?: string;
  alternateCanonicalUrl?: string;
}) => {
  const data = usePageMetadata({ canonicalQueryParams }) || fallbackMetadata;
  // eslint-disable-next-line prefer-destructuring
  const pageMetadata = data?.pageMetadata;
  const ogImage = pageMetadata?.ogImage && [constructImage(pageMetadata.ogImage)];
  const title = pageMetadata?.title || fallbackMetadata?.pageMetadata.title || "";
  const openGraphUrl = pageMetadata?.facebookLikeUrl ? pageMetadata.facebookLikeUrl : undefined;
  return (
    <>
      <DefaultHeadTags title={title} />
      {pageMetadata && (
        <SEO
          title={title}
          description={pageMetadata.description}
          isIndexed={isIndexed && pageMetadata.isIndexed}
          hreflangs={pageMetadata.hreflangs}
          images={ogImage || images}
          openGraphType={openGraphType}
          openGraphUrl={openGraphUrl}
          alternateCanonicalUrl={alternateCanonicalUrl}
        />
      )}
    </>
  );
};

export default SEOContainer;
