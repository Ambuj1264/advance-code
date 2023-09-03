import React from "react";

import SearchPageFAQContainer from "components/features/SearchPage/SearchPageFAQContainer";
import InformationContainer from "components/ui/Search/InformationContainer";
import { LandingPageType, PageType } from "types/enums";
import LazyHydrateWrapper from "components/ui/LazyHydrateWrapper";

const CarSearchCenteredAdditionalContent = ({
  slug,
  informationTitle,
  information,
}: {
  slug: string;
  informationTitle?: string;
  information: string;
}) => {
  return (
    <LazyHydrateWrapper ssrOnly>
      {informationTitle && (
        <InformationContainer
          title={informationTitle}
          description={information}
          clampTextExtraHeight={62}
        />
      )}
      <SearchPageFAQContainer
        landingPage={LandingPageType.CARS}
        pageType={PageType.CARSEARCHCATEGORY}
        slug={slug}
      />
    </LazyHydrateWrapper>
  );
};

export default CarSearchCenteredAdditionalContent;
