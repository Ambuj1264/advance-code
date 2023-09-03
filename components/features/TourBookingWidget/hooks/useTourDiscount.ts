import { useQuery } from "@apollo/react-hooks";

import DiscountQuery from "../queries/TourDiscountQuery.graphql";

import { noCacheHeaders } from "utils/apiUtils";

const useTourDiscount = ({
  slug,
  dateFrom,
  onCompleted,
  isLivePricing,
}: {
  slug: string;
  dateFrom?: Date;
  onCompleted: (data?: TourBookingWidgetTypes.QueryDiscount) => void;
  isLivePricing: boolean;
}) => {
  const { loading: isDiscountLoading } = useQuery<TourBookingWidgetTypes.QueryDiscount>(
    DiscountQuery,
    {
      variables: {
        slug,
        dateFrom,
      },
      context: {
        headers: noCacheHeaders,
      },
      skip: isLivePricing,
      onCompleted: data => {
        onCompleted(data);
      },
    }
  );

  return { isDiscountLoading };
};

export default useTourDiscount;
