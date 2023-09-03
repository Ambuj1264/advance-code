import React, { SyntheticEvent } from "react";
import Button from "@travelshift/ui/components/Inputs/Button";
import { useTheme } from "emotion-theming";
import styled from "@emotion/styled";
import { isInvalidEmail } from "@travelshift/ui/utils/validationUtils";
import useForm from "@travelshift/ui/hooks/useForm";

import useResendVoucherMutation from "./utils/useResendVoucherMutation";

import AttactmentIcon from "components/icons/attachment.svg";
import Input from "components/ui/Inputs/Input";
import Modal, {
  ModalHeader,
  CloseButton,
  ModalFooterContainer,
  ModalHeading,
  ModalContentWrapper,
} from "components/ui/Modal/Modal";
import { ButtonSize } from "types/enums";
import EnvelopeIcon from "components/icons/send-email-envelope.svg";
import { Trans, useTranslation } from "i18n";
import { whiteColor, gutters } from "styles/variables";
import { Namespaces } from "shared/namespaces";
import { getWithDefault } from "utils/helperUtils";
import InputWrapper from "components/ui/InputWrapper";

const StyledEnvelopIcon = styled(EnvelopeIcon)`
  margin-right: ${gutters.small / 2}px;
  width: 24px;
  fill: ${whiteColor};
`;

const StyledInputWrapper = styled(InputWrapper)`
  display: flex;
  flex-direction: column;
  margin: ${gutters.large}px 0;
`;

const getInitialEmailFormValues = (defaultEmail?: string) => ({
  email: {
    value: getWithDefault({ maybeValue: defaultEmail, defaultValue: "" }),
    isValueInvalid: isInvalidEmail,
  },
});

const ResendVoucherModal = ({
  toggleModal,
  voucherId,
  defaultEmail,
  className,
  customZIndex,
}: {
  toggleModal: () => void;
  voucherId: string;
  defaultEmail?: string;
  className?: string;
  customZIndex?: number;
}) => {
  const theme: Theme = useTheme();
  const { t } = useTranslation(Namespaces.voucherNs);

  const { onResendVoucher, isFailure, isLoading, isSuccess } = useResendVoucherMutation({
    voucherId,
  });

  const {
    values: { email },
    errors: { email: isEmailError },
    blurredInputs: { email: isEmailBlurred },
    handleChange,
    handleBlur,
    handleSubmit,
  } = useForm({
    initialValues: getInitialEmailFormValues(defaultEmail),
    onSubmit: values => {
      const inputEmail = values.email as string;
      if (!isInvalidEmail(inputEmail)) {
        onResendVoucher(inputEmail);
      }
    },
  });

  const isEmailInvalid = isEmailBlurred && isEmailError;

  const getButtonText = () => {
    if (isFailure) return t("Sending voucher failed, please try again");
    if (isSuccess) return t("Voucher was sent successfully!");
    return t("Send voucher");
  };

  return (
    <Modal
      id="email-voucher"
      onClose={toggleModal}
      noMinHeight
      className={className}
      customZIndex={customZIndex}
    >
      <ModalHeader rightButton={<CloseButton onClick={toggleModal} />} />
      <ModalHeading>
        <Trans ns={Namespaces.voucherNs}>Send this voucher to an email</Trans>
      </ModalHeading>
      <ModalContentWrapper>
        <InputWrapper
          label={t("Email")}
          id="Email"
          hasError={isEmailInvalid}
          customErrorMessage={t("Please provide a valid email address")}
        >
          <Input
            id="email"
            name="email"
            value={email.value as string}
            onChange={handleChange}
            error={isEmailInvalid}
            onBlur={handleBlur}
            autocomplete="email"
            useDebounce={false}
            placeholder={t("Add email address")}
            type="email"
          />
        </InputWrapper>
        <StyledInputWrapper label={t("Attachment")} id="attachment" hasError={false}>
          <AttactmentIcon />
        </StyledInputWrapper>
      </ModalContentWrapper>
      <ModalFooterContainer>
        <Button
          type="submit"
          theme={theme}
          buttonSize={ButtonSize.Medium}
          color={isFailure ? "error" : "action"}
          loading={isLoading}
          onClick={isSuccess ? toggleModal : (handleSubmit as (e: SyntheticEvent) => void)}
        >
          <>
            {!isSuccess === true ? <StyledEnvelopIcon /> : null}
            {getButtonText()}
          </>
        </Button>
      </ModalFooterContainer>
    </Modal>
  );
};

export default ResendVoucherModal;
