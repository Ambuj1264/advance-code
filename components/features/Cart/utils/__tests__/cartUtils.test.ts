import {
  collectBrowserInfo,
  constructCarQuickFactsCart,
  constructPaymentMethods,
  constructStaysQuickFactsCart,
  constructTourQuickFactsCart,
  constructVacationPackageQuickFactsCart,
  DEFAULT_CREDIT_CARD_PAYMENT_METHOD,
  normalizeAdyen3dsFormData,
  normalizeAdyenPaymentMethods,
  normalizeAdyenSavedCards,
  normalizeSaltPay3dsFormData,
  normalizeSaltPaySavedCards,
  normalizeAdyenConfiguration,
} from "../cartUtils";
import {
  dayTourQuickFacts,
  mockAdyenPaymentMethods,
  mockCarQuickFacts0,
  mockCreditCardBrands,
  mockVacationPackagesQuickFacts0,
  mockVacationPackagesWithoutFlightQuickFacts,
  normalizedApplePayPaymentMethod,
  normalizedCreditCardPaymentMethod,
  normalizedKlarnaPayLaterPaymentMethod,
  normalizedKlarnaPayNowPaymentMethod,
  normalizedKlarnaPayOverPaymentMethod,
  normalizedPayPalPaymentMethod,
  normalizedSofortPaymentMethod,
  packageTourQuickFacts,
  packageTourRegularDatesQuickFacts,
  selfDriveTourQuickFacts,
  staysQuickFact0,
  staysQuickFactCalcellation,
  mockCreditCardConfig,
  staysGTEQuickFact0,
  staysGTEQuickFact0WithoutCheckinTime,
  staysGTEQuickFact0WithoutCheckoutTime,
} from "../cartUtilsMockData";
import {
  formatCardNumber444,
  formatCardNumber464,
  formatCardNumber465,
  formatCreditCardNumber,
  formatExpiryDate,
  validateExpiryDate,
  getCreditCardType,
  getSupportedCardTypes,
} from "../creditCardUtils";

import {
  mockCardInformation,
  mockCarRentalCart0,
  mockConstructVacationPackage,
  mockDayTourCart,
  mockQueryGTEStayConstruct0,
  mockQueryStayConstruct0,
  mockQueryStayConstructCancellation,
  mockSelfDriveTourCart,
  mockVacationPackageTourCart,
} from "components/ui/Order/utils/mockOrderData";
import { SupportedLanguages } from "types/enums";
import {
  CardType,
  OrderPaymentEnvironment,
  OrderPaymentProvider,
  PaymentMethodName,
  PaymentMethodType,
} from "components/features/Cart/types/cartEnums";
import { tokenizeAdyenCard, tokenizeSaltPayCard } from "hooks/useTokenizeCard";

const mockT = (value: string) => value;

describe("constructTourQuickFactsCart", () => {
  test("should construct quick facts for Day tour", () => {
    expect(constructTourQuickFactsCart(mockDayTourCart, SupportedLanguages.English)).toEqual(
      dayTourQuickFacts
    );
  });
  test("should construct quick facts for Self drive tour", () => {
    expect(constructTourQuickFactsCart(mockSelfDriveTourCart, SupportedLanguages.English)).toEqual(
      selfDriveTourQuickFacts
    );
  });
  test("should construct quick facts for Package tour (flexible time)", () => {
    expect(
      constructTourQuickFactsCart(mockVacationPackageTourCart, SupportedLanguages.English)
    ).toEqual(packageTourQuickFacts);
  });
  test("should construct quick facts for Package tour (regular time)", () => {
    expect(
      constructTourQuickFactsCart(
        {
          ...mockVacationPackageTourCart,
          from: new Date("2021-05-20T14:00:00.000Z"),
          to: new Date("2021-05-24T15:00:00.000Z"),
        },
        SupportedLanguages.English
      )
    ).toEqual(packageTourRegularDatesQuickFacts);
  });
});

describe("constructStaysQuickFactsCart", () => {
  test("should construct quick facts for Stays", () => {
    expect(
      constructStaysQuickFactsCart(mockQueryStayConstruct0, SupportedLanguages.English)
    ).toEqual(staysQuickFact0);

    expect(
      constructStaysQuickFactsCart(mockQueryStayConstructCancellation, SupportedLanguages.English)
    ).toEqual(staysQuickFactCalcellation);
  });

  describe("GTE stays", () => {
    test("should construct quick facts for GTE Stays", () => {
      expect(
        constructStaysQuickFactsCart(mockQueryGTEStayConstruct0, SupportedLanguages.English)
      ).toEqual(staysGTEQuickFact0);
    });

    test("should construct quick facts when checkin time is missing", () => {
      expect(
        constructStaysQuickFactsCart(
          {
            ...mockQueryGTEStayConstruct0,
            // @ts-ignore
            product: {
              ...mockQueryGTEStayConstruct0.product,
              timeCheckingIn: null,
            },
          },
          SupportedLanguages.English
        )
      ).toEqual(staysGTEQuickFact0WithoutCheckinTime);
    });

    test("should construct quick facts when checkout time is missing", () => {
      expect(
        constructStaysQuickFactsCart(
          {
            ...mockQueryGTEStayConstruct0,
            // @ts-ignore
            product: {
              ...mockQueryGTEStayConstruct0.product,
              timeCheckingOut: null,
            },
          },
          SupportedLanguages.English
        )
      ).toEqual(staysGTEQuickFact0WithoutCheckoutTime);
    });
  });
});

