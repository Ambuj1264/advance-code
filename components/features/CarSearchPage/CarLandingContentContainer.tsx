import React from "react";
import { useRouter } from "next/router";

import CarSearchAdditionalContent from "./CarSearchAdditionalContent";
import CarSearchCenteredAdditionalContent from "./CarSearchCenteredAdditionalContent";

import FrontValuePropositions from "components/ui/FrontValuePropositions/FrontValuePropositions";
import FrontCover from "components/ui/Cover/FrontCover/FrontCover";
import FrontSearchWidgetContainer from "components/ui/FrontSearchWidget/FrontSearchWidgetContainer";
import { PageType } from "types/enums";
import { cleanAsPathWithLocale } from "utils/routerUtils";
import FrontMobileFooterContainer from "components/ui/FrontSearchWidget/FrontMobileFooterContainer";
import FrontMobileStepsContainer from "components/ui/FrontSearchWidget/FrontMobileStepsContainer";
import LandingHeaderWrapper from "components/ui/Search/LandingHeaderWrapper";

const CarLandingContainer = ({
  slug,
  isCarCategory,
  searchCategory,
  topCars,
  topCarsMetadata,
}: {
  slug: string;
  isCarCategory: boolean;
  searchCategory: SharedTypes.SearchCategoryInfo;
  topCars: CarSearchTypes.QueryTopCar[];
  topCarsMetadata?: SharedTypes.QuerySearchMetadata;
}) => {
  const { asPath } = useRouter();

  const pageType = isCarCategory ? PageType.CARCATEGORY : PageType.CARSEARCH;
  const activeServices = [
    {
      isLegacy: false,
      pageType: pageType as string,
      title: "Find a car",
      uri: cleanAsPathWithLocale(asPath),
    },
  ];
  return (
    <>
      <LandingHeaderWrapper isShow>
        <FrontCover
          images={[searchCategory.cover.image]}
          title={searchCategory.cover.name}
          description={searchCategory.cover.description || ""}
          hasBreadcrumbs
        >
          <FrontSearchWidgetContainer
            activeServices={activeServices}
            runTabChangeOnMount={false}
            hideTabs
          />
        </FrontCover>
      </LandingHeaderWrapper>
      <FrontValuePropositions />
      <FrontMobileStepsContainer activeServices={activeServices} />
      <CarSearchAdditionalContent slug={slug} topCars={topCars} topCarsMetadata={topCarsMetadata} />
      <CarSearchCenteredAdditionalContent
        slug={slug}
        informationTitle={searchCategory.informationTitle}
        information={searchCategory.information}
      />
      <FrontMobileFooterContainer activeServices={activeServices} />
    </>
  );
};

export default CarLandingContainer;
