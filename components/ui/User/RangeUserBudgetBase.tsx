import React from "react";
import styled from "@emotion/styled";
import { useTheme } from "emotion-theming";

import {
  Bars,
  ChartWrapper,
  PriceWrapper,
  rangedSliderStyles,
  StyledReactSlider,
} from "../Filters/RangeFilterBaseNew";

import { FilterContainer } from "components/ui/Filters/shared";
import { NameTextWrapper } from "components/features/User/ProfilePictureWithName";

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const RangeUserBudgetBase = ({
  filters,
  title,
  min,
  max,
  setMinMaxValues,
  onAfterChange,
  step,
  children,
  initialMin,
  initialMax,
  disabled = false,
  minDistance = 0,
}: {
  filters: SearchPageTypes.RangeFilter[];
  title: string;
  min: number;
  max: number;
  children: React.ReactNode;
  setMinMaxValues: (el: number | number[] | undefined) => void;
  onAfterChange: (el: number[]) => void;
  step?: number;
  initialMin?: number;
  initialMax?: number;
  disabled?: boolean;
  minDistance?: number;
}) => {
  const theme: Theme = useTheme();

  const maxCounts = Math.max(...filters.map(fi => fi.count));
  const sliderStep = step || 1;

  return (
    <FilterContainer includeBottomBorder={false}>
      <NameTextWrapper>{title}</NameTextWrapper>
      <Wrapper>
        <ChartWrapper>
          <Bars max={maxCounts} filters={filters} />
        </ChartWrapper>
        <StyledReactSlider
          css={rangedSliderStyles(theme, disabled)}
          onChange={setMinMaxValues}
          withTracks
          step={sliderStep}
          value={[min, max]}
          min={initialMin}
          max={initialMax}
          onAfterChange={onAfterChange}
          disabled={disabled}
          minDistance={minDistance}
        />
        <PriceWrapper>{children}</PriceWrapper>
      </Wrapper>
    </FilterContainer>
  );
};

export default RangeUserBudgetBase;
