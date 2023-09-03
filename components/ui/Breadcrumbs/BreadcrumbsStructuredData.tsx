import React from "react";

const BreadcrumbsStructuredData = ({ items }: { items: SharedTypes.BreadcrumbData[] }) => (
  <script
    type="application/ld+json"
    // eslint-disable-next-line react/no-danger
    dangerouslySetInnerHTML={{
      __html: JSON.stringify({
        "@context": "https://schema.org/",
        "@type": "BreadcrumbList",
        itemListElement: items.map((breadcrumb, index) => ({
          "@type": "ListItem",
          name: breadcrumb.name,
          item: breadcrumb.url,
          position: index + 1,
        })),
      }),
    }}
  />
);

export default BreadcrumbsStructuredData;
