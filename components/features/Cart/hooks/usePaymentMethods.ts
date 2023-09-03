import { useEffect, useState } from "react";

import PaymentMethodsQuery from "../queries/PaymentMethodsQuery.graphql";

import useQueryClient from "hooks/useQueryClient";
import { noCacheHeaders } from "utils/apiUtils";
import lazyCaptureException from "lib/lazyCaptureException";
import { SupportedCurrencies, SupportedLanguages } from "types/enums";

const usePaymentMethods = ({
  shopperLocale,
  currency,
  amount,
  countryCode,
  paymentLinkId,
  ipCountryCode,
  skip = false,
}: {
  shopperLocale: SupportedLanguages;
  currency: SupportedCurrencies;
  amount: number;
  countryCode: string;
  paymentLinkId?: string;
  ipCountryCode?: string;
  skip?: boolean;
}) => {
  const [isLoading, setIsLoading] = useState(true);

  const { error, data, loading } = useQueryClient<CartTypes.QueryPaymentMethods>(
    PaymentMethodsQuery,
    {
      variables: {
        input: {
          shopperLocale,
          currency,
          amount,
          countryCode,
          ipCountryCode,
          payByLinkId: paymentLinkId,
        },
      },
      context: {
        headers: noCacheHeaders,
      },
      skip: skip || ipCountryCode === "",
      fetchPolicy: "network-only",
      onCompleted: () => {
        // This is being done as sometimes loading is stuck on true due to a bug in apollo
        // https://github.com/apollographql/react-apollo/issues/3270
        setIsLoading(false);
      },
      onError: apolloError => {
        setIsLoading(false);
        lazyCaptureException(apolloError);
      },
    }
  );

  useEffect(() => {
    if (loading) {
      setIsLoading(true);
    }
  }, [loading]);

  return { error, data, loading: isLoading, ipCountryCode };
};

export default usePaymentMethods;
