import React, { ChangeEvent, useState } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import { useTheme } from "emotion-theming";
import { ButtonSize } from "@travelshift/ui/types/enums";
import { useMutation } from "@apollo/react-hooks";
import rgba from "polished/lib/color/rgba";

import SubscriptionMutation from "./queries/SubscriptionMutation.graphql";

import SectionRow from "components/ui/Section/SectionRow";
import useToggle from "hooks/useToggle";
import CheckIcon from "components/icons/check-1.svg";
import { Namespaces } from "shared/namespaces";
import {
  gutters,
  fontWeightSemibold,
  greyColor,
  borderRadiusSmall,
  fontSizeBody2,
  fontSizeBody1,
  whiteColor,
  redColor,
} from "styles/variables";
import { Trans, useTranslation } from "i18n";
import { mediaQuery } from "styles/base";
import Button from "components/ui/Inputs/Button";
import { typographyBody1, typographyH5, typographyCaption } from "styles/typography";
import BellIcon from "components/icons/alarm-bell-1.svg";
import EnvelopeIcon from "components/icons/envelope.svg";
import Modal, { ModalHeader, CloseButton } from "components/ui/Modal/Modal";
import { PageType } from "types/enums";

const ContainerForm = styled.form`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

const InputContainer = styled.div([
  css`
    position: relative;
    display: flex;
    width: 100%;
  `,
  mediaQuery({
    maxWidth: [300, 400, 500],
  }),
]);

const StyledInput = styled.input([
  typographyCaption,
  css`
    display: flex;
    align-items: center;
    border: 1px solid ${rgba(greyColor, 0.5)};
    border-radius: ${borderRadiusSmall};
    width: 100%;
    height: 50px;
    padding-right: ${gutters.small / 2}px;
    padding-left: ${gutters.large * 2 + gutters.large / 4}px;
    color: ${greyColor};
    font-family: inherit;
    font-size: ${fontSizeBody2};

    &::placeholder {
      color: ${rgba(greyColor, 0.5)};
    }
  `,
]);

const ButtonTitle = styled.span([
  css`
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  `,
  mediaQuery({
    marginRight: [0, gutters.small / 2, gutters.small],
  }),
]);

const StyledButtonContainer = styled.div([
  css`
    margin-left: ${gutters.small}px;
    button {
      ${mediaQuery({
        fontSize: [fontSizeBody2, fontSizeBody2, fontSizeBody1],
      })}
    }
  `,
  mediaQuery({
    minWidth: [125, 165, 230],
  }),
]);

const ButtonContent = styled.span`
  display: flex;
  align-items: center;
  line-height: 20px;
`;

const StyledBellIcon = styled(BellIcon)([
  css`
    min-width: 21px;
    height: 15px;
    fill: ${whiteColor};
  `,
  mediaQuery({
    display: ["none", "block", "block"],
    marginRight: [0, gutters.small / 2, gutters.small],
  }),
]);

const StyledEnvelopeIcon = styled(EnvelopeIcon)(
  ({ theme }) => css`
    position: absolute;
    top: 50%;
    left: 16px;
    width: 24px;
    height: 24px;
    transform: translateY(-50%);
    fill: ${theme.colors.primary};
  `
);

const ErrorMessage = styled.div`
  position: absolute;
  top: calc(100% + ${gutters.small / 4}px);
  left: 0;
  color: ${redColor};
  font-size: ${fontSizeBody2};
`;

const ModalContentHolder = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: auto 0;
  padding: ${gutters.large}px;
`;

const ModalTitle = styled.div([
  typographyH5,
  ({ theme }) => css`
    color: ${theme.colors.primary};
    font-weight: ${fontWeightSemibold};
  `,
]);

const ModalMessage = styled.div([
  typographyBody1,
  css`
    margin-top: ${gutters.small / 2}px;
  `,
]);

const StyledIcon = styled(CheckIcon)(
  ({ theme }) => css`
    margin-right: ${gutters.small / 2}px;
    width: 14px;
    height: 13px;
    fill: ${theme.colors.action};
  `
);

const StyledSectionRow = styled(SectionRow)`
  margin: ${gutters.small / 2}px;
`;

const SubscriptionForm = () => {
  const [email, setEmail] = useState("");
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const [isModalOpen, toggleModal] = useToggle();
  const theme: Theme = useTheme();
  const [mutate] = useMutation<{
    subscribe: {
      status: boolean;
      errorMessages: Array<string>;
    };
  }>(SubscriptionMutation);

  const { t } = useTranslation(Namespaces.commonNs);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await mutate({
        variables: {
          email,
          type: PageType.PAGE,
        },
      });

      const status = response?.data?.subscribe?.status ?? false;
      const errorList = response?.data?.subscribe?.errorMessages ?? [];

      if (status) {
        setErrorMessages([]);
        setEmail("");
        toggleModal();
      } else {
        setErrorMessages(errorList);
      }
    } catch {
      setErrorMessages([t("There was a problem sending your message. Please try again later.")]);
    }
  };

  const onChangeEmail = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setErrorMessages([]);
  };

  return (
    <>
      <StyledSectionRow title={t("Join our group to stay updated!")}>
        <ContainerForm onSubmit={submit}>
          <InputContainer>
            <StyledInput
              name="email"
              type="email"
              value={email}
              autoFocus={!!email}
              onChange={onChangeEmail}
              placeholder={t("Write your email")}
            />
            <StyledEnvelopeIcon />
            {errorMessages.map(error => (
              <ErrorMessage>{error}</ErrorMessage>
            ))}
          </InputContainer>

          <StyledButtonContainer>
            <Button theme={theme} color="action" type="submit" buttonSize={ButtonSize.Medium}>
              <ButtonContent>
                <StyledBellIcon />
                <ButtonTitle>
                  <Trans ns={Namespaces.commonNs}>Join now</Trans>
                </ButtonTitle>
              </ButtonContent>
            </Button>
          </StyledButtonContainer>
        </ContainerForm>
      </StyledSectionRow>
      {isModalOpen && (
        <Modal id="thank-you-modal" onClose={toggleModal} noMinHeight variant="info">
          <ModalHeader
            rightButton={<CloseButton on="tap:contact-us-modal.close" onClick={toggleModal} />}
          />
          <ModalContentHolder>
            <ModalTitle>
              <Trans ns={Namespaces.commonNs}>Thank you!</Trans>
            </ModalTitle>
            <ModalMessage>
              <StyledIcon />
              <Trans ns={Namespaces.commonNs}>
                Email sign up successful, you will hear from us soon!
              </Trans>
            </ModalMessage>
          </ModalContentHolder>
        </Modal>
      )}
    </>
  );
};

export default SubscriptionForm;
