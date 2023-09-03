import React from "react";

import IconLoading from "../utils/IconLoading";

import ButtonFilterSection from "./ButtonFilterSection";

import CustomNextDynamic from "lib/CustomNextDynamic";
import { Namespaces } from "shared/namespaces";
import { useTranslation } from "i18n";
import { FilterQueryParam } from "types/enums";

const GTEIcon = CustomNextDynamic(() => import("components/icons/gte-favicon.svg"), {
  loading: IconLoading,
});

const TravelServices = ({
  filters,
  resetPageOnFilterSelection,
  useSingleSelection,
}: {
  filters: SearchPageTypes.Filter[];
  resetPageOnFilterSelection?: boolean;
  useSingleSelection?: boolean;
}) => {
  const { t } = useTranslation(Namespaces.tourSearchNs);

  return (
    <ButtonFilterSection
      title={t("Travel services")}
      Icon={GTEIcon}
      filters={filters}
      sectionId={FilterQueryParam.DURATION_IDS}
      resetPageOnFilterSelection={resetPageOnFilterSelection}
      useSingleSelection={useSingleSelection}
    />
  );
};

export default TravelServices;
