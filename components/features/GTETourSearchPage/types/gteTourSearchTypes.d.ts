declare namespace GTETourSearchTypes {
  type QueryFilters = {
    activities?: {
      activityId: number;
      subtypeId: number;
      name: string;
      active: boolean;
    }[];
    locations?: {
      attractionId: string[];
      locationId: string[];
      name: string;
      active: boolean;
    }[];
    duration?: {
      name: string;
      fromMinutes: number;
      toMinutes: number;
      isActive: boolean;
    }[];
    price?: {
      minValue: number;
      maxValue: number;
      count: number;
    }[];
    reviews?: {
      name: string;
      reviewScore: number;
      isActive: boolean;
    }[];
    time?: {
      name: string;
      fromHour: number;
      endHour: number;
      isActive: boolean;
    }[];
  };

  type PageInfo = {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor: string;
    endCursor: string;
  };

  type Quickfact = {
    title: string;
    name: Name;
    icon: SharedTypes.GraphCMSIcon;
  };

  type QuickfactsList = {
    quickfacts: Quickfact[];
  };

  type QueryValueProp = {
    title: string;
    icon: SharedTypes.GraphCMSIcon;
  };

  type QueryTour = {
    id: number;
    name: string;
    linkUrl: string;
    description: string;
    image: SharedTypes.GraphCMSAsset;
    likelyToSellOut: boolean;
    reviewScore: number;
    reviewCount: number;
    price: number;
    durationInMinutes: number;
    productCode: string;
    valuePropsList: {
      valueProps: QueryValueProp[];
    };
    quickFactVariables: { [x: string]: string | string[] | number | undefined };
    quickFactList: QuickfactsList;
  };

  type QueryTourData = {
    totalCount: number;
    filters: QueryFilters;
    pageInfo: PageInfo;
    nodes: QueryTour[];
  };

  type QueryStartingLocation = {
    locationId: string;
    name: string;
    type: string;
  };
}
