import { ApolloError } from "apollo-client";

import { PB_CARD_TYPE } from "components/features/PostBooking/types/postBookingEnums";
import {
  useAttractionQuery,
  useCarVoucherQuery,
  useFlightVoucherQuery,
  useStayProductVoucherQuery,
  useStayVoucherQuery,
  useTourVoucherQuery,
} from "components/features/PostBooking/components/hooks/useFetchPBInfoModalData";
import { PostBookingTypes } from "components/features/PostBooking/types/postBookingTypes";

const usePBModalManagerHook = ({
  productType,
  id,
  orderId,
}: {
  productType: PB_CARD_TYPE;
  id: string | number;
  orderId?: number;
}): {
  data: PostBookingTypes.UnionPBInfoModalDataType;
  loading: boolean;
  error: ApolloError | undefined;
} => {
  const {
    data: carVoucherData,
    loading: carVoucherLoading,
    error: carVoucherError,
  } = useCarVoucherQuery({
    skip: productType !== PB_CARD_TYPE.CAR_RENTAL,
    bookingId: id,
    orderId,
  });

  const {
    data: stayVoucherData,
    loading: stayVoucherLoading,
    error: stayVoucherError,
  } = useStayVoucherQuery({
    skip: productType !== PB_CARD_TYPE.STAY,
    bookingId: id,
    orderId,
  });

  const {
    data: stayProductVoucherData,
    loading: stayProductVoucherLoading,
    error: stayProductVoucherError,
  } = useStayProductVoucherQuery({
    skip: productType !== PB_CARD_TYPE.STAY_PRODUCT,
    bookingId: id,
    orderId,
  });

  const {
    data: pbAttractionData,
    loading: pbAttractionLoading,
    error: pbAttractionError,
  } = useAttractionQuery({
    skip: productType !== PB_CARD_TYPE.ATTRACTION,
    bookingId: id,
  });

  const {
    data: flightVoucherData,
    loading: flightVoucherLoading,
    error: flightVoucherError,
  } = useFlightVoucherQuery({
    skip:
      productType !== PB_CARD_TYPE.FLIGHT_RETURN && productType !== PB_CARD_TYPE.FLIGHT_ARRIVING,
    bookingId: id,
    orderId,
  });

  const {
    data: tourVoucherData,
    loading: tourVoucherLoading,
    error: tourVoucherError,
  } = useTourVoucherQuery({
    skip: productType !== PB_CARD_TYPE.TOUR,
    bookingId: id,
    orderId,
  });

  if (productType === PB_CARD_TYPE.CAR_RENTAL) {
    return {
      data: carVoucherData,
      loading: carVoucherLoading,
      error: carVoucherError,
    };
  }

  if (productType === PB_CARD_TYPE.STAY) {
    return {
      data: stayVoucherData,
      loading: stayVoucherLoading,
      error: stayVoucherError,
    };
  }
  if (productType === PB_CARD_TYPE.STAY_PRODUCT) {
    return {
      data: stayProductVoucherData,
      loading: stayProductVoucherLoading,
      error: stayProductVoucherError,
    };
  }

  if (productType === PB_CARD_TYPE.FLIGHT_ARRIVING || productType === PB_CARD_TYPE.FLIGHT_RETURN) {
    return {
      data: flightVoucherData,
      loading: flightVoucherLoading,
      error: flightVoucherError,
    };
  }

  if (productType === PB_CARD_TYPE.ATTRACTION) {
    return {
      data: pbAttractionData,
      loading: pbAttractionLoading,
      error: pbAttractionError,
    };
  }

  if (productType === PB_CARD_TYPE.TOUR) {
    return {
      data: tourVoucherData,
      loading: tourVoucherLoading,
      error: tourVoucherError,
    };
  }
  return {
    data: undefined,
    loading: false,
    error: undefined,
  };
};

export default usePBModalManagerHook;
