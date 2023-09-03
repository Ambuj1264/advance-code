import React from "react";

import VPLoadingCardsRow from "../VPLoadingCardsRow";

import VPStayProductCard from "./VPStayProductCard";

import ProductCardRow from "components/ui/ProductCardRow";

const VPDayContent = ({
  loading,
  data,
  day,
}: {
  loading: boolean;
  data: VacationPackageTypes.VacationPackageStayProduct[];
  day: number;
}) => {
  if (loading) {
    return <VPLoadingCardsRow />;
  }
  if (!data || data.length === 0) {
    return null;
  }
  return (
    <ProductCardRow>
      {data.map((stay, i) => (
        <VPStayProductCard stay={stay} day={day} productsCount={data.length} stayIndex={i} />
      ))}
    </ProductCardRow>
  );
};

export default VPDayContent;
