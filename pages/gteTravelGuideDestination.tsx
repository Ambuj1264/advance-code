import React from "react";
import { Direction } from "@travelshift/ui/types/enums";
import { NextPageContext } from "next";

import { getLanguageFromContext } from "utils/apiUtils";
import { cleanAsPathWithLocale } from "utils/routerUtils";
import useActiveLocale from "hooks/useActiveLocale";
import useTGDestinationsQuery from "components/features/TravelGuides/hooks/useTGDestinationsQuery";
import TGDestinationsContainer from "components/features/TravelGuides/TGDestinationsContainer";
import Header from "components/features/Header/MainHeader";
import { normalizeGraphCMSLocale } from "utils/helperUtils";
import TGDestinationsContentQuery from "components/features/TravelGuides/queries/TGDestinationsContentQuery.graphql";
import { constructTGContent } from "components/features/TravelGuides/utils/travelGuideUtils";
import { useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";
import { getInitialPropsWithApollo } from "lib/apollo/initApollo";
import { PageType } from "types/enums";
import { getTravelGuideSectionQueries } from "components/features/TravelGuides/utils/travelGuideQueryUtils";

const TravelGuideDestinationsPage = ({
  queryCondition,
}: {
  queryCondition: LandingPageTypes.LandingPageQueryCondition;
}) => {
  const { t: travelGuidesT } = useTranslation(Namespaces.travelGuidesNs);
  const locale = useActiveLocale();
  const { destinationData, loading, error } = useTGDestinationsQuery({
    queryCondition,
    locale,
  });

  const tGConstructedContent = destinationData
    ? constructTGContent(destinationData, travelGuidesT)
    : undefined;
  return (
    <>
      {/* TODO: get hreflangs from backend */}
      <Header />
      <TGDestinationsContainer
        key={queryCondition.metadataUri}
        metadataUri={queryCondition.metadataUri}
        destinationData={tGConstructedContent}
        queryLoading={loading}
        queryError={error}
      />
    </>
  );
};

TravelGuideDestinationsPage.getInitialProps = getInitialPropsWithApollo(
  PageType.TRAVEL_GUIDE_DESTINATION,
  async (ctx: NextPageContext, apollo) => {
    const locale = getLanguageFromContext(ctx);
    const { asPath } = ctx;
    const normalizedAsPath = cleanAsPathWithLocale(asPath);
    const queryCondition = { metadataUri: normalizedAsPath };
    const { queries, errorStatusCode } = await getTravelGuideSectionQueries(
      apollo,
      queryCondition,
      locale,
      ctx
    );
    return {
      isTopServicesHidden: true,
      isSubscriptionFormHidden: true,
      namespacesRequired: [],
      contactUsButtonPosition: Direction.Left,
      queries: [
        ...queries,
        {
          query: TGDestinationsContentQuery,
          variables: {
            where: queryCondition,
            locale: [normalizeGraphCMSLocale(locale)],
          },
          isRequiredForPageRendering: true,
        },
      ],
      queryCondition,
      locale,
      errorStatusCode,
    };
  }
);

export default TravelGuideDestinationsPage;
