import { constructProductsWithRevenue } from "../trackingUtils";

import { Marketplace, Product } from "types/enums";

describe("tracking utils test", () => {
  const products = [
    {
      id: "cars-1",
      cartItemId: "cars-1",
      price: "5500",
      name: "Toyota Aygo 2019 manual",
      productType: Product.CAR,
      marketplace: Marketplace.GUIDE_TO_ICELAND,
    },
    {
      id: "tour-1",
      cartItemId: "tour-1",
      price: "15600",
      name: "Tour Name",
      productType: Product.TOUR,
      marketplace: Marketplace.GUIDE_TO_ICELAND,
    },
  ];

  it("should return products with revenue", () => {
    const bookedProducts = [
      {
        cartItemId: "cars-1",
        revenue: 550,
        currency: "",
      },
      {
        cartItemId: "tour-1",
        revenue: 1100,
        currency: "",
      },
    ];
    expect(constructProductsWithRevenue({ products, bookedProducts })).toEqual({
      products: [
        {
          ...products[0],
          price: String(bookedProducts[0].revenue),
        },
        {
          ...products[1],
          price: String(bookedProducts[1].revenue),
        },
      ],
      totalRevenue: "1650",
    });
  });

  it("should return default products in case when bookedProducts in empty", () => {
    expect(constructProductsWithRevenue({ products, bookedProducts: undefined })).toEqual({
      products,
      totalRevenue: "0",
    });
  });

  it("should return products with 0 revenue in case when bookedProducts doesn't contain the right product.", () => {
    expect(
      constructProductsWithRevenue({
        products,
        bookedProducts: [
          {
            cartItemId: "cars-123123",
            revenue: 100,
            currency: "",
          },
        ],
      })
    ).toEqual({
      products: [
        {
          ...products[0],
          price: "0",
        },
        {
          ...products[1],
          price: "0",
        },
      ],
      totalRevenue: "100",
    });
  });
});
