declare namespace LandingPageTypes {
  import {
    VpFiltersWhere,
    VacationPackageVpType,
  } from "components/features/VacationPackages/utils/vacationPackagesUtils";
  import {
    GraphCMSSectionAdjective,
    GraphCMSPageVariation,
    GraphCMSDisplayType,
    PageType,
    GraphCMSPageType,
    SupportedLanguages,
  } from "types/enums";
  import PageInfo = GTETourSearchTypes.PageInfo;

  type PlaceNames = {
    toDestinationCity?: string;
    toOriginCity?: string;
    toDestinationCountry?: string;
    fromDestinationCity?: string;
    fromOriginCity?: string;
    fromDestinationCountry?: string;
    inDestinationCity?: string;
    inOriginCity?: string;
    inDestinationCountry?: string;
    inDestinationCountryOrOriginCountry?: string;
  };

  type ApplicationString = {
    value: string;
  };

  type Place = {
    id?: string;
    mainImage?: SharedTypes.GraphCMSAsset;
    images?: SharedTypes.GraphCMSAsset[];
    flightId?: string;
    carId?: string;
    stayId?: string;
    tourId?: string;
    name?: ApplicationString;
    defaultName?: ApplicationString;
    inName?: ApplicationString;
    fromName?: ApplicationString;
    toName?: ApplicationString;
    flag?: SharedTypes.GraphCMSAsset;
    countries?: Place[];
    country?: Place;
    continentGroup?: number[];
    continentGroupOrder?: number[];
    alpha2Code?: string;
    isMainCountry?: boolean;
  };

  type LandingPageSubType = {
    subtype?: string;
    name?: {
      value: string;
    };
    pluralName?: {
      value: string;
    };
    subTypeModifiers?: SubTypeModifier[];
  };

  type LandingPageQueryContent = {
    id: string;
    uniqueId?: string;
    metadataTitle?: string;
    metadataDescription?: string;
    title?: string;
    subtitle?: string;
    destination?: Place;
    origin?: Place;
    searchLinkRoute?: SharedTypes.ClientRoute;
    searchLink?: string;
    pageVariation: import("types/enums").GraphCMSPageVariation;
    subType?: LandingPageSubType;
    pageType?: GraphCMSPageType | PageType;
    image?: SharedTypes.GraphCMSAsset;
  };

  type LandingPageContentQuery = {
    landingPages: LandingPageQueryContent[];
  };

  type CommonMetaData = {
    hreflangs: Hreflang[];
    metadataTitle: string;
    metadataDescription: string;
    canonicalUri: string;
    pagePlace?: Place;
  };

  type Metadata = CommonMetaData & {
    images: Image[];
    review?: {
      totalScore: number;
      totalCount: number;
    };
  };

  type QueryMetadata = CommonMetaData & {
    image: SharedTypes.GraphCMSAsset | SharedTypes.GraphCMSAsset[];
  };
  type LandingPageMetadataQueryData = {
    metadata: QueryMetadata[];
  };

  type SectionContentType =
    | LandingPageTypes.QueryLandingPageSectionCardData
    | StayTypes.QuerySimilarProduct
    | VacationPackageTypes.QueryVacationPackageContent
    | GTETourTypes.QueryTourSectionContent
    | QueryVacationPackagesSearchTypes.VacationPackage
    | TravelGuideTypes.TGDestinationNode;

  type LandingPageConnectionRes<T> = {
    edges: {
      cursor: string;
      node: T;
    }[];
    pageInfo: PageInfo;
    __typename: string;
  };

  type SectionContentEdge =
    | SectionContentType
    | GTETourTypes.QueryTourSectionContent
    | QueryVacationPackagesSearchTypes.VacationPackage
    | TravelGuideTypes.TGLandingContentQueryRes;

  type QueryLandingPageSection = {
    sections: LandingPageTypes.QueryLandingPageSectionData[];
    sectionContent: LandingPageConnectionRes<SectionContentEdge>;
  };

  type LandingPageSectionCard = {
    title: string;
    linkUrl: string;
    image: ImageWithSizes;
    smallTitle?: string;
    subtitle?: string;
    description?: string;
    action?: string;
    country?: string;
    city?: string;
    slug?: string;
    originFlag?: ImageWithSizes;
    destinationFlag?: ImageWithSizes;
    pageType: GraphCMSPageType | PageType;
    subtype?: string;
    pluralType?: string;
    parentType?: string;
    pluralParentType?: string;
    subTypeModifier?: string;
    prefetchParams?: LandingPagePrefetchParams;
    destination?: Place;
    origin?: Place;
    price?: number;
    rank?: number;
    review?: SharedTypes.ProductReview;
    productSpecs?: SharedTypes.ProductSpec[];
    productProps?: SharedTypes.ProductProp[];
  };

  type sectionCardSubtype = {
    subtype?: string;
    tagId?: number;
    typeImage?: SharedTypes.GraphCMSAsset;
    name?: {
      value: string;
    };
    pluralName?: {
      value: string;
    };
    parentSubType?: {
      name?: {
        value: string;
      };
      pluralName?: {
        value: string;
      };
    };
    subTypeModifiers?: SubTypeModifier[];
  };

