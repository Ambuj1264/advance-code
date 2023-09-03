import React from "react";
import { useQuery } from "@apollo/react-hooks";

import GTECommonBreadcrumbs from "../Breadcrumbs/GTECommonBreadcrumbs";
import ProductBreadcrumbs from "../Breadcrumbs/ProductBreadcrumbs";

import LandingPageLoadingBreadcrumbs from "./LandingPageLoadingBreadcrumbs";

import { normalizeGraphCMSLocale } from "utils/helperUtils";
import useActiveLocale from "hooks/useActiveLocale";
import LandingPageBreadcrumbsQuery from "components/ui/LandingPages/queries/LandingPageBreadcrumbsQuery.graphql";
import { Marketplace } from "types/enums";
import { useSettings } from "contexts/SettingsContext";

const LandingPageBreadcrumbs = ({
  queryCondition,
  customLastBreadcrumb,
  onProductPage = false,
  hideLastBreadcrumb,
}: {
  queryCondition: LandingPageTypes.LandingPageQueryCondition;
  customLastBreadcrumb?: string;
  onProductPage?: boolean;
  hideLastBreadcrumb?: boolean;
}) => {
  const activeLocale = useActiveLocale();
  const { marketplace } = useSettings();
  const isGTE = marketplace === Marketplace.GUIDE_TO_EUROPE;
  const { data, error, loading } = useQuery<{
    landingPages: {
      breadcrumbs: SharedTypes.BreadcrumbData[];
      breadcrumbsNew: SharedTypes.BreadcrumbData[];
      breadcrumbList: SharedTypes.BreadcrumbData[];
    }[];
  }>(LandingPageBreadcrumbsQuery, {
    variables: {
      where: queryCondition,
      locale: normalizeGraphCMSLocale(activeLocale),
    },
  });
  if (loading) return <LandingPageLoadingBreadcrumbs />;
  if (!data || !data?.landingPages?.length || error) return null;
  const { breadcrumbs, breadcrumbsNew, breadcrumbList } = data.landingPages[0];
  const breadcrumbsData = breadcrumbsNew || breadcrumbs;
  const finalBreadcrumbsData = breadcrumbList.length > 0 ? breadcrumbList : breadcrumbsData;
  if (onProductPage && isGTE) {
    return (
      <ProductBreadcrumbs
        breadcrumbs={finalBreadcrumbsData}
        customLastBreadcrumb={customLastBreadcrumb}
      />
    );
  }
  return (
    <GTECommonBreadcrumbs
      breadcrumbs={finalBreadcrumbsData}
      customLastBreadcrumb={customLastBreadcrumb}
      hideLastBreadcrumb={hideLastBreadcrumb}
    />
  );
};

export default LandingPageBreadcrumbs;
