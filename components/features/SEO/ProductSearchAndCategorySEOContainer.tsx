import React from "react";
import { useRouter } from "next/router";

import { constructSEOProduct, constructAlternateCanonical } from "./utils/SEOUtils";

import ProductCarouselSchema from "components/features/SEO/ProductCarouselSchema";
import SEOContainer from "components/features/SEO/SEOContainer";
import { OpenGraphType } from "types/enums";
import { useSettings } from "contexts/SettingsContext";
import LazyHydrateWrapper from "components/ui/LazyHydrateWrapper";

const ProductSearchAndCategorySEOContainer = ({
  isIndexed,
  products = [],
  coverImage,
  canonicalQueryParams,
  fallbackTitle,
}: {
  isIndexed: boolean;
  products?: SharedTypes.Product[];
  coverImage?: Image;
  canonicalQueryParams?: string;
  fallbackTitle?: string;
}) => {
  const ogImage = coverImage || products[0]?.image;
  const images = ogImage ? [ogImage] : [];
  const { websiteName, marketplaceUrl } = useSettings();
  const { asPath } = useRouter();

  const alternateCanonicalUrl = constructAlternateCanonical({
    canonicalQueryParamString: canonicalQueryParams,
    asPath,
    marketplaceUrl,
  });
  return (
    <>
      <SEOContainer
        isIndexed={isIndexed}
        images={images}
        openGraphType={OpenGraphType.WEBSITE}
        fallbackMetadata={{
          pageMetadata: {
            title: fallbackTitle || websiteName,
            isIndexed: false,
            hreflangs: [],
            ogImage: ogImage
              ? {
                  ...ogImage,
                  id: Number(ogImage.id),
                }
              : {
                  id: 0,
                  url: "",
                },
          },
        }}
        canonicalQueryParams={canonicalQueryParams}
        alternateCanonicalUrl={alternateCanonicalUrl}
      />
      {isIndexed && products.length > 0 && (
        <LazyHydrateWrapper ssrOnly>
          <ProductCarouselSchema products={constructSEOProduct(products)} />
        </LazyHydrateWrapper>
      )}
    </>
  );
};

export default ProductSearchAndCategorySEOContainer;
