import React, { useContext, useState, useEffect } from "react";
import { useTheme } from "emotion-theming";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import { isInvalidEmail } from "@travelshift/ui/utils/validationUtils";

import { ItemWrapper } from "../../ui/FlightsShared/flightShared";

import HealthDeclaration from "./HealthDeclaration";
import FlightStateContext from "./contexts/FlightStateContext";
import FlightCallbackContext from "./contexts/FlightCallbackContext";
import { checkIsContactDetailsValid } from "./utils/flightUtils";

import SectionWithTitle from "components/ui/Section/SectionWithTitle";
import Input from "components/ui/Inputs/Input";
import { gutters, whiteColor } from "styles/variables";
import { mqMin } from "styles/base";
import SectionHeading from "components/ui/Section/SectionHeading";
import Section from "components/ui/Section/Section";
import ContactDetailsIcon from "components/icons/single-man-actions-email.svg";
import { useTranslation, Trans } from "i18n";
import { Namespaces } from "shared/namespaces";
import InputWrapper from "components/ui/InputWrapper";
import PhoneNumberInputContainer from "components/ui/Inputs/PhoneNumberInputContainer";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: ${gutters.large}px;
  ${mqMin.large} {
    flex-direction: row;
  }
`;

const iconStyles = css`
  margin-right: ${gutters.small / 2}px;
  width: 20px;
  height: 20px;
  fill: ${whiteColor};
`;

const StyledItemWrapper = styled(ItemWrapper)`
  position: relative;
  margin-bottom: ${gutters.large}px;
  ${mqMin.large} {
    margin-bottom: ${gutters.small / 2}px;
  }
`;

const HealthDeclarationWrapper = styled.div`
  margin: -${gutters.large}px ${gutters.large}px ${gutters.small}px;
  ${mqMin.large} {
    display: none;
  }
`;

export const ContactDetailsContent = () => {
  const { t } = useTranslation(Namespaces.flightNs);
  const [blurred, setBlurred] = useState(false);
  const { contactDetails, formSubmitted, formErrors } = useContext(FlightStateContext);
  const { onContactDetailsChange, onValidateContactDetails } = useContext(FlightCallbackContext);
  const { phoneNumber, contactEmail } = contactDetails;
  const phoneError = blurred && phoneNumber === "";
  const emailError = blurred && contactEmail === "";
  const invalidEmailError = blurred && isInvalidEmail(contactEmail);
  const onBlur = () => setBlurred(true);
  useEffect(() => {
    const isContactDetailsValid = checkIsContactDetailsValid(phoneNumber, contactEmail);
    if (isContactDetailsValid && formErrors.contactFormError) {
      onValidateContactDetails(false);
    }
    if (!isContactDetailsValid && !formErrors.contactFormError) {
      onValidateContactDetails(true);
    }
    if (formSubmitted) {
      onBlur();
    }
  }, [
    formSubmitted,
    formErrors.contactFormError,
    onValidateContactDetails,
    phoneNumber,
    contactEmail,
  ]);
  return (
    <Wrapper>
      <StyledItemWrapper>
        <InputWrapper
          label={t("Email")}
          id="email"
          hasError={emailError || invalidEmailError}
          customErrorMessage={invalidEmailError ? t("Email must be valid") : undefined}
        >
          <Input
            id="email"
            value={contactEmail}
            onChange={event =>
              onContactDetailsChange({
                ...contactDetails,
                contactEmail: event.target.value,
              })
            }
            type="email"
            useDebounce={false}
            placeholder={t("Add contact email")}
            error={emailError || invalidEmailError}
          />
        </InputWrapper>
      </StyledItemWrapper>
      <StyledItemWrapper>
        <PhoneNumberInputContainer
          onPhoneNumberChange={value =>
            onContactDetailsChange({
              ...contactDetails,
              phoneNumber: value,
            })
          }
          phoneNumber={phoneNumber}
          placeholder={t("Add a phone number")}
          hasError={phoneError}
        />
      </StyledItemWrapper>
    </Wrapper>
  );
};

const FlightContactDetailsContainer = ({
  showHealthDeclaration,
  dataTestid,
}: {
  showHealthDeclaration: boolean;
  dataTestid?: string;
}) => {
  const theme: Theme = useTheme();
  const { t } = useTranslation(Namespaces.flightNs);
  return (
    <Section dataTestid={dataTestid}>
      <SectionHeading>
        <Trans ns={Namespaces.flightNs}>Add your contact details</Trans>
      </SectionHeading>
      <SectionWithTitle
        color={theme.colors.primary}
        title={t("Contact details")}
        icon={<ContactDetailsIcon css={iconStyles} />}
      >
        <ContactDetailsContent />
        {showHealthDeclaration && (
          <HealthDeclarationWrapper>
            <HealthDeclaration />
          </HealthDeclarationWrapper>
        )}
      </SectionWithTitle>
    </Section>
  );
};

export default FlightContactDetailsContainer;