describe("constructCarQuickFactsCart", () => {
  test("should construct quick facts for Cars", () => {
    expect(constructCarQuickFactsCart(mockCarRentalCart0, SupportedLanguages.English)).toEqual(
      mockCarQuickFacts0
    );
  });
});

describe("constructVacationPackageQuickFactsCart", () => {
  test("should construct quick facts for Vacation Packages", () => {
    expect(
      constructVacationPackageQuickFactsCart(
        mockConstructVacationPackage,
        SupportedLanguages.English
      )
    ).toEqual(mockVacationPackagesQuickFacts0);
  });
  test("should construct quick facts for Vacation Packages without flight", () => {
    expect(
      constructVacationPackageQuickFactsCart(
        {
          ...mockConstructVacationPackage,
          flights: [],
        },
        SupportedLanguages.English
      )
    ).toEqual(mockVacationPackagesWithoutFlightQuickFacts);
  });
});

describe("formatCardNumber464", () => {
  test("should format card number in format XXXX XXXXXX XXXX", () => {
    expect(formatCardNumber464("30000000000000")).toEqual("3000 000000 0000");
    expect(formatCardNumber464("3")).toEqual("3");
  });
});

describe("formatCardNumber465", () => {
  test("should format card number in format XXXX XXXXXX XXXXX", () => {
    expect(formatCardNumber465("370000000000002")).toEqual("3700 000000 00002");
    expect(formatCardNumber465("3")).toEqual("3");
  });
});

describe("formatCardNumber444", () => {
  test("should format card number in format XXXX XXXX XXXX XXXX", () => {
    expect(formatCardNumber444("4646464646464646")).toEqual("4646 4646 4646 4646");
    expect(formatCardNumber444("4646464646464646")).toEqual("4646 4646 4646 4646");
    expect(formatCardNumber444("4")).toEqual("4");
  });
});

describe("formatCreditCardNumber", () => {
  test("should format VISA credit card number", () => {
    expect(formatCreditCardNumber("4035501000000008", CardType.VISA)).toEqual(
      "4035 5010 0000 0008"
    );
    expect(formatCreditCardNumber("4", CardType.VISA)).toEqual("4");
  });
  test("should format MASTERCARD credit card number", () => {
    expect(formatCreditCardNumber("5555555555554444", CardType.MASTERCARD)).toEqual(
      "5555 5555 5555 4444"
    );
    expect(formatCreditCardNumber("5555 5555 5555 4444", CardType.MASTERCARD)).toEqual(
      "5555 5555 5555 4444"
    );
  });
  test("should format AMEX credit card number", () => {
    expect(formatCreditCardNumber("378282246310005", CardType.AMEX)).toEqual("3782 822463 10005");
  });
  test("should format MAESTRO credit card number", () => {
    expect(formatCreditCardNumber("5020 5500 0000 0029", CardType.MAESTRO)).toEqual(
      "5020 5500 0000 0029"
    );
  });
  test("should format UNIONPAY credit card number", () => {
    expect(formatCreditCardNumber("6243030000000001", CardType.MAESTRO)).toEqual(
      "6243 0300 0000 0001"
    );
  });
  // TODO: Look into this case a little better
  test("should format UNKNOWN credit card number", () => {
    expect(formatCreditCardNumber("00000000000000000000")).toEqual("0000 0000 0000 0000 000");
  });
});

describe("formatExpiryDate", () => {
  test("should format expiry date with", () => {
    expect(formatExpiryDate("14")).toBe("01/4");
    expect(formatExpiryDate("13")).toBe("01/3");
    expect(formatExpiryDate("123")).toBe("12/3");
    expect(formatExpiryDate("1222")).toBe("12/22");
    expect(formatExpiryDate("1234")).toBe("12/34");
    expect(formatExpiryDate("022")).toBe("02/2");
    expect(formatExpiryDate("0223")).toBe("02/23");
    expect(formatExpiryDate("02235")).toBe("02/23");
    expect(formatExpiryDate("9")).toBe("09");
    expect(formatExpiryDate("00")).toBe("0");
    expect(formatExpiryDate("01/00")).toBe("01/00");
    expect(formatExpiryDate("091")).toBe("09/1");
    expect(formatExpiryDate("0912")).toBe("09/12");
  });
  test("should return the same string", () => {
    expect(formatExpiryDate("")).toBe("");
    expect(formatExpiryDate("1")).toBe("1");
    expect(formatExpiryDate("09")).toBe("09");
    expect(formatExpiryDate("12")).toBe("12");
  });
});

