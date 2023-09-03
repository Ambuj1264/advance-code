import React from "react";

import { GridRow } from "components/ui/Search/SearchList";
import SectionRow from "components/ui/Section/SectionRow";
import ProductsGridLazy from "components/ui/ProductsGrid/ProductsGridLazy";
import { PageType, Marketplace } from "types/enums";
import { useCurrencyWithSSR } from "hooks/useLocaleCurrency";
import { useSettings } from "contexts/SettingsContext";

const StaticTourListContainer = ({
  topHolidayTours,
  newestTours,
  newestToursMetadata,
  topHolidayToursMetadata,
}: {
  topHolidayTours: SharedTypes.Product[];
  newestTours: SharedTypes.Product[];
  newestToursMetadata: SharedTypes.QuerySearchMetadata;
  topHolidayToursMetadata: SharedTypes.QuerySearchMetadata;
}) => {
  const { marketplace } = useSettings();
  const { currencyCode, convertCurrency } = useCurrencyWithSSR();

  return (
    <>
      <SectionRow
        title={topHolidayToursMetadata.title}
        subtitle={topHolidayToursMetadata.subtitle}
        CustomRowWrapper={GridRow}
      >
        <ProductsGridLazy
          products={topHolidayTours}
          currency={currencyCode}
          convertCurrency={convertCurrency}
          pageType={PageType.TOUR}
        />
      </SectionRow>

      {marketplace !== Marketplace.ICELAND_PHOTO_TOURS && (
        <SectionRow
          title={newestToursMetadata.title}
          subtitle={newestToursMetadata.subtitle}
          CustomRowWrapper={GridRow}
        >
          <ProductsGridLazy
            products={newestTours}
            currency={currencyCode}
            convertCurrency={convertCurrency}
            pageType={PageType.TOUR}
          />
        </SectionRow>
      )}
    </>
  );
};

export default StaticTourListContainer;
