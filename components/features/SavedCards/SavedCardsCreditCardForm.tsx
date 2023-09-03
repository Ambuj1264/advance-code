import React, { useCallback, useEffect, useState } from "react";
import styled from "@emotion/styled";
import useForm from "@travelshift/ui/hooks/useForm";
import rgba from "polished/lib/color/rgba";
import { css } from "@emotion/core";
import { Waypoint } from "react-waypoint";
import { ApolloError } from "apollo-client";

import { DoubleInputWrapper, DoubleInputWrapperContainer } from "../Cart/CartPassengerDetailsForm";
import {
  cleanNumber,
  formatExpiryDate,
  handleCreditCardNumber,
} from "../Cart/utils/creditCardUtils";
import { DEFAULT_CREDIT_CARD_PAYMENT_METHOD } from "../Cart/utils/cartUtils";
import { CardType, OrderPaymentProvider } from "../Cart/types/cartEnums";
import PaymentMethods from "../Cart/PaymentMethods";
import PaymentFormBusinessInputs, {
  CheckBoxContainer,
  CheckboxWrapper,
} from "../Cart/PaymentFormBusinessInputs";
import { StyledColumn } from "../Flight/PassengerDetailsForm";
import PaymentError from "../Cart/PaymentError";
import { InputWithIconWrapper } from "../Cart/sharedCartComponents";

import {
  constructSaveCardMutationInput,
  creditCardObject,
  genericErrorMessage,
  getCardInfoToDisplay,
  getInitialSavedPaymentValues,
} from "./utils/SavedCardsUtils";
import useSaveCard from "./hooks/useSaveCard";
import useDeleteCard from "./hooks/useDeletecard";
import { StateFields } from "./types/savedCardsTypes";
import useCardsStateVariables from "./hooks/useCardsStateVariables";

