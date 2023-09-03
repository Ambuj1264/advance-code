/* eslint-disable functional/immutable-data */
import memoizeOne from "memoize-one";

import {
  removeAt,
  getColor,
  getIdFromName,
  getQueryParams,
  addLeadingSlashIfNotPresent,
  getNumberOfDays,
  getTravelerPriceText,
  getCalculatePrice,
  closestInteger,
  getTruncationCutWithoutAnchor,
  getUUID,
  partition,
  removeDuplicates,
  getDuration,
  getTravelerText,
  getCoreMarketPlace,
  decodeHtmlEntity,
  memoizeOneObj,
  getSplitNamespaces,
} from "utils/helperUtils";
import { Marketplace, ThemeColor } from "types/enums";

const t = (key: string) => key;

describe("removeAt", () => {
  const array = ["foo", "bar"];
  test("should return the array with the item at position 0 removed", () => {
    expect(removeAt(0, array)).toEqual(["bar"]);
  });
  test("should return the array with the item at position 1 removed", () => {
    expect(removeAt(1, array)).toEqual(["foo"]);
  });
});

describe("getColor", () => {
  const primaryColor = "#336699";
  const actionColor = "#33ab63";
  const theme: Theme = {
    colors: {
      primary: primaryColor,
      action: actionColor,
    },
  };
  test("should return primary theme color", () => {
    expect(getColor(ThemeColor.Primary, theme)).toBe(primaryColor);
  });
  test("should return action theme color", () => {
    expect(getColor(ThemeColor.Action, theme)).toBe(actionColor);
  });
  test("should return the color passed into the function", () => {
    expect(getColor("#fff", theme)).toBe("#fff");
  });
});

describe("getIdFromName", () => {
  test("should return correcly constructed id when name has not whitespace", () => {
    expect(getIdFromName("Foo")).toEqual("foo");
  });
  test("should return correcly constructed id when name has whitespace", () => {
    expect(getIdFromName("Foo bar")).toEqual("fooBar");
  });
  test("should return correcly constructed id when name has multiple whitespaces", () => {
    expect(getIdFromName("Foo bar  Barr")).toEqual("fooBarBarr");
  });
});

const { location } = window;

describe("getQueryParams", () => {
  test("should return an empty array since the query parameters are empty", () => {
    // @ts-ignore
    delete window.location;
    window.location = { ...location, search: "" };
    expect(getQueryParams()).toEqual([]);
    window.location = location;
  });
  test("should return the correct array of key value pairs", () => {
    // @ts-ignore
    delete window.location;
    window.location = { ...location, search: "?date=12-12-2019&cart_item=1" };
    expect(getQueryParams()).toEqual([
      ["date", "12-12-2019"],
      ["cart_item", "1"],
    ]);
    window.location = location;
  });
});

describe("addLeadingSlashIfNotPresent", () => {
  const withSlash = "/someUrl";
  const withoutSlash = "someUrl";
  test("should add leading slash that is not present", () => {
    expect(addLeadingSlashIfNotPresent(withoutSlash)).toEqual(withSlash);
  });
  test("should return same url if leading slash is present", () => {
    expect(addLeadingSlashIfNotPresent(withSlash)).toEqual(withSlash);
  });
});

describe("getNumberOfDays", () => {
  const testCases = [
    {
      title: "less than 1 day",
      seconds: 10,
      days: 1,
    },
    {
      title: "Round close to the floor",
      seconds: 2 * 24 * 60 * 60 + 1,
      days: 2,
    },
    {
      title: "Round close to the ceil",
      seconds: 3 * 24 * 60 * 60 - 1,
      days: 2,
    },
    {
      title: "Large amount",
      seconds: 12 * 24 * 60 * 60,
      days: 12,
    },
  ];
  testCases.forEach(testCase =>
    test(testCase.title, () => {
      expect(getNumberOfDays(testCase.seconds)).toEqual(testCase.days);
    })
  );
});

describe("getTravelerPriceText", () => {
  test("Should return correct text for travelers", () => {
    const travelers = {
      adults: 1,
      teenagers: 0,
      children: 0,
    };
    expect(getTravelerPriceText(travelers, t as TFunction)).toEqual(
      "Price for {numberOfAdults} adults"
    );
  });
  test("Should return correct text for travelers", () => {
    const travelers = {
      adults: 1,
      teenagers: 1,
      children: 0,
    };
    expect(getTravelerPriceText(travelers, t as TFunction)).toEqual(
      "Price for {numberOfAdults} adults and {numberOfTeenagers} teenagers"
    );
  });
  test("Should return correct text for travelers", () => {
    const travelers = {
      adults: 2,
      teenagers: 0,
      children: 1,
    };
    expect(getTravelerPriceText(travelers, t as TFunction)).toEqual(
      "Price for {numberOfAdults} adults and {numberOfChildren} children"
    );
  });
  test("Should return correct text for travelers", () => {
    const travelers = {
      adults: 2,
      teenagers: 1,
      children: 1,
    };
    expect(getTravelerPriceText(travelers, t as TFunction)).toEqual(
      "Price for {numberOfAdults} adults, {numberOfTeenagers} teenagers and {numberOfChildren} children"
    );
  });
});

