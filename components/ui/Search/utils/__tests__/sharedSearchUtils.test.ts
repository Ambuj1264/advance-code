import { getProductClientRoute } from "../sharedSearchUtils";

import { PageType } from "types/enums";

const mockProduct = {
  id: 1111,
  image: {
    id: "imageid",
    url: "imageUrl",
    name: "image name",
  },
  linkUrl: "product/productLink",
  slug: "",
  headline: "headline",
  description: "product description",
  averageRating: 4.45,
  reviewsCount: 199,
  price: 11111,
  totalSaved: 10,
  ssrPrice: 11111,
  props: [],
  specs: [],
};

describe("getProductClientRoute", () => {
  test("should construct product client route from clientRoute prop", () => {
    const mockProductClientRoute = {
      query: {
        category: "Small",
        driverAge: "45",
        driverCountryCode: "IS",
        dropoffLocationName: "Keflavík, Iceland",
        dropoff_id: "1170,1",
        f: "1633935600",
        pickupLocationName: "Keflavík, Iceland",
        pickup_id: "1170,1",
        provider: "1",
        t: "1634022000",
        carId: "Exh9eedlQ0SkHvFuhskpJg-134",
      },
      route: "/car",
      as: "/car-rental/search-results/book/volkswagen-golf/Exh9eedlQ0SkHvFuhskpJg-134?f=1633935600&t=1634022000&pickup_id=1170,1&dropoff_id=1170,1&provider=1&driverAge=45&driverCountryCode=IS&category=Small&pickupLocationName=Keflavík, Iceland&dropoffLocationName=Keflavík, Iceland",
    };
    expect(
      getProductClientRoute(
        {
          ...mockProduct,
          clientRoute: mockProductClientRoute,
        },
        PageType.CARSEARCH
      )
    ).toEqual({
      as: mockProductClientRoute.as,
      route: mockProductClientRoute.route,
      query: {
        ...mockProductClientRoute.query,
        title: mockProduct.headline,
      },
    });
  });

  test("should construct product client route in case if product without clientRoute and without slug", () => {
    expect(getProductClientRoute(mockProduct, PageType.ACCOMMODATION_CATEGORY)).toEqual({
      as: "/productLink",
      query: {
        slug: "productLink",
        title: mockProduct.headline,
      },
      route: "/accommodationCategory",
    });
  });

  test("should construct product client route in case if product without clientRoute and with slug", () => {
    expect(
      getProductClientRoute(
        {
          ...mockProduct,
          slug: "productSlug",
        },
        PageType.ACCOMMODATION_CATEGORY
      )
    ).toEqual({
      as: "/productLink",
      query: {
        slug: "productSlug",
        title: mockProduct.headline,
      },
      route: "/accommodationCategory",
    });
  });
});
