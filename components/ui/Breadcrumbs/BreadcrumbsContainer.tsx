import React from "react";
import { useQuery } from "@apollo/react-hooks";

import Breadcrumbs from "./Breadcrumbs";
import breadcrumbsQuery from "./BreadcrumbsQuery.graphql";
import BreadcrumbsWrapper from "./BreadcrumbsWrapper";

import LandingPageLoadingBreadcrumbs from "components/ui/LandingPages/LandingPageLoadingBreadcrumbs";
import { PageType, LandingPageType } from "types/enums";
import { longCacheHeaders, shouldSkipBreadcrumbsQuery } from "utils/apiUtils";

const BreadcrumbsContainer = ({
  slug,
  id,
  type,
  landingPageType,
  lastCrumb,
  firstCrumbOnly,
  isLoading,
}: {
  slug?: string;
  id?: number;
  type?: PageType;
  landingPageType?: LandingPageType;
  lastCrumb?: string;
  firstCrumbOnly?: boolean;
  isLoading?: boolean;
}) => {
  const { error, data, loading } = useQuery<{
    breadcrumbs: SharedTypes.BreadcrumbData[];
  }>(breadcrumbsQuery, {
    variables: {
      slug,
      id,
      type: type?.toUpperCase(),

      landingPageType: landingPageType?.toUpperCase(),
    },
    skip:
      landingPageType?.toUpperCase() !== undefined
        ? false
        : shouldSkipBreadcrumbsQuery({ slug, id, type: type?.toUpperCase() }),
    context: { headers: longCacheHeaders },
  });
  if (isLoading || loading) return <LandingPageLoadingBreadcrumbs />;
  if (error || !data?.breadcrumbs) return null;

  if (firstCrumbOnly) {
    return (
      <BreadcrumbsWrapper>
        <Breadcrumbs breadcrumbs={data.breadcrumbs.slice(0, 1)} hideLastBreadcrumb={false} />
      </BreadcrumbsWrapper>
    );
  }

  if (lastCrumb) {
    return (
      <BreadcrumbsWrapper>
        <Breadcrumbs
          breadcrumbs={[
            ...data.breadcrumbs,
            {
              name: lastCrumb,
              url: "",
            },
          ]}
        />
      </BreadcrumbsWrapper>
    );
  }

  return (
    <BreadcrumbsWrapper>
      <Breadcrumbs breadcrumbs={data.breadcrumbs} />
    </BreadcrumbsWrapper>
  );
};

export default BreadcrumbsContainer;
