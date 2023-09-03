import { baseUrl } from "../../../../utils/testcafe/testcafeConstants";
import { Envs } from "../../../funcTests/const/envs";

import { CartModelType, CartPaymentProvidersType, getCartModel } from "./cartModel";

export type DataModelType = {
  carProductBaseUrl: string;
  carSearchBaseUrl: string;
  cartWithPaymentProviders: {
    cart: CartModelType;
    paymentProviderSettings: {
      serverTime: string;
      preferredPaymentProvider: string;
      paymentProviders: CartPaymentProvidersType[];
      __typename: string;
    };
    __typename: string;
  };
};

const [saltPayEnvironment, saltPayClientKey] =
  baseUrl.includes(Envs.DevMaster) || baseUrl.includes(Envs.ProdGTI)
    ? ["live", "729428_puZUXoz6Ew2pS34bxZfyX4l1ib6xgr2p2l"]
    : ["test", "test_RPFJ3LDO3VDV3P7DKXL3VZNXFEUW3C5W"];

// eslint-disable-next-line no-console
console.log("testcafe baseUrl:", baseUrl);

export const getDataModel = (): DataModelType => ({
  carProductBaseUrl: "car-rental",
  carSearchBaseUrl: "iceland-car-rentals",
  cartWithPaymentProviders: {
    cart: getCartModel(),
    paymentProviderSettings: {
      serverTime: "2022-04-13T22:15:36.311Z",
      preferredPaymentProvider: "ADYEN",
      paymentProviders: [
        {
          suggestedCurrency: "USD",
          provider: "ADYEN",
          clientKey: "test_RPFJ3LDO3VDV3P7DKXL3VZNXFEUW3C5W",
          merchantAccount: "GuideToIcelandECOM-uninsured",
          environment: "test",
          enableSaveCard: false,
          clientPublicKey:
            "10001|AE6BCFDD6DF47C3CE5DB7211C3DECDD5B36CFE773740E89DC6A6407A2A64FC7BF082A238E82F7C14DEBECF7F05FFF72202978706F42D4DE7F9F0C9D8B01DD776916AB09A1301F6EFECEEE5BDA5CD03FF00421E176A4E225CECDFDC9AA212A9F8AC79A7D693AAD01FE85144F4264DDF6271F7DD45B1394017B195477AF75C7A2BB35B2B09110D190BE59636B1B24AD9FD082C899DDF30256362A4F950A04BD9C787770EC83614A4600AABE041FA4499C628BB7DE1E435C14C82935EC18A18AE1E47FB7F70D756F6E6FC751D42BEB193A83FDE4F2C0ECBD732E438ED3A4DD303D1ACE564EAD449D84700539747DCD8C2285CFED126F48BCAA48E361E69EA60089D",
          clientLibraryLocation: "https://test.adyen.com/hpp/cse/js/8015821177360381.shtml",
          additionalProviderSettings: [],
          __typename: "OrderCartPaymentProviderSettings",
        },
        {
          suggestedCurrency: "EUR",
          provider: "SALTPAY",
          clientKey: saltPayClientKey,
          merchantAccount: "guidetoiceland-is",
          environment: saltPayEnvironment,
          enableSaveCard: false,
          clientPublicKey: null,
          clientLibraryLocation: null,
          additionalProviderSettings: [
            {
              suggestedCurrency: "ISK",
              provider: "SALTPAY",
              clientKey: saltPayClientKey,
              merchantAccount: "guidetoiceland-is",
              environment: saltPayEnvironment,
              enableSaveCard: false,
              clientPublicKey: null,
              clientLibraryLocation: null,
              __typename: "OrderCartPaymentProviderSettings",
            },
          ],
          __typename: "OrderCartPaymentProviderSettings",
        },
      ],
      __typename: "OrderCartPaymentProviders",
    },
    __typename: "OrderGetCartWithProvidersResult",
  },
});