import FixedSaveButton from "components/ui/User/FixedSaveButton";
import CreditCardIcon from "components/icons/credit-card-cross.svg";
import Row from "components/ui/Grid/Row";
import InputWrapper from "components/ui/InputWrapper";
import { useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";
import CardCvvIcon from "components/icons/cart/cvv.svg";
import { greyColor, gutters, redColor, whiteColor } from "styles/variables";
import AddDeleteButton, { PlusIconWrapper, Text } from "components/ui/User/AddButton";
import ConfirmationModal from "components/ui/User/ConfirmationModal";
import useTokenizeCard from "hooks/useTokenizeCard";
import {
  FullWidthColumn,
  ScrollStopEl,
  StyledBusinessInputRow,
  StyledColumnItemWrapper,
  StyledUserInput,
} from "components/ui/User/SharedStyledComponent";
import WaypointWrapper from "components/ui/Lazy/WaypointWrapper";
import { mqMax, mqMin } from "styles/base";
import { ColumnWrapper } from "components/ui/FlightsShared/flightShared";
import { Wrapper } from "components/ui/Inputs/Input";
import RadioButton from "components/ui/Inputs/RadioButton";
import useCreditCardInput from "components/features/Cart/hooks/useCreditCardInput";
import Section from "components/ui/Section/Section";

const DeleteButton = styled(AddDeleteButton)`
  position: absolute;
  right: ${gutters.large / 2}px;
  bottom: 3px;
  background-color: ${rgba(redColor, 0.1)};
  ${mqMax.large} {
    right: 8px;
  }
  ${PlusIconWrapper} {
    background-color: ${redColor};
  }
  ${Text} {
    color: ${redColor};
  }
`;

const StyledFullWidthColumn = styled(FullWidthColumn)`
  padding: 0;
  ${mqMin.large} {
    padding: 0;
  }
`;

const StyledPaymentFormBusinessInputs = styled(PaymentFormBusinessInputs)<{
  blueBorder?: boolean;
  noBusinessInput?: boolean;
}>(
  ({ blueBorder, noBusinessInput, theme }) => css`
    ${Wrapper} {
      border: ${blueBorder
        ? `1px solid ${theme.colors.primary}`
        : `1px solid ${rgba(greyColor, 0.5)}`};
    }
    ${CheckBoxContainer} {
      visibility: ${noBusinessInput ? "hidden" : "visible"};
    }
    ${CheckboxWrapper} {
      margin-bottom: 0;
      ${mqMin.large} {
        margin-bottom: 0;
      }
    }
    input[type="text"] {
      &:disabled,
      &:read-only {
        background: ${whiteColor};
      }
    }
    ${mqMin.large} {
      margin-top: 0;
    }
  `
);

const StyledInputWithIconWrapper = styled(InputWithIconWrapper)`
  svg {
    &:nth-child(2) {
      right: ${gutters.small}px;
    }
  }
`;

const StyledSection = styled(Section)`
  margin-top: ${gutters.small}px;
  ${mqMin.large} {
    margin-top: ${gutters.small}px;
  }
`;

const SavedCardsCreditCardForm = ({
  paymentProviderSettings,
  savedCards,
  setSavedCards,
  setOnError,
}: {
  paymentProviderSettings: CartTypes.QueryPaymentProviderSettings;
  savedCards: CartTypes.QuerySaltPaySavedCard[];
  setSavedCards: React.Dispatch<React.SetStateAction<CartTypes.QuerySaltPaySavedCard[]>>;
  setOnError: (error: ApolloError | undefined) => void;
}) => {
  const { t } = useTranslation(Namespaces.userProfileNs);
  const [activePaymentMethod, setActivePaymentMethod] = useState<CartTypes.PaymentMethod>({
    ...DEFAULT_CREDIT_CARD_PAYMENT_METHOD(),
    provider: OrderPaymentProvider.SALTPAY,
  });

  const { stateData, handleStateDataChange, handleMultiStateDataChange, toggleModal } =
    useCardsStateVariables(savedCards);

  const { primaryId, isTokenizing, genericError, isSuccessTimeout, showModal, creditCardType } =
    stateData;

  const tokenizeCard = useTokenizeCard(paymentProviderSettings);

  const initialValues = getInitialSavedPaymentValues(t);
  const {
    values: creditCardValues,
    errors: creditCardErrors,
    validationErrorMessages: creditCardErrorMessages,
    blurredInputs: creditCardBlurredInputs,
    handleChange: handleCreditCardChange,
    handleBlur: handleCreditCardBlur,
    handleSubmit,
    isFormInvalid,
    setValues,
  } = useForm({
    initialValues,
    onSubmit: async () => {
      if (!isFormInvalid) {
        handleStateDataChange(StateFields.isTokenizing, true);
        const [expMonth, expYear] = (creditCardValues.expiryDate.value as string).split("/");
        const {
          cvvNumber,
          cardNumber,
          firstName,
          lastName,
          companyName,
          companyId,
          companyAddress,
        } = creditCardValues;
        const cvc = cvvNumber.value as string;
        const pan = cardNumber.value as string;
        const firstNameValue = firstName.value as string;
        const lastNameValue = lastName.value as string;
        const companyNameValue = companyName.value as string;
        const companyIdValue = companyId.value as string;
        const companyAddressValue = companyAddress.value as string;

        const { tokenizedSaltPayCard, tokenizedAdyenCard, hasTokenizationError } =
          await tokenizeCard({
            cardInformation: {
              pan,
              expMonth,
              expYear,
              cvc,
            },
            shouldSaveCard: true,
            creditCardType,
          });

        if (!hasTokenizationError) {
          const tokenizingSuccess = [
            { field: StateFields.isTokenizing, value: false },
            {
              field: StateFields.genericError,
              value: "",
            },
          ];
          handleMultiStateDataChange(tokenizingSuccess);

          const constructedMutationInput = constructSaveCardMutationInput({
            tokenizedSaltPay: tokenizedSaltPayCard,
            tokenizedAdyen: tokenizedAdyenCard,
            cvc,
            firstName: firstNameValue,
            lastName: lastNameValue,
            businessId: companyIdValue,
            businessName: companyNameValue,
            businessAddress: companyAddressValue,
            isUsersPrimaryCard: primaryId === activePaymentMethod.id,
          });
          // eslint-disable-next-line @typescript-eslint/no-use-before-define
          saveCard(constructedMutationInput);
        } else {
          const tokenizingError = [
            { field: StateFields.isTokenizing, value: false },
            {
              field: StateFields.genericError,
              value: genericErrorMessage,
            },
          ];
          handleMultiStateDataChange(tokenizingError);
        }
      }
    },
  });

  const { savingCardLoading, savingCardResponse, saveCard, setPrimary } = useSaveCard(
    setSavedCards,
    setValues,
    setActivePaymentMethod,
    handleStateDataChange,
    initialValues
  );

  const { deleteCard, deletingCardLoading, deletingCardError, deletingCardResponse } =
    useDeleteCard(setSavedCards, setActivePaymentMethod);

  const {
    cardNumber,
    cvvNumber,
    expiryDate,
    firstName,
    lastName,
    isBusinessTraveller,
    companyName,
    companyId,
    companyAddress,
  } = creditCardValues;
  const {
    cardNumber: isCardNumberError,
    expiryDate: isExpiryDateError,
    cvvNumber: isCvvNumberError,
    firstName: firstNameError,
    lastName: lastNameError,
  } = creditCardErrors;

  const {
    cardNumber: isCardNumberBlurred,
    expiryDate: isExpiryDateBlurred,
    cvvNumber: isCvvNumberBlurred,
  } = creditCardBlurredInputs;

  const { expiryDate: expiryErrorMessage } = creditCardErrorMessages;

  const handleCardNumberChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>, cardType) => {
      handleCreditCardNumber(event, cardType);
      handleCreditCardChange(event);
    },
    [handleCreditCardChange]
  );

  const handleExpiryDateChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      handleCreditCardChange(event, formatExpiryDate);
    },
    [handleCreditCardChange]
  );

  const handleChangeCvv = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      handleCreditCardChange(event, cleanNumber);
    },
    [handleCreditCardChange]
  );

  const [isSticky, setIsSticky] = useState(true);

  const handleWaypointEnter = useCallback(() => {
    setIsSticky(false);
  }, []);
  const handleWaypointExit = useCallback(
    ({
      currentPosition,
      previousPosition,
    }: {
      currentPosition?: string;
      previousPosition?: string;
    }) => {
      if (currentPosition === Waypoint.above && previousPosition === Waypoint.inside) {
        setIsSticky(false);
      } else {
        setIsSticky(true);
      }
    },
    [setIsSticky]
  );

  const isExpiryDateInvalid =
    isExpiryDateBlurred && (isExpiryDateError || Boolean(expiryErrorMessage));

  const isCvvNumberInvalid = isCvvNumberBlurred && isCvvNumberError;

  const handleAddClick = useCallback(() => {
    setActivePaymentMethod(creditCardObject as CartTypes.PaymentMethod);
  }, []);

  const handleRemoveClick = useCallback(() => {
    const input = {
      id: Number(activePaymentMethod.id),
    };
    deleteCard(input);
    handleStateDataChange(StateFields.showModal, false);
  }, [activePaymentMethod.id, deleteCard, handleStateDataChange]);

  const infoToDisplay = getCardInfoToDisplay(activePaymentMethod);

  const buttonText = infoToDisplay ? "Add payment method" : "Save payment method";

  // TODO: clarify with business the correct behaviour
  const useSetPrimaryMethod = useCallback(
    e => {
      const chosenId = e.target.value as string;
      const isNewPrimary = chosenId !== primaryId;
      if (isNewPrimary) {
        handleStateDataChange(StateFields.primaryId, e.target.value as string);
        if (chosenId !== DEFAULT_CREDIT_CARD_PAYMENT_METHOD().id) {
          setPrimary({
            cardId: Number(chosenId),
          });
        }
      }
    },
    [primaryId, setPrimary]
  );

  useEffect(() => {
    if (savedCards.length === 0) {
      setActivePaymentMethod(creditCardObject as CartTypes.PaymentMethod);
    }
  }, [savedCards]);

  // this won't work if handleStateDataChange is included as a dependency
  useEffect(() => {
    if (savingCardResponse || deletingCardResponse) {
      handleStateDataChange(StateFields.isSuccessTimeout, true);
      const timeout: NodeJS.Timeout = setTimeout(() => {
        handleStateDataChange(StateFields.isSuccessTimeout, false);
      }, 3000);
      return () => clearTimeout(timeout);
    }
    return undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [savingCardResponse, deletingCardResponse]);

  // TODO: actually handle errors in a smart way
  useEffect(() => {
    if (deletingCardError) {
      setOnError(deletingCardError);
    }
  }, [deletingCardError]);

  const onCreditCardTypeChange = useCallback(
    (newCreditCardType: CardType) => {
      handleStateDataChange(StateFields.creditCardType, newCreditCardType);
    },
    [handleStateDataChange]
  );

  const {
    CreditCardInput,
    numberCvvDigits,
    cardErrorMessage,
    isCardNumberInvalid,
    isFetchingCardType,
  } = useCreditCardInput({
    cardNumber: infoToDisplay ? "" : (cardNumber.value as string),
    creditCardType: infoToDisplay ? infoToDisplay.cardType : stateData.creditCardType,
    onCreditCardTypeChange,
    handleCardNumberChange,
    handleBlur: handleCreditCardBlur,
    paymentProviderSettings,
    InputComponent: StyledUserInput,
    placeholder: infoToDisplay ? infoToDisplay.cardNumber : t("Write your card number"),
    disabled: Boolean(infoToDisplay),
    isEditing: !infoToDisplay,
    isCardNumberBlurred,
    isCardNumberError,
  });

  return (
    <>
      <PaymentMethods
        activePaymentMethod={activePaymentMethod}
        setActivePaymentMethod={setActivePaymentMethod}
        activePaymentProvider={OrderPaymentProvider.SALTPAY}
        saltPaySavedCards={savedCards}
      />
      <StyledSection key={`card-input-section${activePaymentMethod.id}`}>
        <Row key="card-number-name">
          <StyledColumn>
            <DoubleInputWrapper
              label={t("Name on card")}
              id="userProfilegivenNameWrapper"
              hasError={!infoToDisplay && (firstNameError || lastNameError)}
              customErrorMessage={t("Cardholders name is required")}
            >
              <DoubleInputWrapperContainer>
                <StyledUserInput
                  id="firstName"
                  name="firstName"
                  placeholder={infoToDisplay ? infoToDisplay.firstName : t("Given name")}
                  value={infoToDisplay ? "" : (firstName.value as string)}
                  onChange={infoToDisplay ? () => {} : handleCreditCardChange}
                  useDebounce={false}
                  autocomplete="given-name"
                  error={firstNameError}
                  isEditing={!infoToDisplay}
                  disabled={Boolean(infoToDisplay)}
                />
                <StyledUserInput
                  id="lastName"
                  placeholder={infoToDisplay ? infoToDisplay.lastName : t("Surname")}
                  name="lastName"
                  value={infoToDisplay ? "" : (lastName.value as string)}
                  onChange={infoToDisplay ? () => {} : handleCreditCardChange}
                  useDebounce={false}
                  autocomplete="family-name"
                  error={lastNameError}
                  isEditing={!infoToDisplay}
                  disabled={Boolean(infoToDisplay)}
                />
              </DoubleInputWrapperContainer>
            </DoubleInputWrapper>
          </StyledColumn>
          <StyledColumn>
            <InputWrapper
              label={t("Card number")}
              id={`card-number${activePaymentMethod.id}`}
              hasError={!infoToDisplay && isCardNumberInvalid}
              customErrorMessage={cardErrorMessage}
            >
              {CreditCardInput}
            </InputWrapper>
          </StyledColumn>
        </Row>
        <StyledFullWidthColumn>
          <ColumnWrapper>
            <StyledColumnItemWrapper>
              <InputWrapper
                label={t("Expiry date")}
                id="expiryDate"
                hasError={!infoToDisplay && isExpiryDateInvalid}
                customErrorMessage={expiryErrorMessage}
              >
                <StyledUserInput
                  id="expiryDate"
                  name="expiryDate"
                  inputMode="numeric"
                  autocomplete="cc-exp"
                  placeholder={infoToDisplay ? infoToDisplay.expiry : "MM/YY"}
                  value={infoToDisplay ? "" : (expiryDate.value as string)}
                  onChange={handleExpiryDateChange}
                  onBlur={handleCreditCardBlur}
                  error={isExpiryDateInvalid}
                  maxLength={5}
                  useDebounce={false}
                  disabled={Boolean(infoToDisplay)}
                  isEditing={!infoToDisplay}
                />
              </InputWrapper>
            </StyledColumnItemWrapper>
            <StyledColumnItemWrapper>
              <InputWrapper
                label={t("CVC / CVV")}
                id={`cvvNumber${activePaymentMethod.id}`}
                hasError={!infoToDisplay && isCvvNumberInvalid}
                customErrorMessage={t("Invalid CVC/CVV number")}
              >
                <StyledInputWithIconWrapper>
                  <StyledUserInput
                    id="cvvNumber"
                    name="cvvNumber"
                    autocomplete="cc-csc"
                    inputMode="numeric"
                    placeholder={
                      infoToDisplay ? infoToDisplay.dummyCvv : t(`${numberCvvDigits} digits`)
                    }
                    value={infoToDisplay ? "" : (cvvNumber.value as string)}
                    onChange={handleChangeCvv}
                    onBlur={handleCreditCardBlur}
                    error={isCvvNumberInvalid}
                    maxLength={numberCvvDigits}
                    useDebounce={false}
                    disabled={Boolean(infoToDisplay)}
                    isEditing={!infoToDisplay}
                  />
                  <CardCvvIcon />
                </StyledInputWithIconWrapper>
              </InputWrapper>
            </StyledColumnItemWrapper>
          </ColumnWrapper>
        </StyledFullWidthColumn>
        <StyledBusinessInputRow
          isOpen={Boolean((infoToDisplay && infoToDisplay.isBusiness) || isBusinessTraveller.value)}
        >
          <StyledPaymentFormBusinessInputs
            isBusinessTraveller={
              infoToDisplay ? infoToDisplay.isBusiness : (isBusinessTraveller.value as boolean)
            }
            companyName={companyName.value as string}
            companyNamePlaceholder={
              infoToDisplay ? infoToDisplay.businessName : t("Add company name")
            }
            companyId={companyId.value as string}
            companyAddress={companyAddress.value as string}
            companyAddressPlaceholder={
              infoToDisplay ? infoToDisplay.businessAddress : t("Add company address")
            }
            companyIdPlaceholder={
              infoToDisplay ? infoToDisplay.businessId : t("Vat or other company number")
            }
            isReadOnly={Boolean(infoToDisplay)}
            handleChange={infoToDisplay ? () => {} : handleCreditCardChange}
            handleBlur={handleCreditCardBlur}
            blueBorder={Boolean(!infoToDisplay)}
            noBusinessInput={infoToDisplay && !infoToDisplay.isBusiness}
            leftElement={
              savedCards.length > 0 && (
                <RadioButton
                  id={`${activePaymentMethod.id}primary-radio-button`}
                  name="isPrimary"
                  checked={
                    primaryId === activePaymentMethod.id ?? infoToDisplay?.isUsersPrimaryCard
                  }
                  value={activePaymentMethod.id}
                  onChange={useSetPrimaryMethod}
                  label={t("Primary payment method")}
                />
              )
            }
          />
          {infoToDisplay ? (
            <DeleteButton isDelete buttonText={t("Delete")} onClick={toggleModal} />
          ) : null}
        </StyledBusinessInputRow>
        {genericError && !infoToDisplay && (
          <PaymentError paymentError={{ errorMessage: t(genericError) }} />
        )}
      </StyledSection>
      {showModal && (
        <ConfirmationModal
          onClose={toggleModal}
          title={t("Delete payment method")}
          Icon={CreditCardIcon}
          BodyText={t("Are you sure you want to remove this credit card?")}
          onConfirmClick={handleRemoveClick}
        />
      )}
      <ScrollStopEl>
        <FixedSaveButton
          buttonText={buttonText}
          successMessage={t("Successfully updated payment methods")}
          onSaveClick={infoToDisplay ? handleAddClick : handleSubmit}
          isSticky={isSticky}
          isUpdating={
            deletingCardLoading || Boolean(savingCardLoading || isTokenizing || isFetchingCardType)
          }
          saveSuccess={isSuccessTimeout}
        />
      </ScrollStopEl>
      <WaypointWrapper onEnter={handleWaypointEnter} onLeave={handleWaypointExit} />
    </>
  );
};

export default SavedCardsCreditCardForm;
