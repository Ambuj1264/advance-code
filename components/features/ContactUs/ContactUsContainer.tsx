import React, { useCallback, useMemo, useState } from "react";
import useStyles from "isomorphic-style-loader/useStyles";
import textAreaStyles from "@travelshift/ui/components/Inputs/TextArea.scss";

import ContactUsButton, { ContactUsMobileMargin } from "./ContactUsButton";

import CustomNextDynamic from "lib/CustomNextDynamic";
import Modal, { CloseButton, ModalHeader } from "components/ui/Modal/Modal";
import { useTranslation } from "i18n";
import useToggle from "hooks/useToggle";
import { Direction } from "types/enums";

const ContactUsModalContent = CustomNextDynamic(() => import("./ContactUsModalContent"), {
  ssr: false,
  loading: () => null,
});

const ContactUsContainer = ({
  buttonPosition,
  zIndexValue,
  mobileMargin = ContactUsMobileMargin.WithoutFooter,
  ...rest
}: {
  productName: string;
  buttonPosition?: Direction;
  mobileMargin?: number;
  zIndexValue?: number;
}) => {
  useStyles(textAreaStyles);

  const [isToggled, toggle] = useToggle();
  const [isSent, setSent] = useState(false);
  const [hasError, setError] = useState(false);
  const csrf = useMemo(() => {
    if (typeof window === "undefined") {
      return "";
    }
    const match = document.cookie.match(/(.)X-CSRF-token=([^;]+)/);
    if (match) {
      return decodeURI(match[2]).split("~")[1];
    }
    return "";
  }, []);
  const handleSubmit = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
    event.persist();
    event.preventDefault();
    const formElement = event.target as HTMLFormElement;
    const { action, method } = formElement;
    const formData = new FormData(formElement);
    const response = await fetch(action, {
      method,
      mode: "no-cors",
      body: formData,
    });
    if (response.status !== 200) {
      setError(true);
    } else {
      setSent(true);
    }
  }, []);
  const { t } = useTranslation();

  return (
    <>
      <ContactUsButton
        label={t("Contact Us")}
        onClick={toggle}
        position={buttonPosition}
        mobileMargin={mobileMargin}
        zIndexValue={zIndexValue}
      />
      {isToggled && (
        <Modal id="contact-us-modal" onClose={toggle} noMinHeight topMost>
          <ModalHeader
            title={t("Contact Us")}
            rightButton={<CloseButton on="tap:contact-us-modal.close" onClick={toggle} />}
          />
          <ContactUsModalContent
            {...rest}
            onClose={toggle}
            csrfToken={csrf}
            isSent={isSent}
            hasError={hasError}
            handleSubmit={handleSubmit}
          />
        </Modal>
      )}
    </>
  );
};

export default ContactUsContainer;