describe("getExpiryDateError", () => {
  const realDate = Date;
  const dateNowStub = new Date("2022-02-07");

  beforeAll(() => {
    // @ts-ignore
    // eslint-disable-next-line functional/immutable-data
    global.Date = class extends Date {
      constructor() {
        super();
        // eslint-disable-next-line no-constructor-return
        return dateNowStub;
      }
    };
  });

  test("should return invalid date error on invalid card date", () => {
    expect(validateExpiryDate(mockT as TFunction)("1")).toBe("Invalid date value");
    expect(validateExpiryDate(mockT as TFunction)("12/")).toBe("Invalid date value");
    expect(validateExpiryDate(mockT as TFunction)("12/2")).toBe("Invalid date value");
  });

  test("should return error message about card's date being too far in future", () => {
    expect(validateExpiryDate(mockT as TFunction)("12/54")).toBe(
      "The date is too far in the future"
    );
    expect(validateExpiryDate(mockT as TFunction)("01/99")).toBe(
      "The date is too far in the future"
    );
  });

  test("should return error message about the card being expired", () => {
    expect(validateExpiryDate(mockT as TFunction)("12/20")).toBe("The card is expired");
    expect(validateExpiryDate(mockT as TFunction)("01/22")).toBe("The card is expired");
  });

  test("should return undefined when date is valid", () => {
    expect(validateExpiryDate(mockT as TFunction)("12/24")).toBe(undefined);
    expect(validateExpiryDate(mockT as TFunction)("12/52")).toBe(undefined);
  });

  afterAll(() => {
    // eslint-disable-next-line functional/immutable-data
    global.Date = realDate;
  });
});

describe("normalize3dsFormData", () => {
  const mock3dsFormData: CartTypes.SaltPayForm3dsData = [
    {
      Name: "actionURL",
      Value: "https://acs.privatbank.ua/pPaReqMC.jsp",
    },
    {
      Name: "PaReq",
      Value: "eJxVUgluwjAQ/IrFA/CBgwJaLNGmaqM",
    },
    {
      Name: "MD",
      Value: "yFY2GJABZ5Yz1qGIoCAHfg==",
    },
    {
      Name: "TermUrl",
      Value: "https://staging.guidetoiceland.is/cart",
    },
  ];

  test("should return normalized 3ds form data for SALTPAY", () => {
    return expect(normalizeSaltPay3dsFormData(mock3dsFormData)).toEqual({
      action: mock3dsFormData[0].Value,
      inputs: [
        {
          name: mock3dsFormData[1].Name,
          value: mock3dsFormData[1].Value,
        },
        {
          name: mock3dsFormData[2].Name,
          value: mock3dsFormData[2].Value,
        },
        {
          name: mock3dsFormData[3].Name,
          value: mock3dsFormData[3].Value,
        },
      ],
    });
  });
});

describe("normalizeAdyen3dsFormData", () => {
  const mock3dsFormData: CartTypes.AdyenForm3dsData = {
    type: "redirect",
    data: {
      MD: "M2RzMi41ZTA0NTdkNjhkNjI5MTYzNmJiNWFjZWE2NjM0MjJlODg2OTYwOWMzMTkzYzIxMjZkN2QwYmJmMjliYzlmZmQ2",
      PaReq: "BQABAgCcbsIlz4kQtTzceBB",
    },
    method: "POST",
    paymentData: "Ab02b4c0!B",
    paymentMethodType: "scheme",
    url: "https://checkoutshopper-test.adyen.com/checkoutshopper/threeDS2.shtml?pspReference=QMNW9JJDJMK2WN82",
  };
  const currentUrl = "https://staging.guidetoiceland.is";

  test("should return normalized 3ds form data for ADYEN", () => {
    return expect(normalizeAdyen3dsFormData(mock3dsFormData, currentUrl)).toEqual({
      action: mock3dsFormData.url,
      inputs: [
        {
          name: "MD",
          value: mock3dsFormData.data.MD,
        },
        {
          name: "PaReq",
          value: mock3dsFormData.data.PaReq,
        },
        {
          name: "TermUrl",
          value: currentUrl,
        },
      ],
    });
  });
});

