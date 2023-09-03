import React, { ElementType, useEffect } from "react";
import { ArrayParam, useQueryParams } from "use-query-params";

import RangeFilterBaseNew, { PriceTitle, MaxPriceWrapper } from "./RangeFilterBaseNew";
import useFilteredRange from "./useFilteredRange";

import { useCurrencyWithDefault } from "hooks/useCurrency";
import { Trans } from "i18n";
import { Namespaces } from "shared/namespaces";
import currencyFormatter from "utils/currencyFormatUtils";

const RangePriceFilterSection = ({
  min,
  max,
  filters,
  title,
  Icon,
  sectionId,
  withCurrencyConversion = true,
  isLoading,
  priceRangeEnabled,
}: {
  min: number;
  max: number;
  filters: SearchPageTypes.RangeFilter[];
  title: string;
  Icon: ElementType<any>;
  sectionId: string;
  withCurrencyConversion?: boolean;
  isLoading?: boolean;
  priceRangeEnabled?: boolean;
}) => {
  const { currencyCode, convertCurrency } = useCurrencyWithDefault();
  const [{ [sectionId]: queryValues }] = useQueryParams({
    [sectionId]: ArrayParam,
  });
  const roundedMin = Math.floor(min);
  const roundedMax = Math.ceil(max);
  const [queryMin, queryMax] = queryValues || [undefined, undefined];
  const defaultMin = queryMin ? Number(queryMin) : roundedMin;
  const defaultMax = queryMax ? Number(queryMax) : roundedMax;

  const [[minValue, maxValue], setMinMaxValues] = useFilteredRange({
    min,
    max,
  });

  const convertedMin = withCurrencyConversion ? convertCurrency(minValue) : minValue;
  const convertedMax = withCurrencyConversion ? convertCurrency(maxValue) : maxValue;
  const hasFilters = filters.length > 1;
  const convertSelectedValues = (values: number[]) => values.map(value => String(value));

  useEffect(() => {
    setMinMaxValues([defaultMin, defaultMax]);
  }, [defaultMin, defaultMax, setMinMaxValues]);

  if ((!hasFilters && !priceRangeEnabled) || (priceRangeEnabled && !hasFilters && !isLoading))
    return null;
  const roundedFilters = filters.map(filter => ({
    ...filter,
    id: Math.ceil(Number(filter.id)).toString(),
  }));

  return (
    <RangeFilterBaseNew
      min={minValue}
      max={maxValue}
      filters={roundedFilters}
      convertSelectedValues={convertSelectedValues}
      setMinMaxValues={setMinMaxValues}
      title={title}
      Icon={Icon}
      sectionId={sectionId}
      initialMin={roundedMin}
      initialMax={roundedMax}
      minDistance={1}
      data-testid={`filter-section-${sectionId}`}
    >
      <div>
        <PriceTitle>
          <Trans ns={Namespaces.commonSearchNs}>Min price</Trans>
        </PriceTitle>
        <div>{`${currencyFormatter(convertedMin)} ${currencyCode}`}</div>
      </div>
      <MaxPriceWrapper>
        <PriceTitle>
          <Trans ns={Namespaces.commonSearchNs}>Max price</Trans>
        </PriceTitle>
        <div>{`${currencyFormatter(convertedMax)} ${currencyCode}`}</div>
      </MaxPriceWrapper>
    </RangeFilterBaseNew>
  );
};

export default RangePriceFilterSection;
