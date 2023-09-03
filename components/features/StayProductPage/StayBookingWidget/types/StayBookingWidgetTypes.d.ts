declare namespace StayBookingWidgetTypes {
  type CancellationPolicy = {
    dateFrom: string;
    dateTo: string;
    price: {
      currency: string;
      value: number;
    };
  };

  type RoomRate = {
    index: number;
    roomRateName: string;
    room: {
      name: string;
      roomType: import("./enums").RoomType;
      specialType: string;
      providerCode: string;
      subProviderCode: string;
    }[];
    meal: {
      mealType: import("./enums").MealType;
      subProviderCode: string;
    };
    numberOfAdults: number;
    numberOfChildren: number;
    cancellationType: import("./enums").OrderStayCancellationType;
    paymentType: import("./enums").PaymentType;
  };

  type Rate = {
    provider: import("./enums").StayProvider;
    productId: number;
    rateReference: string;
    subProvider: string;
    mesh: string;
    providerCode: string;
    providerBookingCode: string;
    price: {
      currency: string;
      value: number;
    };
    roomRates: RoomRate[];
    cancellationPolicies?: CancellationPolicy[];
    // TODO: looks like booked and canceled field are not used probably we can remove them.
    booked?: boolean;
    canceled?: boolean;
  };

  type QueryDetailedRoom = {
    availableRooms: number;
    rates: Rate[];
  };

  type IncludedItem = {
    Icon: React.ElementType;
    title: string;
    isIncluded: boolean;
  };

  type DetailedRoom = QueryDetailedRoom & {
    isSelected: boolean;
    numberOfSelectedRooms: number;
    includedItems: IncludedItem[];
  };

  type CommonGroupedRate = {
    title: string;
    fromPrice: number;
    rateReference: string;
    maxOccupancy: number;
    maxAvailableRooms?: number;
  };

  type QueryGroupedRate = CommonGroupedRate & {
    detailedRooms: QueryDetailedRoom[];
  };

  type GroupedRate = CommonGroupedRate & {
    detailedRooms: DetailedRoom[];
  };

  type CartRate = {
    provider: import("./enums").StayProvider;
    subprovider: string;
    rateReference: string;
    mesh: string;
    numberOfAdults: number;
    numberOfChildren: number;
    price: {
      currency: string;
      value: number;
    };
  };

  type MutationAddStayProductToCartInput = {
    productId: number;
    availabilityIds: string[];
    isForVacationPackage: boolean;
  };

  type MutationAddStayToCartInput = {
    cartItemId?: string;
    productId: number;
    dateCheckingIn: string;
    dateCheckingOut: string;
    rates: CartRate[];
    totalNumberOfAdults: number;
    totalNumberOfChildren: number;
    childrenAges: number[];
    productPageUri?: string;
  };

  type CartRoomBooking = {
    mesh: string;
    masterRateCode: string;
  };
  type CartRoom = {
    roomBookings: CartRoomBooking[];
  };
  type CartStay = {
    cartItemId: string;
    numberOfAdults: number;
    numberOfChildren: number;
    childrenAges: number[];
    from: string;
    to: string;
    rooms: CartRoom[];
  };
  type QueryCurrentCart = {
    cart: {
      stays: CartStay[];
    };
  };

  type StayAddToCartData = {
    groupedRates: QueryGroupedRate[];
    roomTypes: RoomType[];
    selectedDates: SharedTypes.SelectedDates;
    occupancies: StayBookingWidgetTypes.Occupancy[];
    productPageUri: string;
    productId: number;
    cartItemId?: string;
  };

  type OldStayAddToCartData = {
    roomTypes: GroupedRate[];
    selectedDates: SharedTypes.SelectedDates;
    numberOfGuests: SharedTypes.NumberOfGuests;
    productPageUri: string;
    productId: number;
    cartItemId?: string;
  };
  export type AvailableDates = {
    min?: string;
    max?: string;
    unavailableDates: string[];
  };

  export type QueryAvailableDatesData = {
    dateAvailability: AvailableDates;
  };

  type StayPriceObject = Omit<SharedTypes.PriceObject, "defaultPrice">;

  type RoomCombinationAvailability = {
    availabilityId: string;
    freeCancellationUntil?: Date;
    priceObject: StayPriceObject;
    mealType: import("./enums").MealType;
    cancellationType: import("./enums").OrderStayCancellationType;
    isSelected: boolean;
  };

  type RoomCombinationRoom = {
    roomName: string;
    images: Image[];
    numberOfPersons?: number;
    productSpecs: SharedTypes.ProductSpec[];
    roomDetails: SharedType.Icon[];
  };

  type RoomCombination = {
    roomCombinationId: string;
    title: string;
    images: Image[];
    productSpecs: SharedTypes.ProductSpec[];
    rooms: RoomCombinationRoom[];
    availabilities: RoomCombinationAvailability[];
    isSelected: boolean;
  };
  type QueryRoomBed = {
    bedType: import("./enums").BedType;
    count: number;
  };

  type QueryRoomTypeInfo = {
    images: SharedTypes.GraphCMSAsset[];
    numberOfPersons: number;
    roomSize?: number;
    beds: QueryRoomBed[];
    privateShower?: boolean;
    wifiAvailability: import("types/enums").Availability;
    amenities: import("types/enums").StayAmenity[];
  };

  type QueryStaticRoomTypeInfo = QueryRoomTypeInfo & {
    numberOfPersons?: number;
  };

  type QueryRoomCombinationRoom = {
    roomName: string;
    images: SharedTypes.GraphCMSAsset[];
    numberOfPersons?: number;
    roomSize?: number;
    beds?: QueryRoomBed[];
    privateShower?: boolean;
    wifiAvailability?: import("types/enums").Availability;
    amenities?: import("types/enums").StayAmenity[];
  };

  type QueryRoomCombinationAvailability = {
    availabilityId: string;
    freeCancellationUntil?: string;
    priceObject: StayPriceObject;
    mealType: import("./enums").MealType;
    cancellationType: import("./enums").OrderStayCancellationType;
    isSelected: boolean;
  };

  type QueryRoomCombination = {
    rooms: QueryRoomCombinationRoom[];
    availabilities: QueryRoomCombinationAvailability[];
  };

  type RoomOffer = {
    roomOfferName: string;
    roomOfferRateReference?: string;
    availableRooms: number;
    priceObject: StayPriceObject;
    mealType: import("./enums").MealType;
    cancellationType: import("./enums").OrderStayCancellationType;
    freeCancellationUntil?: Date;
    availabilityIds: string[];
    isSelected: boolean;
    numberOfSelectedRooms: number;
  };

  type QueryRoomOffer = {
    roomOfferName: string;
    availableRooms: number;
    priceObject: StayPriceObject;
    mealType: import("./enums").MealType;
    cancellationType: import("./enums").OrderStayCancellationType;
    freeCancellationUntil?: string;
    availabilityIds: string[];
  };

  type QueryRoomType = {
    roomTypeName: string;
    roomType: import("./enums").RoomType;
    fromPriceObject: StayPriceObject;
    totalAvailableRooms?: number;
    roomTypeInfo: QueryRoomTypeInfo;
    roomOffers: QueryRoomOffer[];
  };

  type RoomType = {
    roomTypeId: string;
    roomTypeName: string;
    roomType: import("./enums").RoomType;
    fromPriceObject: StayPriceObject;
    totalAvailableRooms?: number;
    images: SharedTypes.Image[];
    numberOfPersons?: number;
    productSpecs: SharedTypes.ProductSpec[];
    roomDetails: SharedType.Icon[];
    roomOffers: RoomOffer[];
    totalPriceObject?: StayPriceObject;
  };

  type ProductAvailabilities = {
    suggestedAvailabilityIds: string[];
    specialOffers: QuerySpecialOffer[];
    roomTypes: QueryRoomType[];
  };

  type QueryStaticRoom = {
    roomTypeName: string;
    roomType: import("./enums").RoomType;
    roomTypeInfo: QueryStaticRoomTypeInfo;
  };

  type StaticRoom = {
    roomTypeId: string;
    roomTypeName: string;
    roomType: import("./enums").RoomType;
    images: SharedTypes.Image[];
    productSpecs: SharedTypes.ProductSpec[];
    roomDetails: SharedType.Icon[];
  };

  type CalcPricesRoomAvailability = {
    roomName: string;
    availabilityIds: string[];
  };

  type CalculatePricesInput = {
    roomAvailabilities: CalcPricesRoomAvailability[];
    currency: string;
  };

  type CalculatePricesRoomType = {
    roomName: string;
    price: StayPriceObject;
  };

  type Occupancy = {
    numberOfAdults: number;
    childrenAges: number[];
  };
}
