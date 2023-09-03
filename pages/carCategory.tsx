import React from "react";
import { NextPageContext } from "next";

import Header from "components/features/Header/MainHeader";
import { Namespaces } from "shared/namespaces";
import CarSearchPageContainer from "components/features/CarSearchPage/CarSearchPageContainer";
import QueryParamProvider from "components/ui/Filters/QueryParamProvider";
import { Direction, PageType } from "types/enums";
import { getCarSearchAndCategoryQueries } from "components/features/CarSearchPage/utils/carSearchUtils";
import { getLanguageFromContext, getSlugFromContext, getMarketplaceUrl } from "utils/apiUtils";
import { cleanAsPath, removeEnCnLocaleCode } from "utils/routerUtils";

const CarCategoryPage = ({ slug }: { slug: string }) => {
  return (
    <>
      <Header />
      <QueryParamProvider>
        <CarSearchPageContainer slug={slug} isCarCategory />
      </QueryParamProvider>
    </>
  );
};

CarCategoryPage.getInitialProps = (ctx: NextPageContext) => {
  const slug = getSlugFromContext(ctx);
  const locale = getLanguageFromContext(ctx);
  const path = removeEnCnLocaleCode(cleanAsPath(ctx.asPath, locale), locale);
  const marketplaceUrl = getMarketplaceUrl(ctx);

  return {
    slug,
    queries: [
      ...getCarSearchAndCategoryQueries({
        slug,
        path,
        pageType: PageType.CARSEARCHCATEGORY,
        landingPageType: undefined,
        marketplaceUrl,
        locale,
      }),
    ],
    namespacesRequired: [
      Namespaces.headerNs,
      Namespaces.footerNs,
      Namespaces.carSearchNs,
      Namespaces.commonNs,
      Namespaces.commonSearchNs,
      Namespaces.commonCarNs,
      Namespaces.reviewsNs,
    ],
    isMobileFooterShown: false,
    contactUsButtonPosition: Direction.Right,
  };
};

export default CarCategoryPage;
