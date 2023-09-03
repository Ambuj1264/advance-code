declare namespace TourCartTypes {
  export type QueryItem = Readonly<{
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
  }>;

  export type CurrentCart = Readonly<{
    id: string;
    items: TourBookingWidgetTypes.EditItem[];
  }>;

  export type QueryCart = Readonly<{
    currentCart: {
      id: string;
      items: QueryItem[];
    };
  }>;
}
