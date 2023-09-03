import React from "react";

import { getLandingPageBreadcrumbs } from "components/ui/LandingPages/utils/landingPageUtils";
import Breadcrumbs from "components/ui/Breadcrumbs/Breadcrumbs";
import BreadcrumbsWrapper from "components/ui/Breadcrumbs/BreadcrumbsWrapper";
import { useSettings } from "contexts/SettingsContext";
import useActiveLocale from "hooks/useActiveLocale";
import { SupportedLanguages, Marketplace } from "types/enums";

const GTECommonBreadcrumbs = ({
  breadcrumbs,
  customLastBreadcrumb,
  hideLastBreadcrumb,
}: {
  breadcrumbs: SharedTypes.BreadcrumbData[];
  customLastBreadcrumb?: string;
  hideLastBreadcrumb?: boolean;
}) => {
  const { marketplaceUrl, absoluteUrl, marketplace } = useSettings();
  const activeLocale = useActiveLocale();

  const isOnGTIChineseLocale =
    activeLocale === (SupportedLanguages.Chinese || SupportedLanguages.LegacyChinese) &&
    marketplace === Marketplace.GUIDE_TO_ICELAND;

  const breadcrumbsList = getLandingPageBreadcrumbs(
    isOnGTIChineseLocale ? absoluteUrl : marketplaceUrl,
    breadcrumbs,
    customLastBreadcrumb
  );
  return (
    <BreadcrumbsWrapper>
      <Breadcrumbs breadcrumbs={breadcrumbsList} hideLastBreadcrumb={hideLastBreadcrumb} />
    </BreadcrumbsWrapper>
  );
};

export default GTECommonBreadcrumbs;
