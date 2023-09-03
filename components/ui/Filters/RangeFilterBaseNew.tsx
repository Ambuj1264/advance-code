import React, { useCallback } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import { useTheme } from "emotion-theming";
import { ArrayParam, useQueryParams, NumberParam, StringParam } from "use-query-params";

import { QueryParamTypes } from "./QueryParamTypes";
import FilterHeading from "./FilterHeading";
import { FilterContainer } from "./shared";

import CustomNextDynamic from "lib/CustomNextDynamic";
import { CursorPaginationQueryParams, SharedFilterQueryParams } from "types/enums";
import { RangeFilterSectionType } from "components/ui/Filters/FilterTypes";
import { typographyBody2, typographySubtitle2 } from "styles/typography";
import {
  gutters,
  greyColor,
  borderRadius,
  separatorColor,
  separatorColorLight,
} from "styles/variables";

const ReactSlider = CustomNextDynamic<any>(
  () => import(/* webpackChunkName: "reactSlider" */ "react-slider"),
  {
    ssr: false,
    loading: () => null,
  }
);

export const StyledReactSlider = styled(ReactSlider)`
  &:hover {
    cursor: pointer;
  }
`;

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

export const rangedSliderStyles = (theme: Theme, disabled: boolean) => css`
  display: flex;
  align-items: center;
  width: 100%;
  height: 40px;
  .track {
    border-radius: ${borderRadius};
    height: 8px;
  }
  .track-1 {
    background: ${disabled ? separatorColor : theme.colors.primary};
  }
  .track-0,
  .track-2 {
    background: ${separatorColor};
  }
  .thumb {
    border: 2px solid ${disabled ? separatorColor : theme.colors.primary};
    border-radius: 50%;
    width: 32px;
    height: 32px;
    background: white;
    .thumb-value {
      position: absolute;
      bottom: -32px;
    }
  }
`;

export const PriceWrapper = styled.div(
  typographyBody2,
  css`
    display: flex;
    justify-content: space-between;
    width: 100%;
    color: ${greyColor};
  `
);

export const MaxPriceWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

export const PriceTitle = styled.div(typographySubtitle2);

export const ChartWrapper = styled.div`
  position: relative;
  bottom: -${gutters.small}px;
  display: flex;
  align-items: flex-end;
  width: 100%;
  height: 80px;
`;

const Bar = styled.div<{ height: number; numberOfValues: number }>(
  ({ height, numberOfValues }) =>
    css`
      width: calc(100% / ${numberOfValues});
      height: ${height * 100}%;
      max-height: 100%;
      background: ${separatorColorLight};
    `
);

export const Bars = ({ filters, max }: { filters: SearchPageTypes.RangeFilter[]; max: number }) => {
  return (
    <>
      {filters.map(filter => {
        const heightRatio = Number(filter.count) / max;
        const height = heightRatio < 0.2 && heightRatio > 0 ? 0.2 : heightRatio;
        return (
          <Bar
            key={`${filter.id}${filter.count}`}
            height={height}
            numberOfValues={filters.length}
          />
        );
      })}
    </>
  );
};

const RangeFilterBaseNew = ({
  filters,
  Icon,
  title,
  min,
  max,
  setMinMaxValues,
  step,
  children,
  sectionId,
  convertSelectedValues,
  initialMin,
  initialMax,
  disabled = false,
  minDistance = 0,
}: RangeFilterSectionType & {
  children: React.ReactNode;
  setMinMaxValues: (el: number | number[] | undefined) => void;
  step?: number;
  sectionId?: string;
  convertSelectedValues: (values: number[]) => string[];
  initialMin?: number;
  initialMax?: number;
  disabled?: boolean;
  minDistance?: number;
}) => {
  const [options, setOptions] = useQueryParams({
    [sectionId]: ArrayParam,
    [SharedFilterQueryParams.PAGE]: NumberParam,
    [CursorPaginationQueryParams.NEXT_PAGE_ID]: StringParam,
    [CursorPaginationQueryParams.PREV_PAGE_ID]: StringParam,
  });

  const theme: Theme = useTheme();

  const maxCounts = Math.max(...filters.map(fi => fi.count));
  const sliderStep = step || 1;
  const onSetValues = (values: number[]) => {
    const valuesAsString = convertSelectedValues(values);
    const valueMin = Math.ceil(values[0]);
    const valueMax = Math.ceil(values[1]);
    if (valueMin <= Math.ceil(initialMin || 0) && valueMax >= Math.ceil(initialMax || 0)) {
      setOptions(
        {
          [sectionId]: undefined,
          page: undefined,
          [CursorPaginationQueryParams.PREV_PAGE_ID]: undefined,
          [CursorPaginationQueryParams.NEXT_PAGE_ID]: undefined,
        },
        QueryParamTypes.PUSH_IN
      );
    } else if (options[sectionId] !== valuesAsString) {
      setOptions(
        {
          [sectionId]: valuesAsString,
          page: undefined,
          [CursorPaginationQueryParams.PREV_PAGE_ID]: undefined,
          [CursorPaginationQueryParams.NEXT_PAGE_ID]: undefined,
        },
        QueryParamTypes.PUSH_IN
      );
    }
  };

  const onClearFilterClick = useCallback(() => {
    setMinMaxValues([initialMin || 0, initialMax || 0]);
    setOptions({ [sectionId]: undefined, page: undefined }, QueryParamTypes.PUSH_IN);
  }, [setMinMaxValues, initialMin, initialMax, setOptions, sectionId]);

  return (
    <FilterContainer data-testid={`filter-section-${sectionId}`}>
      <FilterHeading
        title={title}
        Icon={Icon}
        numberOfSelectedFilters={Number(min !== initialMin || max !== initialMax)}
        onClearFilterClick={onClearFilterClick}
        isRange
      />
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
          onAfterChange={(el: number | number[] | undefined) =>
            el && typeof el !== "number" && onSetValues(el)
          }
          disabled={disabled}
          minDistance={minDistance}
        />
        <PriceWrapper>{children}</PriceWrapper>
      </Wrapper>
    </FilterContainer>
  );
};

export default RangeFilterBaseNew;
