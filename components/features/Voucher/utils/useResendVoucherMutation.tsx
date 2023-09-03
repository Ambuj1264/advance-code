import { useMutation } from "@apollo/react-hooks";

import ResendVoucherMutation from "../graphql/ResendVoucherMutation.graphql";

const useResendVoucherMutation = ({ voucherId }: { voucherId: string }) => {
  const [resendVoucherMutation, { data, loading }] = useMutation<
    {
      resendVoucher: { success: boolean };
    },
    {
      email: string;
      voucherId: string;
    }
  >(ResendVoucherMutation);

  const onResendVoucher = (email: string) =>
    resendVoucherMutation({ variables: { email, voucherId } });

  const isFailure = data?.resendVoucher.success === false;

  const isSuccess = data?.resendVoucher.success === true;

  return { onResendVoucher, isLoading: loading, isFailure, isSuccess };
};

export default useResendVoucherMutation;
