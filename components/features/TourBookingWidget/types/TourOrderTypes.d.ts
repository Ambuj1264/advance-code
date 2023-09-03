declare namespace TourOrderTypes {
  export type ContactInformation = {
    name: string;
    email: string;
    phone: string;
    country: string;
  };

  export type PickupInformation = {
    pickupType: string;
    pickupTime: string;
    pickupAddress: string;
    placeId: number;
    pickupFlightNumber: string;
    dropoffTime: string;
    dropoffPlaceId: number;
    dropoffAddress: string;
    dropoffType: string;
    dropoffFlightNumber: string;
    specialRequest: string;
  };

  export type QueryItem = {
    itemId: number;
    productId: number;
    type: string;
    name: string;
    persons: number;
    adults: number;
    teenagers: number;
    children: number;
    date: string;
    time: string;
    tourDetails: TourBookingWidgetTypes.EditItemDetails;
    editLock: boolean;
  };

  export type Order = {
    id: number;
    items: TourBookingWidgetTypes.EditItem[];
    customerData: ContactInformation;
  };

  export type QueryOrder = {
    orderAsCart: {
      id: number;
      items: QueryItem[];
      customerData: ContactInformation;
    };
  };
}
