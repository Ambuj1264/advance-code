import { createContext } from "react";

type ConstantContext = {
  cartLink: string;
  id: string;
  from: Date;
  to: Date;
  pickupId: number;
  dropoffId: number;
  queryPickupId: string;
  queryDropoffId: string;
  searchPageUrl: string;
  pickupLocation: string;
  isAirportPickup: boolean;
  isHotelPickup: boolean;
  dropoffLocation: string;
  isHotelDropoff: boolean;
  title: string;
  priceSubtext: string;
  discount?: number;
  editItem?: number;
  isCarnect: boolean;
  driverAge?: string;
  driverCountryCode?: string;
  availableLocations?: CarTypes.AvailableLocation[];
  editCarOfferCartId?: string;
};

const context = createContext<ConstantContext>({
  title: "",
  cartLink: "/cart",
  id: "0",
  from: new Date(),
  to: new Date(),
  pickupId: 0,
  dropoffId: 0,
  queryPickupId: "",
  queryDropoffId: "",
  searchPageUrl: "",
  pickupLocation: "",
  isAirportPickup: false,
  isHotelPickup: false,
  dropoffLocation: "",
  isHotelDropoff: false,
  priceSubtext: "",
  discount: 0,
  editItem: 0,
  isCarnect: true,
  availableLocations: [],
  editCarOfferCartId: "",
});

export default context;

export const { Provider } = context;
