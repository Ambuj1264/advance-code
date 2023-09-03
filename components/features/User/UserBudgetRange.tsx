import React from "react";

import RangeUserBudgetBase from "../../ui/User/RangeUserBudgetBase";

import { Namespaces } from "shared/namespaces";
import { useCurrencyWithDefault } from "hooks/useCurrency";
import { MaxPriceWrapper, PriceTitle } from "components/ui/Filters/RangeFilterBaseNew";
import currencyFormatter from "utils/currencyFormatUtils";
import { useTranslation } from "i18n";
import useFilteredRange from "components/ui/Filters/useFilteredRange";

const UserBudgetRange = ({
  initialMin,
  initialMax,
  travelBudget,
  priceFilters,
  onAfterChange,
}: {
  initialMin: number;
  initialMax: number;
  travelBudget: { min: number; max: number };
  priceFilters: SearchPageTypes.RangeFilter[];
  onAfterChange: (el: number[]) => void;
}) => {
  const { t } = useTranslation(Namespaces.userProfileNs);
  const roundedMin = Math.ceil(initialMin);
  const roundedMax = Math.ceil(initialMax);

  const { min, max } = travelBudget;

  const [[minValue, maxValue], setMinMaxValues] = useFilteredRange({
    min,
    max,
  });

  const { currencyCode, convertCurrency } = useCurrencyWithDefault();

  const convertedMin = convertCurrency(minValue);
  const convertedMax = convertCurrency(maxValue);
  return (
    <RangeUserBudgetBase
      min={minValue}
      max={maxValue}
      filters={priceFilters}
      setMinMaxValues={setMinMaxValues}
      onAfterChange={onAfterChange}
      title={t("Budget")}
      initialMin={roundedMin}
      initialMax={roundedMax}
      minDistance={1}
    >
      <div>
        <PriceTitle>{t("Min price")}</PriceTitle>
        <div>{`${currencyFormatter(convertedMin)} ${currencyCode}`}</div>
      </div>
      <MaxPriceWrapper>
        <PriceTitle>{t("Max price")}</PriceTitle>
        <div>{`${currencyFormatter(convertedMax)} ${currencyCode}`}</div>
      </MaxPriceWrapper>
    </RangeUserBudgetBase>
  );
};

export default UserBudgetRange;
