import React, { useCallback, useState } from "react";
import { isNone, toUndefined } from "fp-ts/lib/Option";
import { ApolloError } from "apollo-client";

import { UsercontentContainer } from "../User/UserContent";
import { PBError } from "../PostBooking/components/PBError";

import PaymentProvidersQuery from "./queries/ProviderSettingsQuery.graphql";
import SavedCardsCreditCardForm from "./SavedCardsCreditCardForm";
import useSavedCardsQuery from "./hooks/useSavedCardsQuery";
import SavedPaymentsValueProps from "./SavedPaymentsValueProps";

import { DesktopContainer, MobileContainer } from "components/ui/Grid/Container";
import { noCacheHeaders } from "utils/apiUtils";
import useCurrency from "hooks/useCurrency";
import { SupportedCurrencies } from "types/enums";
import { StyledSection } from "components/ui/User/SharedStyledComponent";
import DefaultPageLoading from "components/ui/Loading/DefaultLoadingPage";
import ProductHeader from "components/ui/ProductHeader";
import { useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";
import useDocumentHidden from "hooks/useDocumentHidden";
import useQueryClient from "hooks/useQueryClient";

const SavedCardsContent = () => {
  const { t } = useTranslation(Namespaces.userProfileNs);
  const [queryError, setQueryError] = useState<ApolloError | undefined>(undefined);
  const handleOnError = useCallback((error: ApolloError | undefined) => {
    setQueryError(error);
  }, []);

  const { currencyCode } = useCurrency();
  const isCurrencyEmpty = isNone(currencyCode) || toUndefined(currencyCode) === undefined;
  const {
    data,
    loading: settingsLoading,
    error: settingsError,
    refetch: fetchCartData,
  } = useQueryClient<CartTypes.SavedPaymentProviderSettings>(PaymentProvidersQuery, {
    context: { headers: noCacheHeaders },
    variables: {
      input: { currency: toUndefined(currencyCode) as SupportedCurrencies },
    },
    skip: isCurrencyEmpty,
  });

  useDocumentHidden({
    onDocumentHiddenStatusChange: isCurrencyEmpty
      ? // eslint-disable-next-line @typescript-eslint/no-empty-function
        () => {}
      : fetchCartData,
  });

  const [savedCards, setSavedCards] = useState<CartTypes.QuerySaltPaySavedCard[]>([]);

  const { cardData, cardDataLoading, cardDataError } = useSavedCardsQuery(setSavedCards);

  const canDisplay = cardData && data;

  if (settingsError || queryError) {
    return <PBError error={settingsError || queryError} />;
  }

  if (!cardDataLoading && cardDataError) {
    return (
      <PBError
        error={cardDataError ?? new Error("Something went wrong while fetching your saved cards..")}
      />
    );
  }

  if (settingsLoading || isCurrencyEmpty || !cardData) {
    return <DefaultPageLoading />;
  }

  if (canDisplay) {
    const { paymentProviderSettings } = data;

    return (
      <DesktopContainer>
        <ProductHeader title={t("Saved payment methods")} />
        <SavedPaymentsValueProps />
        <UsercontentContainer>
          <StyledSection id="payment-methods">
            <MobileContainer>
              <SavedCardsCreditCardForm
                paymentProviderSettings={paymentProviderSettings}
                savedCards={savedCards}
                setSavedCards={setSavedCards}
                setOnError={handleOnError}
              />
            </MobileContainer>
          </StyledSection>
        </UsercontentContainer>
      </DesktopContainer>
    );
  }

  return null;
};

export default SavedCardsContent;
