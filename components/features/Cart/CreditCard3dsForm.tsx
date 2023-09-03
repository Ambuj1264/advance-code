import React, { useCallback, useEffect, useRef } from "react";
import styled from "@emotion/styled";
import { useTheme } from "emotion-theming";
import { css } from "@emotion/core";
import Head from "next/head";
import Bubbles from "@travelshift/ui/components/Bubbles/Bubbles";

import { constructPaymentRedirectUrl } from "./utils/cartUtils";
import { useCartContext } from "./contexts/CartContextState";

import MarketplaceLogo from "components/ui/Logo/MarketplaceLogo";
import { gutters, whiteColor, zIndex } from "styles/variables";
import Modal, { ModalContentWrapper } from "components/ui/Modal/Modal";
import { typographySubtitle2 } from "styles/typography";
import { Namespaces } from "shared/namespaces";
import { useTranslation } from "i18n";
import lazyCaptureException from "lib/lazyCaptureException";
import { SupportedLanguages } from "types/enums";
import { mqMin } from "styles/base";

const Hidden3dsFormWrapper = styled.div`
  display: none;
`;

const Hidden3DSIframe = styled.iframe`
  position: relative;
  z-index: ${zIndex.z1};
  width: 100%;
  height: calc(100% - 64px);
  padding-bottom: ${gutters.small * 2 + gutters.large}px;
  background-color: "transparent";
`;

const StyledModalContentWrapper = styled(ModalContentWrapper)`
  position: relative;
  padding-right: 0;
  padding-left: 0;
  overflow: hidden;

  ${mqMin.large} {
    padding-right: ${gutters.large}px;
    padding-left: ${gutters.large}px;
  }
`;

const ModalLogoContainer = styled.div`
  position: sticky;
  top: 0;
  left: 0;
  z-index: ${zIndex.z1};
  display: flex;
  align-items: center;
  justify-content: start;
  width: 100%;
  height: fit-content;
  padding: ${gutters.small}px;
  padding-top: ${gutters.large}px;
  background-color: ${whiteColor};

  ${mqMin.large} {
    padding-right: 0;
    padding-left: 0;
  }
`;

const NoIframeText = styled.p<{}>(({ theme }) => [
  typographySubtitle2,
  css`
    position: sticky;
    bottom: 0;
    left: 0;
    z-index: ${zIndex.z1};
    padding-top: ${gutters.small}px;
    padding-bottom: ${gutters.small}px;
    background-color: ${whiteColor};
    color: ${theme.colors.primary};
    text-align: center;
    text-decoration: underline;
    &:hover {
      cursor: pointer;
    }
  `,
]);

const BubblesWrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  transform: translate(-50%, -50%);
`;

// eslint-disable-next-line @typescript-eslint/no-empty-function
const emptyFunction = () => {};

const Hidden3DSForm = ({
  isUsingIframe = false,
  data3dsForm,
}: {
  isUsingIframe?: boolean;
  data3dsForm: CartTypes.NormalizedForm3dsData;
}) => {
  const form3DSRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (form3DSRef?.current) {
      const timer = setTimeout(() => form3DSRef?.current?.submit(), 250);
      return () => clearTimeout(timer);
    }
    return emptyFunction;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form3DSRef, data3dsForm, isUsingIframe]);

  return (
    <Hidden3dsFormWrapper>
      <form
        id="3DSMethodForm"
        action={data3dsForm.action}
        method="POST"
        acceptCharset="UTF-8"
        target={`${isUsingIframe ? "3DSMethodIframe" : "_self"}`}
        ref={form3DSRef}
      >
        <input type="hidden" name="_charset_" value="UTF-8" />
        {data3dsForm.inputs.map(input => (
          <input key={input.name} type="hidden" name={input.name} value={input.value} />
        ))}
      </form>
    </Hidden3dsFormWrapper>
  );
};

const CreditCard3dsForm = ({
  setFinalizeCheckoutInput,
  resubmitForm,
  activeLocale,
}: {
  setFinalizeCheckoutInput: (finalizeCheckoutInput: CartTypes.FinalizeCheckoutInput) => void;
  resubmitForm: (event: React.SyntheticEvent) => void;
  activeLocale: SupportedLanguages;
}) => {
  const iframe3DSRef = useRef<HTMLIFrameElement>(null);
  const { t } = useTranslation(Namespaces.orderNs);
  const theme: Theme = useTheme();
  const { setContextState, is3DSModalToggled, threeDSFormData, is3DSIframeDisabled } =
    useCartContext();

  const handleDisableIframe = useCallback(
    (event: React.SyntheticEvent) => {
      setContextState({ is3DSModalToggled: false });
      resubmitForm(event);
    },
    [resubmitForm, setContextState]
  );

  const handleIframeMessageError = useCallback(
    (msgErrorEvt: MessageEvent<CartTypes.ThreeDSIframeMessageEventData>) => {
      if (
        msgErrorEvt.data.isFinalizeCheckoutInputLoaded &&
        msgErrorEvt.origin === window.location.origin
      ) {
        lazyCaptureException(new Error(`Error on CreditCard3dsForm - messageerror`), {
          errorInfo: {
            messageerror_event: msgErrorEvt,
            threeDSFormData,
            // @ts-ignore
            errorMessage: error.message,
          },
        });
      }
    },
    [threeDSFormData]
  );

  const handleIframeMessage = useCallback(
    (msgEvent: MessageEvent<CartTypes.ThreeDSIframeMessageEventData>) => {
      if (
        msgEvent.data.isFinalizeCheckoutInputLoaded &&
        msgEvent.origin === window.location.origin
      ) {
        setFinalizeCheckoutInput(msgEvent.data.finalizeCheckoutInput);
        setContextState({ is3DSModalToggled: false });
      }
    },
    [setFinalizeCheckoutInput, setContextState]
  );

  useEffect(() => {
    if (!is3DSIframeDisabled) {
      window.addEventListener("message", handleIframeMessage);
      window.addEventListener("messageerror", handleIframeMessageError);
      return () => {
        window.removeEventListener("message", handleIframeMessage);
        window.removeEventListener("messageerror", handleIframeMessageError);
      };
    }
    return emptyFunction;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [is3DSIframeDisabled]);

  return (
    <>
      <Head>
        <link
          rel="preload"
          href={constructPaymentRedirectUrl({ activeLocale })}
          as="fetch"
          crossOrigin="anonymous"
        />
      </Head>
      {(() => {
        if (threeDSFormData) {
          if (is3DSIframeDisabled) {
            return <Hidden3DSForm data3dsForm={threeDSFormData} />;
          }
          if (is3DSModalToggled) {
            return (
              <Modal
                id="3DSModal"
                onClose={emptyFunction}
                variant="info"
                disableCloseOnOutsideClick
                wide
              >
                <StyledModalContentWrapper>
                  <ModalLogoContainer>
                    <MarketplaceLogo />
                  </ModalLogoContainer>
                  <BubblesWrapper>
                    <Bubbles theme={theme} color="primary" size="large" />
                  </BubblesWrapper>
                  <Hidden3DSIframe
                    id="3DSMethodIframe"
                    name="3DSMethodIframe"
                    frameBorder="0"
                    sandbox="allow-forms allow-scripts allow-same-origin"
                    ref={iframe3DSRef}
                  />
                  <Hidden3DSForm isUsingIframe data3dsForm={threeDSFormData} />
                  <NoIframeText onClick={handleDisableIframe} id="disableIframeButton">
                    {t("Should this window not load, please click here.")}
                  </NoIframeText>
                </StyledModalContentWrapper>
              </Modal>
            );
          }
        }
        return null;
      })()}
    </>
  );
};

export default CreditCard3dsForm;
