declare namespace TeaserListTypes {
  export interface CommonQueryProductList {
    variant: import("types/enums").TeaserListVariant;
    type: ArticleWidgetTypes.ArticleWidgetType;
    title: string;
    titleLink?: string;
    icon?: string;
  }

  export interface CommonProductList extends CommonQueryProductList {
    categoryLink?: string;
    categoryLinkTitle: string;
    categoryLinkClientRoute?: SharedTypes.ClientRoute;
  }

  export interface TourList extends CommonProductList {
    items: TeaserTypes.Tour[];
  }

  export interface QueryTourList extends CommonQueryProductList {
    listOfTours: TeaserTypes.QueryTour[];
  }

  export interface HotelList extends TourList {
    items: TeaserTypes.Hotel[];
  }

  export interface QueryHotelList extends CommonQueryProductList {
    listOfHotels: TeaserTypes.QueryHotel[];
  }

  export interface CarList extends TourList {
    items: TeaserTypes.Car[];
  }

  export interface QueryCarList extends CommonQueryProductList {
    listOfCars: TeaserTypes.QueryCar[];
  }

  export type QueryProductList = QueryTourList | QueryHotelList | QueryCarList;
  export type ProductList = TourList | HotelList | CarList;

  export type TeaserList = {
    variant: import("types/enums").TeaserListVariant;
    type: string;
    title: string;
    titleLink?: string;
    icon?: string;
    teasers: TeaserTypes.Teaser[];
    pageType?: import("types/enums").PageType;
  };
}
