import React from "react";

import GTECommonBreadcrumbs from "./GTECommonBreadcrumbs";

const ProductBreadcrumbs = ({
  breadcrumbs,
  customLastBreadcrumb,
}: {
  breadcrumbs?: SharedTypes.BreadcrumbData[];
  customLastBreadcrumb?: string;
}) => {
  if (!breadcrumbs) return null;
  return (
    <GTECommonBreadcrumbs breadcrumbs={breadcrumbs} customLastBreadcrumb={customLastBreadcrumb} />
  );
};

export default ProductBreadcrumbs;
