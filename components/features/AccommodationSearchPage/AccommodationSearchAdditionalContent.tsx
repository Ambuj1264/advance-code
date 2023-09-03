import React, { memo } from "react";

import AccommodationSearchTopCategories from "./AccommodationSearchCategories/AccommodationSearchTopCategories";
import AccommodationDestinations from "./AccommodationSearchCategories/AccommodationDestinations";

import { PageType } from "types/enums";
import SectionRow from "components/ui/Section/SectionRow";
import ProductsGridLazy from "components/ui/ProductsGrid/ProductsGridLazy";
import { GridRow } from "components/ui/Search/SearchList";
import { useCurrencyWithSSR } from "hooks/useLocaleCurrency";
import LazyHydrateWrapper from "components/ui/LazyHydrateWrapper";

const AccommodationSearchAdditionalContent = ({
  isAccommodationCategory,
  slug,
  popularAccommodationsMetadata,
  popularAccommodations,
  onAvailabilityButtonClick,
}: {
  isAccommodationCategory: boolean;
  slug: string;
  popularAccommodationsMetadata?: SharedTypes.QuerySearchMetadata;
  popularAccommodations?: SharedTypes.Product[];
  onAvailabilityButtonClick?: () => void;
}) => {
  const { currencyCode, convertCurrency } = useCurrencyWithSSR();
  const shouldShowPopularAccommodations = popularAccommodations && popularAccommodationsMetadata;

  const AccommodationCategories = <AccommodationSearchTopCategories slug={slug} />;

  return (
    <>
      <LazyHydrateWrapper whenVisible key={slug}>
        {!isAccommodationCategory && AccommodationCategories}
        <AccommodationDestinations slug={slug} />
        {isAccommodationCategory && AccommodationCategories}
      </LazyHydrateWrapper>
      {shouldShowPopularAccommodations && (
        <SectionRow
          title={popularAccommodationsMetadata!.title}
          subtitle={popularAccommodationsMetadata!.subtitle}
          CustomRowWrapper={GridRow}
        >
          <ProductsGridLazy
            products={popularAccommodations!}
            currency={currencyCode}
            convertCurrency={convertCurrency}
            pageType={PageType.ACCOMMODATION}
            columnSizes={{ small: 1, medium: 1 / 2, desktop: 1 / 4 }}
            onAvailabilityButtonClick={onAvailabilityButtonClick}
            hidePrice
          />
        </SectionRow>
      )}
    </>
  );
};

export default memo(AccommodationSearchAdditionalContent);
