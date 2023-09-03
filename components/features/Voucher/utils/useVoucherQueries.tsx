import VoucherQuery from "../graphql/VoucherQuery.graphql";
import VoucherUpsellQuery from "../graphql/VoucherUpsellQuery.graphql";
import VoucherCarSearchUrlQuery from "../graphql/VoucherCarSearchUrlQuery.graphql";
import GTEVoucherQuery from "../graphql/GTEVoucherQuery.graphql";
import PaymentLinkVoucherQuery from "../../PaymentLink/queries/PaymentLinkVoucherQuery.graphql";

import useQueryClient from "hooks/useQueryClient";
import { normalizeGraphCMSLocale } from "utils/helperUtils";
import useActiveLocale from "hooks/useActiveLocale";
import useSession from "hooks/useSession";
import { noCacheHeaders } from "utils/apiUtils";
import { useSettings } from "contexts/SettingsContext";
import { Marketplace } from "types/enums";

const useVoucherQueries = ({
  voucherId,
  isGTE,
  isPDF,
  paymentLinkId,
}: {
  voucherId?: string;
  isGTE: boolean;
  isPDF?: boolean;
  paymentLinkId?: string;
}) => {
  const activeLocale = useActiveLocale();
  const { queryCompleted: isUserSessionQueryCompleted, refetch: fetchSessionData } = useSession();
  const { marketplace } = useSettings();
  const isGTTP = marketplace === Marketplace.GUIDE_TO_THE_PHILIPPINES;

  const {
    data,
    loading,
    error,
    refetch: refetchVoucher,
  } = useQueryClient<VoucherTypes.VoucherQuery>(VoucherQuery, {
    variables: { voucherId },
    context: {
      headers: noCacheHeaders,
      fetchOptions: {
        method: "POST",
      },
    },
    skip: isGTE || !voucherId || !!paymentLinkId,
    fetchPolicy: "no-cache",
    onCompleted: () => {
      if (!isPDF) fetchSessionData();
    },
  });
  const {
    data: gteData,
    loading: gteLoading,
    error: gteError,
    refetch: refetchGTEVoucher,
  } = useQueryClient<VoucherTypes.GTEVoucherQuery>(GTEVoucherQuery, {
    variables: { voucherId },
    context: {
      headers: noCacheHeaders,
      fetchOptions: {
        method: "POST",
      },
    },
    skip: !isGTE || !voucherId || !!paymentLinkId,
    fetchPolicy: "no-cache",
    onCompleted: () => {
      if (!isPDF) fetchSessionData();
    },
  });

  const {
    data: voucherUpsellData,
    loading: voucherUpsellLoading,
    error: voucherUpsellError,
  } = useQueryClient<VoucherTypes.VoucherUpsellQuery>(VoucherUpsellQuery, {
    variables: { locale: normalizeGraphCMSLocale(activeLocale) },
    context: {
      headers: noCacheHeaders,
    },
    fetchPolicy: "no-cache",
  });

  const {
    data: carSearchUrlData,
    loading: carSearchUrlLoading,
    error: carSearchUrlError,
  } = useQueryClient<VoucherTypes.CarSearchUrlQuery>(VoucherCarSearchUrlQuery);

  const {
    data: paymentLinkVoucherData,
    loading: paymentLinkVoucherLoading,
    error: paymentLinkVoucherError,
    refetch: refetchPaymentLinkVoucher,
  } = useQueryClient<PaymentLinkTypes.PaymentLinkVoucher>(PaymentLinkVoucherQuery, {
    variables: { payByLinkId: paymentLinkId },
    context: {
      headers: noCacheHeaders,
      fetchOptions: {
        method: "POST",
      },
    },
    skip: !paymentLinkId || !!voucherId,
    fetchPolicy: "no-cache",
  });

  const vpSlug = isGTTP
    ? voucherUpsellData?.voucherUpsells[0]?.gttpVacationPackagesSlug
    : voucherUpsellData?.voucherUpsells[0]?.vacationPackagesSlug;

  const commonVoucherElements = {
    voucherUpsellData,
    voucherUpsellLoading,
    voucherUpsellError,
    carSearchUrl: carSearchUrlData?.carSearchUrl,
    carSearchUrlError,
    carSearchUrlLoading,
    payByLinkType: paymentLinkVoucherData?.payByLinkVoucher?.payByLinkType,
    payerInfo: paymentLinkVoucherData?.payByLinkVoucher?.payerInfo,
  };

  if (paymentLinkId) {
    return {
      ...commonVoucherElements,
      voucherData: paymentLinkVoucherData?.payByLinkVoucher,
      voucherLoading: paymentLinkVoucherLoading,
      voucherError: paymentLinkVoucherError,
      refetchVoucher: refetchPaymentLinkVoucher,
      isUserSessionQueryCompleted,
      vpSlug,
    };
  }

  if (isGTE) {
    return {
      ...commonVoucherElements,
      voucherData: gteData?.voucher,
      voucherLoading: gteLoading,
      voucherError: gteError,
      refetchVoucher: refetchGTEVoucher,
      isUserSessionQueryCompleted,
      vpSlug: "",
    };
  }
  return {
    ...commonVoucherElements,
    voucherData: data?.voucher,
    voucherLoading: loading,
    voucherError: error,
    refetchVoucher,
    isUserSessionQueryCompleted,
    vpSlug,
  };
};

export default useVoucherQueries;
