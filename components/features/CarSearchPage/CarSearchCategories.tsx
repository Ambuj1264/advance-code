import React from "react";
import { useQuery } from "@apollo/react-hooks";

import CarSearchCategoriesQuery from "./queries/CarSearchCategoriesQuery.graphql";

import TopServices from "components/ui/ImageCategoriesGrid";
import { PageType } from "types/enums";
import { constructServices } from "components/ui/Search/utils/sharedSearchUtils";

const CarSearchCategories = () => {
  const { data, error } =
    useQuery<CarSearchTypes.QueryCarSearchCategories>(CarSearchCategoriesQuery);
  if (error || !data) return null;
  const searchCategories = constructServices(
    data.carTopTypes.searchCategories,
    PageType.CARCATEGORY
  );
  return (
    <TopServices
      categories={searchCategories}
      metadata={data.carTopTypes.metadata}
      columnSizes={{ small: 1, large: 1 / searchCategories.length }}
      isFirstSection
    />
  );
};

export default CarSearchCategories;
