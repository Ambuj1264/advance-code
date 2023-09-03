import React from "react";
import { useRouter } from "next/router";

import { getCarMetadataUri } from "./utils/carUtils";

import LazyHydrateWrapper from "components/ui/LazyHydrateWrapper";
import { PageType, LandingPageType, Marketplace, GraphCMSPageType } from "types/enums";
import BreadcrumbsContainer from "components/ui/Breadcrumbs/BreadcrumbsContainer";
import LandingPageBreadcrumbs from "components/ui/LandingPages/LandingPageBreadcrumbs";
import { useSettings } from "contexts/SettingsContext";

const CarBreadcrumbs = ({
  id,
  carName,
  isCarnect,
  searchCategory,
  onProductPage = false,
}: {
  id: string;
  carName: string;
  isCarnect: boolean;
  searchCategory?: CarTypes.SearchCategory;
  onProductPage?: boolean;
}) => {
  const { asPath } = useRouter();
  const { marketplace } = useSettings();
  const numericId = Number(id);
  const isNumericId = !Number.isNaN(Number(id));
  const breadcrumbQueryCondition = {
    pageType: GraphCMSPageType.Cars,
    metadataUri: getCarMetadataUri(asPath),
  };
  return (
    <LazyHydrateWrapper ssrOnly>
      {marketplace === Marketplace.GUIDE_TO_EUROPE ? (
        <LandingPageBreadcrumbs
          queryCondition={breadcrumbQueryCondition}
          customLastBreadcrumb={carName}
          onProductPage={onProductPage}
        />
      ) : (
        <BreadcrumbsContainer
          id={isNumericId ? numericId : undefined}
          type={isCarnect && searchCategory ? PageType.CARSEARCHCATEGORY : PageType.CAR}
          landingPageType={isCarnect && !searchCategory ? LandingPageType.CARS : undefined}
          lastCrumb={isCarnect ? carName : undefined}
          slug={isCarnect && searchCategory ? searchCategory.uri : undefined}
        />
      )}
    </LazyHydrateWrapper>
  );
};

export default CarBreadcrumbs;
