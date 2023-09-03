import { CustomerInfoModelType, getCustomerInfoModel } from "./customerInfoModel";
import { TourModelType, getTourModel } from "./tourModel";

export default class CartModel {
  flights: any[];

  cars: any[];

  tours: TourModelType[];

  stays: any[];

  customs: any[];

  itemCount: number;

  totalPrice: number;

  totalOnArrival: number;

  customerInfo: CustomerInfoModelType;

  __typename: string;

  constructor() {
    this.flights = [];
    this.cars = [];
    const fakeTour = getTourModel();
    fakeTour.title = "Test Best Ice Cave Tour Volcano";
    fakeTour.totalPrice = 18400;

    const fakeTourDefault = getTourModel();
    this.tours = [fakeTourDefault, fakeTour];
    this.stays = [];
    this.customs = [];
    this.itemCount = 2;
    this.totalPrice = 19900;
    this.totalOnArrival = 0;
    this.customerInfo = getCustomerInfoModel();
    // eslint-disable-next-line no-underscore-dangle
    this.__typename = "OrderCartInfo";
  }
}

export type CartModelType = {
  flights: any[];
  cars: any[];
  tours: TourModelType[];
  stays: any[];
  gteStays: any[];
  customs: any[];
  vacationPackages: any[];
  toursAndTickets: any[];
  itemCount: number;
  totalPrice: number;
  totalOnArrival: number;
  customerInfo: CustomerInfoModelType;
  __typename: string;
};

export type CartPaymentProvidersType = {
  suggestedCurrency: string;
  provider: string;
  clientKey: string;
  clientPublicKey?: string | null;
  clientLibraryLocation?: string | null;
  merchantAccount: string;
  environment: string;
  enableSaveCard: boolean;
  additionalProviderSettings?: CartPaymentProvidersType[];
  __typename: string;
};

export const getCartModel = (): CartModelType => ({
  flights: [],
  cars: [],
  tours: [getTourModel(), getTourModel("Test Best Ice Cave Tour Volcano", 18400)],
  stays: [],
  gteStays: [],
  customs: [],
  vacationPackages: [],
  toursAndTickets: [],
  itemCount: 2,
  totalPrice: 19900,
  totalOnArrival: 0,
  customerInfo: getCustomerInfoModel(),
  __typename: "OrderCartInfo",
});