describe("normalizeSaltPaySavedCards", () => {
  const mockSavedCards = [
    {
      id: 15,
      cardType: CardType.MASTERCARD,
      pan: "558740******2037",
      expYear: "2022",
      expMonth: "09",
      currencyCode: "ISK",
      created: "2022-03-18T14:49:16.746918",
      isUsersPrimaryCard: true,
    },
    {
      id: 111,
      cardType: CardType.VISA,
      pan: "558740******1111",
      expYear: "2025",
      expMonth: "10",
      currencyCode: "ISK",
      created: "2022-03-18T14:49:16.746918",
      isUsersPrimaryCard: false,
    },
  ];

  test("should return normalized saved cards data", () => {
    return expect(
      normalizeSaltPaySavedCards({
        savedCards: mockSavedCards,
        creditCardConfig: mockCreditCardConfig,
      })
    ).toEqual([
      {
        id: "15",
        type: PaymentMethodType.SAVED_CARD,
        name: "**** 2037",
        provider: OrderPaymentProvider.SALTPAY,
        cardType: mockSavedCards[0].cardType.toLowerCase(),
        pan: mockSavedCards[0].pan,
        index: 0,
        businessId: undefined,
        businessName: undefined,
        businessAddress: undefined,
        expMonth: "09",
        expYear: "22",
        firstName: undefined,
        lastName: undefined,
        isUsersPrimaryCard: true,
        paymentFeePercentage: 10,
        adyenAmount: 46039,
        adyenCurrency: "EUR",
        totalAmount: 460.3929,
        totalCurrency: "EUR",
      },
      {
        id: "111",
        type: PaymentMethodType.SAVED_CARD,
        name: "**** 1111",
        provider: OrderPaymentProvider.SALTPAY,
        cardType: mockSavedCards[1].cardType.toLowerCase(),
        pan: mockSavedCards[1].pan,
        index: 1,
        businessId: undefined,
        businessName: undefined,
        businessAddress: undefined,
        expMonth: "10",
        expYear: "25",
        firstName: undefined,
        lastName: undefined,
        isUsersPrimaryCard: false,
        paymentFeePercentage: 10,
        adyenAmount: 46039,
        adyenCurrency: "EUR",
        totalAmount: 460.3929,
        totalCurrency: "EUR",
      },
    ]);
  });
  test("should return normalized saved cards data when no creditCardConfig", () => {
    return expect(
      normalizeSaltPaySavedCards({
        savedCards: mockSavedCards,
      })
    ).toEqual([
      {
        id: "15",
        type: PaymentMethodType.SAVED_CARD,
        name: "**** 2037",
        provider: OrderPaymentProvider.SALTPAY,
        cardType: mockSavedCards[0].cardType.toLowerCase(),
        pan: mockSavedCards[0].pan,
        index: 0,
        businessId: undefined,
        businessName: undefined,
        businessAddress: undefined,
        expMonth: "09",
        expYear: "22",
        firstName: undefined,
        lastName: undefined,
        isUsersPrimaryCard: true,
      },
      {
        id: "111",
        type: PaymentMethodType.SAVED_CARD,
        name: "**** 1111",
        provider: OrderPaymentProvider.SALTPAY,
        cardType: mockSavedCards[1].cardType.toLowerCase(),
        pan: mockSavedCards[1].pan,
        index: 1,
        businessId: undefined,
        businessName: undefined,
        businessAddress: undefined,
        expMonth: "10",
        expYear: "25",
        firstName: undefined,
        lastName: undefined,
        isUsersPrimaryCard: false,
      },
    ]);
  });
  test("should return empty array for undefined saltpay saved cards", () => {
    return expect(
      normalizeSaltPaySavedCards({
        savedCards: undefined,
        creditCardConfig: mockCreditCardConfig,
      })
    ).toEqual([]);
  });
});

describe("normalizeAdyenPaymentMethods", () => {
  test("should return normalized adyen payment methods", () => {
    expect(
      normalizeAdyenPaymentMethods({
        paymentMethods: mockAdyenPaymentMethods,
        isMobile: false,
      })
    ).toEqual([normalizedCreditCardPaymentMethod, normalizedPayPalPaymentMethod]);
  });

  describe("normalizeAdyenPaymentMethods with Apple pay", () => {
    beforeAll(() => {
      // @ts-ignore
      // eslint-disable-next-line functional/immutable-data
      global.window.ApplePaySession = {};
    });

    afterEach(() => {
      // @ts-ignore
      // eslint-disable-next-line functional/immutable-data
      global.window.ApplePaySession = undefined;
    });

    test("should return normalized adyen payment methods with Apple pay payment method for apple browsers", () => {
      expect(
        normalizeAdyenPaymentMethods({
          paymentMethods: mockAdyenPaymentMethods,
          isMobile: false,
        })
      ).toEqual([
        normalizedCreditCardPaymentMethod,
        normalizedApplePayPaymentMethod,
        normalizedPayPalPaymentMethod,
      ]);
    });
  });

  test("should return normalized adyen payment methods and exclude unsupported payment methods", () => {
    expect(
      normalizeAdyenPaymentMethods({
        paymentMethods: [
          ...mockAdyenPaymentMethods,
          {
            name: "OXXO",
            type: "OXXO" as any,
          },
        ],
        isMobile: false,
      })
    ).toEqual([normalizedCreditCardPaymentMethod, normalizedPayPalPaymentMethod]);
  });

  describe("normalizeAdyenPaymentMethods with Alipay", () => {
    test("should return normalized AliPay adyen payment methods for desktop", () => {
      expect(
        normalizeAdyenPaymentMethods({
          paymentMethods: [
            ...mockAdyenPaymentMethods,
            {
              name: "Alipay",
              type: PaymentMethodType.ALI_PAY,
            },
            {
              name: "Alipay",
              type: PaymentMethodType.ALI_PAY_MOBILE,
            },
          ],
          isMobile: false,
        })
      ).toEqual([
        normalizedCreditCardPaymentMethod,
        normalizedPayPalPaymentMethod,
        {
          id: "Alipay",
          type: PaymentMethodType.ALI_PAY,
          name: "Alipay",
          provider: OrderPaymentProvider.ADYEN,
        },
      ]);
      expect(
        normalizeAdyenPaymentMethods({
          paymentMethods: [
            ...mockAdyenPaymentMethods,
            {
              name: "Alipay",
              type: PaymentMethodType.ALI_PAY,
            },
          ],
          isMobile: false,
        })
      ).toEqual([
        normalizedCreditCardPaymentMethod,
        normalizedPayPalPaymentMethod,
        {
          id: "Alipay",
          type: PaymentMethodType.ALI_PAY,
          name: "Alipay",
          provider: OrderPaymentProvider.ADYEN,
        },
      ]);
    });
  });

  test("should return normalized AliPay adyen payment methods for mobile", () => {
    expect(
      normalizeAdyenPaymentMethods({
        paymentMethods: [
          ...mockAdyenPaymentMethods,
          {
            name: "Alipay",
            type: PaymentMethodType.ALI_PAY,
          },
          {
            name: "Alipay",
            type: PaymentMethodType.ALI_PAY_MOBILE,
          },
        ],
        isMobile: true,
      })
    ).toEqual([
      normalizedCreditCardPaymentMethod,
      normalizedPayPalPaymentMethod,
      {
        id: "Alipay",
        type: PaymentMethodType.ALI_PAY_MOBILE,
        name: "Alipay",
        provider: OrderPaymentProvider.ADYEN,
      },
    ]);
    expect(
      normalizeAdyenPaymentMethods({
        paymentMethods: [
          ...mockAdyenPaymentMethods,
          {
            name: "Alipay",
            type: PaymentMethodType.ALI_PAY,
          },
        ],
        isMobile: true,
      })
    ).toEqual([
      normalizedCreditCardPaymentMethod,
      normalizedPayPalPaymentMethod,
      {
        id: "Alipay",
        type: PaymentMethodType.ALI_PAY,
        name: "Alipay",
        provider: OrderPaymentProvider.ADYEN,
      },
    ]);
  });

  test("should return empty array for undefined adyen payment methods", () => {
    expect(
      normalizeAdyenPaymentMethods({
        paymentMethods: undefined,
        isMobile: false,
      })
    ).toEqual([]);
  });
});

