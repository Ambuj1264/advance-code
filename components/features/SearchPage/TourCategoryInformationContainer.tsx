import React from "react";
import { useQuery } from "@apollo/react-hooks";

import TourCategoryInformationQuery from "./queries/TourCategoryInformationQuery.graphql";

import InformationContainer from "components/ui/Search/InformationContainer";

const TourCategoryInformationContainer = ({ slug }: { slug?: string }) => {
  const { data, loading, error } = useQuery<{
    tourCategoryInformation: {
      id: string;
      title: string;
      description: string;
    };
  }>(TourCategoryInformationQuery, {
    variables: { slug },
  });

  if (
    loading ||
    error ||
    !data ||
    !data.tourCategoryInformation ||
    !data.tourCategoryInformation.title ||
    !data.tourCategoryInformation.description
  )
    return null;

  const { title, description } = data.tourCategoryInformation;

  return <InformationContainer title={title} description={description} />;
};

export default TourCategoryInformationContainer;
