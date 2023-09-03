import React, { useEffect } from "react";
import styled from "@emotion/styled";
import withStyles from "isomorphic-style-loader/withStyles";
import { useRouter } from "next/router";
import styles from "@travelshift/ui/components/Header/styles";
import { StringParam, useQueryParams } from "use-query-params";

import { OrderPaymentProvider } from "./types/cartEnums";

import DefaultPageLoading from "components/ui/Loading/DefaultLoadingPage";
import { isBrowser } from "utils/helperUtils";
import { Namespaces } from "shared/namespaces";
import { useTranslation } from "i18n";
import { CartQueryParam, PaymentLinkQueryParam } from "types/enums";
import useActiveLocale from "hooks/useActiveLocale";
import { constructLocalizedUrl } from "utils/routerUtils";
import { whiteColor } from "styles/variables";
import { ROUTE_NAMES } from "shared/routeNames";

const StyledDefaultPageLoading = styled(DefaultPageLoading)`
  width: 100vw;
  height: 100vh;
  background-color: ${whiteColor};
`;

const PaymentRedirectContainer = ({
  finalizeCheckoutInput,
}: {
  finalizeCheckoutInput?: CartTypes.FinalizeCheckoutInput;
}) => {
  const isViewedFromIframe = isBrowser && window.self !== window.top;
  const { t } = useTranslation(Namespaces.orderNs);
  const router = useRouter();
  const activeLocale = useActiveLocale();
  const [{ paymentLinkId, paymentProvider: queryParamPaymentProvider }] = useQueryParams({
    [PaymentLinkQueryParam.PAYMENT_LINK_ID]: StringParam,
    [CartQueryParam.PAYMENT_PROVIDER]: StringParam,
  });
  const returnRouteName = paymentLinkId ? ROUTE_NAMES.PAYMENT_LINK : ROUTE_NAMES.CART;
  const normalizedFinalizeCheckoutInput =
    queryParamPaymentProvider === OrderPaymentProvider.PAYMAYA && !finalizeCheckoutInput?.length
      ? OrderPaymentProvider.PAYMAYA
      : finalizeCheckoutInput;

  useEffect(() => {
    if (isViewedFromIframe && window?.top) {
      window.top.postMessage(
        {
          finalizeCheckoutInput: normalizedFinalizeCheckoutInput,
          isFinalizeCheckoutInputLoaded: true,
        },
        window.location.origin
      );
    } else if (window.self === window.top) {
      const returnUrl = `${constructLocalizedUrl(
        window.location.host,
        activeLocale
      )}/${returnRouteName}`;
      router.push(
        {
          pathname: `/${returnRouteName}`,
          query: {
            finalizeCheckoutInput: normalizedFinalizeCheckoutInput,
            paymentLinkId,
          },
        },
        `${
          paymentLinkId
            ? `${returnUrl}?${PaymentLinkQueryParam.PAYMENT_LINK_ID}=${paymentLinkId}`
            : returnUrl
        }`
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    activeLocale,
    finalizeCheckoutInput,
    isViewedFromIframe,
    paymentLinkId,
    returnRouteName,
    normalizedFinalizeCheckoutInput,
  ]);

  return (
    <StyledDefaultPageLoading
      disableResponsiveTypography={isViewedFromIframe}
      title={t("Processing...")}
    />
  );
};

export default withStyles(...styles)(PaymentRedirectContainer);