describe("normalizeAdyenSavedCards", () => {
  test("should return normalized adyen payment methods with adyen saved methods", () => {
    const mockStoredPaymentMethod = {
      brand: "mc",
      expiryMonth: "03",
      expiryYear: "2030",
      holderName: "Checkout Shopper PlaceHolder",
      id: "QC9J85W8T2M84H82",
      lastFour: "1115",
      name: "mc",
      supportedShopperInteractions: ["Ecommerce", "ContAuth"],
      type: "scheme",
    };
    const mockSavedCard = {
      id: 15,
      cardType: CardType.MASTERCARD,
      pan: "558740******1115",
      expYear: "2030",
      expMonth: "03",
      currencyCode: "ISK",
      created: "2022-03-18T14:49:16.746918",
      isUsersPrimaryCard: false,
    };

    expect(
      normalizeAdyenSavedCards({
        adyenSavedCards: [mockStoredPaymentMethod],
        savedCards: [mockSavedCard],
        creditCardConfig: mockCreditCardConfig,
      })
    ).toEqual([
      {
        id: mockStoredPaymentMethod.id,
        type: PaymentMethodType.SAVED_CARD,
        name: `**** ${mockStoredPaymentMethod.lastFour}`,
        provider: OrderPaymentProvider.ADYEN,
        cardType: CardType.MASTERCARD,
        index: 0,
        isUsersPrimaryCard: false,
        businessId: undefined,
        businessName: undefined,
        businessAddress: undefined,
        pan: mockSavedCard.pan,
        paymentFeePercentage: mockCreditCardConfig.paymentFeePercentage,
        totalAmount: mockCreditCardConfig.totalAmount,
        totalCurrency: mockCreditCardConfig.totalCurrency,
        adyenAmount: mockCreditCardConfig.adyenAmount,
        adyenCurrency: mockCreditCardConfig.adyenCurrency,
      },
    ]);
  });
  test("should return empty array for undefined adyen saved cards", () => {
    expect(
      normalizeAdyenSavedCards({
        adyenSavedCards: undefined,
        savedCards: [],
        creditCardConfig: mockCreditCardConfig,
      })
    ).toEqual([]);
  });
});

