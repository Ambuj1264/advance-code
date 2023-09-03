import React, { useState, useEffect, useContext } from "react";
import { useMutation } from "@apollo/react-hooks";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import ContactUserModalContent from "./ContactUserModalContent";
import SendContactMessageMutation from "./queries/SendContactMessageMutation.graphql";

import { useSettings } from "contexts/SettingsContext";
import LocaleContext from "contexts/LocaleContext";
import useToggle from "hooks/useToggle";
import useSession from "hooks/useSession";
import Modal, { ModalHeader, CloseButton } from "components/ui/Modal/Modal";
import { useTranslation } from "i18n";
import { borderRadiusSmall, whiteColor } from "styles/variables";
import { typographySubtitle2 } from "styles/typography";
import { Namespaces } from "shared/namespaces";

const ContactUserButton = styled.button([
  typographySubtitle2,
  ({ theme }) => css`
    display: inline-block;
    margin: 0;
    border: 0;
    border-radius: ${borderRadiusSmall};
    min-width: 212px;
    padding: 12px;
    background: ${theme.colors.primary};
    cursor: pointer;
    color: ${whiteColor};
    line-height: inherit;
    text-align: center;
  `,
]);

const getDefaultTranslations = (t: TFunction) => ({
  messageSentInfo: t("Your message has been sent"),
  closeButton: t("Close"),
  sendMessageButton: t("Send message"),
});

const ContactUserContainer = ({
  author,
  translations: inputTranslations,
}: {
  author: ArticleLayoutTypes.ArticleAuthor;
  translations: ContactUserTypes.InputTranslations;
}) => {
  const { t } = useTranslation(Namespaces.commonNs);
  const translations: Required<ContactUserTypes.Translations> = {
    ...getDefaultTranslations(t),
    ...inputTranslations,
  };

  const [isToggled, toggle] = useToggle();
  const { user } = useSession();
  const { marketplaceUrl } = useSettings();
  const activeLocale = useContext(LocaleContext);
  const isLoggedIn = Boolean(user);
  const [isSent, setIsSent] = useState<boolean>(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [mutate] = useMutation<{
    sendContactMessage: {
      status: boolean;
      errorMessages: string[];
    };
  }>(SendContactMessageMutation);

  const handleSubmit = async (text: string) => {
    if (!isLoggedIn) {
      /*
       * For now we haven't modal with a login form, so here is temporarily redirect to "https://guidetoiceland.is/login
       * */
      if (typeof window !== "undefined") {
        // eslint-disable-next-line functional/immutable-data
        window.location.href = `${marketplaceUrl}/${activeLocale}/login`;
      }

      return;
    }

    try {
      const response = await mutate({
        variables: {
          text,
          userId: author.id,
        },
      });

      const responseStatus = response?.data?.sendContactMessage?.status ?? false;
      const responseErrors = response?.data?.sendContactMessage?.errorMessages ?? [];

      if (responseStatus) {
        setIsSent(true);
      } else {
        setErrors(responseErrors);
      }
    } catch {
      setErrors([t("There was a problem sending your message. Please try again later.")]);
    }
  };

  useEffect(
    function clearModalDataOnClose() {
      if (!isToggled) {
        setIsSent(false);
        setErrors([]);
      }
    },
    [isToggled]
  );

  return (
    <>
      <ContactUserButton type="button" onClick={toggle}>
        {translations.modalTitle}
      </ContactUserButton>
      {isToggled && (
        <Modal id="contact-user-modal" onClose={toggle} noMinHeight>
          <ModalHeader
            title={translations.modalTitle}
            rightButton={<CloseButton on="tap:contact-us-modal.close" onClick={toggle} />}
          />
          <ContactUserModalContent
            onSubmit={handleSubmit}
            onClose={toggle}
            isSent={isSent}
            errors={errors}
            translations={translations}
          />
        </Modal>
      )}
    </>
  );
};

export default ContactUserContainer;
