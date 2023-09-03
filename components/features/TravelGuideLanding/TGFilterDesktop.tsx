import React from "react";
import styled from "@emotion/styled";

import VPSearchFilters from "../VacationPackages/VPSearchFilters";

import { FilterSectionListType, SelectedFilter } from "components/ui/Filters/FilterTypes";
import { useIsTablet } from "hooks/useMediaQueryCustom";
import { gutters } from "styles/variables";

const StyledVPSearchFilters = styled(VPSearchFilters)`
  &:nth-of-type(1) {
    padding-top: ${gutters.small}px;
  }
`;

const TGFilterDesktop = ({
  filters,
  selectedFilters,
  loading = false,
}: {
  filters?: FilterSectionListType | undefined;
  selectedFilters: SelectedFilter[];
  loading?: boolean;
}) => {
  const isTablet = useIsTablet();
  if (isTablet)
    return (
      <StyledVPSearchFilters
        filters={filters}
        selectedFilters={selectedFilters}
        loading={loading}
      />
    );
  return null;
};

export default TGFilterDesktop;