describe("getCalculatePrice", () => {
  test("Should return correct prices from priceData object", () => {
    const priceData = {
      prices: {
        totalPrice: "1,300",
        fullPrice: "2,500",
        discountPrice: "3,000,000",
        cancellationPolicy: "",
      },
    };
    const returnValue = {
      totalPrice: 1300,
      fullPrice: 2500,
      discountPrice: 3000000,
    };
    expect(getCalculatePrice(priceData)).toEqual(returnValue);
  });
  test("Should return default prices if priceData object is undefined", () => {
    const priceData = undefined;
    const returnValue = {
      totalPrice: 0,
      fullPrice: 0,
      discountPrice: 0,
    };
    expect(getCalculatePrice(priceData)).toEqual(returnValue);
  });
});

describe("closestInteger", () => {
  it("should find correct closest number to match divider", () => {
    expect(closestInteger(1, 5)).toBe(0);
    expect(closestInteger(2, 5)).toBe(0);
    expect(closestInteger(3, 5)).toBe(5);
    expect(closestInteger(4, 5)).toBe(5);
    expect(closestInteger(5, 5)).toBe(5);
    expect(closestInteger(6, 5)).toBe(5);
    expect(closestInteger(7, 5)).toBe(5);
    expect(closestInteger(8, 5)).toBe(10);
    expect(closestInteger(9, 5)).toBe(10);
    expect(closestInteger(10, 5)).toBe(10);
    expect(closestInteger(11, 5)).toBe(10);
  });
});

describe("getTruncationCutWithoutAnchor", () => {
  test("Should not truncate the text since the text is too small", () => {
    expect(
      getTruncationCutWithoutAnchor({
        content: "abcd",
        truncationLength: 5,
      })
    ).toEqual({ visibleDescription: "abcd", restDescription: "" });
  });
  test("Should truncate the text correctly", () => {
    expect(
      getTruncationCutWithoutAnchor({
        content: "abcd",
        truncationLength: 2,
      })
    ).toEqual({ visibleDescription: "ab", restDescription: "cd" });
  });
  test("Should move the truncation so we don't cut the anchor tag", () => {
    expect(
      getTruncationCutWithoutAnchor({
        content: "Text <a>anchor</a> awesome",
        truncationLength: 15,
      })
    ).toEqual({
      visibleDescription: "Text <a>anchor</a>",
      restDescription: " awesome",
    });
  });
  test("Should move the truncation so we don't cut the anchor tag", () => {
    expect(
      getTruncationCutWithoutAnchor({
        content: "Text <a href='/something' class='artur made me do it'>anchor</a> awesome",
        truncationLength: 61,
      })
    ).toEqual({
      visibleDescription: "Text <a href='/something' class='artur made me do it'>anchor</a>",
      restDescription: " awesome",
    });
  });

  test("Should move the truncation for the first anchor tag and not cut the second one", () => {
    expect(
      getTruncationCutWithoutAnchor({
        content: "Text <a href='/something' class='artur made me do it'>anchor</a><a>awesome<a/>",
        truncationLength: 61,
      })
    ).toEqual({
      visibleDescription: "Text <a href='/something' class='artur made me do it'>anchor</a>",
      restDescription: "<a>awesome<a/>",
    });
  });

  test("Expect links which are long which start before the cut but and during it should not be cut", () => {
    expect(
      getTruncationCutWithoutAnchor({
        content:
          "<a href='https://guidetoiceland.is/travel-info/where-to-find-puffins-irestDescription n-iceland'>Puffins can be seen in Iceland</a> from early April until September",
        truncationLength: 70,
      })
    ).toEqual({
      visibleDescription:
        "<a href='https://guidetoiceland.is/travel-info/where-to-find-puffins-irestDescription n-iceland'>Puffins can be seen in Iceland</a>",
      restDescription: " from early April until September",
    });
  });

  test("Should make sure long content with multiple links does not cut links", () => {
    expect(
      getTruncationCutWithoutAnchor({
        content:
          '日本と同じく商業捕鯨を行うアイスランドでは、クジラに関して度々議論されております。アイスランドで捕鯨された鯨肉の内、国内で消費する鯨肉は、たった２パーセントです。アイスランド人の大半が、鯨に対して愛情や捕鯨に対して懸念を抱いおります。事実、捕鯨船として利用されていた船の多くは、現在、ホエールウォッチングで利用されています。ホエールウォッチングは<a href="https://guidetoiceland.is/ja/book-holiday-trips/whales-sails">伝統的なスクーナー船</a>を始め、<a href="https://guidetoiceland.is/ja/book-holiday-trips/whale-watching-1">大型のクルーズ</a>、<a href="https://guidetoiceland.is/ja/book-holiday-trips/rib-express">スピード感のあるRIBボート</a>、<a href="https://guidetoiceland.is/ja/book-holiday-trips/whale-watching-tour-small-group">ラグジュアリー感溢れるヨット</a>等、多岐に渡りお楽しみいただけます。',
        truncationLength: 315,
      })
    ).toEqual({
      visibleDescription:
        '日本と同じく商業捕鯨を行うアイスランドでは、クジラに関して度々議論されております。アイスランドで捕鯨された鯨肉の内、国内で消費する鯨肉は、たった２パーセントです。アイスランド人の大半が、鯨に対して愛情や捕鯨に対して懸念を抱いおります。事実、捕鯨船として利用されていた船の多くは、現在、ホエールウォッチングで利用されています。ホエールウォッチングは<a href="https://guidetoiceland.is/ja/book-holiday-trips/whales-sails">伝統的なスクーナー船</a>を始め、<a href="https://guidetoiceland.is/ja/book-holiday-trips/whale-watching-1">大型のクルーズ</a>',
      restDescription:
        '、<a href="https://guidetoiceland.is/ja/book-holiday-trips/rib-express">スピード感のあるRIBボート</a>、<a href="https://guidetoiceland.is/ja/book-holiday-trips/whale-watching-tour-small-group">ラグジュアリー感溢れるヨット</a>等、多岐に渡りお楽しみいただけます。',
    });
  });
});

