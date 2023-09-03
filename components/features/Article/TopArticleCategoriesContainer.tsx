import React from "react";
import { useQuery } from "@apollo/react-hooks";

import TopArticleCategoryQuery from "./queries/TopArticleCategoriesQuery.graphql";

import TopServicesWithCarousel, {
  ITEMS_PER_PAGE,
} from "components/ui/TopServices/TopServicesWithCarousel";
import TopServicesSkeleton from "components/ui/TopServices/TopServicesSkeleton";
import { teaserHeight } from "styles/variables";

type ArticleTopCategories = {
  settings?: {
    articleSearchPageTopCategories: {
      metadata: SharedTypes.PageCategoriesMetaType;
      categories: SharedTypes.PageCategoryItemType[];
    };
  };
};

const TopArticleCategoriesContainer = () => {
  const { error, data, loading } = useQuery<ArticleTopCategories>(TopArticleCategoryQuery);
  if (
    error ||
    !data?.settings?.articleSearchPageTopCategories.categories ||
    data?.settings?.articleSearchPageTopCategories.categories?.length === 0
  )
    return null;
  if (loading) return <TopServicesSkeleton />;
  const {
    settings: { articleSearchPageTopCategories },
  } = data;

  return (
    <TopServicesWithCarousel
      columnSizes={{
        small: 1 / 2,
        large: 1 / 4,
        desktop: 1 / ITEMS_PER_PAGE,
      }}
      metadata={articleSearchPageTopCategories.metadata}
      categories={articleSearchPageTopCategories.categories}
      cardHeight={teaserHeight.small}
      isFirstSection
    />
  );
};

export default React.memo(TopArticleCategoriesContainer);
