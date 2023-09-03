import React, { useCallback, useEffect } from "react";
import useForm from "@travelshift/ui/hooks/useForm";
import styled from "@emotion/styled";
import rgba from "polished/lib/color/rgba";
import {
  isEmptyString as isEmptyStringOrUndefined,
  isInvalidEmail,
} from "@travelshift/ui/utils/validationUtils";

import { ColumnWithMarginTop, SectionTitle } from "../Cart/sharedCartComponents";
import { CloseButtonWrapper, CloseIcon } from "../Header/Header/NavigationBar/Cart/CartComponents";

import ExpiryDateSelect from "./ExpiryDateSelect";
import { columnCommonStyles } from "./sharedAdminComponents";
import { formatInputToValidFloatString, isFloatOrIntPattern } from "./utils";

import Row from "components/ui/Grid/Row";
import InputWrapper from "components/ui/InputWrapper";
import Input from "components/ui/Inputs/Input";
import { gutters, lightBlueColor } from "styles/variables";
import useOnDidUpdate from "hooks/useOnDidUpdate";
import { column, mqMax } from "styles/base";

const StyledCloseButtonWrapper = styled(CloseButtonWrapper)`
  position: absolute;
  top: ${gutters.small / 4}px;
  right: ${gutters.large}px;
  background-color: ${lightBlueColor};
  cursor: pointer;

  ${CloseIcon} {
    cursor: pointer;
  }
`;

const StyledSectionTitle = styled(SectionTitle)`
  position: relative;
  margin-right: -${gutters.large}px;
  margin-left: -${gutters.large}px;
  width: calc(100% + ${gutters.large * 2}px);
  background-color: ${rgba(lightBlueColor, 0.2)};
`;

const ReservationItemWrapper = styled.div`
  margin-bottom: ${gutters.large + gutters.small}px;
`;
const StyledColumnWithMarginTop = styled(ColumnWithMarginTop)`
  ${mqMax.large} {
    margin-top: 0;
  }
`;

const ColumnLg = styled.div(() => [column({ small: 1, large: 3.5 / 10 }), columnCommonStyles]);
const ColumnSm = styled.div(() => [column({ small: 1, large: 3 / 10 }), columnCommonStyles]);

const isEmptyString = (value?: string) => value?.trim() === "";

