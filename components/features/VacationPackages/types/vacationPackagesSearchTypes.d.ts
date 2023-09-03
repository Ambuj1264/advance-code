declare namespace QueryVacationPackagesSearchTypes {
  type VacationPackageGraphCmsImageEntry = {
    handle?: string;
    caption?: string;
  };

  type VacationPackagePageInfo = {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor?: string;
    endCursor?: string;
  };

  type VacationPackageCategoryTypeFilter = "VariationSelectors" | "Variation" | "SubType";

  type VacationPackageSearchFilters = {
    types?: {
      id: string;
      name: string;
      available: boolean;
      type: VacationPackageCategoryTypeFilter;
    }[];
    countries?: {
      id: string;
      name: string;
      available: boolean;
    }[];
    activitiesList?: {
      id: string[];
      name: string;
      available: boolean;
    }[];
    destinationsList?: {
      id: number[];
      name: string;
      available: boolean;
    }[];
    numberOfDays: number[];
    allDays: number[];
    price?: {
      minValue: number;
      maxValue: number;
      count: number;
    }[];
  };

  type VacationPackageSearchFiltersKeysWithoutNumberOfDays = keyof Omit<
    VacationPackageSearchFilters,
    "numberOfDays"
  >;

  type VacationPackagesConnection = {
    nodes?: VacationPackage[];
    totalCount: number;
    filters?: VacationPackageSearchFilters;
    __typename?: string;
  };

  type GraphCmsVacationPackage = {
    id?: string;
    title?: string;
    image?: SharedTypes.GraphCMSAsset;
    description?: string;
    metaDescription?: string;
    metaUri?: string;
    reviewCount?: number;
    reviewScore?: number;
    startsIn?: string;
    endsIn?: string;
    available?: string;
    days?: string;
    nights?: number;
    startTime?: string;
    endTime?: string;
    flagHandle?: string;
    countryName?: string;
    quickfactsList?: VacationPackageTypes.QuickfactsList;
    quickfacts?: VacationPackageTypes.Quickfact[];
    valueProps?: VacationPackageTypes.ValueProp[];
  };

  type VacationPackage = {
    id?: string;
    price?: {
      amount: number;
    };
    cmsObject?: GraphCmsVacationPackage;
  };

  type VacationPackagesSearch = {
    totalCount: number;
    vacationPackages: VacationPackagesConnection;
  };

  type VacationPackagesSectionSearch = {
    vacationPackages: VacationPackagesConnection;
    sections: LandingPageTypes.QueryLandingPageSectionData[];
  };

  type VPLandingPageContentQuery = {
    landingPages: Pick<
      LandingPageTypes.LandingPageQueryContent,
      "id" | "image" | "title" | "pageVariation"
    >[];
  };
}
