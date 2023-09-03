import { createContext } from "react";

type ConstantContext = {
  id: number;
  tourType: string;
  lengthOfTour: number;
  isFreePickup: boolean;
  slug: string;
  transport: PickupTransport;
  editItem?: TourBookingWidgetTypes.EditItem;
  lowestPriceGroupSize: number;
  title: string;
  currentRequestAuth?: string;
};

const context = createContext<ConstantContext>({
  id: 0,
  tourType: "",
  lengthOfTour: 1,
  isFreePickup: false,
  transport: {
    pickup: "",
    enableNotKnown: false,
    required: false,
    price: 0,
    pickupType: "",
    places: [],
  },
  slug: "",
  editItem: undefined,
  lowestPriceGroupSize: 1,
  title: "",
});

export default context;

export const { Provider } = context;
