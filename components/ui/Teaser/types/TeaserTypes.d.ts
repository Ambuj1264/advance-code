declare namespace TeaserTypes {
  export interface Tour {
    id: number;
    name: string;
    linkUrl: string;
    slug: string;
    description: string;
    averageRating: number;
    reviewsCount: number;
    image: Image;
    price?: number;
    totalSaved?: number;
    specs: SharedTypes.ProductSpec[];
    props: SharedTypes.ProductProp[];
    clientRoute: SharedTypes.ClientRoute;
    ribbonLabelText?: string;
  }

  export interface QueryTour extends Tour {
    image: QueryImage;
    specs: SharedTypes.QueryProductSpec[];
    props: SharedTypes.QueryProductProp[];
    banner: {
      text: string;
    };
    basePrice: number;
    discount?: {
      value: number;
    };
  }

  export type Hotel = Tour;

  export interface QueryHotel extends Hotel {
    image: QueryImage;
    specs: SharedTypes.QueryProductSpec[];
    props: SharedTypes.QueryProductProp[];
    stars: string;
  }

  export interface Car extends Tour {
    specs: SharedTypes.ProductSpec[];
    props: SharedTypes.ProductProp[];
    establishment: {
      name: string;
      image: Image;
    };
  }

  export interface QueryCar extends Car {
    orSimilar: boolean;
    image: QueryImage;
    establishment: {
      reviewTotalScore: number;
      reviewCount: number;
      name: string;
      image: QueryImage;
    };
    category: string;
    passengerQuantity: number;
    bagQuantity: number;
    automaticTransmission: boolean;
    fuelPolicy: QueryFuelPolicy | null;
    kmUnlimited: boolean;
    kmIncluded: string;
    model: number | null;
    depositRequired: boolean;
    doors: number;
    highlandCapabilities: boolean;
    airConIncluded: boolean;
    minAge: number;
    year: number;
  }

  export type Teaser = {
    url: string;
    variant: import("types/enums").TeaserVariant;
    title: string;
    ormName?: string;
    subtitle?: string;
    upperTitle?: string;
    description?: string;
    action?: string;
    image?: Image | null;
    rating?: number;
    ratingUsersAmount?: number;
    badge?: string;
    reviewScore?: number;
    reviewsCount?: number;
    isGoogleReview?: boolean;
    pageType?: import("types/enums").PageType;
  };

  export type Product = Tour | Hotel | Car;

  export type TeaserOverlayBannerIcon = "trending" | "newest" | "popular" | "recommended";
}
