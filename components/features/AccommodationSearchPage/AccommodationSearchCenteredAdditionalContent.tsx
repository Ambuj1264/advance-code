import React from "react";

import SearchPageFAQContainer from "components/features/SearchPage/SearchPageFAQContainer";
import InformationContainer from "components/ui/Search/InformationContainer";
import { PageType, LandingPageType } from "types/enums";
import LazyHydrateWrapper from "components/ui/LazyHydrateWrapper";

const AccommodationSearchCenteredAdditionalContent = ({
  isAccommodationCategory,
  slug,
  informationTitle,
  information,
}: {
  isAccommodationCategory: boolean;
  slug: string;
  informationTitle?: string;
  information: string;
}) => {
  return (
    <LazyHydrateWrapper ssrOnly>
      {informationTitle && (
        <InformationContainer title={informationTitle} description={information} />
      )}
      <SearchPageFAQContainer
        landingPage={isAccommodationCategory ? undefined : LandingPageType.HOTELS}
        pageType={isAccommodationCategory ? PageType.HOTELSEARCHCATEGORY : undefined}
        slug={slug}
      />
    </LazyHydrateWrapper>
  );
};

export default AccommodationSearchCenteredAdditionalContent;
