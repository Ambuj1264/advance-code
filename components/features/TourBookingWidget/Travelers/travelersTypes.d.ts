declare namespace TravelersTypes {
  export type QueryPriceGroup = Readonly<{
    minAge: number;
    maxAge: number | null;
  }>;

  export type QueryPriceGroups = {
    [travelerType in SharedTypes.TravelerType]?: QueryPriceGroup;
  };

  export type QueryPriceGroupsData = Readonly<{
    priceGroups: QueryPriceGroups;
  }>;

  export type QueryPriceGroupsTour = Readonly<{
    tour: QueryPriceGroupsData;
  }>;

  export type PriceGroup = Readonly<{
    id: string;
    defaultNumberOfTravelerType: number;
    minAge: number;
    maxAge: number | null;
    travelerType: SharedTypes.TravelerType;
  }>;
}
