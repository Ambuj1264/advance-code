import React, { ElementType, useEffect } from "react";
import { ArrayParam, useQueryParams } from "use-query-params";

import RangeFilterBaseNew, { PriceTitle, MaxPriceWrapper } from "./RangeFilterBaseNew";
import useFilteredRange from "./useFilteredRange";

import { Trans } from "i18n";
import { Namespaces } from "shared/namespaces";

const RangeTimeFilterSection = ({
  min,
  max,
  filters,
  title,
  Icon,
  sectionId,
  disabled = false,
}: {
  min: number;
  max: number;
  filters: SearchPageTypes.RangeFilter[];
  title: string;
  Icon: ElementType<any>;
  sectionId: string;
  disabled?: boolean;
}) => {
  const [{ [sectionId]: queryValues }] = useQueryParams({
    [sectionId]: ArrayParam,
  });
  const [queryMin, queryMax] = queryValues || [undefined, undefined];
  const adjustedMin = Math.floor(min / 3600);
  const adjustedMax = Math.ceil(max / 3600);
  const adjustedQueryMin = queryMin ? Math.floor(Number(queryMin) / 3600) : adjustedMin;
  const adjustedQueryMax = queryMax ? Math.ceil(Number(queryMax) / 3600) : adjustedMax;
  const [[minValue, maxValue], setMinMaxValues] = useFilteredRange({
    min: adjustedQueryMin,
    max: adjustedQueryMax,
  });
  useEffect(() => {
    setMinMaxValues([adjustedQueryMin, adjustedQueryMax]);
  }, [adjustedQueryMin, adjustedQueryMax, setMinMaxValues]);

  if (filters.length <= 1) return null;
  const adjustedTimeFilters = filters.map(filter => ({
    ...filter,
    id: Math.ceil(Number(filter.id) / 3600).toString(),
  }));

  const onSetconvertSelectedValuesValues = (values: number[]) =>
    values.map(value => (value * 3600).toString());
  return (
    <RangeFilterBaseNew
      min={minValue}
      max={maxValue}
      filters={adjustedTimeFilters}
      setMinMaxValues={setMinMaxValues}
      title={title}
      Icon={Icon}
      sectionId={sectionId}
      convertSelectedValues={onSetconvertSelectedValuesValues}
      initialMin={adjustedMin}
      initialMax={adjustedMax}
      disabled={disabled}
      data-testid={`filter-section-${sectionId}`}
    >
      <div>
        <PriceTitle>
          <Trans ns={Namespaces.commonSearchNs}>Min time</Trans>
        </PriceTitle>
        <div>
          <Trans
            ns={Namespaces.commonSearchNs}
            i18nKey="{numberOfHours} hours"
            defaults="{numberOfHours} hours"
            values={{ numberOfHours: disabled ? 0 : minValue }}
          />
        </div>
      </div>
      <MaxPriceWrapper>
        <PriceTitle>
          <Trans ns={Namespaces.commonSearchNs}>Max time</Trans>
        </PriceTitle>
        <div>
          <Trans
            ns={Namespaces.commonSearchNs}
            i18nKey="{numberOfHours} hours"
            defaults="{numberOfHours} hours"
            values={{ numberOfHours: disabled ? 0 : maxValue }}
          />
        </div>
      </MaxPriceWrapper>
    </RangeFilterBaseNew>
  );
};

export default RangeTimeFilterSection;
