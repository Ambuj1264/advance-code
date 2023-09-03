import React from "react";

import useVPQueryParams from "./hooks/useVPQueryParams";
import { doesVpHasAllRequiredSearchQueryParams } from "./utils/vacationPackagesUtils";
import VacationPackageSearchContainer from "./VacationPackagesSearchContainer";
import VPLandingPageContentContainer from "./VPLandingPageContentContainer";

const VacationPackagesSearchLanding = ({
  queryCondition,
  slug,
}: {
  queryCondition: LandingPageTypes.LandingPageQueryCondition;
  slug?: string;
}) => {
  const [queryParams] = useVPQueryParams();
  const hasSearchQueryParams = doesVpHasAllRequiredSearchQueryParams(queryParams);
  if (hasSearchQueryParams) {
    return <VacationPackageSearchContainer categorySlug={slug} queryCondition={queryCondition} />;
  }

  return <VPLandingPageContentContainer queryCondition={queryCondition} />;
};

export default VacationPackagesSearchLanding;
