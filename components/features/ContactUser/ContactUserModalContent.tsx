import React, { useCallback, useState } from "react";
import styled from "@emotion/styled";
import { useTheme } from "emotion-theming";
import { css } from "@emotion/core";
import rgba from "polished/lib/color/rgba";
import TextArea from "@travelshift/ui/components/Inputs/TextArea";
import Button from "@travelshift/ui/components/Inputs/Button";

import { ModalContentWrapper, ModalFooterContainer } from "components/ui/Modal/Modal";
import { greyColor, gutters, whiteColor } from "styles/variables";
import { ButtonSize } from "types/enums";
import EnvelopeIcon from "components/icons/send-email-envelope.svg";
import { typographySubtitle1 } from "styles/typography";
import { mqMin } from "styles/base";

const ContactUserForm = styled.form`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
  overflow-y: auto;
`;

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

const ContactUserModalContent = ({
  onSubmit,
  isSent,
  onClose,
  errors,
  translations,
}: {
  onSubmit: (text: string) => void;
  onClose: () => void;
  isSent: boolean;
  errors: string[];
  translations: ContactUserTypes.Translations;
}) => {
  const [text, setText] = useState("");
  const theme: Theme = useTheme();
  const hasError = !!errors.length;

  const onTextChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => setText(e.currentTarget.value),
    []
  );

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(text);
  };

  return (
    <ContactUserForm onSubmit={submitHandler}>
      <ModalContentWrapper>
        <InfoText>
          {hasError && errors.map(errorText => errorText)}
          {isSent && translations.messageSentInfo}
        </InfoText>

        {!isSent && (
          <Field>
            <TextArea
              name="text"
              placeholder={translations.placeholder}
              value={text}
              onChange={onTextChange}
              rows={7}
              required
            />
          </Field>
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
            {translations.closeButton}
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
            {translations.sendMessageButton}
          </Button>
        )}
      </ModalFooterContainer>
    </ContactUserForm>
  );
};

export default ContactUserModalContent;
