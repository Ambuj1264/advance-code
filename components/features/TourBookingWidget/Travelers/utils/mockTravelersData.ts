export const mockQueryPriceGroups0: TravelersTypes.QueryPriceGroups = {
  adults: {
    minAge: 13,
    maxAge: null,
  },
  teenagers: {
    minAge: 7,
    maxAge: 12,
  },
  children: {
    minAge: 0,
    maxAge: 12,
  },
};

export const mockQueryPriceGroups1: TravelersTypes.QueryPriceGroups = {
  adults: {
    minAge: 13,
    maxAge: null,
  },
};

export const mockPriceGroupAdult: TravelersTypes.PriceGroup = {
  id: "adults",
  travelerType: "adults",
  defaultNumberOfTravelerType: 1,
  minAge: 13,
  maxAge: null,
};

export const mockPriceGroupTeenager: TravelersTypes.PriceGroup = {
  id: "teenagers",
  travelerType: "teenagers",
  defaultNumberOfTravelerType: 0,
  minAge: 7,
  maxAge: 12,
};

export const mockPriceGroupChildren: TravelersTypes.PriceGroup = {
  id: "children",
  travelerType: "children",
  defaultNumberOfTravelerType: 0,
  minAge: 0,
  maxAge: 12,
};

export const mockPriceGroups0: Array<TravelersTypes.PriceGroup> = [
  mockPriceGroupAdult,
  mockPriceGroupTeenager,
  mockPriceGroupChildren,
];

export const mockPriceGroups1: Array<TravelersTypes.PriceGroup> = [mockPriceGroupAdult];

export const mockPriceGroups2: Array<TravelersTypes.PriceGroup> = [
  mockPriceGroupAdult,
  mockPriceGroupTeenager,
];

export const mockNumberOfTravelers1: SharedTypes.NumberOfTravelers = {
  adults: 2,
  teenagers: 1,
  children: 1,
};
