declare namespace CarSearchTypes {
  import { CarProvider } from "types/enums";

  export type CarSearch = {
    selected?: boolean;
    vehicleCategory: string;
    id: number;
    name?: string;
    currency?: string;
    provider: CarProvider;
    headline: string;
    image: Image;
    linkUrl: string;
    carSpecs: SharedTypes.ProductSpec[];
    carProps: SharedTypes.ProductProp[];
    averageRating: number;
    reviewsCount: number;
    price: number;
    totalSaved?: number;
    ribbonLabelText?: string;
    establishment: SharedTypes.Establishment;
    recommendedOrderScore: number;
    priceOrderScore: number;
    filters: CarAppliedFilter[];
    category?: string;
  };

  export type QueryCarsSearch = {
    carOffers?: {
      resultCount: number;
      offers?: QueryCarSearch[];
      filters: CarFilter[];
    };
  };

  export type QueryCarSearch = {
    selected?: boolean;
    provider: string;
    idContext: number;
    carInfo: CarInfo;
    totalCharge: {
      estimatedTotalAmount: number;
      currency: string;
    };
    included: SharedCarTypes.CarIncluded[];
    vendor: SharedCarTypes.VendorInfo;
    productProps: SharedCarTypes.QueryProductProp[];
    recommendedOrderScore: number;
    priceOrderScore: number;
    filters: CarAppliedFilter[];
    rentalRate: {
      vehicleCharges: {
        basePrice: {
          amount: number;
        };
        discount: {
          percent: string;
          amount: number;
        } | null;
      };
    };
    quickFacts: SharedCarTypes.QueryQuickFacts;
  };

  export type CarInfo = {
    vehicleCategory: string;
    name: string;
    images: SharedCarTypes.QueryCarImage[];
    orSimilar: boolean;
  };

  export type CarFilterOption = {
    filterOptionId: string;
    name: string;
    isPrefilled: boolean;
  };

  export type CarAppliedFilter = {
    filterId: string;
    items: string[];
  };

  export type CarFilter = {
    filterId: string;
    type: string;
    options: CarFilterOption[];
  };

  export type QueryCarSearchCategories = {
    carTopTypes: {
      metadata: QuerySearchMetadata;
      searchCategories: QuerySearchCategory[];
    };
  };

  export type QueryCarSearchLinkedCategories = {
    carLinkedSearchCategories: {
      metadata: QuerySearchMetadata;
      searchCategories: QuerySearchCategory[];
    };
  };

  export type CarFilters = {
    carType: string[];
    includedInsurances: string[];
    seats: string[];
    supplier: string[];
    carFeatures: string[];
    depositAmount: string[];
    includedExtras: string[];
    supplierLocation: string[];
    fuelPolicy: string[];
    fuelType: string[];
    milage: string[];
  };

  export type TopCarRentalQuery = {
    url: string;
    image: QueryImage;
    reviewTotalScore: string;
    reviewTotalCount: number;
  };

  export type QueryTopCarRentals = {
    metadata: SharedTypes.PageCategoriesMetaType;
    establishments: TopCarRentalQuery[];
  };

  export type TopCarRental = {
    url: string;
    image?: Image;
    reviewTotalScore: number;
    reviewTotalCount: number;
  };

  export type QueryTopCar = {
    id: number;
    name: string;
    category: string;
    seats: number;
    automatic: boolean;
    bags: number;
    image: QueryImage;
    establishment: {
      name: string;
      image: QueryImage;
      reviewTotalScore: string;
      reviewTotalCount: number;
    };
  };
  export type CarFilterParams = {
    carType?: string[];
    includedInsurances?: string[];
    seats?: string[];
    supplier?: string[];
    carFeatures?: string[];
    depositAmount?: string[];
    includedExtras?: string[];
    supplierLocation?: string[];
    fuelPolicy?: string[];
    fuelType?: string[];
    milage?: string[];
  };

  export type CarSearchQueryFilters = {
    slug: string;
    pickupLocationId?: string;
    returnLocationId?: string;
    from?: string;
    to?: string;
    driverAge?: string;
    sourceCountry?: string;
  };

  export type AutoFilter = {
    defaultPickupLocation?: string;
    defaultDropoffLocation?: string;
  };
}
