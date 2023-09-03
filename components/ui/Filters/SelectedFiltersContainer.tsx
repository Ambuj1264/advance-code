import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import rgba from "polished/lib/color/rgba";

import SelectedFilterContainer from "./SelectedFilter";

import { gutters } from "styles/variables";
import { SelectedFilter } from "components/ui/Filters/FilterTypes";

const Wrapper = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-wrap: wrap;
    &::after {
      content: "";
      display: flex;
      margin: ${gutters.small}px 0px;
      width: 100vw;
      height: 2px;
      background-color: ${rgba(theme.colors.primary, 0.3)};
    }
  `
);

const SelectedFiltersContainer = ({ filters }: { filters?: SelectedFilter[] }) => {
  if (!filters || filters.length === 0) return null;
  return (
    <Wrapper>
      {filters.map((filter, index) => {
        return (
          <SelectedFilterContainer
            key={`selectedFilter${index.toString()}-${filter.value}`}
            {...filter}
          />
        );
      })}
    </Wrapper>
  );
};

export default SelectedFiltersContainer;
