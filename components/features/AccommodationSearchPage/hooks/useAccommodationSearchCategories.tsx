import { useQuery } from "@apollo/react-hooks";

import HotelSearchCategories from "../queries/HotelSerchCategoriesQuery.graphql";

export enum HotelSearchCategoriesTypes {
  topTypes = "top_types",
  topCities = "top_cities",
}

const useAccommodationSearchCategories = (type: string, slug?: string) => {
  const { data, error } = useQuery<{
    getHotelSearchCategories: {
      categories: SharedTypes.QuerySearchCategory[];
      metadata: SharedTypes.QuerySearchMetadata;
    };
  }>(HotelSearchCategories, {
    variables: {
      type,
      slug: slug || "",
    },
  });

  return { data: data?.getHotelSearchCategories, error };
};

export default useAccommodationSearchCategories;
