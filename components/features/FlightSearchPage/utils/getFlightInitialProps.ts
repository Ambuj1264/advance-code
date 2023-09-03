import { NextPageContext } from "next";

import { getInitialPropsWithApollo } from "lib/apollo/initApollo";
import { Direction, PageType } from "types/enums";
import { prepareGraphCmsAsPath } from "utils/routerUtils";
import { getLanguageFromContext, getMarketplaceUrl, getQueryParamsViaLayer0 } from "utils/apiUtils";
import {
  doesFlightSearchHaveFilters,
  getFlightQueryCondition,
} from "components/features/FlightSearchPage/utils/flightSearchUtils";
import { Namespaces } from "shared/namespaces";
import { getFlightLandingPageCommonQueries } from "components/ui/LandingPages/utils/flightLandingPageQueryUtils";

const getInitialProps = getInitialPropsWithApollo(
  PageType.FLIGHTSEARCH,
  async (ctx: NextPageContext, apollo) => {
    const locale = getLanguageFromContext(ctx);
    const { asPath } = ctx;
    const marketplaceUrl = getMarketplaceUrl(ctx);
    const isGTI = marketplaceUrl.includes("guidetoiceland");
    const uri = asPath ? prepareGraphCmsAsPath(asPath, isGTI) : undefined;
    const { slug, country, originId, destinationId, dateFrom } = getQueryParamsViaLayer0(ctx);
    const flightQueryCondition = getFlightQueryCondition(marketplaceUrl, uri);

    const hasSearchFilters = doesFlightSearchHaveFilters({
      originId,
      destinationId,
      dateFrom,
    });
    const { queries, errorStatusCode } = await getFlightLandingPageCommonQueries(
      apollo,
      flightQueryCondition,
      locale,
      ctx,
      hasSearchFilters
    );

    return {
      slug,
      country,
      flightQueryCondition,
      namespacesRequired: [
        Namespaces.commonNs,
        Namespaces.headerNs,
        Namespaces.footerNs,
        Namespaces.commonSearchNs,
        Namespaces.flightSearchNs,
        Namespaces.flightNs,
      ],
      queries,
      contactUsButtonPosition: Direction.Right,
      isMobileFooterShown: false,
      errorStatusCode,
    };
  }
);

export default getInitialProps;
