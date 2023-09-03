import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ApolloError } from "apollo-client";
import { useTheme } from "emotion-theming";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import Button from "@travelshift/ui/components/Inputs/Button";

import ReservationLinkPayer from "./ReservationLinkPayer";
import ExpiryDateSelect from "./ExpiryDateSelect";
import AdminModalError from "./AdminModalError";
import {
  DoubleButtonWrapper,
  HEADER_ID,
  IconWrapper,
  InfoText,
  StyledCartOptionModal,
  StyledModalHeading,
} from "./sharedAdminComponents";
import { adjustPercentageValue } from "./utils";

import WarningIcon from "components/icons/alert-triangle.svg";
import CheckCircleIcon from "components/icons/checks-circle.svg";
import { mqMin } from "styles/base";
import { fontWeightRegular, greyColor, gutters } from "styles/variables";
import { emptyFunction } from "utils/helperUtils";
import Checkbox from "components/ui/Inputs/Checkbox";
import Row from "components/ui/Grid/Row";
import Column from "components/ui/Grid/Column";
import { typographySubtitle1 } from "styles/typography";
import { Container } from "components/ui/Modal/Modal";
import Tooltip from "components/ui/Tooltip/Tooltip";

const StyledDoubleButtonWrapper = styled(DoubleButtonWrapper)(
  () =>
    css`
      margin-top: ${gutters.large * 2}px;
      & > button {
        margin-top: ${gutters.small}px;
        margin-bottom: ${gutters.small}px;
      }

      ${mqMin.large} {
        margin-top: ${gutters.large * 3}px;
        & > button {
          margin-top: 0;
          margin-bottom: 0;
        }
      }
    `
);

export const StyledTooltip = styled(Tooltip)`
  ${mqMin.large} {
    justify-content: flex-start;
  }
`;

const ReservationModal = styled(StyledCartOptionModal)(
  () => css`
    ${Container} {
      ${mqMin.large} {
        width: 750px;
        height: auto;
      }
    }
  `
);

const StyledButton = styled(Button, {
  shouldForwardProp: () => true,
})`
  ${mqMin.large} {
    width: 80%;
  }
`;

const ChargeInfoText = styled.div`
  margin: ${gutters.small / 2}px 0;
  ${typographySubtitle1};
  color: ${greyColor};
  font-weight: ${fontWeightRegular};
`;

const StyledCheckbox = styled(Checkbox)`
  margin-bottom: ${gutters.large + gutters.small}px;
`;

const EMPTY_PAYER: CartTypes.PaymentLinkPayer = {
  id: 1,
  email: "",
  expireDate: undefined,
  customerName: "",
  customlyAddedPercentage: undefined,
  percentageOfTotal: 0,
  isInvalid: true,
};

