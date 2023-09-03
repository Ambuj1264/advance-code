import { NextPageContext } from "next";

import BlogCategoriesQuery from "../queries/BlogCategoriesQuery.graphql";

import { BloggerSearchQueryParam } from "./useBloggerSearchQueryParams";

import {
  getProductSlugFromHref,
  cleanAsPath,
  removeEnCnLocaleCode,
  removeLocaleCode,
} from "utils/routerUtils";
import { urlToRelative, getLanguageFromContext, longCacheHeaders } from "utils/apiUtils";
import { SelectedFilter } from "components/ui/Filters/FilterTypes";
import PageMetadataQuery from "hooks/queries/PageMetadataQuery.graphql";
import BreadcrumbsQuery from "components/ui/Breadcrumbs/BreadcrumbsQuery.graphql";
import { Namespaces } from "shared/namespaces";
import { LandingPageType, PageType, Direction, SupportedLanguages, FilterType } from "types/enums";
import { removeDuplicates } from "utils/helperUtils";
import { constructImage } from "utils/globalUtils";
import { getSectionTypeSelectedFilters } from "components/ui/Filters/utils/filtersUtils";

export const constructBlogs = (
  queryBlogs: BloggerSearchTypes.QueryBlog[]
): BloggerSearchTypes.SearchBlog[] =>
  queryBlogs.map((queryBlog: BloggerSearchTypes.QueryBlog) => ({
    id: queryBlog.id,
    linkUrl: queryBlog.url || "",
    pageType: `/${PageType.BLOG}`,
    bannerId: queryBlog.bannerId,
    description: queryBlog.description,
    image: {
      ...constructImage(queryBlog.image),
      name: queryBlog.title,
    },
    headline: queryBlog.title,
    author: {
      ...queryBlog.author,
      image: {
        ...constructImage(queryBlog.author.image),
        name: queryBlog.author.name,
      },
    },
  }));

export const constructTileCardBlog = (
  blog: BloggerSearchTypes.SearchBlog,
  activeLocale: SupportedLanguages
) => ({
  ...blog,
  title: blog.headline,
  metadata: {
    description: blog.description || "",
  },
  url: blog.linkUrl,
  clientRoute: {
    query: {
      slug: getProductSlugFromHref(blog.linkUrl),
      category: removeLocaleCode(blog.linkUrl, activeLocale).split("/")[2],
    },
    route: `/${PageType.BLOG}`,
    as: urlToRelative(blog.linkUrl),
  },
});

export const getInitialProps =
  ({ landingPageType }: { landingPageType: LandingPageType }) =>
  (ctx: NextPageContext) => {
    const locale = getLanguageFromContext(ctx);
    const path = removeEnCnLocaleCode(cleanAsPath(ctx.asPath, locale), locale);
    return {
      namespacesRequired: [
        Namespaces.commonNs,
        Namespaces.headerNs,
        Namespaces.footerNs,
        Namespaces.commonSearchNs,
        Namespaces.bloggerSearchNs,
        Namespaces.articleSearchNs,
      ],
      queries: [
        {
          query: BreadcrumbsQuery,
          variables: {
            landingPageType: landingPageType.toUpperCase(),
          },
          context: { headers: longCacheHeaders },
        },
        {
          query: PageMetadataQuery,
          variables: { path },
          context: { headers: longCacheHeaders },
        },
        {
          query: BlogCategoriesQuery,
        },
      ],
      contactUsButtonPosition: Direction.Right,
      isMobileFooterShown: true,
    };
  };

export const constructTypeOfBlogs = (bloggerType: string[]) => {
  if (bloggerType.length > 1) return "all";
  if (bloggerType.length > 0) return bloggerType[0];
  return "all";
};

export const constructCategoriesFilter = (
  typeOfBlogs: string,
  categoriesData?: BloggerSearchTypes.QueryBlogCategories
) => {
  if (!categoriesData) return [];

  const localCategories = categoriesData.localCategories.map(category => ({
    ...category,
    id: category.id.toString(),
    disabled:
      typeOfBlogs === "travel" &&
      !categoriesData.travelCategories.some(travelCategory => travelCategory.id === category.id),
  }));
  const travelCategories = categoriesData.travelCategories.map(category => ({
    ...category,
    id: category.id.toString(),
    disabled:
      typeOfBlogs === "local" &&
      !categoriesData.localCategories.some(localCategory => localCategory.id === category.id),
  }));

  return removeDuplicates(
    [...localCategories, ...travelCategories] as GenericObject[],
    "id"
  ) as SearchPageTypes.Filter[];
};

export const getBlogSelectedFilters = ({
  categoryIds,
  bloggerType,
  categoriesFilters,
  bloggerTypeFilters,
}: {
  categoryIds?: string[];
  bloggerType?: string[];
  categoriesFilters: SearchPageTypes.Filter[];
  bloggerTypeFilters: SearchPageTypes.Filter[];
}) => {
  const selectedCategoryIds = categoryIds
    ? getSectionTypeSelectedFilters(
        categoriesFilters,
        categoryIds,
        BloggerSearchQueryParam.CATEGORYIDS,
        FilterType.CHECKBOX
      )
    : [];

  const selectedbloggerTypes = bloggerType
    ? getSectionTypeSelectedFilters(
        bloggerTypeFilters,
        bloggerType,
        BloggerSearchQueryParam.BLOGGERTYPE,
        FilterType.CHECKBOX
      )
    : [];
  return [...selectedbloggerTypes, ...selectedCategoryIds] as SelectedFilter[];
};
