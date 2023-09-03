import Core from "@adyen/adyen-web/dist/types/core";
import React from "react";
import { Global } from "@emotion/core";
import { useTheme } from "emotion-theming";
import styled from "@emotion/styled";

import { PaymentMethodContainer, QRCodeStyles } from "../adyenStyles";
import { PaymentMethodType } from "../../types/cartEnums";
import { useIsMobile } from "../../../../../hooks/useMediaQueryCustom";

import useEffectOnce from "hooks/useEffectOnce";

const WECHAT_QR_CONTAINER = "wechatpayQR-container";

const WeChatDesktopContainer = styled.div``;

const WeChat = ({
  checkoutRef,
  adyenRef,
  paymentMethods,
  setFinalizeCheckoutInput,
}: {
  checkoutRef: React.RefObject<Core>;
  adyenRef: React.MutableRefObject<CartTypes.AdyenRefType | null>;
  paymentMethods: CartTypes.PaymentMethod[];
  setFinalizeCheckoutInput: (finalizeCheckoutInput: CartTypes.FinalizeCheckoutInput) => void;
}) => {
  const theme: Theme = useTheme();
  const isMobile = useIsMobile();
  const weChatPaymentMethod = paymentMethods.find(
    ({ type }) => type === PaymentMethodType.WECHAT_QR || type === PaymentMethodType.WECHAT_PAY
  );

  useEffectOnce(() => {
    if (weChatPaymentMethod && checkoutRef.current) {
      // eslint-disable-next-line no-param-reassign
      adyenRef.current = {
        ...adyenRef.current,
        [weChatPaymentMethod.type]: checkoutRef.current
          .create(weChatPaymentMethod.type, {
            onAdditionalDetails: (state: { data: { details: any } }) => {
              setFinalizeCheckoutInput(JSON.stringify(state.data.details));
            },
          })
          .mount(`#${WECHAT_QR_CONTAINER}`),
      };
    }
  });

  if (!weChatPaymentMethod) {
    return null;
  }

  const Wrapper = isMobile ? PaymentMethodContainer : WeChatDesktopContainer;

  return (
    <>
      {!isMobile && <Global styles={QRCodeStyles(theme)} />}
      <Wrapper id={WECHAT_QR_CONTAINER} />
    </>
  );
};

export default WeChat;
