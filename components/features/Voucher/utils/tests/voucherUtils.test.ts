import {
  constructCustomerInfoSection,
  constructBookingDetails,
  constructCustomerInfoSectionDetails,
  constructGTETourCustomerInfoSection,
} from "../voucherUtils";

import {
  mockBuiltSectionsEven,
  mockBuiltSectionsOdd,
  mockCustomerInfoEvenQuestions,
  mockCustomerInfoOddQuestions,
} from "./mockData";

import { SupportedLanguages } from "types/enums";
import { OrderResultCode, PaymentMethodType } from "components/features/Cart/types/cartEnums";

const fakeT = (value: string) => value;

describe("constructCustomerInfoSection", () => {
  test("Should correctly construct customer info section", () => {
    expect(
      constructCustomerInfoSection({
        customerInfo: {
          name: "Gert",
          email: "gert@bert.com",
          phoneNumber: "00123456789",
          nationality: "is",
          termsAgreed: true,
        },
        t: fakeT as TFunction,
      })
    ).toEqual({
      title: "Traveler details",
      sections: [
        {
          label: "Name",
          values: ["Gert"],
          shouldStartFromNewLine: false,
        },
        {
          label: "Email",
          values: ["gert@bert.com"],
        },
        {
          label: "Phone",
          values: ["00123456789"],
        },
        {
          label: "Nationality",
          values: ["IS"],
        },
      ],
    });
  });
});

describe("constructBookingDetails", () => {
  test("Should correctly construct booking details section", () => {
    expect(
      constructBookingDetails({
        bookingNumber: "1337",
        externalId: "GTI-9765145",
        bookingDate: "2021-03-09T15:29:24.000Z",
        activeLocale: SupportedLanguages.English,
        t: fakeT as TFunction,
        orderInfo: {
          paymentMethod: PaymentMethodType.ALI_PAY,
          orderStatus: OrderResultCode.AUTHORISED,
        },
        productTitle: "productTitle",
      })
    ).toEqual({
      title: "Booking details",
      sections: [
        {
          label: "Product name",
          values: ["productTitle"],
        },
        {
          label: "Booking number",
          values: ["1337"],
        },
        {
          label: "Booking date",
          values: ["March 9, 2021, 3:29 PM"],
        },
        {
          label: "Ticket number",
          values: ["GTI-9765145"],
        },
      ],
    });

    expect(
      constructBookingDetails({
        bookingNumber: "1337",
        externalId: "GTI-9765145",
        bookingDate: "2021-03-09T15:29:24.000Z",
        activeLocale: SupportedLanguages.English,
        t: fakeT as TFunction,
        orderInfo: {
          paymentMethod: PaymentMethodType.ALI_PAY,
          orderStatus: OrderResultCode.AUTHORISED,
        },
      })
    ).toEqual({
      title: "Booking details",
      sections: [
        {
          label: "Booking number",
          values: ["1337"],
        },
        {
          label: "Booking date",
          values: ["March 9, 2021, 3:29 PM"],
        },
        {
          label: "Ticket number",
          values: ["GTI-9765145"],
        },
      ],
    });
  });
  test("Should correctly construct booking details section for car voucher", () => {
    const vendorName = "Avis";
    const vendorBookingReference = "mock vendorBookingReference";
    const emergencyPhone = "+12345";
    const rateCode = "mock rateCode";
    const iata = "mock iata";
    const accountingNumber = "mock accountingNumber";
    const aVNumber = "mock aVNumber";

    expect(
      constructBookingDetails({
        bookingNumber: "1337",
        externalId: "GTI-9765145",
        bookingDate: "2021-03-09T15:29:24.000Z",
        activeLocale: SupportedLanguages.English,
        t: fakeT as TFunction,
        orderInfo: {
          paymentMethod: PaymentMethodType.ALI_PAY,
          orderStatus: OrderResultCode.AUTHORISED,
        },
        productTitle: "productTitle",
        carInfo: {
          vendorBookingReference,
          vendorName,
          emergencyPhone,
          rateCode,
          iata,
          accountingNumber,
          aVNumber,
        },
      })
    ).toEqual({
      title: "Booking details",
      sections: [
        {
          label: "Product name",
          values: ["productTitle"],
        },
        {
          label: "Booking number",
          values: ["1337"],
        },
        {
          label: "Booking date",
          values: ["March 9, 2021, 3:29 PM"],
        },
        {
          label: "Supplier",
          values: [vendorName],
        },
        {
          label: "Your car rental reservation number",
          values: [vendorBookingReference],
        },
        {
          label: "AV. NO",
          values: [aVNumber],
        },
        {
          label: "IATA-No",
          values: [iata],
        },
        {
          label: "Accounting nr.",
          values: [accountingNumber],
        },
        {
          label: "Ratecode",
          values: [rateCode],
        },
        {
          label: "Emergency phone",
          values: [emergencyPhone],
        },
        {
          label: "Ticket number",
          values: ["GTI-9765145"],
        },
      ],
    });

    expect(
      constructBookingDetails({
        bookingNumber: "1337",
        externalId: "GTI-9765145",
        bookingDate: "2021-03-09T15:29:24.000Z",
        activeLocale: SupportedLanguages.English,
        t: fakeT as TFunction,
        orderInfo: {
          paymentMethod: PaymentMethodType.ALI_PAY,
          orderStatus: OrderResultCode.AUTHORISED,
        },
      })
    ).toEqual({
      title: "Booking details",
      sections: [
        {
          label: "Booking number",
          values: ["1337"],
        },
        {
          label: "Booking date",
          values: ["March 9, 2021, 3:29 PM"],
        },
        {
          label: "Ticket number",
          values: ["GTI-9765145"],
        },
      ],
    });
  });
});

