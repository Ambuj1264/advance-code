import { PostBookingTypes } from "../../types/postBookingTypes";

import useActiveLocale from "hooks/useActiveLocale";
import { noCacheHeaders } from "utils/apiUtils";
import GetCarVoucherQuery from "components/features/PostBooking/queries/PBCarVoucher.graphql";
import GetStayVoucherQuery from "components/features/PostBooking/queries/PBStayVoucher.graphql";
import GetStayProductVoucherQuery from "components/features/PostBooking/queries/PBStayProductVoucher.graphql";
import GetAttractionQuery from "components/features/VacationPackageProductPage/queries/VPAttractionQuery.graphql";
import GetFlightVoucherQuery from "components/features/PostBooking/queries/PBFlightVoucher.graphql";
import GetTourVoucherQuery from "components/features/PostBooking/queries/PBTourVoucher.graphql";
import useQueryClient from "hooks/useQueryClient";

const context = {
  headers: noCacheHeaders,
};

export const useCarVoucherQuery = ({
  skip = true,
  bookingId,
  orderId,
}: {
  skip: boolean;
  bookingId: number | string;
  orderId?: number;
}) => {
  return useQueryClient<PostBookingTypes.QueryCarVoucher>(GetCarVoucherQuery, {
    variables: {
      input: {
        orderId,
        carBookingId: bookingId,
      },
    },
    context,
    skip,
  });
};

export const useStayVoucherQuery = ({
  skip = true,
  bookingId,
  orderId,
}: {
  skip: boolean;
  bookingId: number | string;
  orderId?: number;
}) => {
  return useQueryClient<PostBookingTypes.QueryStayVoucher>(GetStayVoucherQuery, {
    variables: {
      input: {
        orderId,
        stayBookingId: bookingId,
      },
    },
    context,
    skip,
  });
};

// used for new stays funnel standalone bookings
export const useStayProductVoucherQuery = ({
  skip = true,
  bookingId,
  orderId,
}: {
  skip: boolean;
  bookingId: number | string;
  orderId?: number;
}) => {
  return useQueryClient<PostBookingTypes.QueryStayVoucher>(GetStayProductVoucherQuery, {
    variables: {
      input: {
        orderId,
        stayBookingId: bookingId,
      },
    },
    context,
    skip,
  });
};

export const useAttractionQuery = ({
  skip = true,
  bookingId,
}: {
  skip: boolean;
  bookingId: number | string;
}) => {
  const locale = useActiveLocale();
  return useQueryClient<PostBookingTypes.QueryAttraction>(GetAttractionQuery, {
    variables: {
      where: {
        attractionId: bookingId,
      },
      locale,
    },
    context,
    skip,
  });
};

export const useFlightVoucherQuery = ({
  skip = true,
  bookingId,
  orderId,
}: {
  skip: boolean;
  bookingId: number | string;
  orderId?: number;
}) => {
  return useQueryClient<PostBookingTypes.QueryFlightVoucher>(GetFlightVoucherQuery, {
    variables: {
      input: {
        orderId,
        flightBookingId: bookingId,
      },
    },
    context,
    skip,
  });
};

export const useTourVoucherQuery = ({
  skip = true,
  bookingId,
  orderId,
}: {
  skip?: boolean;
  bookingId: number | string;
  orderId?: number;
}) => {
  return useQueryClient<PostBookingTypes.QueryTourVoucher>(GetTourVoucherQuery, {
    variables: {
      input: {
        orderId,
        tourBookingId: bookingId,
      },
    },
    context,
    skip,
  });
};
