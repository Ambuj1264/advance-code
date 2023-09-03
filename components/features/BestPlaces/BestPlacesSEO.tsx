import React from "react";
import { useRouter } from "next/router";

import { constructAlternateCanonical } from "components/features/SEO/utils/SEOUtils";
import SEOContainer from "components/features/SEO/SEOContainer";
import { OpenGraphType } from "types/enums";
import { useSettings } from "contexts/SettingsContext";

const BestPlacesSEO = ({ places, page }: { places: SharedTypes.PlaceProduct[]; page: number }) => {
  const { marketplaceUrl } = useSettings();
  const { asPath } = useRouter();
  const canonicalQueryParams = page > 1 ? `page=${page}` : undefined;
  const images = places.length > 0 ? [places[0].image] : [];
  const alternateCanonicalUrl = constructAlternateCanonical({
    canonicalQueryParamString: canonicalQueryParams,
    asPath,
    marketplaceUrl,
  });

  return (
    <SEOContainer
      isIndexed
      images={images}
      openGraphType={OpenGraphType.WEBSITE}
      canonicalQueryParams={canonicalQueryParams}
      alternateCanonicalUrl={alternateCanonicalUrl}
    />
  );
};

export default BestPlacesSEO;
