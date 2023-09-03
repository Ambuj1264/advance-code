import {
  cleanPrecacheManifest,
  prepareGTEManifest,
  prepareGTIManifest,
  swManifest,
} from "utils/swHelpers";

const getReadableChunkNames = (manifest: swManifest) =>
  manifest.map(
    ({ url }) => url.replace(/_next\/static\/chunks\/|_next\/static\//, "").split(/\.|-/)[0]
  );

describe("service worker", () => {
  const mockManifest = [
    {
      revision: "09c86b2d8361e353d76d6f1bd0370c43",
      url: "_next/static/QpVs1CX56gQvxRHHCmO-s/_buildManifest.js",
    },
    {
      revision: "abee47769bf307639ace4945f9cfd4ff",
      url: "_next/static/QpVs1CX56gQvxRHHCmO-s/_ssgManifest.js",
    },
    {
      revision: "7fb22404f92a63035de92840362764b3",
      url: "_next/static/chunks/99.123b0b0986bd4e00bbef.js",
    },
    {
      revision: "c3f02a54a873dce9eca2186dedb657ff",
      url: "_next/static/chunks/commons.7c35ffe69652aea82d11.js",
    },
    {
      revision: "1b5d2e0b5f5d2fc2147d15eaf4e790ad",
      url: "_next/static/chunks/main-cbec18b7e3747f7e0544.js",
    },
    {
      revision: "2a5f1f84399d2153f7f26f884253d250",
      url: "_next/static/chunks/pages/_app-53ce47b56ca025125023.js",
    },
    {
      revision: "d2ec2b4a0a3bc1e02734db758323ec6f",
      url: "_next/static/chunks/pages/_error-8143c9b1d24e18e98b1c.js",
    },
    {
      revision: "0af7c7d30065e81a4ebd879fccebcee4",
      url: "_next/static/chunks/pages/accommodationCategory-4a1a8bc77b079d9919ff.js",
    },
    {
      revision: "a5c6a8d03f1b9b668c63e057f4324aba",
      url: "_next/static/chunks/pages/accommodationProduct-f3a06a6b0bc08ec4c5d5.js",
    },
    {
      revision: "9b31fc4e9d52b598087e9d7dd9d4b868",
      url: "_next/static/chunks/pages/accommodationSearch-23b5586fd81cd78fb924.js",
    },
    {
      revision: "059c1a641d2f643f6b48369b6f804fb4",
      url: "_next/static/chunks/pages/article-3cf25223b60c038e8e0b.js",
    },
    {
      revision: "deab09bcfcf2079160a52b432431eb49",
      url: "_next/static/chunks/pages/articleCategory-8752f2f6d99054a665d2.js",
    },
    {
      revision: "67c75e9875b0733e18660c9bdcaeb852",
      url: "_next/static/chunks/pages/articleSearch-222db765667ec3f80008.js",
    },
    {
      revision: "9cff8d9db2a343e10df394a71171e32e",
      url: "_next/static/chunks/pages/attraction-d300997134c5e1e1635f.js",
    },
    {
      revision: "40c9f66e8e620b6001fcc0cff3898a97",
      url: "_next/static/chunks/pages/bestPlaces-c6cc1b8a8761707f8dbb.js",
    },
    {
      revision: "2af2e72bcf62847defb96a305c99b774",
      url: "_next/static/chunks/pages/blog-0b4b03f59dfb54a09fff.js",
    },
    {
      revision: "3a1d725f9da0f741f1bbb671d48f7102",
      url: "_next/static/chunks/pages/bloggerSearch-02f6d866628676eceebe.js",
    },
    {
      revision: "4efd2b5043293dcb3a21993a4257346a",
      url: "_next/static/chunks/pages/car-b48f0ed139d0a1a57ac0.js",
    },
    {
      revision: "1867890d8c759aa0fb6fe22fccbdd723",
      url: "_next/static/chunks/pages/carCategory-3a7ef4645bc67f029983.js",
    },
    {
      revision: "a742d862cc3972f911e272b267d368e8",
      url: "_next/static/chunks/pages/carSearch-b9e2e25d5d7ce17be6a8.js",
    },
    {
      revision: "0d6b88d28a3aa29d9574f1b442f4219f",
      url: "_next/static/chunks/pages/cart-2bcaf26def68114d0413.js",
    },
    {
      revision: "e4db1a1dbeffbd6d5fc2030dc79fc923",
      url: "_next/static/chunks/pages/cmsPreview-f9e7390ab65732a0f72d.js",
    },
    {
      revision: "567e3fa61fdb1688c1d72763eb950ff3",
      url: "_next/static/chunks/pages/errorStatic-a261ce1d4fa50dfb7f31.js",
    },
    {
      revision: "64c37e1994f33fbcbacd09a125978659",
      url: "_next/static/chunks/pages/flight-69a9faa9904fe1e8fb94.js",
    },
    {
      revision: "9938e5ac008112dcd353e4df494f2c33",
      url: "_next/static/chunks/pages/flightSearch-bbd00b3784950caca0d7.js",
    },
    {
      revision: "a3febdb52b44926b6393d67dc9fc05dd",
      url: "_next/static/chunks/pages/gteCarSearch-726bbb0a75a39ade5136.js",
    },
    {
      revision: "81f09e2e9df64d6920ff753073c4ba0a",
      url: "_next/static/chunks/pages/gteCountryPage-47c7a18968a831883b2e.js",
    },
    {
      revision: "5ad43efff66e0028c7342888e0fb6682",
      url: "_next/static/chunks/pages/gteFrontPage-b5d1f5155e8ee3c04ddc.js",
    },
    {
      revision: "a480a47802be6c5ac28ca772cf4bfa01",
      url: "_next/static/chunks/pages/gteStay-ca14ea22182f359e70d9.js",
    },
    {
      revision: "c88178e8c4f145b78d581a9f8e7927ea",
      url: "_next/static/chunks/pages/gteStaysSearch-891e87727cfe2c065e0b.js",
    },
    {
      revision: "1f0d32b2ffd87903b397b8c120dc125b",
      url: "_next/static/chunks/pages/index-90201dd44e32c22af5c1.js",
    },
    {
      revision: "4ab2bd3a1a5c527a5449e23a53334050",
      url: "_next/static/chunks/pages/local-4be01e813b1ca7cf0337.js",
    },
    {
      revision: "98552be291fb7d48cb2c3e7828bb4272",
      url: "_next/static/chunks/pages/payment-c1fd378d35f8533b6fa4.js",
    },
    {
      revision: "37407a713789d58c2b8be74b04a64e2f",
      url: "_next/static/chunks/pages/tour-3513943b22fbb5149967.js",
    },
    {
      revision: "57677e2f26abfc1f9e31f59f44c62567",
      url: "_next/static/chunks/pages/tourCategory-27a12de0504767d649fe.js",
    },
    {
      revision: "d1eb35000bbc4df07956321066fcd8f1",
      url: "_next/static/chunks/pages/tourSearch-66752c5b1abfcd37e06f.js",
    },
    {
      revision: "fbf0ec63854fc37c973c8e58d9764ccf",
      url: "_next/static/chunks/pages/travel-2d8cd466919e4059a7d4.js",
    },
    {
      revision: "deed628d73eaa6b1e9280e918b06230b",
      url: "_next/static/chunks/pages/tripPlanner-aef2c3d8b5a865bbc806.js",
    },
    {
      revision: "77d50e7dd9f645f3261ce6234b3ba9eb",
      url: "_next/static/chunks/pages/voucher-babeb1c134e4cfe49027.js",
    },
    {
      revision: "0c9933125c4808c9602e1a78610870e4",
      url: "_next/static/chunks/reactDayPicker.f5d92465ff2974e64e9d.js",
    },
    {
      revision: "69f3618495fe67a50af05a73a74bafed",
      url: "_next/static/chunks/reactSelect.7f8a45d06bcd3d27b1d7.js",
    },
    {
      revision: "878fa2e68aee59d226b01af76d5fb7fb",
      url: "_next/static/chunks/reactSlider.10863e53570028bcd523.js",
    },
    {
      revision: "4ae6d4b09b64a7b9e41fc5586ff0e58f",
      url: "_next/static/chunks/sentry.f9f89bddbabffb064d40.js",
    },
    {
      revision: "011023b9fa67c037db07c5cf38df1c63",
      url: "_next/static/chunks/webpack-af53578b8acca5153644.js",
    },
    {
      revision: "733633d36d55f7f9f529e1df532528cb",
      url: "_next/static/js/baidu-maps/markerClusters.min.js",
    },
    {
      revision: "22a9b4ca23083f5c5ef03449a33a34a8",
      url: "_next/static/mockData/tripPlannerMockMap.html",
    },
  ];
  it("cleanPrecacheManifest", () => {
    expect(getReadableChunkNames(cleanPrecacheManifest(mockManifest))).toEqual([
      "commons",
      "main",
      "pages/_app",
      "pages/accommodationCategory",
      "pages/accommodationProduct",
      "pages/accommodationSearch",
      "pages/article",
      "pages/articleCategory",
      "pages/articleSearch",
      "pages/attraction",
      "pages/bestPlaces",
      "pages/blog",
      "pages/bloggerSearch",
      "pages/car",
      "pages/carCategory",
      "pages/carSearch",
      "pages/flight",
      "pages/flightSearch",
      "pages/gteCarSearch",
      "pages/gteCountryPage",
      "pages/gteStay",
      "pages/gteStaysSearch",
      "pages/local",
      "pages/tour",
      "pages/tourCategory",
      "pages/tourSearch",
      "pages/travel",
      "reactDayPicker",
      "reactSelect",
      "reactSlider",
      "webpack",
    ]);
  });

  it("prepareGTIManifest", () => {
    const cleaned = cleanPrecacheManifest(mockManifest);
    expect(getReadableChunkNames(prepareGTIManifest(cleaned))).toEqual([
      "commons",
      "main",
      "pages/_app",
      "pages/accommodationCategory",
      "pages/accommodationProduct",
      "pages/accommodationSearch",
      "pages/article",
      "pages/articleCategory",
      "pages/articleSearch",
      "pages/attraction",
      "pages/bestPlaces",
      "pages/blog",
      "pages/bloggerSearch",
      "pages/car",
      "pages/carCategory",
      "pages/carSearch",
      "pages/local",
      "pages/tour",
      "pages/tourCategory",
      "pages/tourSearch",
      "pages/travel",
      "reactDayPicker",
      "reactSelect",
      "reactSlider",
      "webpack",
    ]);
  });

  it("prepareGTEManifest", () => {
    const cleaned = cleanPrecacheManifest(mockManifest);
    expect(getReadableChunkNames(prepareGTEManifest(cleaned))).toEqual([
      "commons",
      "main",
      "pages/flight",
      "pages/flightSearch",
      "pages/gteCarSearch",
      "pages/gteCountryPage",
      "pages/gteStay",
      "pages/gteStaysSearch",
      "reactDayPicker",
      "reactSelect",
      "reactSlider",
      "webpack",
    ]);
  });
});
