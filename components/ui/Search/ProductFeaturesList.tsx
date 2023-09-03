import React, { useRef, useState, useEffect } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import Tooltip from "../Tooltip/Tooltip";
import { isValueTruncated } from "../utils/uiUtils";

import ProductFeature from "components/ui/Search/ProductFeature";
import { gutters } from "styles/variables";

// TODO: remove isVPResults when implementing new design.
const ItemFeatureStyled = styled(ProductFeature, {
  shouldForwardProp: () => true,
})<{ isVPResults?: boolean }>([
  ({ isVPResults = false }) => css`
    margin-right: ${gutters.small + gutters.small / 2}px;
    vertical-align: text-bottom;
    ${isVPResults &&
    `
      @media (min-width: 1140px) and (max-width: 1280px) {
      &:nth-of-type(3) {
        display: none;
      }
    }`}
  `,
]);

const FeatureItemWithTruncation = ({
  productProp,
  className,
  isTileCard,
  truncateTextTrigger = "",
  isVPResults = false,
}: {
  className?: string;
  isTileCard?: boolean;
  shouldTruncateText?: boolean;
  truncateTextTrigger?: string;
  productProp: SharedTypes.ProductProp;
  isVPResults?: boolean;
}) => {
  const [truncate, setTruncate] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    let timeout: number;
    if (ref.current && productProp.title && truncateTextTrigger) {
      // making a timeout ensures the browser applies proper offsetWidth/scrollWidth
      // for the price value in DOM while processing the styles
      timeout = window.setTimeout(() => setTruncate(isValueTruncated(ref)), 250);
      setTruncate(isValueTruncated(ref));
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [isTileCard, productProp.title, ref, truncateTextTrigger]);

  if (truncate) {
    return (
      <Tooltip
        title={
          productProp.description
            ? `${productProp.title} - ${productProp.description}`
            : productProp.title
        }
        isCustomTooltipWrapperAvailable={isTileCard}
        fullWidth
      >
        <ItemFeatureStyled className={className} {...productProp} ref={ref} />
      </Tooltip>
    );
  }

  if (productProp.description) {
    return (
      <Tooltip
        title={productProp.description}
        isCustomTooltipWrapperAvailable={isTileCard}
        direction="center"
        tooltipWidth={170}
      >
        <ItemFeatureStyled
          className={className}
          {...productProp}
          ref={ref}
          isVPResults={isVPResults}
        />
      </Tooltip>
    );
  }

  return (
    <ItemFeatureStyled className={className} {...productProp} ref={ref} isVPResults={isVPResults} />
  );
};

const ProductFeaturesList = ({
  className,
  productProps,
  isTileCard = false,
  truncateTextTrigger = "",
  isVPResults = false,
}: {
  className?: string;
  isTileCard?: boolean;
  productProps: SharedTypes.ProductProp[];
  truncateTextTrigger?: string;
  isVPResults?: boolean;
}) => {
  return (
    <>
      {productProps.slice(0, 4).map(productProp => (
        <FeatureItemWithTruncation
          className={className}
          key={productProp.title}
          isTileCard={isTileCard}
          productProp={productProp}
          truncateTextTrigger={truncateTextTrigger}
          isVPResults={isVPResults}
        />
      ))}
    </>
  );
};

export default ProductFeaturesList;
