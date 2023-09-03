import React, { memo } from "react";

import useAccommodationSearchCategories, {
  HotelSearchCategoriesTypes,
} from "../hooks/useAccommodationSearchCategories";

import AccommodationSearchCategoriesList from "./AccommodationSearchCategoriesList";

import { constructServices } from "components/ui/Search/utils/sharedSearchUtils";
import { PageType } from "types/enums";

const AccommodationSearchTopCategories = ({ slug }: { slug: string }) => {
  const { data, error } = useAccommodationSearchCategories(
    HotelSearchCategoriesTypes.topTypes,
    slug
  );

  if (error || !data || !data.categories?.length || !data.metadata) {
    return null;
  }

  const searchCategories = constructServices(data.categories, PageType.ACCOMMODATION_CATEGORY);

  return (
    <AccommodationSearchCategoriesList
      metadata={data.metadata}
      searchCategories={searchCategories}
      isFirstSection
    />
  );
};

export default memo(AccommodationSearchTopCategories);
