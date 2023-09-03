import React from "react";
import { useLazyQuery, useQuery } from "@apollo/react-hooks";
import { NumberParam, useQueryParam } from "use-query-params";
import { useRouter } from "next/router";

import TopTravelPlansContainer from "../CountryPage/TopTravelPlansContainer/TopTravelPlansContainer";
import { getArticleSearchAndCategoryAdminLinks } from "../AdminGear/utils";
import { constructAlternateCanonical } from "../SEO/utils/SEOUtils";

import ArticleSearchPageQuery from "./queries/ArticleSearchPageQuery.graphql";
import ArticleSearchTopArticlesQuery from "./queries/ArticleSearchTopArticlesQuery.graphql";
import ArticleSearchPageClientQuery from "./queries/ArticleSearchPageClientQuery.graphql";
import { normalizeArticleHeaderData, getSectionMetadata } from "./utils/articleUtils";
import TopArticleCategoriesContainer from "./TopArticleCategoriesContainer";

import SEOContainer from "components/features/SEO/SEOContainer";
import SearchHeader from "components/ui/Inputs/SearchHeader";
import ArticleAndBlogSearchPageCover from "components/ui/Cover/ArticleAndBlogSearchPageCover";
import { constructTours } from "utils/typeConversionUtils";
import useEffectOnScrollMobile from "hooks/useEffectOnScrollMobile";
import Container from "components/ui/Search/SearchGrid";
import BreadcrumbsContainer from "components/ui/Breadcrumbs/BreadcrumbsContainer";
import FrontValuePropositions from "components/ui/FrontValuePropositions/FrontValuePropositions";
import { LandingPageType, PageType, SharedFilterQueryParams, OpenGraphType } from "types/enums";
import TopAttractionsContainer from "components/ui/TopAttractionsContainer/TopAttractionsContainer";
import TopArticleContainer from "components/ui/TopArticleContainer/TopArticleContainer";
import { DEFAULT_METADATA } from "components/features/CountryPage/utils/countryUtils";
import AdminGearLoader from "components/features/AdminGear/AdminGearLoader";
import useActiveLocale from "hooks/useActiveLocale";
import { useSettings } from "contexts/SettingsContext";
import { PRODUCT_SEARCH_RESULT_LIMIT } from "utils/constants";
import { getTotalPages } from "utils/helperUtils";
import { useRedirectToPageParam } from "hooks/useRedirect";
import LazyHydrateWrapper from "components/ui/LazyHydrateWrapper";

const ArticleSearchContainer = ({
  slug,
  isArticleCategory = false,
}: {
  slug: string;
  isArticleCategory?: boolean;
}) => {
  const { asPath } = useRouter();
  const [page = 1] = useQueryParam(SharedFilterQueryParams.PAGE, NumberParam);
  const activeLocale = useActiveLocale();
  const { adminUrl, marketplaceUrl } = useSettings();
  const {
    data: topArticlesData,
    error: topArticlesDataError,
    loading: topArticlesDataLoading,
  } = useQuery<ArticleSearchPageTypes.TopArticlesQuery>(ArticleSearchTopArticlesQuery, {
    variables: {
      page,
      limit: isArticleCategory ? 24 : 8,
      slug: isArticleCategory ? slug : undefined,
      landing: !isArticleCategory,
    },
    skip: !!(isArticleCategory && !slug),
  });

  const totalArticles = topArticlesData?.topArticles?.totalArticles ?? 0;

  const totalPages = getTotalPages(totalArticles, PRODUCT_SEARCH_RESULT_LIMIT);

  useRedirectToPageParam({
    loading: topArticlesDataLoading,
    page,
    totalPages,
    goToPage: 1,
  });

  const {
    data: articleData,
    error: articleDataError,
    loading: articleDataLoading,
  } = useQuery<ArticleSearchPageTypes.PageQuery>(ArticleSearchPageQuery, {
    variables: isArticleCategory ? { slug } : { landing: true },
  });

  const [fetchClientData, { data: clientData }] =
    useLazyQuery<ArticleSearchPageTypes.PageClientQuery>(ArticleSearchPageClientQuery, {
      variables: isArticleCategory ? { slug } : { landing: true },
      context: {
        fetchOptions: {
          method: "POST",
        },
      },
    });

  useEffectOnScrollMobile(fetchClientData);

  if (topArticlesDataError || articleDataError) return null;

  const coverData = normalizeArticleHeaderData(articleData?.articleSearchHeader);

  const bestTravelPlanTours = constructTours(
    articleData?.bestTravelPlans.tours ?? [],
    clientData?.bestTravelPlans?.tours
  );

  const breadcrumbProps = {
    type: PageType.ARTICLECATEGORY,
    ...(isArticleCategory ? { slug } : { landingPageType: LandingPageType.ARTICLES }),
  };

  const canonicalQueryParamString = page > 1 ? `page=${page}` : undefined;
  const alternateCanonicalUrl = constructAlternateCanonical({
    canonicalQueryParamString,
    asPath,
    marketplaceUrl,
  });
  return (
    <>
      <Container data-testid="article-search">
        <SEOContainer
          isIndexed={page <= totalPages}
          images={coverData.images}
          openGraphType={OpenGraphType.WEBSITE}
          canonicalQueryParams={canonicalQueryParamString}
          alternateCanonicalUrl={alternateCanonicalUrl}
        />
        <BreadcrumbsContainer {...breadcrumbProps} />

        <LazyHydrateWrapper ssrOnly key="articleAndBlogSearchPageCover">
          <ArticleAndBlogSearchPageCover
            images={coverData.images}
            title={coverData.title}
            description={coverData.description}
            loading={articleDataLoading}
          >
            {articleData?.searchLink && (
              <SearchHeader searchLink={articleData?.searchLink} searchTerm="q" />
            )}
          </ArticleAndBlogSearchPageCover>
        </LazyHydrateWrapper>

        <FrontValuePropositions />

        {!isArticleCategory && <TopArticleCategoriesContainer />}

        <TopArticleContainer
          metadata={topArticlesData?.topArticles?.metadata ?? DEFAULT_METADATA}
          loading={topArticlesDataLoading}
          articles={topArticlesData?.topArticles?.articles ?? []}
          totalArticles={totalArticles}
          isArticleCategory={isArticleCategory}
          totalPages={totalPages}
          currentPage={page}
        />

        <LazyHydrateWrapper on="click" key="topAttractions">
          <TopAttractionsContainer
            metadata={getSectionMetadata(articleData?.topAttractions)}
            attractions={articleData?.topAttractions.attractions ?? []}
            loading={articleDataLoading}
          />
        </LazyHydrateWrapper>

        <TopTravelPlansContainer
          metadata={getSectionMetadata(articleData?.bestTravelPlans)}
          bestTravelPlanTours={bestTravelPlanTours}
          loading={articleDataLoading}
        />
      </Container>
      <AdminGearLoader
        links={getArticleSearchAndCategoryAdminLinks({
          activeLocale,
          adminUrl,
          articleCategoryId: articleData?.articleSearchHeader.category.id,
        })}
      />
    </>
  );
};

export default ArticleSearchContainer;
