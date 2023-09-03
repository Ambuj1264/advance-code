import React from "react";
import { useQuery } from "@apollo/react-hooks";

import StayMetadataQuery from "./queries/StayMetadataQuery.graphql";

import { useSettings } from "contexts/SettingsContext";
import { constructMetadata } from "components/ui/LandingPages/utils/landingPageUtils";
import LazyHydrateWrapper from "components/ui/LazyHydrateWrapper";
import ProductStructuredData from "components/features/SEO/ProductStructuredData";
import useActiveLocale from "hooks/useActiveLocale";
import { GraphCMSPageType, OpenGraphType } from "types/enums";
import GraphCmsSEOContainer from "components/ui/GraphCmsSEOContainer";
import { useCurrencyWithDefault } from "hooks/useCurrency";
import { hreflangLocalesByMarketplace } from "components/ui/LandingPages/utils/hreflangLocalesByMarketplace";

const StaySEOContainer = ({
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
  const { marketplace } = useSettings();
  const locale = useActiveLocale();
  const { convertCurrency, currencyCode } = useCurrencyWithDefault();
  const { data } = useQuery<LandingPageTypes.LandingPageMetadataQueryData>(StayMetadataQuery, {
    variables: {
      where: queryCondition,
      locale,
      hrefLangLocales: hreflangLocalesByMarketplace[marketplace],
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
        funnelType={GraphCMSPageType.StaysProductPage}
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

export default StaySEOContainer;