describe("getUUID", () => {
  it("should validate the UUID is correctly formatted", () => {
    expect(
      /^([0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[0-9a-d][0-9a-f]{3}-[0-9a-f]{12})$/i.test(
        getUUID()
      )
    ).toBe(true);
  });
});

describe("partition", () => {
  it("should create two arrays using the predicate provided", () => {
    expect(partition<number>([1, 2, 3, 4, 5, 6], (i: number) => i % 2 === 0)).toEqual([
      [2, 4, 6],
      [1, 3, 5],
    ]);
  });
});

describe("removeDuplicatrs", () => {
  it("should remove duplicate from array with the object key provided", () => {
    expect(
      removeDuplicates(
        [
          { name: "Chinese Mandalorian", code: "zh_CN" },
          { name: "Chinese", code: "zh_CN" },
          { name: "English", code: "en" },
        ],
        "code"
      )
    ).toEqual([
      { name: "Chinese Mandalorian", code: "zh_CN" },
      { name: "English", code: "en" },
    ]);
  });
});

describe("getDuration", () => {
  it("should create hours and minutes from seconds", () => {
    expect(getDuration(3660)).toEqual([1, 1]);
  });
});

describe("getTravelerText", () => {
  test("Should return correct number of adults", () => {
    const numberOfTravelers = {
      adults: 1,
      teenagers: 0,
      children: 0,
    };
    expect(getTravelerText(numberOfTravelers, t as TFunction)).toEqual("{numberOfAdults} adults");
  });
  test("Should return correct number of adults and teenagers", () => {
    const numberOfTravelers = {
      adults: 2,
      teenagers: 1,
      children: 0,
    };
    expect(getTravelerText(numberOfTravelers, t as TFunction)).toEqual(
      "{numberOfAdults} adults and {numberOfTeenagers} teenagers"
    );
  });
  test("Should return correct number of adults and children", () => {
    const numberOfTravelers = {
      adults: 2,
      teenagers: 0,
      children: 1,
    };
    expect(getTravelerText(numberOfTravelers, t as TFunction)).toEqual(
      "{numberOfAdults} adults and {numberOfChildren} children"
    );
  });
  test("Should return correct number of adults, teenagers and children", () => {
    const numberOfTravelers = {
      adults: 3,
      teenagers: 2,
      children: 1,
    };
    expect(getTravelerText(numberOfTravelers, t as TFunction)).toEqual(
      "{numberOfAdults} adults, {numberOfTeenagers} teenagers and {numberOfChildren} children"
    );
  });
});

describe("getCoreMarketPlace", () => {
  it("returns guidetoiceland-is for Marketplace.GUIDE_TO_ICELAND", () => {
    expect(getCoreMarketPlace(Marketplace.GUIDE_TO_ICELAND)).toEqual("guidetoiceland-is");
  });

  it("returns guidetoeurope-com for Marketplace.GUIDE_TO_EUROPE", () => {
    expect(getCoreMarketPlace(Marketplace.GUIDE_TO_EUROPE)).toEqual("guidetoeurope-com");
  });

  it("returns iceland-photo-tours-com for Marketplace.ICELAND_PHOTO_TOURS", () => {
    expect(getCoreMarketPlace(Marketplace.ICELAND_PHOTO_TOURS)).toEqual("iceland-photo-tours-com");
  });
  it("returns guidetothephilippines-ph for Marketplace.GUIDE_TO_THE_PHILIPPINES", () => {
    expect(getCoreMarketPlace(Marketplace.GUIDE_TO_THE_PHILIPPINES)).toEqual(
      "guidetothephilippines-ph"
    );
  });
  it("returns norwaytravelguide-no for Marketplace.NORWAY_TRAVEL_GUIDE", () => {
    expect(getCoreMarketPlace(Marketplace.NORWAY_TRAVEL_GUIDE)).toEqual("norwaytravelguide-no");
  });
});

describe("decodeHtmlEntity", () => {
  it("should decode entities", () => {
    expect(decodeHtmlEntity("&amp;")).toBe("&");
    expect(decodeHtmlEntity("&amp; &#169; &bull;")).toBe("& © •");
  });
});

describe("memoizeOneObj", () => {
  const mockObjArgs = {
    key1: {},
    key2: [],
    key3: false,
    key4: 1,
  };
  const fn = (a: any) => a;

  it("regular memoizeOne not handling object arg", () => {
    const memoFn = memoizeOne(fn);
    const memo1 = memoFn({ ...mockObjArgs });
    const memo2 = memoFn({ ...mockObjArgs });

    expect(memo1 === memo2).toBe(false);
  });

  it("improved memoizeOneObj cheks key equality of an object arg", () => {
    const memoFn = memoizeOneObj(fn);
    const memo1 = memoFn({ ...mockObjArgs });
    const memo2 = memoFn({ ...mockObjArgs });

    expect(memo1 === memo2).toBe(true);
  });

  it("invalidates in case arguments are different", () => {
    const memoFn = memoizeOneObj(fn);
    const memo1 = memoFn({ ...mockObjArgs });
    const memo2 = memoFn({ ...mockObjArgs, extraKey: "" });

    expect(memo1 === memo2).toBe(false);
  });

  it("correctly returns false when keys are different", () => {
    const memoFn = memoizeOneObj(fn);
    const memo1 = memoFn({ ...mockObjArgs });
    const memo2 = memoFn({ ...mockObjArgs, key1: {} });

    expect(memo1 === memo2).toBe(false);
  });
});

describe("getSplitNamespaces", () => {
  it("returns all namespaces as empty array since there were no namespaces in the array", () => {
    expect(getSplitNamespaces([])).toEqual({
      firstNamespaces: [],
      secondNamespaces: [],
      lastNamespaces: [],
    });
  });

  it("returns correctly split namespaces", () => {
    expect(getSplitNamespaces(["carNs"])).toEqual({
      firstNamespaces: ["carNs"],
      secondNamespaces: [],
      lastNamespaces: [],
    });
  });
  it("returns correctly split namespaces", () => {
    expect(getSplitNamespaces(["carNs", "accommodationNs"])).toEqual({
      firstNamespaces: ["carNs"],
      secondNamespaces: [],
      lastNamespaces: ["accommodationNs"],
    });
  });
  it("returns correctly split namespaces", () => {
    expect(getSplitNamespaces(["carNs", "accommodationNs", "tourNs"])).toEqual({
      firstNamespaces: ["carNs"],
      secondNamespaces: ["accommodationNs"],
      lastNamespaces: ["tourNs"],
    });
  });
  it("returns correctly split namespaces", () => {
    expect(getSplitNamespaces(["carNs", "accommodationNs", "tourNs", "commonNs"])).toEqual({
      firstNamespaces: ["carNs", "accommodationNs"],
      secondNamespaces: ["tourNs", "commonNs"],
      lastNamespaces: [],
    });
  });
  it("returns correctly split namespaces", () => {
    expect(
      getSplitNamespaces(["carNs", "accommodationNs", "tourNs", "commonNs", "cartNs"])
    ).toEqual({
      firstNamespaces: ["carNs", "accommodationNs"],
      secondNamespaces: ["tourNs", "commonNs"],
      lastNamespaces: ["cartNs"],
    });
  });
});
