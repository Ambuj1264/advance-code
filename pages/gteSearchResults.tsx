import React from "react";
import { NextPageContext } from "next";

import SearchResultPageBreadcrumbsQuery from "../components/features/SearchResults/queries/SearchResultPageBreadcrumbsQuery.graphql";
import OverallSearchPageQuery from "../components/features/SearchResults/queries/OverallSearchPageQuery.graphql";

import { Namespaces } from "shared/namespaces";
import { Direction, PageType } from "types/enums";
import { zIndex } from "styles/variables";
import useLandingPageLocaleLinks from "components/ui/LandingPages/hooks/useLandingPageLocaleLinks";
import Header from "components/features/Header/MainHeader";
import { getInitialPropsWithApollo } from "lib/apollo/initApollo";
import { cleanAsPathWithLocale } from "utils/routerUtils";
import QueryParamProvider from "components/ui/Filters/QueryParamProvider";
import SearchResultContainer, {
  filters,
} from "components/features/SearchResults/SearchResultContainer";
import { getFrontPageQueryCondition } from "components/features/FrontPage/utils/frontPageUtils";
import { getLanguageFromContext } from "utils/apiUtils";

const SearchResultsPage = ({
  queryCondition,
}: {
  queryCondition: LandingPageTypes.LandingPageQueryCondition;
}) => {
  const localeLinks = useLandingPageLocaleLinks(queryCondition);
  return (
    <>
      <Header gteLocaleLinks={localeLinks} />
      <QueryParamProvider>
        <SearchResultContainer />
      </QueryParamProvider>
    </>
  );
};

SearchResultsPage.getInitialProps = getInitialPropsWithApollo(
  PageType.GTE_SEARCH_RESULTS,
  async (ctx: NextPageContext) => {
    const locale = getLanguageFromContext(ctx);
    const { asPath } = ctx;
    const normalizesAsPath = cleanAsPathWithLocale(asPath);
    const queryCondition = getFrontPageQueryCondition(normalizesAsPath);
    return {
      queryCondition,
      isTopServicesHidden: true,
      isSubscriptionFormHidden: true,
      namespacesRequired: [
        Namespaces.commonNs,
        Namespaces.headerNs,
        Namespaces.footerNs,
        Namespaces.commonSearchNs,
        Namespaces.overallSearchNs,
      ],
      contactUsButtonPosition: Direction.Right,
      contactUsButtonZIndex: zIndex.max + 1,
      queries: [
        {
          query: SearchResultPageBreadcrumbsQuery,
          variables: {
            where: {
              breadCrumbId: "europe",
            },
            locale,
          },
        },
        {
          query: OverallSearchPageQuery,
          variables: {
            input: {
              query: "europe",
              locale,
              nextPage: "1",
              filters,
              limit: 6,
            },
          },
        },
      ],
    };
  }
);

export default SearchResultsPage;
