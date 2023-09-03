import React from "react";

import TopTravelPlansSkeleton from "./TopTravelPlansSkeleton";

import SectionRow from "components/ui/Section/SectionRow";
import ProductsGridLazy from "components/ui/ProductsGrid/ProductsGridLazy";
import { PageType } from "types/enums";
import { Namespaces } from "shared/namespaces";
import { useTranslation } from "i18n";
import { GridRow } from "components/ui/Search/SearchList";
import { useCurrencyWithSSR } from "hooks/useLocaleCurrency";
import useCurrency from "hooks/useCurrency";

const TopTravelPlansContainer = ({
  bestTravelPlanTours,
  metadata,
  loading = false,
}: {
  bestTravelPlanTours: SharedTypes.Product[];
  metadata: SharedTypes.PageSectionMetadata;
  loading?: boolean;
}) => {
  const { currencyCode, convertCurrency } = useCurrencyWithSSR();
  const { t } = useTranslation(Namespaces.countryNs);
  const { isCurrencyEmpty } = useCurrency();

  if (bestTravelPlanTours.length === 0) return null;
  return loading ? (
    <TopTravelPlansSkeleton />
  ) : (
    <SectionRow
      title={metadata.title}
      subtitle={metadata.subtitle}
      categoryLink={metadata.url}
      categoryLinkTitle={t(`See all travel plans`)}
      categoryLinkPageType={PageType.TOURCATEGORY}
      CustomRowWrapper={GridRow}
      dataTestid="top-travel-plans-wrapper"
    >
      <ProductsGridLazy
        products={bestTravelPlanTours}
        currency={currencyCode}
        convertCurrency={convertCurrency}
        pageType={PageType.TOUR}
        isPriceLoading={isCurrencyEmpty}
      />
    </SectionRow>
  );
};

export default TopTravelPlansContainer;
