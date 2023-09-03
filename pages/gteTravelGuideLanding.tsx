import { NextPageContext } from "next";
import React from "react";

import { Namespaces } from "../shared/namespaces";

import Header from "components/features/Header/MainHeader";
import { getInitialPropsWithApollo } from "lib/apollo/initApollo";
import { Direction, GraphCMSPageType, PageType } from "types/enums";
import { getLanguageFromContext } from "utils/apiUtils";
import { cleanAsPathWithLocale } from "utils/routerUtils";
import TGLandingContainer from "components/features/TravelGuideLanding/TGLandingContainer";
import QueryParamProvider from "components/ui/Filters/QueryParamProvider";
import { getTGLandingSectionQueries } from "components/features/TravelGuideLanding/TGLandingUtils/TGLandingQueryUtils";
import TGLandingContentQuery from "components/features/TravelGuides/queries/TGLandingPageQuery.graphql";

const TravelGuideLandingPage = ({
  queryCondition,
}: {
  queryCondition: LandingPageTypes.LandingPageQueryCondition;
}) => {
  return (
    <>
      <Header />
      <QueryParamProvider>
        <TGLandingContainer key={queryCondition.metadataUri} queryCondition={queryCondition} />
      </QueryParamProvider>
    </>
  );
};

TravelGuideLandingPage.getInitialProps = getInitialPropsWithApollo(
  PageType.TRAVEL_GUIDE_LANDING,
  async (ctx: NextPageContext, apollo) => {
    const locale = getLanguageFromContext(ctx);
    const { asPath, query } = ctx;
    const { page } = query;
    const currentPage = page ? Number(page) : 1;
    const normalizesAsPath = cleanAsPathWithLocale(asPath);
    const queryCondition = {
      metadataUri: normalizesAsPath,
      pageType: GraphCMSPageType.TravelGuidesLanding,
    };
    const { queries, errorStatusCode, pageInfo } = await getTGLandingSectionQueries(
      apollo,
      queryCondition,
      locale,
      ctx,
      currentPage
    );
    return {
      isTopServicesHidden: true,
      isSubscriptionFormHidden: true,
      contactUsButtonPosition: Direction.Right,
      namespacesRequired: [
        Namespaces.headerNs,
        Namespaces.commonNs,
        Namespaces.footerNs,
        // Namespaces.travelGuidesNs,
      ],
      queries: [
        ...queries,
        {
          query: TGLandingContentQuery,
          variables: {
            where: {
              metadataUri: queryCondition.metadataUri,
            },
          },
          isRequiredForPageRendering: true,
        },
      ],
      errorStatusCode,
      queryCondition,
      pageInfo,
      locale,
    };
  }
);

export default TravelGuideLandingPage;
