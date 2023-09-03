import styled from "@emotion/styled";
import { css } from "@emotion/core";
import React, { useCallback, useEffect, useState } from "react";
import { FormInput } from "@travelshift/ui/hooks/useForm";

import { cleanNumber, formatExpiryDate, handleCreditCardNumber } from "./utils/creditCardUtils";
import { CardType, OrderPaymentProvider, PaymentMethodType } from "./types/cartEnums";
import useCreditCardInput from "./hooks/useCreditCardInput";
import { useCartContext } from "./contexts/CartContextState";
import { ColumnWithMarginTop } from "./sharedCartComponents";

import Input from "components/ui/Inputs/Input";
import InputWrapper from "components/ui/InputWrapper";
import Row from "components/ui/Grid/Row";
import CardCvvIcon from "components/icons/cart/cvv.svg";
import { mqMin } from "styles/base";
import { useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";
import { gutters } from "styles/variables";
import Column from "components/ui/Grid/Column";
import { useIsMobile } from "hooks/useMediaQueryCustom";
import useOnDidMount from "hooks/useOnDidMount";

const Container = styled.div`
  align-self: flex-start;
  width: 100%;
`;

export const FormInputSection = styled.section``;

export const StyledColumn = styled(Column)`
  & + & {
    margin-top: ${gutters.large / 2}px;
    ${mqMin.large} {
      margin: 0;
    }
  }
`;

export const StyledColumnSmall = styled(Column)``;

export const InputWithIconWrapper = styled.div`
  position: relative;

  svg {
    position: absolute;
    top: 50%;
    right: ${gutters.small / 2}px;
    width: 27px;
    height: 18px;
    transform: translateY(-50%);
  }
`;

const MarginBottomRow = styled(Row)<{ bottomInputHasError: boolean }>(
  ({ bottomInputHasError }) => css`
    margin-bottom: ${bottomInputHasError ? gutters.large : gutters.small / 2}px;
  `
);

const CCDefaultForm = ({
  CreditCardInput,
  isExpiryDateInvalid,
  isCardNumberInvalid,
  expiryDate,
  cvvNumber,
  handleBlur,
  handleExpiryDateChange,
  isCvvNumberInvalid,
  numberCvvDigits,
  handleChangeCvv,
  errorMessage,
  cardErrorMessage,
}: {
  CreditCardInput: React.ReactElement;
  expiryDate: FormInput;
  cvvNumber: FormInput;
  isExpiryDateInvalid: boolean;
  isCardNumberInvalid: boolean;
  isCvvNumberInvalid: boolean;
  numberCvvDigits: number;
  handleBlur: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleExpiryDateChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleChangeCvv: (event: React.ChangeEvent<HTMLInputElement>) => void;
  errorMessage?: string;
  cardErrorMessage: string;
}) => {
  const { t } = useTranslation(Namespaces.cartNs);
  const isMobile = useIsMobile();
  const bottomInputHasError = isMobile
    ? isCvvNumberInvalid
    : isCardNumberInvalid || isCvvNumberInvalid || isExpiryDateInvalid;

  return (
    <MarginBottomRow bottomInputHasError={bottomInputHasError}>
      <StyledColumn columns={{ small: 1, large: 2 }}>
        <FormInputSection>
          <InputWrapper
            label={t("Card number")}
            id="cardNumber"
            hasError={isCardNumberInvalid}
            customErrorMessage={cardErrorMessage}
          >
            <InputWithIconWrapper>{CreditCardInput}</InputWithIconWrapper>
          </InputWrapper>
        </FormInputSection>
      </StyledColumn>
      <StyledColumn columns={{ small: 1, large: 2 }}>
        <Row>
          <StyledColumnSmall columns={{ small: 2 }}>
            <FormInputSection>
              <InputWrapper
                label={t("Expiry date")}
                id="expiryDate"
                hasError={isExpiryDateInvalid}
                customErrorMessage={errorMessage}
              >
                <Input
                  id="expiryDate"
                  name="expiryDate"
                  inputMode="numeric"
                  autocomplete="cc-exp"
                  placeholder="MM/YY"
                  value={expiryDate.value as string}
                  onChange={handleExpiryDateChange}
                  onBlur={handleBlur}
                  error={isExpiryDateInvalid}
                  maxLength={5}
                  useDebounce={false}
                />
              </InputWrapper>
            </FormInputSection>
          </StyledColumnSmall>
          <StyledColumnSmall columns={{ small: 2 }}>
            <FormInputSection>
              <InputWrapper
                label={t("CVC / CVV")}
                id="cvvNumber"
                hasError={isCvvNumberInvalid}
                customErrorMessage={t("Invalid CVC/CVV number")}
              >
                <InputWithIconWrapper>
                  <Input
                    id="cvvNumber"
                    name="cvvNumber"
                    autocomplete="cc-csc"
                    inputMode="numeric"
                    placeholder={t(`{numberCvvDigits} digits`, {
                      numberCvvDigits,
                    })}
                    value={cvvNumber.value as string}
                    onChange={handleChangeCvv}
                    onBlur={handleBlur}
                    error={isCvvNumberInvalid}
                    maxLength={numberCvvDigits}
                    useDebounce={false}
                  />
                  <CardCvvIcon />
                </InputWithIconWrapper>
              </InputWrapper>
            </FormInputSection>
          </StyledColumnSmall>
        </Row>
      </StyledColumn>
    </MarginBottomRow>
  );
};

const CCSaveCardForm = ({
  CreditCardInput,
  isExpiryDateInvalid,
  isCardNumberInvalid,
  expiryDate,
  cvvNumber,
  handleBlur,
  handleExpiryDateChange,
  isCvvNumberInvalid,
  numberCvvDigits,
  handleChangeCvv,
  errorMessage,
  isHolderNameInvalid,
  commonErrorMessage,
  customerName,
  handleChange,
  cardErrorMessage,
}: {
  CreditCardInput: React.ReactElement;
  expiryDate: FormInput;
  cvvNumber: FormInput;
  isExpiryDateInvalid: boolean;
  isCardNumberInvalid: boolean;
  isCvvNumberInvalid: boolean;
  numberCvvDigits: number;
  handleBlur: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleExpiryDateChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleChangeCvv: (event: React.ChangeEvent<HTMLInputElement>) => void;
  errorMessage?: string;
  isHolderNameInvalid: boolean;
  commonErrorMessage: string;
  customerName?: string;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  cardErrorMessage: string;
}) => {
  const { t } = useTranslation(Namespaces.cartNs);
  const columnSizes = { small: 1, large: 2 };
  const isMobile = useIsMobile();
  const [cardholderName, setCardholderName] = useState(customerName);
  const bottomInputHasError = isMobile
    ? isCvvNumberInvalid
    : isExpiryDateInvalid || isCvvNumberInvalid;

  const handleChangeHolderName = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setCardholderName(event.target.value);
      handleChange(event);
    },
    [handleChange]
  );

  useOnDidMount(() => {
    let timer: NodeJS.Timeout | undefined;
    if (customerName && !cardholderName) {
      timer = setTimeout(
        () =>
          handleChangeHolderName({
            target: { value: customerName },
          } as React.ChangeEvent<HTMLInputElement>),
        200
      );
    }
    return () => clearTimeout(timer);
  });

  return (
    <>
      <Row>
        <Column columns={columnSizes}>
          <FormInputSection>
            <InputWrapper
              label={t("Name on card")}
              id="holderName"
              hasError={isHolderNameInvalid}
              customErrorMessage={commonErrorMessage}
            >
              <Input
                id="holderName"
                name="holderName"
                autocomplete="cc-name"
                placeholder={t("Add the cardholder's name")}
                value={cardholderName}
                onChange={handleChangeHolderName}
                onBlur={handleBlur}
                error={isHolderNameInvalid}
                maxLength={220}
                useDebounce={false}
              />
            </InputWrapper>
          </FormInputSection>
        </Column>
        <Column columns={columnSizes}>
          <FormInputSection>
            <InputWrapper
              label={t("Card number")}
              id="cardNumber"
              hasError={isCardNumberInvalid}
              customErrorMessage={cardErrorMessage}
            >
              <InputWithIconWrapper>{CreditCardInput}</InputWithIconWrapper>
            </InputWrapper>
          </FormInputSection>
        </Column>
      </Row>
      <MarginBottomRow bottomInputHasError={bottomInputHasError}>
        <ColumnWithMarginTop columns={columnSizes}>
          <FormInputSection>
            <InputWrapper
              label={t("Expiry date")}
              id="expiryDate"
              hasError={isExpiryDateInvalid}
              customErrorMessage={errorMessage}
            >
              <Input
                id="expiryDate"
                name="expiryDate"
                inputMode="numeric"
                autocomplete="cc-exp"
                placeholder="MM/YY"
                value={expiryDate.value as string}
                onChange={handleExpiryDateChange}
                onBlur={handleBlur}
                error={isExpiryDateInvalid}
                maxLength={5}
                useDebounce={false}
              />
            </InputWrapper>
          </FormInputSection>
        </ColumnWithMarginTop>
        <ColumnWithMarginTop columns={columnSizes}>
          <FormInputSection>
            <InputWrapper
              label={t("CVC / CVV")}
              id="cvvNumber"
              hasError={isCvvNumberInvalid}
              customErrorMessage={t("Invalid CVC/CVV number")}
            >
              <InputWithIconWrapper>
                <Input
                  id="cvvNumber"
                  name="cvvNumber"
                  autocomplete="cc-csc"
                  inputMode="numeric"
                  placeholder={t(`{numberCvvDigits} digits`, {
                    numberCvvDigits,
                  })}
                  value={cvvNumber.value as string}
                  onChange={handleChangeCvv}
                  onBlur={handleBlur}
                  error={isCvvNumberInvalid}
                  maxLength={numberCvvDigits}
                  useDebounce={false}
                />
                <CardCvvIcon />
              </InputWithIconWrapper>
            </InputWrapper>
          </FormInputSection>
        </ColumnWithMarginTop>
      </MarginBottomRow>
    </>
  );
};

