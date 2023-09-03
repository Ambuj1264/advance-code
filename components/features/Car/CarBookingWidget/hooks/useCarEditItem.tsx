import { useContext } from "react";

import CarBookingWidgetConstantContext from "../contexts/CarBookingWidgetConstantContext";
import CarBookingWidgetStateContext from "../contexts/CarBookingWidgetStateContext";
import CarBookingWidgetCallbackContext from "../contexts/CarBookingWidgetCallbackContext";

import cartQuery from "components/features/Cart/queries/CartQuery.graphql";
import {
  pickupOrFlightNumber,
  setSelectedExtras,
  setSelectedInsurces,
} from "components/features/Car/CarBookingWidget/utils/carBookingWidgetUtils";
import { noCacheHeaders } from "utils/apiUtils";
import useQueryClient from "hooks/useQueryClient";

const useCarEditItem = () => {
  const { editItem } = useContext(CarBookingWidgetConstantContext);
  const { selectedExtras } = useContext(CarBookingWidgetStateContext);
  const { setSelectedExtra, setSelectedInsurance, setSpecifiedDropoff, setSpecifiedPickup } =
    useContext(CarBookingWidgetCallbackContext);
  useQueryClient<CartTypes.QueryCart>(cartQuery, {
    context: { headers: noCacheHeaders },
    ssr: false,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "no-cache",
    skip: !editItem,
    onCompleted: data => {
      if (!data) return {};
      const carItem = data?.cart?.cars?.find(car => car?.cartItemId === `cars-${editItem}`);

      if (carItem) {
        const {
          insurances: preSelectedInsurances,
          extras: preSelectedExtras,
          dropoffSpecify,
        } = carItem;

        const pickupSpecify = pickupOrFlightNumber(carItem);

        if (preSelectedInsurances?.length > 0) {
          setSelectedInsurces(preSelectedInsurances, setSelectedInsurance);
        }
        if (preSelectedExtras?.length > 0) {
          setSelectedExtras(selectedExtras, preSelectedExtras, setSelectedExtra);
        }
        if (pickupSpecify) {
          setSpecifiedPickup(pickupSpecify);
        }
        if (dropoffSpecify) {
          setSpecifiedDropoff(dropoffSpecify);
        }
      }
      return {};
    },
  });
};

export default useCarEditItem;
