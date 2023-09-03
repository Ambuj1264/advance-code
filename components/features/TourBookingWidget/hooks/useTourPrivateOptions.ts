import { useQuery } from "@apollo/react-hooks";

import PrivateOptionsQuery from "../queries/TourPrivateOptionsQuery.graphql";

const useTourPrivateOptions = ({
  slug,
  isLivePricing,
  onCompleted,
}: {
  slug: string;
  isLivePricing: boolean;
  onCompleted: (data?: TourBookingWidgetTypes.QueryPrivateOptions) => void;
}) => {
  useQuery<TourBookingWidgetTypes.QueryPrivateOptions>(PrivateOptionsQuery, {
    variables: { slug },
    skip: isLivePricing,
    onCompleted: privateOptionsData => {
      onCompleted(privateOptionsData);
    },
  });
};

export default useTourPrivateOptions;
