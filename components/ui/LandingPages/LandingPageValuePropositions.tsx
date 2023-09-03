import React, { memo } from "react";

import ErrorBoundary from "../ErrorBoundary";
import { ValuePropsWrapper } from "../FrontValuePropositions/FrontValuePropositionsShared";

import ProductPropositions from "components/ui/ProductPropositions";
import Icon from "components/ui/SSRIcon";

const LandingPageValuePropositions = ({
  valueProps,
  maxDesktopColumns = 4,
  className,
}: {
  valueProps: LandingPageTypes.LandingPageValueProposition[];
  maxDesktopColumns?: number;
  className?: string;
}) => {
  const productProps = valueProps.map(valueProp => ({
    title: valueProp.title,
    Icon: Icon(valueProp.icon.svgAsString),
    description: valueProp.description,
  }));
  return (
    <ErrorBoundary>
      <ValuePropsWrapper>
        <ProductPropositions
          productProps={productProps}
          maxDesktopColumns={maxDesktopColumns}
          useTruncationIcon={false}
          className={className}
        />
      </ValuePropsWrapper>
    </ErrorBoundary>
  );
};

export default memo(LandingPageValuePropositions);
