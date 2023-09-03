import { useMemo, useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import { ApolloError } from "apollo-client";

import CreateReservationMutation from "./graphql/CreateReservationMutation.graphql";

import { monolithAuthVerificationHeaders } from "utils/apiUtils";

const useCreateReservation = ({
  customerInfo,
}: {
  refetchCartData?: () => void;
  customerInfo?: CartTypes.CommonCustomerInfoInput;
}) => {
  const [createPaymentLinkError, setCreatePaymentLinkError] = useState<ApolloError>();

  const onDismissApolloError = () => {
    setCreatePaymentLinkError(undefined);
  };

  const hasAllMandatoryFields = Boolean(
    customerInfo?.email &&
      customerInfo?.name &&
      customerInfo?.phoneNumber &&
      customerInfo?.nationality
  );

  const missingCustomerInfoFields = useMemo(
    () =>
      customerInfo && !hasAllMandatoryFields
        ? Object.keys(customerInfo).filter(
            key =>
              Boolean(customerInfo[key as keyof CartTypes.CommonCustomerInfoInput]) === false &&
              !key.startsWith("business") &&
              !key.startsWith("company")
          )
        : [],
    [customerInfo, hasAllMandatoryFields]
  );

  const [createReservation, { loading: isCreatePaymentLinkLoading, data }] = useMutation<
    {
      createReservationWithPaymentLinks: {
        success: boolean;
        refusalReason?: string;
      };
    },
    CartTypes.CreateReservationParams
  >(CreateReservationMutation, {
    context: {
      headers: monolithAuthVerificationHeaders,
    },
    onError: err => setCreatePaymentLinkError(err),
    onCompleted: mutationData => {
      if (!mutationData?.createReservationWithPaymentLinks?.success) {
        const { refusalReason } =
          mutationData?.createReservationWithPaymentLinks ||
          "Mutation returned 'success: false'. No refusalReason received";
        setCreatePaymentLinkError({
          message: refusalReason,
        } as ApolloError);
      }
    },
  });

  const createReservationPaymentLink = (
    mainExpirationDate: SharedTypes.iso8601DateTime,
    paymentLinks: CartTypes.ReservationPaymentLink[]
  ) => {
    if (customerInfo) {
      createReservation({
        variables: {
          input: { customerInfo, paymentLinks, mainExpirationDate },
        },
      });
    }
  };
  return {
    createReservationPaymentLink,
    isCreatePaymentLinkLoading,
    createPaymentLinkError,
    missingCustomerInfoFields,
    onDismissApolloError,
    isCreatePaymentLinkSuccessful: data?.createReservationWithPaymentLinks?.success || false,
  };
};

export default useCreateReservation;
