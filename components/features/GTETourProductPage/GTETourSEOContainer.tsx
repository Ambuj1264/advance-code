import React from "react";
import { useQuery } from "@apollo/react-hooks";

import { hreflangLocalesByMarketplace } from "../../ui/LandingPages/utils/hreflangLocalesByMarketplace";

import GTETourMetadataQuery from "./queries/GTETourMetadataQuery.graphql";

import { constructMetadata } from "components/ui/LandingPages/utils/landingPageUtils";
import LazyHydrateWrapper from "components/ui/LazyHydrateWrapper";
import ProductStructuredData from "components/features/SEO/ProductStructuredData";
import useActiveLocale from "hooks/useActiveLocale";
import { OpenGraphType, GraphCMSPageType, Marketplace } from "types/enums";
import GraphCmsSEOContainer from "components/ui/GraphCmsSEOContainer";
import { useCurrencyWithDefault } from "hooks/useCurrency";
import { normalizeGraphCMSLocale } from "utils/helperUtils";

const GTETourSEOContainer = ({
  queryCondition,
  isIndexed = false,
  fromPrice,
  metadataUri,
  pagePlace,
  review,
}: {
  queryCondition: LandingPageTypes.LandingPageQueryCondition;
  isIndexed?: boolean;
  fromPrice: number;
  metadataUri: string;
  pagePlace?: LandingPageTypes.Place;
  review?: {
    totalScore: number;
    totalCount: number;
  };
}) => {
  const locale = useActiveLocale();
  const { convertCurrency, currencyCode } = useCurrencyWithDefault();
  const { data } = useQuery<LandingPageTypes.LandingPageMetadataQueryData>(GTETourMetadataQuery, {
    variables: {
      where: queryCondition,
      locale: [normalizeGraphCMSLocale(locale)],
      hrefLangLocales: hreflangLocalesByMarketplace[Marketplace.GUIDE_TO_EUROPE],
    },
  });

  if (!data?.metadata?.[0]) {
    return null;
  }

  const metadata = constructMetadata(data?.metadata?.[0]);
  const metadataWithReview = {
    ...metadata,
    review,
  };
  return (
    <>
      <GraphCmsSEOContainer
        metadata={metadataWithReview}
        isIndexed={isIndexed}
        ogImages={metadata.images}
        openGraphType={OpenGraphType.PRODUCT}
        funnelType={GraphCMSPageType.TourProductPage}
        pagePlace={pagePlace}
      />
      <LazyHydrateWrapper ssrOnly>
        <ProductStructuredData
          name={metadata.metadataTitle}
          description={metadata.metadataDescription}
          images={metadata.images}
          path={metadataUri}
          establishmentName=""
          localePrice={convertCurrency(fromPrice)}
          localeCurrency={currencyCode}
        />
      </LazyHydrateWrapper>
    </>
  );
};

export default GTETourSEOContainer;