const CreateReservationModal = ({
  onToggleModal,
  onCreateReservationPaymentLink,
  createPaymentLinkError,
  missingCustomerInfoFields,
  onDismissApolloError,
  isCreatePaymentLinkLoading,
  isCreatePaymentLinkSuccessful,
  onRefetchCartData,
}: {
  onToggleModal: () => void;
  onCreateReservationPaymentLink: (
    mainExpirationDate: SharedTypes.iso8601DateTime,
    paymentLinks: CartTypes.ReservationPaymentLink[]
  ) => void;
  createPaymentLinkError?: ApolloError;
  missingCustomerInfoFields: string[];
  onDismissApolloError: () => void;
  isCreatePaymentLinkLoading: boolean;
  isCreatePaymentLinkSuccessful: boolean;
  onRefetchCartData: () => void;
}) => {
  const theme: Theme = useTheme();
  const [payerDetails, setPayerDetails] = useState<CartTypes.PaymentLinkPayer[]>([]);
  const [mainExpiryDate, setMainExpiryDate] = useState<string>();
  const [isSingleExpDate, setIsSingleExpDate] = useState(true);
  const [pricePercentage, setPricePercentage] = useState(50);
  const [isPercentageSumError, setIsPercentageSumError] = useState(false);
  const [canValidateForms, setCanValidateForms] = useState(false);

  const sumOfPayerAdjustedPercentages = payerDetails.reduce(
    (acc, curr) => Number(curr.customlyAddedPercentage ?? "0") + acc,
    0
  );

  const hasValidationErrors = useMemo(
    () => payerDetails.some(item => item.isInvalid) || mainExpiryDate === undefined,
    [mainExpiryDate, payerDetails]
  );
  const hasMissingCustomerInfo = missingCustomerInfoFields.length > 0;
  const hasQueryOrMissingInfoErrors =
    hasMissingCustomerInfo || createPaymentLinkError !== undefined;

  const onSetOneExpDate = useCallback((value: boolean) => {
    if (value) {
      setPayerDetails(prevValue => prevValue.map(payer => ({ ...payer, expireDate: undefined })));
    }
    setIsSingleExpDate(value);
  }, []);

  const onUpdateMainExpiryDate = useCallback((dateString?: string) => {
    setMainExpiryDate(dateString);
  }, []);

  const onAdjustPricePercentage = useCallback(() => {
    if (sumOfPayerAdjustedPercentages > 0) {
      // extra payers - lead traveler
      const numberOfCustomPercentages =
        payerDetails.filter(payer => payer.customlyAddedPercentage !== undefined).length - 1;

      const newPercentage = adjustPercentageValue({
        numberOfCustomPercentages,
        numberOfExtraPayers: payerDetails.length,
        sumOfPayerAdjustedPercentages,
      });
      if (newPercentage <= 0 || newPercentage > 100) {
        setPricePercentage(0);
        setIsPercentageSumError(true);
      } else {
        setPricePercentage(newPercentage);
        setIsPercentageSumError(false);
      }
    } else {
      setPricePercentage(Math.round((100 / (payerDetails.length + 1)) * 100) / 100);
    }
  }, [sumOfPayerAdjustedPercentages, payerDetails]);

  // TODO: Look into refactoring this with the PR suggestion (https://github.com/GuideToIceland/monorepo/pull/18321#discussion_r1135808725)
  // The same approach as found in the usePassengersForm hook
  const onUpdatePayerDetails = useCallback((payer: CartTypes.PaymentLinkPayer) => {
    setPayerDetails(prevValue => prevValue.map(item => (item.id === payer.id ? payer : item)));
  }, []);

  const onAddNewPayer = useCallback(() => {
    const newPayer = {
      ...EMPTY_PAYER,
      id: payerDetails.length ? payerDetails[payerDetails.length - 1].id + 1 : EMPTY_PAYER.id,
    };
    setPayerDetails(prevValue => [...prevValue, newPayer]);
  }, [payerDetails]);

  const onRemovePayer = useCallback(
    (id: number) => {
      const filteredPayerDetails = payerDetails.filter(payer => payer.id !== id);
      setPayerDetails(filteredPayerDetails);
    },
    [payerDetails]
  );

  const onUpdateCartDataAndClose = useCallback(() => {
    onRefetchCartData();
    onToggleModal();
  }, [onToggleModal, onRefetchCartData]);

  const handleOnCreateReservationPaymentLink = useCallback(() => {
    if (hasValidationErrors) {
      setCanValidateForms(true);
    } else {
      const reservationLinks = payerDetails.map(curr => {
        const { id, isInvalid, customlyAddedPercentage, ...rest } = curr;
        return {
          ...rest,
          percentageOfTotal: customlyAddedPercentage
            ? Number(customlyAddedPercentage)
            : pricePercentage,
        };
      });
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      onCreateReservationPaymentLink(mainExpiryDate!, reservationLinks);
    }
  }, [
    hasValidationErrors,
    mainExpiryDate,
    onCreateReservationPaymentLink,
    payerDetails,
    pricePercentage,
  ]);

  useEffect(() => {
    // This condition resets the validation display when an user either updates the payerDetails array or
    // if the user decides that each payer will have their own expiration date
    if (canValidateForms) {
      setCanValidateForms(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [payerDetails, isSingleExpDate]);

  useEffect(() => {
    if (payerDetails.length > 0) {
      onAdjustPricePercentage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [payerDetails.length, sumOfPayerAdjustedPercentages]);

  useEffect(() => {
    if (createPaymentLinkError) {
      document.getElementById(HEADER_ID)?.scrollIntoView({ behavior: "smooth" });
    }
  }, [createPaymentLinkError]);

  return (
    <ReservationModal
      id="createReservationModal"
      onClose={isCreatePaymentLinkSuccessful ? onUpdateCartDataAndClose : onToggleModal}
      title="Reservation payment link"
      isError={hasQueryOrMissingInfoErrors}
    >
      <StyledModalHeading isError={hasQueryOrMissingInfoErrors} theme={theme} id={HEADER_ID}>
        Create a reservation payment link
        <ChargeInfoText>
          {isCreatePaymentLinkSuccessful ? (
            <InfoText>
              <IconWrapper isSuccessful isLargeIcon>
                <CheckCircleIcon />
              </IconWrapper>
              The reservation payment link was successfully created.
            </InfoText>
          ) : (
            <>
              <InfoText>Creates a payment link from the current cart.</InfoText>
              <InfoText>
                The customer(s) will receive an email notifying them of this charge.
              </InfoText>
              {payerDetails.length > 0 && !isPercentageSumError && (
                <InfoText>
                  <small>
                    <b>{`The lead traveler will be charged ${pricePercentage}% of the total price`}</b>
                  </small>
                </InfoText>
              )}
            </>
          )}
        </ChargeInfoText>
      </StyledModalHeading>
      {isCreatePaymentLinkSuccessful ? (
        <Button
          theme={theme}
          color="action"
          onClick={onUpdateCartDataAndClose}
          disabled={hasMissingCustomerInfo || isCreatePaymentLinkLoading}
        >
          Close and return to the front page
        </Button>
      ) : (
        <>
          {hasMissingCustomerInfo && (
            <AdminModalError>
              <InfoText>
                <IconWrapper>
                  <WarningIcon />
                </IconWrapper>
                Please fill in the missing mandatory customer info:
              </InfoText>
              <InfoText>
                {/* [phoneNumber, customerName] => phone number, customer name */}
                <strong>
                  {missingCustomerInfoFields
                    .join(", ")
                    .split(/(?=[A-Z])/)
                    .join(" ")
                    .toLowerCase()}
                </strong>
              </InfoText>
            </AdminModalError>
          )}
          {createPaymentLinkError && (
            <AdminModalError
              onDismissError={onDismissApolloError}
              isDismissable
              apolloError={createPaymentLinkError}
              useGenericErrorMessage
            />
          )}
          <div>
            <Row>
              <Column>
                <ExpiryDateSelect
                  onUpdateExpiryDate={onUpdateMainExpiryDate}
                  canValidate={canValidateForms}
                />
                {payerDetails.length > 0 && (
                  <StyledCheckbox
                    id="showSameExpDate"
                    name="showSameExpDate"
                    label="Use the same expiration date for all"
                    checked={isSingleExpDate}
                    onChange={onSetOneExpDate}
                  />
                )}
              </Column>
            </Row>
            {payerDetails.map((payer, index) => (
              <ReservationLinkPayer
                payer={payer}
                payerNumber={index + 1}
                onUpdatePayerDetails={onUpdatePayerDetails}
                onRemoveItem={onRemovePayer}
                canValidate={canValidateForms}
                defaultExpiryDate={isSingleExpDate ? mainExpiryDate : undefined}
                isReadOnlyDate={isSingleExpDate}
                isPercentageSumError={isPercentageSumError}
                key={`payer-${payer.id}`}
                pricePercentage={pricePercentage}
              />
            ))}
          </div>
          <StyledDoubleButtonWrapper>
            <StyledTooltip
              title="Please fill in all fields correctly"
              fullWidth
              isVisible={hasValidationErrors && !hasMissingCustomerInfo}
            >
              <StyledButton
                theme={theme}
                color="action"
                onClick={
                  hasMissingCustomerInfo || isCreatePaymentLinkLoading
                    ? emptyFunction
                    : handleOnCreateReservationPaymentLink
                }
                disabled={hasMissingCustomerInfo || isCreatePaymentLinkLoading}
              >
                Create payment link
              </StyledButton>
            </StyledTooltip>
            <StyledButton
              theme={theme}
              onClick={
                hasMissingCustomerInfo || isCreatePaymentLinkLoading ? emptyFunction : onAddNewPayer
              }
              disabled={hasMissingCustomerInfo || isCreatePaymentLinkLoading}
            >
              Add another payer
            </StyledButton>
          </StyledDoubleButtonWrapper>
        </>
      )}
    </ReservationModal>
  );
};

export default CreateReservationModal;
