import {
  constructCarProductUrl,
  getCarnectKey,
  getTranslationByKey,
  constructHeadline,
} from "../sharedCarUtils";

import { CarProvider } from "types/enums";

describe("constructCarProductUrl", () => {
  it("should return construct the correct url for car product page", () => {
    expect(
      constructCarProductUrl(
        "/car-rental/search-results/book",
        1601028000,
        {
          selectedDates: {
            to: new Date("2020-09-13"),
            from: new Date("2020-09-12"),
          },
          pickupId: "1",
          dropoffId: "1",
          dropoffLocationName: "Keflavik",
          pickupLocationName: "Keflavik",
        },
        CarProvider.MONOLITH,
        "small",
        "Toyota Yaris (2020-2022) 2021",
        45,
        "IS"
      )
    ).toEqual(
      "/car-rental/search-results/book/Toyota%20Yaris%20(2020-2022)%202021/1601028000?from=2020-09-12 00:00&to=2020-09-13 00:00&pickup_id=1&dropoff_id=1&provider=0&driverAge=45&driverCountryCode=IS&category=small&pickupLocationName=Keflavik&dropoffLocationName=Keflavik"
    );
    expect(
      constructCarProductUrl(
        "/car-rental/search-results/book",
        1601028000,
        {
          selectedDates: {
            to: new Date("2020-09-13"),
            from: new Date("2020-09-12"),
          },
          pickupId: "1",
          dropoffId: "1",
          dropoffLocationName: "Keflavik",
          pickupLocationName: "Keflavik",
        },
        CarProvider.MONOLITH,
        "small",
        "Toyota Yaris",
        45,
        "IS"
      )
    ).toEqual(
      "/car-rental/search-results/book/Toyota%20Yaris/1601028000?from=2020-09-12 00:00&to=2020-09-13 00:00&pickup_id=1&dropoff_id=1&provider=0&driverAge=45&driverCountryCode=IS&category=small&pickupLocationName=Keflavik&dropoffLocationName=Keflavik"
    );
    expect(
      constructCarProductUrl(
        "/car-rental/search-results/book",
        1601028000,
        {
          selectedDates: {
            to: new Date("2020-09-13"),
            from: new Date("2020-09-12"),
          },
          pickupId: "1",
          dropoffId: "1",
          dropoffLocationName: "Keflavik",
          pickupLocationName: "Keflavik",
        },
        CarProvider.MONOLITH,
        "small",
        "KIA PICANTO 1.1",
        45,
        "IS"
      )
    ).toEqual(
      "/car-rental/search-results/book/KIA%20PICANTO%201.1/1601028000?from=2020-09-12 00:00&to=2020-09-13 00:00&pickup_id=1&dropoff_id=1&provider=0&driverAge=45&driverCountryCode=IS&category=small&pickupLocationName=Keflavik&dropoffLocationName=Keflavik"
    );
    expect(
      constructCarProductUrl(
        "/car-rental/search-results/book",
        1601028000,
        {
          selectedDates: {
            to: new Date("2020-09-13"),
            from: new Date("2020-09-12"),
          },
          pickupId: "1",
          dropoffId: "1",
          dropoffLocationName: "Keflavik",
          pickupLocationName: "Keflavik",
        },
        CarProvider.MONOLITH,
        "small",
        "VW Carravelle 4x4 (Automatic) 2017 + Roof Box",
        45,
        "IS"
      )
    ).toEqual(
      "/car-rental/search-results/book/VW%20Carravelle%204x4%20(Automatic)%202017%20%2B%20Roof%20Box/1601028000?from=2020-09-12 00:00&to=2020-09-13 00:00&pickup_id=1&dropoff_id=1&provider=0&driverAge=45&driverCountryCode=IS&category=small&pickupLocationName=Keflavik&dropoffLocationName=Keflavik"
    );
  });
});

describe("getCarnectKey", () => {
  it("should return carnect translation key", () => {
    const translationKeyName = {
      key: "extra_222_name",
      variables: [],
    };
    const translationKeyDesc = {
      key: "extra_222_desc",
      variables: [],
    };
    const translationKeys = {
      keys: [translationKeyName, translationKeyDesc],
    };
    expect(getCarnectKey(translationKeys, "name")).toEqual(translationKeyName);
    expect(getCarnectKey(translationKeys, "desc")).toEqual(translationKeyDesc);
    expect(getCarnectKey(translationKeys, "hello")).toEqual(undefined);
  });
});

describe("getTranslationByKey", () => {
  const fakeTranslate = (value: string, variables: object) => [value, variables];
  const convertCurrency = (value: number) => value;
  it("should return carnect translation key", () => {
    const translationKeyName = {
      key: "extra_222_name",
      variables: [],
    };
    expect(getTranslationByKey(translationKeyName, fakeTranslate as TFunction)).toEqual([
      "extra_222_name",
      {},
    ]);
  });
  it("should return carnect translation key with variables", () => {
    const translationKeyWithPrice = {
      key: "extra_12_name",
      variables: [
        {
          key: "XX0",
          value: "234",
        },
      ],
    };
    const translationKeyWithVariable = {
      key: "extra_12_name",
      variables: [
        {
          key: "YY0",
          value: "7",
        },
      ],
    };
    expect(
      getTranslationByKey(
        translationKeyWithPrice,
        fakeTranslate as TFunction,
        convertCurrency,
        "USD"
      )
    ).toEqual(["extra_12_name", { XX0: "234 USD" }]);
    expect(
      getTranslationByKey(
        translationKeyWithVariable,
        fakeTranslate as TFunction,
        convertCurrency,
        "USD"
      )
    ).toEqual(["extra_12_name", { YY0: "7" }]);
  });
});

describe("constructHeadline", () => {
  const fakeTranslate = (value: string) => value;
  const name = "Toyota Yaris";
  it("should return correctly constructed headline", () => {
    expect(constructHeadline(fakeTranslate as TFunction, name)).toEqual("Toyota Yaris or similar");
  });
  const name2 = "Ford Focus 2.0";
  it("should return correctly constructed headline", () => {
    expect(constructHeadline(fakeTranslate as TFunction, name2)).toEqual(
      "Ford Focus 2.0 or similar"
    );
  });
  const name3 = "Toyota Yaris, or similar";
  it("should return correctly constructed headline", () => {
    expect(constructHeadline(fakeTranslate as TFunction, name3)).toEqual(
      "Toyota Yaris, or similar"
    );
  });
  const name4 = "Toyota Aygo 2019";
  it("should return correctly constructed headline", () => {
    expect(constructHeadline(fakeTranslate as TFunction, name4)).toEqual(
      "Toyota Aygo 2019 or similar"
    );
  });
});
