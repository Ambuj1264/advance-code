import React, { useState, useCallback } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import { withTheme } from "emotion-theming";
import rgba from "polished/lib/color/rgba";
import TextArea from "@travelshift/ui/components/Inputs/TextArea";
import Input from "@travelshift/ui/components/Inputs/Input";
import Button from "@travelshift/ui/components/Inputs/Button";

import { ModalFooterContainer, ModalContentWrapper } from "components/ui/Modal/Modal";
import { Trans, useTranslation } from "i18n";
import { gutters, whiteColor, greyColor } from "styles/variables";
import { ButtonSize } from "types/enums";
import useSession from "hooks/useSession";
import EnvelopeIcon from "components/icons/send-email-envelope.svg";
import { mqMin } from "styles/base";
import { typographySubtitle1 } from "styles/typography";

const Field = styled.div`
  margin-top: ${gutters.large}px;
  width: 100%;
`;

const IconWrapper = styled.span`
  margin-right: 10px;
  line-height: 0;
  svg {
    width: 23px;
  }
  path {
    fill: ${whiteColor};
  }
`;

const InfoText = styled.div([
  typographySubtitle1,
  css`
    margin-top: ${gutters.small}px;
    color: ${rgba(greyColor, 0.7)};
    text-align: center;
    ${mqMin.large} {
      margin-top: ${gutters.large}px;
    }
  `,
]);

const formStyles = css`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
  overflow-y: auto;
`;

type Props = {
  productName: string;
  theme: Theme;
  onClose: () => void;
  csrfToken: string;
  isSent: boolean;
  hasError: boolean;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

const ContactUsModalContent = withTheme(
  ({ productName, theme, onClose, csrfToken, isSent, hasError, handleSubmit }: Props) => {
    const { user } = useSession();
    const isLoggedIn = Boolean(user);
    const [name, setName] = useState((user && user.name) || "");
    const [email, setEmail] = useState((user && user.email) || "");
    const [text, setText] = useState("");

    const { t } = useTranslation();

    const onNameChange = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => setName(event.currentTarget.value),
      []
    );
    const onEmailChange = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => setEmail(event.currentTarget.value),
      []
    );
    const onTextChange = useCallback(
      (event: React.ChangeEvent<HTMLTextAreaElement>) => setText(event.currentTarget.value),
      []
    );
    return (
      <form css={formStyles} method="POST" action="/api/contact" onSubmit={handleSubmit}>
        <ModalContentWrapper>
          <InfoText>
            {hasError && (
              <Trans>There was a problem sending your message. Please try again later.</Trans>
            )}
            {isSent && <Trans>Your message has been sent</Trans>}
            {!hasError && !isSent && <Trans>You will receive an answer within 24 hours</Trans>}
          </InfoText>
          {!isSent && (
            <>
              <input
                type="hidden"
                name="kohana-csrf"
                value={csrfToken}
                data-testid="contact-us-csrf"
              />
              <input
                type="hidden"
                name="subject"
                value={productName}
                data-testid="contact-us-subject"
              />
              <Field>
                <Input
                  type={isLoggedIn ? "hidden" : "text"}
                  name="name"
                  placeholder={t("Your name")}
                  value={name}
                  onChange={onNameChange}
                  required
                />
              </Field>
              <Field>
                <Input
                  type={isLoggedIn ? "hidden" : "email"}
                  name="email"
                  placeholder={t("Your email")}
                  value={email}
                  onChange={onEmailChange}
                  required
                />
              </Field>
              <Field>
                <TextArea
                  name="text"
                  placeholder={t("Let us help you…")}
                  value={text}
                  onChange={onTextChange}
                  rows={7}
                  required
                />
              </Field>
            </>
          )}
        </ModalContentWrapper>
        <ModalFooterContainer>
          {isSent ? (
            <Button
              testId="contact-us-close"
              onClick={onClose}
              theme={theme}
              buttonSize={ButtonSize.Medium}
            >
              <Trans>Close</Trans>
            </Button>
          ) : (
            <Button
              testId="contact-us-send-message"
              type="submit"
              theme={theme}
              buttonSize={ButtonSize.Medium}
              color="action"
            >
              <IconWrapper>
                <EnvelopeIcon />
              </IconWrapper>
              <Trans>Send message</Trans>
            </Button>
          )}
        </ModalFooterContainer>
      </form>
    );
  }
);

export default ContactUsModalContent;
