import { useQuery } from "@apollo/react-hooks";

import tourOptionsQuery from "../queries/TourOptionsQuery.graphql";
import { BookingWidgetAction, BookingWidgetActionType } from "../BookingWidgetState";

import { constructTourOptions } from "components/features/TourBookingWidget/Experiences/experiencesUtils";

const useTourOptions = ({
  id,
  dateFrom,
  times,
  isLivePricing,
  dispatch,
}: {
  id: number;
  dateFrom?: Date;
  times?: any;
  isLivePricing: boolean;
  dispatch: React.Dispatch<BookingWidgetAction>;
}) => {
  const { error: optionsError, loading: isLoadingOptions } =
    useQuery<ExperiencesTypes.QueryTourOptions>(tourOptionsQuery, {
      variables: { id },
      onCompleted: ({ tour }) => {
        dispatch({
          type: BookingWidgetActionType.SetTourOptions,
          options: constructTourOptions(tour.tourOptions),
        });
      },
      skip: isLivePricing || !dateFrom || times.length === 0,
    });

  return { optionsError, isLoadingOptions };
};

export default useTourOptions;
