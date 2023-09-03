import { NextPageContext } from "next";
import { last } from "fp-ts/lib/Array";
import { pipe } from "fp-ts/lib/pipeable";
import { toUndefined } from "fp-ts/lib/Option";

import ArticleSearchPageQuery from "../queries/ArticleSearchPageQuery.graphql";
import ArticleSearchTopArticlesQuery from "../queries/ArticleSearchTopArticlesQuery.graphql";

import PageMetadataQuery from "hooks/queries/PageMetadataQuery.graphql";
import { removeEnCnLocaleCode, cleanAsPath } from "utils/routerUtils";
import {
  getLanguageFromContext,
  getSlugFromContext,
  longCacheHeaders,
  shouldSkipBreadcrumbsQuery,
} from "utils/apiUtils";
import { Namespaces } from "shared/namespaces";
import ArticleQuery from "components/features/Article/queries/ArticleQuery.graphql";
import ArticleTourLandingUrlQuery from "components/features/Article/queries/ArticleTourLandingUrlQuery.graphql";
import BreadcrumbsQuery from "components/ui/Breadcrumbs/BreadcrumbsQuery.graphql";
import FrontValuePropsQuery from "components/ui/FrontValuePropositions/FrontValuePropsQuery.graphql";
import TopArticleCategoriesQuery from "components/features/Article/queries/TopArticleCategoriesQuery.graphql";
import { LandingPageType, PageType, Direction, SupportedLanguages } from "types/enums";
import { ContactUsMobileMargin } from "components/features/ContactUs/ContactUsButton";

const getArticleCategorySearchSlug = (ctx: NextPageContext) => {
  if (ctx.query.category) {
    return getSlugFromContext(ctx);
  }

  const locale = getLanguageFromContext(ctx);
  const slug = removeEnCnLocaleCode(cleanAsPath(ctx.asPath, locale), locale);

  return pipe(slug.split("/"), last, toUndefined);
};

export const getCategorySlug = (ctx: NextPageContext, locale: SupportedLanguages) => {
  const path = removeEnCnLocaleCode(cleanAsPath(ctx.asPath, locale), locale);
  // Below is a bit of an edge case as we should receive a category object from the getQueryParamsViaLayer0 if we get
  // 'article' or a translation of it in our URI
  const splitPath = path.split("/");
  const urlSlashesCount = splitPath.length - 1;
  return urlSlashesCount < 2 ? splitPath[0] : splitPath[1];
};

export const getArticleSearchInitialProps =
  ({ isArticleCategory = false }: { isArticleCategory?: boolean }) =>
  (ctx: NextPageContext) => {
    const slug = getArticleCategorySearchSlug(ctx);
    const locale = getLanguageFromContext(ctx);
    const page = isArticleCategory && ctx?.query?.page ? Number(ctx.query.page) : 1;
    const path = removeEnCnLocaleCode(cleanAsPath(ctx.asPath, locale), locale);
    return {
      slug,
      namespacesRequired: [
        Namespaces.commonNs,
        Namespaces.headerNs,
        Namespaces.footerNs,
        Namespaces.commonSearchNs,
        Namespaces.countryNs,
        Namespaces.articleSearchNs,
      ],
      queries: [
        {
          query: BreadcrumbsQuery,
          variables: {
            type: PageType.ARTICLECATEGORY.toUpperCase(),
            ...(isArticleCategory
              ? { slug }
              : { landingPageType: LandingPageType.ARTICLES.toUpperCase() }),
          },
          ...(isArticleCategory
            ? {
                skip: shouldSkipBreadcrumbsQuery({
                  slug,
                  type: PageType.ARTICLECATEGORY.toUpperCase(),
                }),
              }
            : {}),
          context: { headers: longCacheHeaders },
        },
        {
          query: ArticleSearchTopArticlesQuery,
          variables: {
            page,
            limit: isArticleCategory ? 24 : 8,
            slug: isArticleCategory ? slug : undefined,
            landing: !isArticleCategory,
          },
          skip: !!(isArticleCategory && !slug),
          isRequiredForPageRendering: true,
        },
        {
          query: ArticleSearchPageQuery,
          variables: isArticleCategory ? { slug } : { landing: true },
          isRequiredForPageRendering: true,
        },
        {
          query: FrontValuePropsQuery,
        },
        {
          query: PageMetadataQuery,
          variables: {
            path: `${path}${page > 1 ? `?page=${page}` : ""}`,
          },
          context: { headers: longCacheHeaders },
        },
        ...(!isArticleCategory ? [{ query: TopArticleCategoriesQuery }] : []),
      ],
      isClientApi: true,
      contactUsButtonPosition: Direction.Right,
    };
  };

export const getArticlePageInitialProps = (ctx: NextPageContext) => {
  const slug = getSlugFromContext(ctx);
  const locale = getLanguageFromContext(ctx);
  const path = removeEnCnLocaleCode(cleanAsPath(ctx.asPath, locale), locale);
  const categorySlug = getCategorySlug(ctx, locale);

  return {
    slug,
    categorySlug,
    contactUsMobileMargin: ContactUsMobileMargin.RegularFooter,
    namespacesRequired: [
      Namespaces.commonNs,
      Namespaces.headerNs,
      Namespaces.footerNs,
      Namespaces.articleNs,
      Namespaces.commonBookingWidgetNs,
      Namespaces.tourBookingWidgetNs,
      Namespaces.tourNs,
      Namespaces.commonCarNs,
      Namespaces.quickFactsNs,
    ],
    queries: [
      {
        query: ArticleQuery,
        variables: {
          slug,
          categorySlug,
        },
        isRequiredForPageRendering: true,
      },
      {
        query: ArticleTourLandingUrlQuery,
      },
      {
        query: BreadcrumbsQuery,
        variables: {
          slug,
          type: PageType.ARTICLE.toUpperCase(),
        },
        context: { headers: longCacheHeaders },
        skip: shouldSkipBreadcrumbsQuery({ slug, type: PageType.ARTICLE.toUpperCase() }),
      },
      {
        query: PageMetadataQuery,
        variables: { path },
        context: { headers: longCacheHeaders },
      },
    ],
  };
};
