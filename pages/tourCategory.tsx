import React from "react";
import { NextPageContext } from "next";

import Header from "components/features/Header/MainHeader";
import { cleanAsPath, removeEnCnLocaleCode } from "utils/routerUtils";
import TourSearchQuery from "components/features/SearchPage/queries/TourSearchQuery.graphql";
import QueryParamProvider from "components/ui/Filters/QueryParamProvider";
import TourCategoryInformationQuery from "components/features/SearchPage/queries/TourCategoryInformationQuery.graphql";
import TourCategoryDefaultFiltersQuery from "components/features/SearchPage/queries/TourCategoryDefaultFiltersQuery.graphql";
import CategoryContainer from "components/features/SearchPage/CategoryContainer";
import { getTourSearchAndCategoryQueries } from "components/features/SearchPage/utils/searchUtils";
import { PRODUCT_SEARCH_RESULT_LIMIT } from "utils/constants";
import { Namespaces } from "shared/namespaces";
import { Direction, PageType, Product } from "types/enums";
import { getLanguageFromContext, getSlugFromContext } from "utils/apiUtils";

const TourCategoryPage = ({ slug }: { slug: string }) => {
  return (
    <>
      <Header />
      <QueryParamProvider>
        <CategoryContainer slug={slug} />
      </QueryParamProvider>
    </>
  );
};

TourCategoryPage.getInitialProps = (ctx: NextPageContext) => {
  const slug = getSlugFromContext(ctx);
  const locale = getLanguageFromContext(ctx);

  const queries = [
    {
      query: TourSearchQuery,
      variables: {
        filters: {
          categorySlug: slug,
          limit: PRODUCT_SEARCH_RESULT_LIMIT,
          page: ctx?.query?.page ? Number(ctx.query.page) : 1,
        },
      },
    },
    {
      query: TourCategoryDefaultFiltersQuery,
    },
    {
      query: TourCategoryInformationQuery,
      variables: { slug },
    },
    ...getTourSearchAndCategoryQueries({
      slug,
      path: removeEnCnLocaleCode(cleanAsPath(ctx.asPath, locale), locale),
      pageType: PageType.TOURCATEGORY,
      landingPageType: undefined,
      pageNumber: Number(ctx.query.page),
      frontValuePropsProductType: Product.TOUR,
    }),
  ];

  return {
    slug,
    namespacesRequired: [
      Namespaces.commonNs,
      Namespaces.headerNs,
      Namespaces.footerNs,
      Namespaces.tourSearchNs,
      Namespaces.commonSearchNs,
    ],
    queries,
    isMobileFooterShown: false,
    contactUsButtonPosition: Direction.Right,
  };
};

export default TourCategoryPage;
