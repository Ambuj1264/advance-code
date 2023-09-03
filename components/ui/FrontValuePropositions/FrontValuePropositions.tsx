import React, { memo, useMemo } from "react";
import { useQuery } from "@apollo/react-hooks";

import ErrorBoundary from "../ErrorBoundary";

import FrontValuePropsQuery from "./FrontValuePropsQuery.graphql";
import FrontValuePropositionsSkeleton from "./FrontValuePropositionsSkeleton";
import { ValuePropsWrapper } from "./FrontValuePropositionsShared";

import ProductPropositions from "components/ui/ProductPropositions";
import { constructProductProps } from "components/ui/utils/uiUtils";
import { Product } from "types/enums";

const FrontValuePropositions = ({
  className,
  count = 4,
  id = "pageValueProps",
  productType,
}: {
  className?: string;
  count?: number;
  id?: string;
  productType?: Product;
}) => {
  const { data, error, loading } = useQuery<{
    frontValueProps: SharedTypes.QueryProductProp[];
  }>(FrontValuePropsQuery, {
    variables: productType ? { product_type: productType } : {},
  });
  const productProps = useMemo(
    () => data && constructProductProps(data.frontValueProps).slice(0, count),
    [count, data]
  );

  if (loading) return <FrontValuePropositionsSkeleton />;
  if (!productProps || error) return null;

  return (
    <ErrorBoundary>
      <ValuePropsWrapper id={id} className={className}>
        <ProductPropositions
          productProps={productProps}
          maxDesktopColumns={count}
          useTruncationIcon={false}
        />
      </ValuePropsWrapper>
    </ErrorBoundary>
  );
};

export default memo(FrontValuePropositions);
