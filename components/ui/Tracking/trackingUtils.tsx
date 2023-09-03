/* eslint-disable functional/immutable-data */
import { declareDataLayer } from "./declareDataLayer";

import { Marketplace, Product, SupportedCurrencies } from "types/enums";

export const getIdOfProductType = (id: string, category: Product) => {
  switch (category) {
    case Product.CAR:
      return `cars-${id}`;
    case Product.STAY:
    case Product.GTEStay:
      return `stays-${id}`;
    case Product.TOUR:
    case Product.GTETour:
      return `tours-${id}`;
    case Product.FLIGHT:
      return `flights-${id}`;
    case Product.VacationPackage:
      return `vp-${id}`;
    case Product.CUSTOM:
      return `customs-${id}`;
    default:
      return id;
  }
};

export const addToCartDataLayerPush = (
  currencyCode: string,
  name: string,
  id: number,
  price: number
) => {
  declareDataLayer();
  // eslint-disable-next-line no-unused-expressions, functional/immutable-data
  window.dataLayer.push?.({
    event: "addToCart",
    ecommerce: {
      currencyCode,
      add: {
        products: [
          {
            name,
            id: `tours-${id}`,
            price,
          },
        ],
      },
    },
  });
};

export const productDetailsDataLayerPush = ({
  name,
  id,
  price,
  category,
}: {
  name: string;
  id: string;
  price: number;
  category: Product;
}) => {
  declareDataLayer();
  window.dataLayer.push?.({
    ecommerce: {
      detail: {
        products: [
          {
            name,
            id: getIdOfProductType(id, category),
            price,
            category,
          },
        ],
      },
    },
  });
};

export const selectedLanguageDataLayerPush = (selectedLanguage: string) => {
  declareDataLayer();
  window.dataLayer.push({
    selectedLanguage,
  });
};

export type DatalayerProduct = {
  id: string;
  cartItemId?: string;
  price: string;
  name: string;
  productType: Product;
  marketplace: Marketplace;
};

const constructDatalayerItem = ({
  name,
  price,
  id,
  productType,
  marketplace,
}: DatalayerProduct) => ({
  item_name: name,
  item_id: getIdOfProductType(id, productType),
  price,
  item_brand: marketplace,
  item_category: productType,
  quantity: 1,
});

export const constructProductsWithRevenue = ({
  products,
  bookedProducts,
}: {
  products: DatalayerProduct[];
  bookedProducts?: CartTypes.CheckoutBookedProducts[];
}) => {
  if (!bookedProducts?.length) {
    return {
      products,
      totalRevenue: "0",
    };
  }
  const totalRevenue = bookedProducts
    .reduce((result, currentProduct) => result + currentProduct.revenue, 0 as number)
    .toString();

  return {
    products: products.map(productItem => ({
      ...productItem,
      price: productItem.cartItemId
        ? bookedProducts
            .find(product => product.cartItemId === productItem.cartItemId)
            ?.revenue?.toString() ?? "0"
        : "0",
    })),
    totalRevenue,
  };
};

export const datalayerProductView = (product: DatalayerProduct, currency: SupportedCurrencies) => {
  declareDataLayer();
  window.dataLayer.push({
    event: "view_item",
    ecommerce: {
      items: [constructDatalayerItem(product)],
      currency,
    },
  });
};

export const datalayerAddProductToCart = (
  product: DatalayerProduct,
  currency: SupportedCurrencies
) => {
  declareDataLayer();
  window.dataLayer.push({
    event: "add_to_cart",
    ecommerce: {
      items: [constructDatalayerItem(product)],
      currency,
    },
  });
};

export const datalayerRemoveProductFromCart = (product: DatalayerProduct) => {
  const item = constructDatalayerItem(product);
  declareDataLayer();
  // Legacy event for old GA
  window.dataLayer.push({ ecommerce: null }); // Clear the previous ecommerce object.
  window.dataLayer.push({
    event: "removeFromCart",
    ecommerce: {
      remove: {
        products: [
          {
            name: item.item_name,
            id: item.item_id,
            price: item.price,
            brand: item.item_brand,
            category: item.item_category,
            quantity: 1,
          },
        ],
      },
    },
  });
  // GA4 event
  window.dataLayer.push({
    event: "remove_from_cart",
    ecommerce: {
      items: [item],
    },
  });
};

// Checkout

export const datalayerBeginCheckout = (products: DatalayerProduct[]) => {
  declareDataLayer();
  window.dataLayer.push({
    event: "begin_checkout",
    ecommerce: {
      items: products.map(product => constructDatalayerItem(product)),
    },
  });
};

export const datalayerPurchase = ({
  paymentId,
  currency,
  products,
  bookedProducts,
}: {
  paymentId: string;
  currency: SupportedCurrencies;
  products: DatalayerProduct[];
  bookedProducts?: CartTypes.CheckoutBookedProducts[];
}) => {
  declareDataLayer();
  const { products: productsWithRevenue, totalRevenue } = constructProductsWithRevenue({
    products,
    bookedProducts,
  });
  const dataLayerProducts = productsWithRevenue.map(constructDatalayerItem);

  window.dataLayer.push({ ecommerce: null });
  // Google tag manager event
  window.dataLayer.push({
    event: "purchase",
    ecommerce: {
      transaction_id: paymentId,
      value: totalRevenue,
      currency: bookedProducts?.length ? bookedProducts[0].currency : currency,
      items: dataLayerProducts,
    },
  });
};