describe("constructPaymentMethods", () => {
  test("should return constructed payment methods for SALTPAY", () => {
    expect(
      constructPaymentMethods({
        isSaltPayProviderActive: true,
        normalizedSaltPaySavedCards: [],
        normalizedAdyenPaymentMethods: [
          normalizedCreditCardPaymentMethod,
          normalizedPayPalPaymentMethod,
        ],
        savedAdyenCards: [],
      })
    ).toEqual([
      {
        ...normalizedCreditCardPaymentMethod,
        provider: OrderPaymentProvider.SALTPAY,
      },
      normalizedPayPalPaymentMethod,
    ]);
    expect(
      constructPaymentMethods({
        isSaltPayProviderActive: true,
        normalizedSaltPaySavedCards: [],
        normalizedAdyenPaymentMethods: [],
        savedAdyenCards: [],
      })
    ).toEqual([
      {
        ...DEFAULT_CREDIT_CARD_PAYMENT_METHOD(),
        provider: OrderPaymentProvider.SALTPAY,
      },
    ]);
  });
  test("should return constructed payment methods for SALTPAY with saved cards", () => {
    const mockSavedCards: CartTypes.PaymentMethod[] = [
      {
        id: "15",
        type: PaymentMethodType.SAVED_CARD,
        name: "**** 2037",
        provider: OrderPaymentProvider.SALTPAY,
        cardType: CardType.MASTERCARD,
        pan: "558740******2037",
        index: 0,
      },
    ];
    expect(
      constructPaymentMethods({
        isSaltPayProviderActive: true,
        normalizedSaltPaySavedCards: mockSavedCards,
        normalizedAdyenPaymentMethods: [
          normalizedCreditCardPaymentMethod,
          normalizedPayPalPaymentMethod,
        ],
        savedAdyenCards: [],
      })
    ).toEqual([
      ...mockSavedCards,
      {
        ...normalizedCreditCardPaymentMethod,
        provider: OrderPaymentProvider.SALTPAY,
      },
      normalizedPayPalPaymentMethod,
    ]);
  });
  test("should return constructed payment methods for ADYEN", () => {
    expect(
      constructPaymentMethods({
        isSaltPayProviderActive: false,
        normalizedSaltPaySavedCards: [],
        normalizedAdyenPaymentMethods: [
          normalizedCreditCardPaymentMethod,
          normalizedPayPalPaymentMethod,
        ],
        savedAdyenCards: [],
      })
    ).toEqual([normalizedCreditCardPaymentMethod, normalizedPayPalPaymentMethod]);
  });

  describe("constructPaymentMethods should combine Klarna payment method.", () => {
    test("should return constructed payment methods for ADYEN with Klarna", () => {
      expect(
        constructPaymentMethods({
          isSaltPayProviderActive: false,
          normalizedSaltPaySavedCards: [],
          normalizedAdyenPaymentMethods: [
            normalizedCreditCardPaymentMethod,
            normalizedPayPalPaymentMethod,
            normalizedKlarnaPayNowPaymentMethod,
            normalizedKlarnaPayLaterPaymentMethod,
            normalizedKlarnaPayOverPaymentMethod,
          ],
          savedAdyenCards: [],
        })
      ).toEqual([
        normalizedCreditCardPaymentMethod,
        normalizedPayPalPaymentMethod,
        {
          ...normalizedKlarnaPayNowPaymentMethod,
          name: PaymentMethodName.KLARNA,
        },
      ]);
      expect(
        constructPaymentMethods({
          isSaltPayProviderActive: false,
          normalizedSaltPaySavedCards: [],
          normalizedAdyenPaymentMethods: [
            normalizedCreditCardPaymentMethod,
            normalizedKlarnaPayLaterPaymentMethod,
            normalizedPayPalPaymentMethod,
          ],
          savedAdyenCards: [],
        })
      ).toEqual([
        normalizedCreditCardPaymentMethod,
        {
          ...normalizedKlarnaPayLaterPaymentMethod,
          name: PaymentMethodName.KLARNA,
        },
        normalizedPayPalPaymentMethod,
      ]);
    });
  });

  test("should return constructed payment methods for ADYEN with saved cards", () => {
    const mockSavedCards: CartTypes.PaymentMethod[] = [
      {
        id: "1",
        type: PaymentMethodType.SAVED_CARD,
        name: `**** 5555`,
        provider: OrderPaymentProvider.ADYEN,
        cardType: CardType.VISA,
        index: 0,
      },
    ];
    expect(
      constructPaymentMethods({
        isSaltPayProviderActive: false,
        normalizedSaltPaySavedCards: [],
        normalizedAdyenPaymentMethods: [
          normalizedCreditCardPaymentMethod,
          normalizedPayPalPaymentMethod,
        ],
        savedAdyenCards: mockSavedCards,
      })
    ).toEqual([
      ...mockSavedCards,
      normalizedCreditCardPaymentMethod,
      normalizedPayPalPaymentMethod,
    ]);
  });

  describe("constructPaymentMethods with Sofort payment method.", () => {
    test("should return constructed payment methods for ADYEN with Sofort", () => {
      expect(
        constructPaymentMethods({
          isSaltPayProviderActive: false,
          normalizedSaltPaySavedCards: [],
          normalizedAdyenPaymentMethods: [
            normalizedCreditCardPaymentMethod,
            normalizedSofortPaymentMethod,
          ],
          savedAdyenCards: [],
        })
      ).toEqual([
        normalizedCreditCardPaymentMethod,
        {
          ...normalizedSofortPaymentMethod,
          name: PaymentMethodName.SOFORT,
        },
      ]);
    });
  });
});

