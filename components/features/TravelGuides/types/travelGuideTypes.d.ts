declare namespace TravelGuideTypes {
  import { TGDSectionType } from "./travelGuideEnums";

  type CommonDestinationSectionProps = {
    id: string;
    image?: SharedTypes.GraphCMSAsset;
    title: string;
    description: string;
    compositeId?: string;
    sectionType: TGDSectionType;
    level?: number;
  };
  type DestinationSubSection = CommonDestinationSectionProps & {
    sectionParentType: string;
  };
  type DestinationSection = CommonDestinationSectionProps & {
    subSections?: DestinationSubSection[];
  };
  type TGBreadCrumbsRes = {
    metadataUri: string;
    title: string;
  };
  type TGDestinationNode = {
    id: number;
    name: string;
    countryCode: string;
    description: string;
    url: string;
    countryName: string;
    flagImageHandle: string;
    coverImageHandle: string;
    reviewCount?: number;
    reviewScore?: number;
    location?: {
      latitude: number;
      longitude: number;
    };
    isCapital: boolean;
  };

  type TGDestinationFilters = {
    countries: {
      cityId?: number;
      name?: string;
      countryCode?: string;
    }[];
    cities: {
      cityId?: number;
      name?: string;
    }[];
  };

  type TGDestinationsSearchQueryResult = {
    travelGuidesDestinations: {
      destinations: TGDestinationNode[];
      filters: TravelGuideSearchFilters;
      totalPages: number;
    };
  };

  type SingleDestinationContent = CommonDestinationProperties & {
    metaDescription: string;
    quickfactsList?: QuickfactsList;
    breadcrumbs?: TGBreadCrumbsRes[];
    valuePropsList?: {
      valueProps: ValueProp[];
    };
    region?: string;
    country?: string;
    yearlyVisitors?: number;
    elevationAboveSea?: string;
    size?: string;
    sections: DestinationSection[];
    timezone?: string;
    population?: number;
    language?: string;
    lifeExpectancy?: string;
    website?: string;
    attractions: TravelStopTypes.QueryGraphCMSAttraction[];
  };

  type DestinationContentResult = {
    destinationLandingPages: SingleDestinationContent[];
  };

  type ConstructedDestinationSection = {
    id: string;
    sectionType: TGDSectionType;
    title: string;
    description: string;
    image?: SharedTypes.ImageWithSize;
    level: number;
  };

  type ConstructedDestinationContent = {
    id: string;
    place: DestinationPlace;
    breadCrumbs: SharedTypes.BreadcrumbData[];
    title: string;
    description?: string;
    metaDescription: string;
    images: SharedTypes.ImageWithSize;
    mainImage: SharedTypes.GraphCMSAsset;
    destinationSpecs?: SharedTypes.ProductSpec[];
    valueProps?: ValueProp[];
    sections: ConstructedDestinationSection[];
    attractions: TravelStopTypes.TravelStops[];
    mapData?: SharedTypes.Map;
    tableOfContents: any[];
  };

  type SingleSectionResult = {
    id: string;
    destination?: LandingPageTypes.Place;
    origin?: LandingPageTypes.Place;
    country?: any;
    countries?: any[];
    title: string;
    slug?: string;
    pageType: GraphCMSPageType;
    pageVariation: string;
    metadataUri: string;
    image?: SharedTypes.ImageWithSize;
    staticMap?: SharedTypes.GraphCMSAsset;
    subType: LandingPageTypes.sectionCardSubtype;
  };
  type SectionQueryResult = {
    landingPages: SingleSectionResult[];
  };

  type DestinationPlace = {
    id: string;
    name: { id: string; value: string };
    inNameNew?: { id: string; value: string };
    country: { id: string; name: { id: string; value: string }; alpha2Code };
    countries: {
      id: string;
      flightId?: string;
      name: { id: string; value: string };
      alpha2Code: string;
      continentGroup?: number[];
    }[];
    carId: string;
    flightId: string;
    stayId: string;
    tourId: string;
    images?: SharedTypes.GraphCMSAsset[];
  };

  type TGSectionCondition = {
    where: LandingPageTypes.SectionWhere;
    sectionWhere?: LandingPageTypes.SectionWhere;
    input?: any;
    first?: number;
    orderBy?: string;
    order?: any[];
    continentGroup?: number[];
    metadataUri?: string;
    sectionType?: TGDSectionType;
    domain?: GraphCMSPageType;
    sideBarSection?: TGDSectionType;
  };

  type TGConstructedSection = {
    id: string;
    image: SharedTypes.ImageWithSize;
    placeImage: SharedTypes.ImageWithSize;
    staticMap?: SharedTypes.ImageWithSize;
    smallTitle?: string;
    title: string;
    slug?: string;
    pageType: GraphCMSPageType;
    metadataUri: string;
    subTypeImage?: SharedTypes.ImageWithSize;
    destinationFlag?: Image;
    originFlag?: Image;
  };

  type TourProductQueryResult = {
    tourProductPages: GTETourTypes.QueryTourSectionContent[];
  };
  type VPProductQueryResult = {
    vacationPackageSections: QueryVacationPackagesSearchTypes.VacationPackagesConnection;
  };
  type StaysProductQueryResult = {
    staysProductPages: StayTypes.QuerySimilarProduct[];
  };

  type TravelGuideSearchFilters = {
    countries?: {
      id: string;
      name: string;
      available?: boolean;
    }[];
    cities?: {
      id: number[];
      name: string;
      available?: boolean;
    }[];
  };
  type TGSearchResultCard = {
    id: number;
    linkUrl: string;
    headline?: string;
    description?: string;
    image?: {
      id: string;
      name?: string;
      url: string;
    };
    flag?: Image;
    rank?: number;
    clientRoute?: SharedTypes.ClientRoute;
  };
  type TGLandingContentQueryRes = {
    breadcrumbs: TGBreadCrumbsRes[];
    id: string;
    metadataDescription: string;
    metadataTitle: string;
    place?: {
      alpha2Code: string;
      name: {
        id: string;
        value: string;
      };
      mainImage: SharedTypes.GraphCMSAsset;
    };
    title: string;
    type: string;
    uniqueId: string;
  };

  type TGLandingNode = LandingPageTypes.QueryLandingPageSectionCardData & {
    id: string;
    metadataTitle: string;
    linkUrl: string;
    destination: DestinationPlace;
    title: string;
    type: string;
    uniqueId: string;
  };
  type TGLandingEdge = {
    node: TGLandingNode;
  };
  type TGLandingSectionContent = {
    edges: TGLandingEdge[];
    pageInfo: {
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      startCursor: string;
      endCursor: string;
      pageSize: number;
    };
    __typename?: string;
  };
  type TGLandingSection = {
    applicationStringTitle: { id: string; value: string };
    id: string;
    value: string;
    displayType: GraphCMSDisplayType;
    id: string;
    sectionType: string;
    shortTitle: {
      id: string;
      stringId: string;
      value: string;
    };
    useGoogleStaticImage: false;
    useSubTypeImage: false;
    useSubTypeTitle: false;
  };
  type TGLandingPageSection = {
    landingPages: TGLandingSectionContent;
    sections: TGLandingSection[];
  };
  type TGLandingPageData = {
    bestPlacesCategoryPages: TGLandingContentQueryRes[];
  };
}
