import React from "react";
import styled from "@emotion/styled";

import ErrorBoundary from "../ErrorBoundary";

import SimilarProductsWrapper from "./SimilarProductsWrapper";

import { useTranslation } from "i18n";
import { useCurrencyWithDefault } from "hooks/useCurrency";
import SectionRowSeeAll from "components/ui/Section/SectionRowSeeAll";
import { PageType } from "types/enums";
import { gutters } from "styles/variables";

const StyledSectionRowSeeAll = styled(SectionRowSeeAll)`
  margin-top: ${gutters.small / 4}px;
`;

const SimilarProducts = ({
  similarProducts,
  seeMoreLink,
  searchPageType,
  className,
}: {
  similarProducts: SharedTypes.SimilarProduct[];
  seeMoreLink?: string;
  searchPageType: PageType;
  className?: string;
}) => {
  const { currencyCode, convertCurrency } = useCurrencyWithDefault();
  const { t } = useTranslation();
  return (
    <ErrorBoundary>
      <SimilarProductsWrapper
        similarProducts={similarProducts}
        currencyCode={currencyCode}
        convertCurrency={convertCurrency}
        className={className}
      />
      {seeMoreLink && (
        <StyledSectionRowSeeAll
          categoryLink={seeMoreLink}
          categoryLinkTitle={t("Search all")}
          categoryLinkPageType={searchPageType}
        />
      )}
    </ErrorBoundary>
  );
};

export default SimilarProducts;
