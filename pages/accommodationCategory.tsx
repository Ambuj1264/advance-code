import React from "react";
import { NextPageContext } from "next";
import ApolloClient from "apollo-client";

import Header from "components/features/Header/MainHeader";
import AccommodationCategoryDefaultQuery from "components/features/AccommodationSearchPage/queries/AccommodationCategoryDefaultQuery.graphql";
import { Direction, PageType } from "types/enums";
import QueryParamProvider from "components/ui/Filters/QueryParamProvider";
import { Namespaces } from "shared/namespaces";
import FAQQuery from "components/features/SearchPage/queries/FAQQuery.graphql";
import AccommodationCategoryContainer from "components/features/AccommodationSearchPage/AccommodationCategoryContainer";
import { getAccommodationSearchAndCategoryQueries } from "components/features/AccommodationSearchPage/utils/accommodationSearchUtils";
import { cleanAsPath, removeEnCnLocaleCode } from "utils/routerUtils";
import { getFAQVariables } from "components/features/SearchPage/utils/searchUtils";
import {
  getLanguageFromContext,
  getQueryParamsViaLayer0,
  getSlugFromContext,
} from "utils/apiUtils";
import { getPrefetchedData } from "lib/apollo/getPrefetchedData";
import AccommodationSearchCategoryQuery from "components/features/AccommodationSearchPage/queries/AccommodationSearchCategoryQuery.graphql";
import { getInitialPropsWithApolloAndPassToClientSideNav } from "lib/apollo/initApollo";

const AccommodationCategoryPage = ({
  slug,
  isHotelCategoryPage,
}: {
  slug: string;
  isHotelCategoryPage: boolean;
}) => {
  return (
    <>
      <Header />
      <QueryParamProvider>
        <AccommodationCategoryContainer slug={slug} isHotelCategoryPage={isHotelCategoryPage} />
      </QueryParamProvider>
    </>
  );
};

AccommodationCategoryPage.getInitialProps = getInitialPropsWithApolloAndPassToClientSideNav(
  PageType.ACCOMMODATION_CATEGORY,
  async (ctx: NextPageContext, apollo: ApolloClient<unknown>) => {
    const locale = getLanguageFromContext(ctx);
    const path = removeEnCnLocaleCode(cleanAsPath(ctx.asPath, locale), locale);
    const slug = getSlugFromContext(ctx);
    const { page } = getQueryParamsViaLayer0(ctx);
    const pageNumber = page ? Number(page) : 1;

    const { result } = await getPrefetchedData<{
      data: AccommodationSearchTypes.QueryAccommodationSearchCategoryInfo;
    }>(
      apollo,
      ctx,
      {
        query: AccommodationSearchCategoryQuery,
        variables: {
          slug,
        },
      },
      true
    );

    const isHotelCategoryPage = result?.data?.hotelSearchCategoryByUri?.id === 130;

    const queries: AccommodationSearchTypes.Query[] = [
      {
        query: AccommodationCategoryDefaultQuery,
        variables: {
          slug,
          page: pageNumber,
          orderBy: isHotelCategoryPage ? "top_reviews" : "rating",
          orderDirection: "desc",
          limit: 8,
        },
      },
      {
        query: FAQQuery,
        variables: getFAQVariables({
          slug,
          pageType: PageType.HOTELSEARCHCATEGORY,
        }),
      },
      ...getAccommodationSearchAndCategoryQueries({
        path,
        pageType: PageType.HOTELSEARCHCATEGORY,
        slug,
        pageNumber,
      }),
    ];

    return {
      slug,
      isHotelCategoryPage,
      namespacesRequired: [
        Namespaces.commonNs,
        Namespaces.headerNs,
        Namespaces.footerNs,
        Namespaces.commonSearchNs,
        Namespaces.accommodationNs,
        Namespaces.accommodationBookingWidgetNs,
        Namespaces.accommodationSearchNs,
      ],
      queries,
      isMobileFooterShown: false,
      contactUsButtonPosition: Direction.Right,
    };
  }
);

export default AccommodationCategoryPage;
