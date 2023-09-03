import { useCallback, useState } from "react";
import { differenceInSeconds } from "date-fns";

const useProductOfferExpired = ({
  isAvailable,
  expiredTime,
  fetchCartData,
}: {
  isAvailable: boolean;
  expiredTime?: Date | string;
  fetchCartData?: () => void;
}) => {
  const [isTimeEnded, setIsTimeEnded] = useState(false);
  const onExpired = useCallback(() => {
    if (fetchCartData) {
      fetchCartData();
      setIsTimeEnded(true);
    }
  }, [fetchCartData]);
  const expiredTimeDifference = expiredTime
    ? differenceInSeconds(new Date(expiredTime), Date.now())
    : undefined;
  const isExpiredOffer =
    !isAvailable ||
    isTimeEnded ||
    (expiredTimeDifference !== undefined && expiredTimeDifference <= 0);

  return { onExpired, isExpiredOffer, expiredTimeDifference };
};

export default useProductOfferExpired;