describe("tokenizeSaltPayCard", () => {
  beforeAll(() => {
    // @ts-ignore
    // eslint-disable-next-line functional/immutable-data
    global.window.BAPIjs = {
      setPublicToken: (clientKey?: string) => `mockClientKey-${clientKey}`,
      getToken: (
        cardDetails: CartTypes.SaltPayCardDetails,
        callback: (status: number, data: CartTypes.SaltPayTokenData) => {}
      ) => {
        const status = {
          message: "OK",
          statusCode: 201,
        };
        const data = {
          Token: `mockSaltPayToken-${cardDetails.pan}`,
          PAN: cardDetails.pan,
          ExpYear: `20${cardDetails.expYear}`,
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          ExpMonth: cardDetails.expMonth!,
          Enabled: true,
          Used: false,
          ValidUntil: "2016-03-12T11:41:56Z",
        };
        return callback(status.statusCode, data);
      },
    };
  });

  afterAll(() => {
    // @ts-ignore
    // eslint-disable-next-line functional/immutable-data
    global.window.BAPIjs = undefined;
  });

  const mockSaltPayPaymentConfig: CartTypes.QueryPaymentProviderConfig = {
    suggestedCurrency: "ISK",
    provider: OrderPaymentProvider.SALTPAY,
    clientKey: "891451_puZw2H22X7Wcf5ErHxDmOmr1XlnlG6OhZn",
    merchantAccount: "guidetoeurope-com",
    environment: OrderPaymentEnvironment.TEST,
    enableSaveCard: true,
    clientPublicKey: null,
    clientLibraryLocation: null,
    additionalProviderSettings: [
      {
        suggestedCurrency: "EUR",
        provider: OrderPaymentProvider.SALTPAY,
        clientKey: "891451_puZw2H22X7Wcf5ErHxDmOmr1XlnlG6OhZn",
        merchantAccount: "guidetoeurope-com",
        environment: OrderPaymentEnvironment.TEST,
        enableSaveCard: false,
        clientPublicKey: null,
        clientLibraryLocation: null,
      },
    ],
  };

  const mockTokenizedSaltPayCard = [
    {
      cardToken: `mockSaltPayToken-${mockCardInformation.pan}`,
      currency: "ISK",
      paymentProvider: "SALTPAY",
    },
    {
      cardToken: `mockSaltPayToken-${mockCardInformation.pan}`,
      currency: "EUR",
      paymentProvider: "SALTPAY",
    },
  ];

  test("should return a single tokenized card if should save card is false", async () => {
    return expect(
      await tokenizeSaltPayCard({
        cardInformation: mockCardInformation,
        shouldSaveCard: false,
        saltPayPaymentConfig: mockSaltPayPaymentConfig,
        activePaymentProvider: OrderPaymentProvider.SALTPAY,
      })
    ).toEqual({
      isSaltPayError: false,
      tokenizedSaltPayCard: [mockTokenizedSaltPayCard[0]],
    });
  });

  test("should return a tokenized card in each currency if should save card is true", async () => {
    return expect(
      await tokenizeSaltPayCard({
        cardInformation: mockCardInformation,
        shouldSaveCard: true,
        saltPayPaymentConfig: mockSaltPayPaymentConfig,
        activePaymentProvider: OrderPaymentProvider.SALTPAY,
      })
    ).toEqual({
      isSaltPayError: false,
      tokenizedSaltPayCard: mockTokenizedSaltPayCard,
    });
  });

  test("should return an empty array if active provider is ADYEN shouldSaveCard is set to false", async () => {
    return expect(
      await tokenizeSaltPayCard({
        cardInformation: mockCardInformation,
        shouldSaveCard: false,
        saltPayPaymentConfig: mockSaltPayPaymentConfig,
        activePaymentProvider: OrderPaymentProvider.ADYEN,
      })
    ).toEqual({
      isSaltPayError: false,
      tokenizedSaltPayCard: [],
    });
  });

  test("should return an empty array when window.BAPIjs object is undefined", async () => {
    // @ts-ignore
    // eslint-disable-next-line functional/immutable-data
    global.window.BAPIjs = undefined;

    return expect(
      await tokenizeSaltPayCard({
        cardInformation: mockCardInformation,
        shouldSaveCard: false,
        saltPayPaymentConfig: mockSaltPayPaymentConfig,
        activePaymentProvider: OrderPaymentProvider.SALTPAY,
      })
    ).toEqual({
      isSaltPayError: true,
      tokenizedSaltPayCard: [],
    });
  });
});

