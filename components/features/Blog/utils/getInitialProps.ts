import { NextPageContext } from "next";

import {
  getSlugFromContext,
  getLanguageFromContext,
  longCacheHeaders,
  shouldSkipBreadcrumbsQuery,
} from "utils/apiUtils";
import BlogQuery from "components/features/Blog/queries/BlogQuery.graphql";
import PageMetadataQuery from "hooks/queries/PageMetadataQuery.graphql";
import breadcrumbsQuery from "components/ui/Breadcrumbs/BreadcrumbsQuery.graphql";
import { Namespaces } from "shared/namespaces";
import { cleanAsPath, removeEnCnLocaleCode } from "utils/routerUtils";
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
      Namespaces.commonCarNs,
      Namespaces.quickFactsNs,
    ],
    queries: [
      {
        query: BlogQuery,
        variables: {
          slug,
        },
        isRequiredForPageRendering: true,
      },
      {
        query: PageMetadataQuery,
        variables: { path },
        context: { headers: longCacheHeaders },
      },
      {
        query: breadcrumbsQuery,
        variables: {
          slug,
          type: "BLOG",
        },
        skip: shouldSkipBreadcrumbsQuery({ slug, type: "BLOG" }),
        context: { headers: longCacheHeaders },
      },
    ],
  };
};

export default getInitialProps;
