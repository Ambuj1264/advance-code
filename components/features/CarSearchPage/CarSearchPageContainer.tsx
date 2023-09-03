import React from "react";
import { useQuery } from "@apollo/react-hooks";

import AdminGearLoader from "../AdminGear/AdminGearLoader";
import { getCarSearchAndCategoryAdminLinks } from "../AdminGear/utils";

import CarSearchCategoryQuery from "./queries/CarSearchCategoryQuery.graphql";
import { constructCarCategoryInfo, getDefaultLocations } from "./utils/carSearchUtils";

import CarLandingContainer from "components/features/CarSearchPage/CarLandingContainer";
import useActiveLocale from "hooks/useActiveLocale";
import { useSettings } from "contexts/SettingsContext";
import { SearchTabsEnum } from "components/ui/FrontSearchWidget/utils/FrontEnums";
import { FrontSearchStateContext } from "components/ui/FrontSearchWidget/FrontSearchStateContext";
import FrontSearchStateContextProviderContainer from "components/ui/FrontSearchWidget/FrontSearchStateContextProviderContainer";
import { LandingPageType, PageType } from "types/enums";

const CarSearchPageContainer = ({
  slug = "",
  isCarCategory = false,
}: {
  slug?: string;
  isCarCategory?: boolean;
}) => {
  const activeLocale = useActiveLocale();
  const { adminUrl } = useSettings();
  const { data: searchCategoryData } = useQuery<{
    carSearchCategoryByUri?: SharedTypes.QuerySearchCategoryInfo & {
      metadata: SharedTypes.QuerySearchMetadata;
      defaultDropoff?: {
        name: string;
      };
      defaultPickup?: {
        name: string;
      };
      cars: CarSearchTypes.QueryTopCar[];
      reviews: {
        count: number;
        rating: number;
      };
    } & { autoFilter: string };
  }>(CarSearchCategoryQuery, { variables: { slug } });

  const searchCategory = constructCarCategoryInfo(searchCategoryData?.carSearchCategoryByUri);
  const { defaultPickupId, defaultDropoffId } = getDefaultLocations(
    searchCategoryData?.carSearchCategoryByUri?.autoFilter
  );

  const context = {
    activeSearchTab: SearchTabsEnum.Cars,
    carPickupLocationId: defaultPickupId,
    carDropoffLocationId: defaultDropoffId,
    carPickupLocationName: searchCategoryData?.carSearchCategoryByUri?.defaultPickup?.name,
    carDropoffLocationName: searchCategoryData?.carSearchCategoryByUri?.defaultDropoff?.name,
  } as FrontSearchStateContext;

  return (
    <>
      <FrontSearchStateContextProviderContainer context={context}>
        <CarLandingContainer
          slug={slug}
          isCarCategory={isCarCategory}
          topCarsMetadata={searchCategoryData?.carSearchCategoryByUri?.metadata}
          topCars={searchCategoryData?.carSearchCategoryByUri?.cars ?? []}
          searchCategory={searchCategory}
          defaultPickupId={defaultPickupId}
          defaultDropoffId={defaultDropoffId}
        />
      </FrontSearchStateContextProviderContainer>
      <AdminGearLoader
        links={getCarSearchAndCategoryAdminLinks(activeLocale, adminUrl, isCarCategory)}
        landingPageType={LandingPageType.CARS}
        pageType={PageType.CARSEARCHCATEGORY}
        slug={slug}
      />
    </>
  );
};

export default CarSearchPageContainer;