describe("tokenizeAdyenCard", () => {
  beforeAll(() => {
    // @ts-ignore
    // eslint-disable-next-line functional/immutable-data
    global.window.adyen = {
      encrypt: {
        // @ts-ignore
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        createEncryption: (_clientKey: string, _options?: {}) => ({
          encrypt: (cardDetails: CartTypes.AdyenCSECardDetails) =>
            `mockAdyenToken-${cardDetails.number}`,
          validate: (cardDetails: CartTypes.AdyenCSECardDetails) => {
            if (cardDetails.number) {
              return true;
            }
            return false;
          },
        }),
      },
    };
  });

  afterAll(() => {
    // @ts-ignore
    // eslint-disable-next-line functional/immutable-data
    global.window.adyen = undefined;
  });

  const mockAdyenPaymentConfig: CartTypes.QueryPaymentProviderConfig = {
    suggestedCurrency: "EUR",
    provider: OrderPaymentProvider.ADYEN,
    clientKey: "test_RPFJ3LDO3VDV3P7DKXL3VZNXFEUW3C5W",
    merchantAccount: "GuideToEurope-uninsured",
    environment: OrderPaymentEnvironment.TEST,
    enableSaveCard: true,
    clientPublicKey: "10001|AE6BCFDD6DF47C3C",
    clientLibraryLocation: "https://test.adyen.com/hpp/cse/js/8015821177360381.shtml",
    additionalProviderSettings: [],
  };

  const mockTokenizedSaltPayCard = [
    {
      cardToken: `mockAdyenToken-${mockCardInformation.pan}`,
      currency: "EUR",
      paymentProvider: OrderPaymentProvider.ADYEN,
    },
  ];

  test("should tokenize an Adyen card in the required currency if should save card is true", () => {
    return expect(
      tokenizeAdyenCard({
        cardInformation: mockCardInformation,
        adyenPaymentConfig: mockAdyenPaymentConfig,
        serverTime: new Date().toISOString(),
        shouldSaveCard: true,
        activePaymentProvider: OrderPaymentProvider.ADYEN,
      })
    ).toEqual({
      tokenizedAdyenCard: mockTokenizedSaltPayCard,
    });
  });

  test("should tokenize an Adyen card in the required currency if activePaymentProvider ADYEN", () => {
    return expect(
      tokenizeAdyenCard({
        cardInformation: mockCardInformation,
        adyenPaymentConfig: mockAdyenPaymentConfig,
        serverTime: new Date().toISOString(),
        shouldSaveCard: false,
        activePaymentProvider: OrderPaymentProvider.ADYEN,
      })
    ).toEqual({
      tokenizedAdyenCard: mockTokenizedSaltPayCard,
    });
  });

  test("should return an empty array and activePaymentProvider SALTPAY", () => {
    return expect(
      tokenizeAdyenCard({
        cardInformation: mockCardInformation,
        adyenPaymentConfig: mockAdyenPaymentConfig,
        serverTime: new Date().toISOString(),
        shouldSaveCard: false,
        activePaymentProvider: OrderPaymentProvider.SALTPAY,
      })
    ).toEqual({
      tokenizedAdyenCard: [],
    });
  });

  test("should return an empty array and when window.adyen object is undefined", () => {
    // @ts-ignore
    // eslint-disable-next-line functional/immutable-data
    global.window.adyen = undefined;

    return expect(
      tokenizeAdyenCard({
        cardInformation: mockCardInformation,
        adyenPaymentConfig: mockAdyenPaymentConfig,
        serverTime: new Date().toISOString(),
        shouldSaveCard: false,
        activePaymentProvider: OrderPaymentProvider.ADYEN,
      })
    ).toEqual({
      tokenizedAdyenCard: [],
    });
  });

  test("should return an empty array and when adyen CSE validation fails", () => {
    return expect(
      tokenizeAdyenCard({
        cardInformation: {
          ...mockCardInformation,
          // @ts-ignore
          pan: null,
        },
        adyenPaymentConfig: mockAdyenPaymentConfig,
        serverTime: new Date().toISOString(),
        shouldSaveCard: false,
        activePaymentProvider: OrderPaymentProvider.ADYEN,
      })
    ).toEqual({
      tokenizedAdyenCard: [],
    });
  });
});

describe("collectBrowserInfo", () => {
  test("should return browser info", () => {
    expect(collectBrowserInfo()).toMatchObject({
      acceptHeader: expect.any(String),
      colorDepth: expect.any(Number),
      javaEnabled: expect.any(Boolean),
      language: expect.any(String),
      screenHeight: expect.any(Number),
      screenWidth: expect.any(Number),
      timeZoneOffset: expect.any(Number),
      userAgent: expect.any(String),
    });
  });
});

describe("getSupportedCardTypes", () => {
  test("should return supported cart types from CREDIT CARD payment method", () => {
    expect(
      getSupportedCardTypes([
        normalizedCreditCardPaymentMethod,
        normalizedPayPalPaymentMethod,
        normalizedSofortPaymentMethod,
      ])
    ).toEqual(mockCreditCardBrands);
  });
});

describe("getCreditCardType", () => {
  describe("getCreditCardType for supported credit card type", () => {
    beforeEach(() => {
      // @ts-ignore
      // eslint-disable-next-line functional/immutable-data
      global.window.adyen = {
        cardTypes: {
          // @ts-ignore
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          determine: (cardNumber: string) => ({
            name: "MasterCard",
            cardtype: CardType.MASTERCARD,
          }),
        },
      };
    });
    test("should return UNKNOWN type for empty card number", () => {
      expect(getCreditCardType("")).toEqual(CardType.UNKNOWN);
    });
    test("should return cart type if it's supported", () => {
      expect(getCreditCardType("5454 5454 5454 5454")).toEqual(CardType.MASTERCARD);
    });
    afterEach(() => {
      // @ts-ignore
      // eslint-disable-next-line functional/immutable-data
      global.window.adyen = undefined;
    });
  });

  describe("getCreditCardType for supported credit card type", () => {
    beforeEach(() => {
      // @ts-ignore
      // eslint-disable-next-line functional/immutable-data
      global.window.adyen = {
        cardTypes: {
          // @ts-ignore
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          determine: (cardNumber: string) => ({
            name: "jcb",
            cardtype: "jsb",
          }),
        },
      };
    });
    test("should return UNKNOWN for unsupported JCB card type", () => {
      expect(getCreditCardType("3569 9900 1009 5841")).toEqual(CardType.UNKNOWN);
    });
    afterEach(() => {
      // @ts-ignore
      // eslint-disable-next-line functional/immutable-data
      global.window.adyen = undefined;
    });
  });
});

describe("normalizeAdyenConfiguration", () => {
  test("should normalized object with adyen payment method config", () => {
    expect(
      normalizeAdyenConfiguration([
        {
          key: "merchantId",
          value: "000000000202030",
        },
        {
          key: "merchantName",
          value: "Guide to Iceland",
        },
      ])
    ).toEqual({
      merchantId: "000000000202030",
      merchantName: "Guide to Iceland",
    });
  });
});
