import React from "react";
import { useQuery } from "@apollo/react-hooks";

import CarSearchLinkedCategoriesQuery from "./queries/CarSearchLinkedCategoriesQuery.graphql";

import TopServices from "components/ui/ImageCategoriesGrid";
import { constructServices } from "components/ui/Search/utils/sharedSearchUtils";
import { PageType } from "types/enums";

const CarSearchLinkedCategories = () => {
  const { data, error } = useQuery<CarSearchTypes.QueryCarSearchLinkedCategories>(
    CarSearchLinkedCategoriesQuery
  );
  if (error || !data) return null;
  const searchCategories = constructServices(
    data.carLinkedSearchCategories.searchCategories,
    PageType.CARCATEGORY
  );
  return (
    <TopServices
      categories={searchCategories}
      metadata={data.carLinkedSearchCategories.metadata}
      columnSizes={{ small: 1, large: 1 / searchCategories.length }}
    />
  );
};

export default CarSearchLinkedCategories;
