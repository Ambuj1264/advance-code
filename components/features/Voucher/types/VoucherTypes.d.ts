declare namespace VoucherTypes {
  export type VoucherPriceObject = {
    priceObject: SharedTypes.PriceObject;
    vatPriceObject: SharedTypes.PriceObject;
  };
  export type SharedVoucherValue = {
    bookingNumber: string;
    externalId: string;
    bookingDate: string;
    editableStatus: import("./VoucherEnums").EditableStatus;
    vatAmount?: number;
    vatPercentage?: number;
    voucherPriceObjects: VoucherPriceObject[];
  };

  export type VoucherQueryFlight = {
    cart: OrderTypes.QueryFlightItineraryCart;
    passengers: OrderTypes.CustomerInfo[];
  } & SharedVoucherValue;

  export type VoucherQueryTourProvider = {
    name: string;
    phoneNumber: string;
  };

  export type VoucherQueryTour = {
    cart: OrderTypes.QueryTour;
    provider?: VoucherQueryTourProvider;
  } & SharedVoucherValue;

  export type VoucherQueryGTETour = {
    cart: OrderTypes.QueryGTETour;
  } & SharedVoucherValue;

  export type VoucherQueryCarnect = {
    rateCode?: string;
    accountingNumber?: string;
    aVNumber?: string;
    iata?: string;
    vendorBookingReference?: string;
  };

  export type VoucherQueryCar = {
    cart: OrderTypes.QueryCarRental;
  } & SharedVoucherValue &
    VoucherQueryCarnect;

  export type VoucherQueryStay = {
    cart: OrderTypes.QueryStay;
  } & SharedVoucherValue;

  export type VoucherQueryGTEStay = {
    cart: OrderTypes.QueryGTEStay;
    bookingInfoReference?: {
      externalId: string | null;
      availabilityId: string | null;
    }[];
  } & SharedVoucherValue;

  export type VoucherQueryCustomProduct = OrderTypes.QueryPaymentLinkProduct & {
    cart: OrderTypes.QueryCustomProduct;
  } & SharedVoucherValue;

  export type VoucherQueryVacationPackages = {
    price: number;
    cart: OrderTypes.QueryVacationPackageConstruct;
    flights: VoucherQueryFlight[];
    cars: VoucherQueryCar[];
    stays: VoucherQueryStay[];
    gteStays: VoucherQueryGTEStay[];
    toursAndTickets: VoucherQueryGTETour[];
  } & SharedVoucherValue;

  export type VoucherUpsellItem = {
    id: string;
    upsellImage: {
      id: string;
      url: string;
      handle: string;
    };
    gttpUpsellImage: {
      id: string;
      url: string;
      handle: string;
    };
    upsellProductType: import("./VoucherEnums").UpsellProductType;
    title: {
      stringId: string;
      value: string;
    };
  };

  export type VoucherUpsellsQuery = {
    id: string;
    vacationPackagesSlug: string;
    gttpVacationPackagesSlug: string;
    voucherUpsellItems: VoucherUpsellItem[];
  };

  export type VoucherUpsellSettings = Omit<VoucherUpsellsQuery, "voucherUpsellItems">;

  export type OrderInfo = {
    orderStatus: import("components/features/Cart/types/cartEnums").OrderResultCode | null;
    displayedPaymentMethod?: string | null;
    paymentMethod: import("components/features/Cart/types/cartEnums").PaymentMethodType | null;
    paymentCurrency?: string | import("types/enums").SupportedCurrencies;
    paymentAmount?: number;
  };

  export type VoucherData = {
    id?: string;
    voucherReady: boolean;
    numberOfItems: number;
    orderInfo: OrderInfo;
    pdfUrl?: string;
    flights: VoucherQueryFlight[];
    tours: VoucherQueryTour[];
    cars: VoucherQueryCar[];
    stays: VoucherQueryStay[];
    customs: VoucherQueryCustomProduct[];
    customerInfo: OrderTypes.CustomerInfo;
  };

  export type VoucherUpsellQuery = {
    voucherUpsells: [VoucherUpsellsQuery];
  };

  export type CarSearchUrlQuery = {
    carSearchUrl: string;
  };

  export type VoucherQuery = {
    voucher: VoucherData;
  };

  export type GTEVoucherData = {
    id?: string;
    voucherReady: boolean;
    numberOfItems: number;
    orderInfo: OrderInfo;
    pdfUrl?: string;
    flights: VoucherQueryFlight[];
    toursAndTickets: VoucherQueryGTETour[];
    cars: VoucherQueryCar[];
    gteStays: VoucherQueryGTEStay[];
    customs: VoucherQueryCustomProduct[];
    vacationPackages: VoucherQueryVacationPackages[];
    customerInfo: OrderTypes.CustomerInfo;
  };

  export type GTEVoucherQuery = {
    voucher: GTEVoucherData | VoucherData;
  };
}