const ReservationLinkPayer = ({
  payer,
  onUpdatePayerDetails,
  onRemoveItem,
  canValidate,
  defaultExpiryDate,
  isReadOnlyDate,
  payerNumber,
  pricePercentage,
  isPercentageSumError,
}: {
  payer: CartTypes.PaymentLinkPayer;
  onUpdatePayerDetails: (payer: CartTypes.PaymentLinkPayer) => void;
  onRemoveItem: (id: number) => void;
  canValidate: boolean;
  defaultExpiryDate?: string;
  isReadOnlyDate: boolean;
  payerNumber: number;
  pricePercentage: number;
  isPercentageSumError: boolean;
}) => {
  const { id } = payer;
  const reservationNameKey = `reservation-name-${id}`;
  const reservationEmailKey = `reservation-email-${id}`;
  const paymentPercentageKey = `percentage-input-${id}`;

  const percentageErrorMessage = isPercentageSumError
    ? "The percentage sum must be 100"
    : "Percentage field can't be empty";

  const {
    values: {
      [reservationNameKey]: reservationName,
      [reservationEmailKey]: reservationEmail,
      [paymentPercentageKey]: paymentPercentage,
    },
    errors: {
      [reservationNameKey]: isNameError,
      [reservationEmailKey]: isEmailError,
      [paymentPercentageKey]: isPaymentPercentageEmpty,
    },
    blurredInputs: {
      [reservationNameKey]: isNameBlurred,
      [reservationEmailKey]: isEmailBlurred,
      [paymentPercentageKey]: isPaymentPercentageBlurred,
    },
    isFormInvalid,
    handleChange,
    handleSubmit: validate,
  } = useForm({
    initialValues: {
      [reservationNameKey]: {
        value: "",
        isValueInvalid: isEmptyStringOrUndefined,
      },
      [reservationEmailKey]: {
        value: "",
        isValueInvalid: isInvalidEmail,
      },
      [paymentPercentageKey]: {
        value: undefined,
        isValueInvalid: isEmptyString,
      },
    },
  });

  const isPaymentPercentageError =
    isPercentageSumError ||
    (isPaymentPercentageBlurred &&
      isPaymentPercentageEmpty &&
      paymentPercentage.value !== undefined);

  const hasInvalidFields =
    isFormInvalid || isPaymentPercentageError || (!payer.expireDate && !defaultExpiryDate);

  const onUpdateExpiryDate = useCallback(
    (dateString?: string) => {
      const updatedValue = {
        ...payer,
        expireDate: dateString as SharedTypes.iso8601DateTime,
        isInvalid: isFormInvalid || dateString === undefined,
      };
      onUpdatePayerDetails(updatedValue);
    },
    [isFormInvalid, onUpdatePayerDetails, payer]
  );

  const handleOnEmailChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      handleChange(event);
      const updatedValue = {
        ...payer,
        email: event.target.value,
      };
      onUpdatePayerDetails(updatedValue);
    },
    [handleChange, payer, onUpdatePayerDetails]
  );

  const handleOnNameChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      handleChange(event);
      const updatedValue = {
        ...payer,
        customerName: event.target.value,
      };
      onUpdatePayerDetails(updatedValue);
    },
    [handleChange, payer, onUpdatePayerDetails]
  );

  const handleChangePercentage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const formattedValue = formatInputToValidFloatString(event.target.value);
      handleChange(event, formatInputToValidFloatString);
      const updatedValue = {
        ...payer,
        customlyAddedPercentage: formattedValue,
      };
      onUpdatePayerDetails(updatedValue);
    },
    [handleChange, onUpdatePayerDetails, payer]
  );

  const onPercentFieldBlur = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    // eslint-disable-next-line functional/immutable-data, no-param-reassign
    event.target.value =
      value?.length && value[value.length - 1] === "." ? value.slice(0, -1) : value;
  }, []);

  useEffect(() => {
    if (!hasInvalidFields && payer.isInvalid) {
      onUpdatePayerDetails({ ...payer, isInvalid: false });
    }
    if (hasInvalidFields && !payer.isInvalid) {
      onUpdatePayerDetails({ ...payer, isInvalid: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasInvalidFields, payer.isInvalid]);

  useOnDidUpdate(() => {
    if (canValidate) {
      validate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canValidate]);

  return (
    <ReservationItemWrapper>
      <StyledSectionTitle>
        {`Additional payer ${payerNumber}`}
        <StyledCloseButtonWrapper onClick={() => onRemoveItem(id)}>
          <CloseIcon />
        </StyledCloseButtonWrapper>
      </StyledSectionTitle>
      <Row>
        <ColumnLg>
          <InputWrapper
            label="Full name"
            id={`reservation-name-wrapper-${id}`}
            hasError={isNameError}
            customErrorMessage="Please add the full name"
          >
            <Input
              id={reservationNameKey}
              name={reservationNameKey}
              placeholder="Add customer name"
              value={reservationName.value as string}
              onChange={handleOnNameChange}
              error={isNameBlurred && isNameError}
              autocomplete="name"
              useDebounce={false}
            />
          </InputWrapper>
        </ColumnLg>
        <ColumnLg>
          <InputWrapper
            label="Email"
            id={`reservation-email-wrapper-${id}`}
            hasError={isEmailError}
            customErrorMessage="Please use a valid email address"
          >
            <Input
              id={reservationEmailKey}
              name={reservationEmailKey}
              placeholder="Add customer email"
              value={reservationEmail.value as string}
              onChange={handleOnEmailChange}
              error={isEmailError && isEmailBlurred}
              autocomplete="email"
              useDebounce={false}
            />
          </InputWrapper>
        </ColumnLg>
        <ColumnSm>
          <InputWrapper
            label="Assigned payment %"
            id={`percentage-wrapper-${id}`}
            hasError={isPaymentPercentageError}
            customErrorMessage={percentageErrorMessage}
            InfoTooltipText={
              "Only values between 1-99.99 are allowed. Use the '.' character as a decimal separator."
            }
          >
            <Input
              id={paymentPercentageKey}
              name={paymentPercentageKey}
              maxLength={5}
              inputMode="decimal"
              placeholder="Add the payer's price %"
              onChange={handleChangePercentage}
              onBlur={onPercentFieldBlur}
              error={isPaymentPercentageError}
              useDebounce={false}
              value={(paymentPercentage.value as string) ?? pricePercentage.toString()}
              onKeyPress={e => {
                if (!isFloatOrIntPattern(e.key, e.currentTarget.value)) {
                  e.preventDefault();
                }
              }}
            />
          </InputWrapper>
        </ColumnSm>
        {!isReadOnlyDate && (
          <StyledColumnWithMarginTop>
            <ExpiryDateSelect
              id={id}
              canValidate={canValidate}
              isDisabled={isReadOnlyDate}
              onUpdateExpiryDate={onUpdateExpiryDate}
            />
          </StyledColumnWithMarginTop>
        )}
      </Row>
    </ReservationItemWrapper>
  );
};

export default ReservationLinkPayer;