const CreditCardForm = ({
  values: { cardNumber, expiryDate, cvvNumber },
  errors: {
    cardNumber: isCardNumberError,
    expiryDate: isExpiryDateError,
    cvvNumber: isCvvNumberError,
    holderName: isHolderNameError,
  },
  errorMessages: { expiryDate: expiryErrorMessage },
  blurredInputs: {
    cardNumber: isCardNumberBlurred,
    expiryDate: isExpiryDateBlurred,
    cvvNumber: isCvvNumberBlurred,
    holderName: isHolderNameBlurred,
  },
  handleChange,
  handleBlur,
  commonErrorMessage,
  activePaymentMethod,
  customerName,
  isSaveCardAvailable,
  paymentProviderSettings,
  onCreditCardTypeChange,
}: {
  values: {
    [name: string]: FormInput;
  };
  errors: {
    [name: string]: boolean;
  };
  errorMessages: {
    [name: string]: string | undefined;
  };
  blurredInputs: {
    [name: string]: boolean;
  };
  handleChange: (
    event: React.ChangeEvent<HTMLInputElement>,
    valueFormatter?: (value: string) => string
  ) => void;
  handleBlur: (event: React.ChangeEvent<HTMLInputElement>) => void;
  commonErrorMessage: string;
  activePaymentMethod: CartTypes.PaymentMethod;
  customerName?: string;
  isSaveCardAvailable: boolean;
  paymentProviderSettings: CartTypes.QueryPaymentProviderSettings;
  onCreditCardTypeChange: (creditCardType: CardType) => void;
}) => {
  const { creditCardType, setContextState } = useCartContext();
  const handleCardNumberChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>, cardType) => {
      handleCreditCardNumber(event, cardType);
      handleChange(event);
    },
    [handleChange]
  );

  const handleExpiryDateChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      handleChange(event, formatExpiryDate);
    },
    [handleChange]
  );

  const handleChangeCvv = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      handleChange(event, cleanNumber);
    },
    [handleChange]
  );

  const {
    CreditCardInput,
    numberCvvDigits,
    cardErrorMessage,
    isCardNumberInvalid,
    isFetchingCardType,
  } = useCreditCardInput({
    cardNumber: cardNumber.value as string,
    creditCardType,
    handleCardNumberChange,
    handleBlur,
    paymentProviderSettings,
    onCreditCardTypeChange,
    isCardNumberBlurred,
    isCardNumberError,
  });

  const isExpiryDateInvalid =
    isExpiryDateBlurred && (isExpiryDateError || Boolean(expiryErrorMessage));
  const isCvvNumberInvalid = isCvvNumberBlurred && isCvvNumberError;
  const isHolderNameInvalid = isHolderNameBlurred && isHolderNameError;
  const isSavedCardType = activePaymentMethod.type !== PaymentMethodType.SAVED_CARD;
  const isSavedCardTypeAvailable = isSavedCardType && isSaveCardAvailable;
  const isSavedCardTypeNotAvailable = isSavedCardType && !isSaveCardAvailable;

  useEffect(() => {
    setContextState({ isFetchingAPICardType: isFetchingCardType });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFetchingCardType]);

  return (
    <Container data-testid={`${OrderPaymentProvider[activePaymentMethod.provider]}-container`}>
      {isSavedCardTypeAvailable && (
        <CCSaveCardForm
          handleBlur={handleBlur}
          handleExpiryDateChange={handleExpiryDateChange}
          handleChangeCvv={handleChangeCvv}
          numberCvvDigits={numberCvvDigits}
          isCvvNumberInvalid={isCvvNumberInvalid}
          isCardNumberInvalid={isCardNumberInvalid}
          isExpiryDateInvalid={isExpiryDateInvalid}
          CreditCardInput={CreditCardInput}
          expiryDate={expiryDate}
          cvvNumber={cvvNumber}
          errorMessage={expiryErrorMessage || commonErrorMessage}
          handleChange={handleChange}
          customerName={customerName}
          isHolderNameInvalid={isHolderNameInvalid}
          commonErrorMessage={commonErrorMessage}
          cardErrorMessage={cardErrorMessage}
        />
      )}

      {isSavedCardTypeNotAvailable && (
        <CCDefaultForm
          handleBlur={handleBlur}
          handleExpiryDateChange={handleExpiryDateChange}
          handleChangeCvv={handleChangeCvv}
          numberCvvDigits={numberCvvDigits}
          isCvvNumberInvalid={isCvvNumberInvalid}
          isCardNumberInvalid={isCardNumberInvalid}
          isExpiryDateInvalid={isExpiryDateInvalid}
          CreditCardInput={CreditCardInput}
          expiryDate={expiryDate}
          cvvNumber={cvvNumber}
          errorMessage={expiryErrorMessage || commonErrorMessage}
          cardErrorMessage={cardErrorMessage}
        />
      )}
    </Container>
  );
};

export default CreditCardForm;
