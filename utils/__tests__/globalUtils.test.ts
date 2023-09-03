import {
  constructImage,
  isIOSUserAgent,
  convertImgixImageToBase64,
  constructUser,
} from "../globalUtils";

import { UserRoles } from "types/enums";

describe("constructImage", () => {
  test("should remove query parameters from image urls", () => {
    expect(
      constructImage({
        id: 1,
        url: "https://guidetoiceland.imgix.net/370148/x/0/on-a-summer-self-drive-tour-you-could-stop-at-mt-kirkjufell-on-the-snaefellsnes-peninsula-and-capture-a-dramatic-photo-of-the-mountain-bathed-in-the-rays-of-the-midnight-sun-3?auto=compress%2Cformat&ch=Width%2CDPR&dpr=1&ixlib=php-2.3.0&s=64e974d5aa65d48663e49fbbc41d38c4",
      }).url
    ).toBe(
      "https://guidetoiceland.imgix.net/370148/x/0/on-a-summer-self-drive-tour-you-could-stop-at-mt-kirkjufell-on-the-snaefellsnes-peninsula-and-capture-a-dramatic-photo-of-the-mountain-bathed-in-the-rays-of-the-midnight-sun-3"
    );
  });
});

describe("isIOSUserAgent", () => {
  it("should return true for iOS user agent", () => {
    expect(
      isIOSUserAgent(
        "Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_1 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/10.0 Mobile/14E304 Safari/602.1"
      )
    ).toBe(true);
  });

  it("should return false for other cases", () => {
    // Firefox for android
    expect(
      isIOSUserAgent("Mozilla/5.0 (Android 7.0; Mobile; rv:54.0) Gecko/54.0 Firefox/54.0")
    ).toBe(false);

    // Safari desktop
    expect(
      isIOSUserAgent(
        "Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Win64; x64; Trident/5.0; .NET CLR 2.0.50727; SLCC2; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; .NET4.0C; InfoPath.3)"
      )
    ).toBe(false);

    // Chrome desktop
    expect(
      isIOSUserAgent(
        "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/29.0.1547.76 Safari/537.36"
      )
    ).toBe(false);
  });
});

describe("convertImgixImageToBase64 client side", () => {
  it("should return empty string", async () => {
    const base64ImgSrc = await convertImgixImageToBase64({ imageUrl: "" });

    expect(base64ImgSrc).toBe("");
  });
});

describe("constructUser", () => {
  const mockUserData: QueryUser = {
    id: 80800,
    name: "Roman Kholiavko",
    email: "email@gmail.com",
    countryCode: "IS",
    phone: "+3548880101",
    avatarImage: {
      id: "338475",
      name: "avatar",
      url: "https://guidetoiceland.imgix.net/338475/x/0/18575666-1606749316024886-1767795921-o-jpg",
    },
    roles: [],
  };

  it("should return constructed user data without roles", async () => {
    expect(constructUser(mockUserData)).toStrictEqual({
      id: mockUserData.id,
      name: mockUserData.name,
      email: mockUserData.email,
      phone: mockUserData.phone,
      countryCode: mockUserData.countryCode,
      avatarImage: mockUserData.avatarImage,
      isAdmin: false,
      isTranslator: false,
      isAffiliate: false,
    });
  });

  it("should return constructed user data for admin role", async () => {
    expect(
      constructUser({
        ...mockUserData,
        roles: [
          {
            id: UserRoles.admin,
          },
        ],
      })
    ).toStrictEqual({
      id: mockUserData.id,
      name: mockUserData.name,
      email: mockUserData.email,
      phone: mockUserData.phone,
      countryCode: mockUserData.countryCode,
      avatarImage: mockUserData.avatarImage,
      isAdmin: true,
      isTranslator: false,
      isAffiliate: false,
    });
    expect(
      constructUser({
        ...mockUserData,
        roles: [
          {
            id: UserRoles.admin,
          },
          {
            id: "SomeOtherUserRole",
          },
        ],
      })
    ).toStrictEqual({
      id: mockUserData.id,
      name: mockUserData.name,
      email: mockUserData.email,
      phone: mockUserData.phone,
      countryCode: mockUserData.countryCode,
      avatarImage: mockUserData.avatarImage,
      isAdmin: true,
      isTranslator: false,
      isAffiliate: false,
    });
  });

  it("should return constructed user data for translator role", async () => {
    expect(
      constructUser({
        ...mockUserData,
        roles: [
          {
            id: UserRoles.translator,
          },
        ],
      })
    ).toStrictEqual({
      id: mockUserData.id,
      name: mockUserData.name,
      email: mockUserData.email,
      phone: mockUserData.phone,
      countryCode: mockUserData.countryCode,
      avatarImage: mockUserData.avatarImage,
      isAdmin: false,
      isTranslator: true,
      isAffiliate: false,
    });
  });

  it("should return constructed user data for affiliate role", async () => {
    expect(
      constructUser({
        ...mockUserData,
        roles: [
          {
            id: UserRoles.affiliate,
          },
        ],
      })
    ).toStrictEqual({
      id: mockUserData.id,
      name: mockUserData.name,
      email: mockUserData.email,
      phone: mockUserData.phone,
      countryCode: mockUserData.countryCode,
      avatarImage: mockUserData.avatarImage,
      isAdmin: false,
      isTranslator: false,
      isAffiliate: true,
    });
  });

  it("should return constructed user data for admin, affiliate and translator roles", async () => {
    expect(
      constructUser({
        ...mockUserData,
        roles: [
          {
            id: UserRoles.affiliate,
          },
          {
            id: UserRoles.admin,
          },
          {
            id: UserRoles.translator,
          },
        ],
      })
    ).toStrictEqual({
      id: mockUserData.id,
      name: mockUserData.name,
      email: mockUserData.email,
      phone: mockUserData.phone,
      countryCode: mockUserData.countryCode,
      avatarImage: mockUserData.avatarImage,
      isAdmin: true,
      isTranslator: true,
      isAffiliate: true,
    });
  });
});
