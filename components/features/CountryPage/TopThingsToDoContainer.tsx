import React from "react";

import TopTravelPlansSkeleton from "./TopTravelPlansContainer/TopTravelPlansSkeleton";

import SectionRow from "components/ui/Section/SectionRow";
import ProductsGridLazy from "components/ui/ProductsGrid/ProductsGridLazy";
import { PageType } from "types/enums";
import { Namespaces } from "shared/namespaces";
import { useTranslation } from "i18n";
import { GridRow } from "components/ui/Search/SearchList";
import { useCurrencyWithSSR } from "hooks/useLocaleCurrency";
import useCurrency from "hooks/useCurrency";

const TopThingsToDoContainer = ({
  topThingsToDo,
  metadata,
  loading = false,
}: {
  topThingsToDo: SharedTypes.Product[];
  metadata: SharedTypes.PageSectionMetadata;
  loading?: boolean;
}) => {
  const { currencyCode, convertCurrency } = useCurrencyWithSSR();
  const { t } = useTranslation(Namespaces.countryNs);
  const { isCurrencyEmpty } = useCurrency();
  if (topThingsToDo.length === 0) return null;
  return loading ? (
    <TopTravelPlansSkeleton products={8} />
  ) : (
    <SectionRow
      title={metadata.title}
      subtitle={metadata.subtitle}
      categoryLink={metadata.url}
      categoryLinkTitle={t(`See all tours`)}
      categoryLinkPageType={PageType.TOURSEARCH}
      CustomRowWrapper={GridRow}
      dataTestid="top-tours-container"
    >
      <ProductsGridLazy
        products={topThingsToDo}
        pageType={PageType.TOUR}
        currency={currencyCode}
        convertCurrency={convertCurrency}
        isPriceLoading={isCurrencyEmpty}
      />
    </SectionRow>
  );
};

export default TopThingsToDoContainer;
