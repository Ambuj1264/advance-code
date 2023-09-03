declare namespace TravelStopTypes {
  import { TravelStopType } from "types/enums";

  type Name = {
    value: string;
  };

  type Quickfact = {
    title: string;
    name: Name;
    icon: SharedTypes.GraphCMSIcon;
    information?: SharedTypes.ProductSpecInfo;
    quickfactId?: string;
  };

  type QuickfactsList = {
    quickfacts: Quickfact[];
  };

  type CommonInfoTypes = {
    id: string;
    title: string;
    description?: string;
    mainImage: GraphCMSAsset;
    type?: string;
    region?: string;
    country?: string;
    yearlyVisitors?: number;
    elevationAboveSea?: string;
    size?: string;
  };

  type DestinationInfo = CommonInfoTypes & {
    name?: Name;
    timezone?: string;
    population?: number;
    language?: string;
    lifeExpectancy?: string;
    website?: string;
    uniqueId?: number;
    location?: {
      latitude: number;
      longitude: number;
    };
  };

  type AttractionInfo = CommonInfoTypes & {
    location: {
      latitude: number;
      longitude: number;
      distance?: number;
    };
    reviewScore: number;
    reviewCount: number;
    city?: string;
    address?: string;
    inception?: string;
    architect?: string;
    namedAfter?: string;
    width?: string;
    weight?: string;
    height?: string;
  };

  type TravelStops = {
    info: SharedTypes.Icon;
    type: TravelStopType;
    productSpecs: SharedTypes.ProductSpec[];
    isLoading?: boolean;
  };

  type QueryGraphCMSAttraction = AttractionInfo & {
    quickfactsList?: QuickfactsList;
  };

  type QueryGraphCMSDestination = DestinationInfo & {
    quickfactsList?: QuickfactsList;
  };
}
