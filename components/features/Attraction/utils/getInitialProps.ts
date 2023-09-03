import { NextPageContext } from "next";

import {
  getSlugFromContext,
  getLanguageFromContext,
  longCacheHeaders,
  shouldSkipBreadcrumbsQuery,
} from "utils/apiUtils";
import AttractionQuery from "components/features/Attraction/queries/AttractionQuery.graphql";
import breadcrumbsQuery from "components/ui/Breadcrumbs/BreadcrumbsQuery.graphql";
import FAQQuery from "components/ui/ArticleLayout/queries/FAQQuery.graphql";
import PageMetadataQuery from "hooks/queries/PageMetadataQuery.graphql";
import { Namespaces } from "shared/namespaces";
import { removeEnCnLocaleCode, cleanAsPath } from "utils/routerUtils";
import { ContactUsMobileMargin } from "components/features/ContactUs/ContactUsButton";

const getInitialProps = (ctx: NextPageContext) => {
  const slug = getSlugFromContext(ctx);
  const locale = getLanguageFromContext(ctx);
  const path = removeEnCnLocaleCode(cleanAsPath(ctx.asPath, locale), locale);
  return {
    slug,
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
        query: AttractionQuery,
        variables: {
          slug,
        },
        isRequiredForPageRendering: true,
      },
      {
        query: breadcrumbsQuery,
        variables: {
          slug,
          type: "ATTRACTION",
        },
        skip: shouldSkipBreadcrumbsQuery({ slug, type: "ATTRACTION" }),
        context: { headers: longCacheHeaders },
      },
      {
        query: FAQQuery,
        variables: {
          slug,
          pageType: "ATTRACTION",
        },
      },
      {
        query: PageMetadataQuery,
        variables: { path },
        context: { headers: longCacheHeaders },
      },
    ],
  };
};

export default getInitialProps;