  type QueryLandingPageSectionCardData = {
    id: string;
    linkUrl: string;
    slug: string | null;
    title: string;
    destinationNumberOfPlaces: number;
    pageType: GraphCMSPageType;
    pageVariation: GraphCMSPageVariation;
    staticMap?: SharedTypes.GraphCMSAsset;
    subType?: sectionCardSubtype;
    continentGroup?: number[];
    continentGroupOrder: number[];
    destination?: Place;
    origin?: Place;
  };

  type QueryLandingPageSectionData = {
    id: number;
    displayType: GraphCMSDisplayType;
    sectionType: GraphCMSPageVariation;
    sectionId: number;
    applicationStringTitle: ApplicationString;
    useSubTypeTitle?: boolean;
    useSubTypeImage?: boolean;
    useGoogleStaticImage?: boolean;
    sectionAdjective?: GraphCMSSectionAdjective;
    shortTitle?: ApplicationString;
  };

  export type LandingPageNormalizedSectionData = ({
    sectionContent: SectionContentType[];
  } & QueryLandingPageSectionData)[];

  export type LandingPageQueryCondition = {
    pageType?: GraphCMSPageType;
    destinationLocationId?: string;
    pageVariation?: import("types/enums").GraphCMSPageVariation;
    // eslint-disable-next-line camelcase
    pageVariation_in?: import("types/enums").GraphCMSPageVariation[];
    destinationCountry?: string;
    metadataUri?: string;
    // eslint-disable-next-line camelcase
    metadataUri_contains?: string;
    // eslint-disable-next-line camelcase
    pageType_in?: GraphCMSPageType[];
    // eslint-disable-next-line camelcase
    domain_in?: GraphCMSPageType[];
    isDeleted?: boolean;
    cmsCountryPlaceId?: string;
    placeId?: string;
    destination?: {
      name?: {
        stringId?: string;
      };
      countries_some?: {
        name?: {
          stringId?: string;
        };
      };
    };
    subType?: {
      subtype?: string;
    };
    stayProductId?: number;
    tourId?: string;
  };

  export type LandingPagePrefetchParams = {
    subtype?: VacationPackageVpType;
    tagId?: number;
    pageVariation?: GraphCMSPageVariation;
    destinationPlaceId?: string;
    destinationCountryPlaceId?: string;
    originPlaceId?: string;
    flightId?: string;
    originCountryPlaceId?: string;
    destinationCountryCode?: string;
    originCountryCode?: string;
    metadataUri?: string;
    continentGroup?: number[];
    ssrQueries?: boolean;
  };

  export type LandingPageValueProposition = {
    title: string;
    description?: string;
    icon: {
      handle: string;
      svgAsString: string;
    };
  };

  export type SectionWhere = {
    pageType?: GraphCMSPageType;
    pageVariation?: GraphCMSPageVariation;
    // eslint-disable-next-line camelcase
    pageVariation_in?: GraphCMSPageVariation[];
    pageType_in?: GraphCMSPageType[];
    subType?: {
      subtype?: VacationPackageVpType;
      tagId?: number;
      parentSubType?: {
        subtype?: string;
      };
    };
    // eslint-disable-next-line camelcase
    subTypes_some?: {
      subtype?: string;
      tagId?: number;
    };
    destinationPlaceId?: string;
    destinationCountryPlaceId?: string;
    originPlaceId?: string;
    originCountryPlaceId?: string;
    cmsCountryPlaceId?: string;
    placeId?: string;
    isDisabled?: boolean;
    destinationCountryCodes_contains_some?: string[];
    originCountryCodes_contains_some?: string[];
    startPlace?: {
      id?: string;
      countries_some?: {
        id?: string;
      };
    };
    endPlace?: {
      id?: string;
      countries_some?: {
        id?: string;
      };
    };
    destination?: {
      id?: string;
    };
    origin?: {
      id?: string;
    };
    place?: {
      id?: string;
    };
    combinedRating_not?: number | null;
    images_every?: {
      width_not?: number;
    };
    NOT?: {
      destinationPlaceId?: string;
      place?: {
        id?: string;
      };
      origin?: { continentGroup?: number[] };
      metadataUri?: string;
      fromPrice?: number;
      uniqueId?: string;
    };
    OR?: {
      placeId?: string;
      cmsCountryPlaceIds_contains_some?: string;
      startPlace?: {
        id?: string;
        countries_some?: {
          id?: string;
        };
      };
    }[];
    variation?: { eq?: string; in?: string[] };
    reviewScore_gte?: number;
    isDeleted?: boolean;
    cityId?: number;
    countryCode?: string;
    order?: any[];
  };

  export type Where = {
    sectionId: number;
    // eslint-disable-next-line camelcase
    domain_in: GraphCMSPageType[];
  } & VpFiltersWhere;

  export type SectionWhereCondition = {
    sectionWhere?: SectionWhere;
    where: Where;
    domain?: GraphCMSPageType;
    orderBy?: string;
    itemsPerPage: number;
    useSortedQuery?: boolean;
  };

  export type SectionQueryWithVars = {
    query: DocumentNode;
    variables: Omit<
      SectionWhereCondition & {
        isDeleted?: boolean;
        locale: SupportedLanguages | SupportedLanguages[];
        metadataUri?: string;
        continentGroup?: number[];
        first?: number;
        after?: string;
        before?: string;
        input?: any;
      },
      "useSortedQuery" | "itemsPerPage"
    >;
  };

  export type SubTypeModifier = {
    modifierType: GraphCMSSectionAdjective;
    modifierTitle: ApplicationString;
  };
}
