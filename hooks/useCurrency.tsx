import { useMutation } from "@apollo/react-hooks";
import { fromNullable, mapNullable, map, getOrElse, isNone, toUndefined } from "fp-ts/lib/Option";
import { pipe } from "fp-ts/lib/pipeable";
import { useCallback, useMemo } from "react";
import { HeaderTypes } from "@travelshift/ui/typings/headerTypes";

import currencyQuery from "./queries/CurrencyQuery.graphql";
import UpdateActiveCurrencyMutation from "./queries/UpdateActiveCurrencyMutation.graphql";
import useQueryClient from "./useQueryClient";

import { noCacheHeaders } from "utils/apiUtils";
import { useSettings } from "contexts/SettingsContext";

type CurrencyData = Readonly<{
  activeSession: {
    id: string;
    activeCurrency?: Currency;
  };
}>;

const useCurrency = () => {
  const [updateActiveCurrencyMutation] = useMutation<
    HeaderTypes.MutationUpdateActiveCurrencyData,
    HeaderTypes.MutationUpdateActiveCurrencyVariables
  >(UpdateActiveCurrencyMutation);

  const { data } = useQueryClient<CurrencyData>(currencyQuery, {
    context: { headers: { ...noCacheHeaders } },
  });

  const updateActiveCurrency = useCallback(
    (currencyCode: string) => {
      updateActiveCurrencyMutation({
        variables: { currencyCode },
      });
    },
    [updateActiveCurrencyMutation]
  );

  const activeCurrency = pipe(
    fromNullable(data),
    mapNullable(sessionData => sessionData.activeSession),
    mapNullable(session => session.activeCurrency)
  );

  const currencyCode = pipe(
    activeCurrency,
    mapNullable(currency => currency.currencyCode)
  );
  const convertCurrency = (value: number) =>
    pipe(
      activeCurrency,
      map(currency => value * currency.rate)
    );

  const convertFromSelectedCurrencyToBaseCurrency = (value: number) =>
    pipe(
      activeCurrency,
      map(currency => value / currency.rate)
    );

  const isCurrencyEmpty = isNone(currencyCode) || toUndefined(currencyCode) === undefined;

  return useMemo(
    () => ({
      currencyCode,
      convertCurrency,
      updateActiveCurrency,
      convertFromSelectedCurrencyToBaseCurrency,
      isCurrencyEmpty,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activeCurrency]
  );
};

export default useCurrency;

export const useCurrencyWithDefault = () => {
  const {
    currencyCode,
    convertCurrency,
    updateActiveCurrency,
    convertFromSelectedCurrencyToBaseCurrency,
  } = useCurrency();
  const { marketplaceBaseCurrency } = useSettings();

  return useMemo(
    () => ({
      currencyCode: getOrElse(() => marketplaceBaseCurrency)(currencyCode),
      convertCurrency: (value: number) =>
        pipe(
          convertCurrency(value),
          getOrElse(() => value)
        ),
      updateActiveCurrency,
      convertFromSelectedCurrencyToBaseCurrency: (value: number) =>
        pipe(
          convertFromSelectedCurrencyToBaseCurrency(value),
          getOrElse(() => value)
        ),
    }),
    [
      convertCurrency,
      convertFromSelectedCurrencyToBaseCurrency,
      currencyCode,
      marketplaceBaseCurrency,
      updateActiveCurrency,
    ]
  );
};
