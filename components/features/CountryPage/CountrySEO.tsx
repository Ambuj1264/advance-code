import React from "react";
import { useQuery } from "@apollo/react-hooks";

import BreadcrumbsStructuredData from "components/ui/Breadcrumbs/BreadcrumbsStructuredData";
import breadcrumbsQuery from "components/ui/Breadcrumbs/BreadcrumbsQuery.graphql";
import SEOContainer from "components/features/SEO/SEOContainer";
import { OpenGraphType, PageType } from "types/enums";
import LazyHydrateWrapper from "components/ui/LazyHydrateWrapper";
import { longCacheHeaders } from "utils/apiUtils";

const CountrySEO = ({ tours }: { tours: SharedTypes.Product[] }) => {
  const images = tours.length > 0 ? [tours[0].image] : [];
  const { data: breadcrumbsData } = useQuery<{
    breadcrumbs: SharedTypes.BreadcrumbData[];
  }>(breadcrumbsQuery, {
    variables: {
      slug: "/",
      type: PageType.PAGE.toUpperCase(),
    },
    context: { headers: longCacheHeaders },
  });

  return (
    <>
      <SEOContainer isIndexed images={images} openGraphType={OpenGraphType.WEBSITE} />

      {breadcrumbsData && (
        <LazyHydrateWrapper ssrOnly>
          <BreadcrumbsStructuredData items={breadcrumbsData.breadcrumbs} />
        </LazyHydrateWrapper>
      )}
    </>
  );
};

export default CountrySEO;