describe("constructCustomerInfoSectionDetails", () => {
  test("Should correctly construct customer info section name, surname & nationality when voucher is ready", () => {
    expect(
      constructCustomerInfoSectionDetails({
        customerInfo: {
          name: "Roman",
          surname: "Kholiavko",
          nationality: "urk",
          termsAgreed: true,
        },
        isVoucherReady: true,
        t: fakeT as TFunction,
        shouldStartFromNewLine: true,
      })
    ).toEqual([
      {
        label: "Name",
        values: ["Roman Kholiavko"],
        shouldStartFromNewLine: true,
      },
      {
        label: "Nationality",
        values: ["URK"],
      },
    ]);
  });
  test("Should correctly construct customer info section name, surname, email & nationality when voucher is not ready", () => {
    expect(
      constructCustomerInfoSectionDetails({
        customerInfo: {
          name: "Roman",
          surname: "Kholiavko",
          nationality: "urk",
          termsAgreed: true,
        },
        t: fakeT as TFunction,
        shouldStartFromNewLine: true,
      })
    ).toEqual([
      {
        label: "Name",
        values: ["Roman Kholiavko"],
        shouldStartFromNewLine: true,
      },
      {
        label: "Email",
        values: [null],
      },
      {
        label: "Nationality",
        values: ["URK"],
      },
    ]);
  });
  test("Should correctly construct customer info section with surname", () => {
    expect(
      constructCustomerInfoSectionDetails({
        customerInfo: {
          name: "Roman",
          surname: undefined,
          nationality: "urk",
          termsAgreed: true,
        },
        t: fakeT as TFunction,
        isVoucherReady: true,
        shouldStartFromNewLine: true,
      })
    ).toEqual([
      {
        label: "Name",
        values: ["Roman"],
        shouldStartFromNewLine: true,
      },
      {
        label: "Nationality",
        values: ["URK"],
      },
    ]);
  });
  test("Should correctly construct customer info section", () => {
    expect(
      constructCustomerInfoSectionDetails({
        customerInfo: {
          name: "Roman",
          surname: "Kholiavko",
          email: "roman@travelshift.com",
          phoneNumber: "+123456789",
          nationality: "urk",
          termsAgreed: true,
        },
        t: fakeT as TFunction,
        shouldStartFromNewLine: true,
      })
    ).toEqual([
      {
        label: "Name",
        values: ["Roman Kholiavko"],
        shouldStartFromNewLine: true,
      },
      {
        label: "Email",
        values: ["roman@travelshift.com"],
      },
      {
        label: "Phone",
        values: ["+123456789"],
      },
      {
        label: "Nationality",
        values: ["URK"],
      },
    ]);
  });
});

describe("constructGTETourCustomerInfoSection", () => {
  test("should have all travelers listed as is as the total count of questions per traveler is even", () => {
    expect(
      constructGTETourCustomerInfoSection({
        tourCustomerInfo: mockCustomerInfoEvenQuestions,
        t: fakeT as TFunction,
      })
    ).toEqual(mockBuiltSectionsEven);
  });
  test("should have start from a new line the first question of a traveler who isn't the first, as the total count of questions is odd", () => {
    expect(
      constructGTETourCustomerInfoSection({
        tourCustomerInfo: mockCustomerInfoOddQuestions,
        t: fakeT as TFunction,
      })
    ).toEqual(mockBuiltSectionsOdd);
  });
});
