import { constructSaveCardMutationInput, getInitialSavedPaymentValues } from "./SavedCardsUtils";

import { OrderPaymentProvider } from "components/features/Cart/types/cartEnums";

const mockInitialValues = {
  cardNumber: {
    value: "",
  },
  expiryDate: {
    value: "",
  },
  firstName: {
    value: "",
  },
  lastName: {
    value: "",
  },
  cvvNumber: {
    value: "",
  },
  isBusinessTraveller: {
    value: false,
  },
  holderName: {
    value: "",
  },
  companyName: {
    value: "",
  },
  companyId: {
    value: "",
  },
  companyAddress: {
    value: "",
  },
};

const mockTokenizedSaltPayCard = [
  {
    cardToken: "ts_fdj3KPGJ0FozBeP7mpuVKFIPICRtJHr1",
    currency: "EUR",
    paymentProvider: "SALTPAY" as OrderPaymentProvider,
  },
  {
    cardToken: "ts_ld7Vy__byNNCIe4AcVA1jjkDhDNYXLgx",
    currency: "ISK",
    paymentProvider: "SALTPAY" as OrderPaymentProvider,
  },
  {
    cardToken: "ts_omH0CAAicMMm1VE8_x37aWQRnGeRvlgS",
    currency: "USD",
    paymentProvider: "SALTPAY" as OrderPaymentProvider,
  },
  {
    cardToken: "ts_vRtI-RsR_yBNkNKrtBEhJjF2e3yNjG9Q",
    currency: "GBP",
    paymentProvider: "SALTPAY" as OrderPaymentProvider,
  },
];

const mockTokenizedAdyenCard = [
  {
    cardToken:
      "adyenjs_0_1_18$SSK/8dok7LnPFPkjQ2AV3wuax5S8GOTvo+v7VX2HaquURkredE3n0uqJipSAFz4XNuXQxXayo4gc6rYsJozaPAbf9tdDKvd9SCFRawtvZKvpAM+AhjnWRkg01vD5WOfPAEHrZRMtPfwrg0JmP08H9Pj90EAL4neXI2IMUiqMuCeh3i9iet9zw6CyxIyvVfF5Rxq5Wmp/2uhriW7dlkE8dO7oCUGimM3G7DJC8E+dIx6WBdBSkc2Xxp0vyOiVmBO7t43x5A0xn6MkGGDfD+VE6ML8vqrnOR9eCIIP5IxXSBNj0G41+6mJ2XtvJwbiC23Q3SMm8RNTzwL4h2YlHZnSBg==$mUbhvv818rJq/10829H0WdLt+GCu3FvaZCXORtYrLU3f+ax48CVfGSnv0nTT8NK7c5X2d9/B3hCEJG4riM/lOjE0PI6WYXc8PldK1WN+sRmxYp0eWIsWVFvrRszT5xiRuo4FhXoPcYc6mKVbunU89wdwKlb51D/OSkayYMhadfQMEA/83gkmtEpPKlj4nc2wCLFsYcsOws3cxVmJE20z1W0ZGdecwA3bUg4ESDtNUikbPg/2uTOM2+QcVe9OH2aaVhY5HLdijBOUOx4WUOuZany222rPYXGNhziXsF7AweFOaZ7/2t/zc/H7G3B6Qj1ezYRFJwhNlpgRletI5huExdPK",
    currency: "EUR",
    paymentProvider: "ADYEN" as OrderPaymentProvider,
  },
];

const mockCVC = "737";

const mockConstructedInput = {
  cardTokensToSave: [
    {
      cardToken: "ts_fdj3KPGJ0FozBeP7mpuVKFIPICRtJHr1",
      currency: "EUR",
      securityCode: mockCVC,
      paymentProvider: "SALTPAY",
    },
    {
      cardToken: "ts_ld7Vy__byNNCIe4AcVA1jjkDhDNYXLgx",
      currency: "ISK",
      securityCode: mockCVC,
      paymentProvider: "SALTPAY",
    },
    {
      cardToken: "ts_omH0CAAicMMm1VE8_x37aWQRnGeRvlgS",
      currency: "USD",
      securityCode: mockCVC,
      paymentProvider: "SALTPAY",
    },
    {
      cardToken: "ts_vRtI-RsR_yBNkNKrtBEhJjF2e3yNjG9Q",
      currency: "GBP",
      securityCode: mockCVC,
      paymentProvider: "SALTPAY",
    },
    {
      cardToken:
        "adyenjs_0_1_18$SSK/8dok7LnPFPkjQ2AV3wuax5S8GOTvo+v7VX2HaquURkredE3n0uqJipSAFz4XNuXQxXayo4gc6rYsJozaPAbf9tdDKvd9SCFRawtvZKvpAM+AhjnWRkg01vD5WOfPAEHrZRMtPfwrg0JmP08H9Pj90EAL4neXI2IMUiqMuCeh3i9iet9zw6CyxIyvVfF5Rxq5Wmp/2uhriW7dlkE8dO7oCUGimM3G7DJC8E+dIx6WBdBSkc2Xxp0vyOiVmBO7t43x5A0xn6MkGGDfD+VE6ML8vqrnOR9eCIIP5IxXSBNj0G41+6mJ2XtvJwbiC23Q3SMm8RNTzwL4h2YlHZnSBg==$mUbhvv818rJq/10829H0WdLt+GCu3FvaZCXORtYrLU3f+ax48CVfGSnv0nTT8NK7c5X2d9/B3hCEJG4riM/lOjE0PI6WYXc8PldK1WN+sRmxYp0eWIsWVFvrRszT5xiRuo4FhXoPcYc6mKVbunU89wdwKlb51D/OSkayYMhadfQMEA/83gkmtEpPKlj4nc2wCLFsYcsOws3cxVmJE20z1W0ZGdecwA3bUg4ESDtNUikbPg/2uTOM2+QcVe9OH2aaVhY5HLdijBOUOx4WUOuZany222rPYXGNhziXsF7AweFOaZ7/2t/zc/H7G3B6Qj1ezYRFJwhNlpgRletI5huExdPK",
      currency: "ISK",
      securityCode: mockCVC,
      paymentProvider: "ADYEN",
    },
  ],
};

describe("constructSaveCardMutationInput", () => {
  test("should return correctly constructed input for save card mutation", () => {
    expect(
      JSON.parse(
        JSON.stringify(
          constructSaveCardMutationInput({
            tokenizedSaltPay: mockTokenizedSaltPayCard,
            tokenizedAdyen: mockTokenizedAdyenCard,
            cvc: mockCVC,
          })
        )
      )
    ).toEqual(mockConstructedInput);
  });
});

describe("getInitialSavedPaymentValues", () => {
  test("should return initial creditcard values for the input fields", () => {
    const mockT = (value: string) => value;
    expect(JSON.parse(JSON.stringify(getInitialSavedPaymentValues(mockT as TFunction)))).toEqual(
      mockInitialValues
    );
  });
});
