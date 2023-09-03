import React from "react";
import { useQuery } from "@apollo/react-hooks";

import ErrorBoundary from "../ErrorBoundary";
import TopServices from "../ImageCategoriesGrid";

import TopServicesQuery from "./TopServicesQuery.graphql";
import TopServicesSkeleton from "./TopServicesSkeleton";

import { longCacheHeaders } from "utils/apiUtils";
import { teaserHeight } from "styles/variables";

type PageCategories = {
  settings?: {
    frontTopServices: {
      metadata: SharedTypes.PageCategoriesMetaType;
      categories: SharedTypes.PageCategoryItemType[];
    };
  };
};

const TopServicesContainer = ({ isFirstSection }: { isFirstSection?: boolean }) => {
  const { error, data, loading } = useQuery<PageCategories>(TopServicesQuery, {
    context: {
      headers: longCacheHeaders,
    },
  });
  if (
    error ||
    !data?.settings?.frontTopServices.categories ||
    data?.settings?.frontTopServices.categories?.length === 0
  )
    return null;
  if (loading) return <TopServicesSkeleton />;
  const {
    settings: { frontTopServices },
  } = data;
  return (
    <ErrorBoundary>
      <TopServices
        metadata={frontTopServices.metadata}
        categories={frontTopServices.categories}
        isFirstSection={isFirstSection}
        cardHeight={teaserHeight.small}
        dataTestid="top-things-todo-container"
      />
    </ErrorBoundary>
  );
};

export default React.memo(TopServicesContainer);
