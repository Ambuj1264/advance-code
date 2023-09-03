import React from "react";

const ProductCarouselSchema = ({ products }: { products: SEOTypes.Product[] }) => {
  const itemListElement = products.map(({ url }, index) => ({
    "@type": "ListItem",
    position: index + 1,
    url,
  }));

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ItemList",
          itemListElement,
        }),
      }}
    />
  );
};

export default ProductCarouselSchema;
