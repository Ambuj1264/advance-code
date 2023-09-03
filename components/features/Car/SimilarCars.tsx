import React from "react";
import dateFnsParse from "date-fns/parse";
import { useQuery } from "@apollo/react-hooks";

import CarSearchQuery from "../CarSearchPage/queries/CarSearchQuery.graphql";

import { constructSimilarCars, constructCarSearchParams } from "./utils/carUtils";

import { noCacheHeaders } from "utils/apiUtils";
import { isoFormat } from "utils/dateUtils";
import { MobileContainer } from "components/ui/Grid/Container";
import Section from "components/ui/Section/Section";
import SectionContent from "components/ui/Section/SectionContent";
import { LeftSectionHeading } from "components/ui/Section/SectionHeading";
import { Trans, useTranslation } from "i18n";
import SimilarProducts from "components/ui/SimilarProducts/SimilarProducts";
import SimilarProductsLoading from "components/ui/SimilarProducts/SimilarProductsLoading";
import { Namespaces } from "shared/namespaces";
import { useSettings } from "contexts/SettingsContext";
import { Marketplace, PageType } from "types/enums";
import { useCurrencyWithSSR } from "hooks/useLocaleCurrency";
import useActiveLocale from "hooks/useActiveLocale";

const SimilarCars = ({
  similarCarsProps,
  searchCategory,
  searchPageUrl,
}: {
  similarCarsProps: CarTypes.SimilarCarsProps;
  searchCategory?: CarTypes.SearchCategory;
  searchPageUrl?: string;
}) => {
  const { marketplace } = useSettings();
  const { t } = useTranslation(Namespaces.commonCarNs);
  const { currencyCode, convertCurrency } = useCurrencyWithSSR();
  const activeLocale = useActiveLocale();

  const {
    provider,
    from,
    to,
    pickupId,
    dropoffId,
    driverCountry,
    driverAge,
    category,
    carProductUrl,
    pickupLocationName,
    dropoffLocationName,
  } = similarCarsProps;

  const { data, loading } = useQuery<CarSearchTypes.QueryCarsSearch>(CarSearchQuery, {
    variables: {
      input: {
        from,
        to,
        pickupLocationId: pickupId,
        returnLocationId: dropoffId,
        driverAge: String(driverAge),
        sourceCountry: driverCountry,
        provider: provider.toUpperCase(),
        filters: { category },
        skipTranslate: true,
      },
    },
    context: {
      headers: {
        ...noCacheHeaders,
      },
    },
  });
  // eslint-disable-next-line functional/immutable-data
  const similarCars = constructSimilarCars(
    {
      selectedDates: {
        from: dateFnsParse(from, isoFormat, new Date()),
        to: dateFnsParse(to, isoFormat, new Date()),
      },
      pickupId,
      dropoffId,
      pickupLocationName,
      dropoffLocationName,
    },
    t,
    marketplace,
    carProductUrl,
    convertCurrency,
    currencyCode,
    activeLocale,
    data?.carOffers?.offers ?? []
  ).slice(0, 3);
  const carSearchPageType = searchCategory ? PageType.CARSEARCHCATEGORY : PageType.CARSEARCH;

  if (similarCars.length === 0) return null;

  return (
    <Section key="similarCars" id="similarCars">
      <MobileContainer>
        <LeftSectionHeading>
          <Trans ns={Namespaces.carNs}>Similar cars</Trans>
        </LeftSectionHeading>
        <SectionContent>
          {loading ? (
            <SimilarProductsLoading />
          ) : (
            <SimilarProducts
              similarProducts={similarCars}
              seeMoreLink={`${
                searchCategory && searchPageUrl
                  ? `${searchPageUrl}/${searchCategory.uri}${constructCarSearchParams(
                      similarCarsProps
                    )}`
                  : `${searchPageUrl}${constructCarSearchParams(similarCarsProps)}`
              }`}
              searchPageType={
                marketplace === Marketplace.GUIDE_TO_EUROPE
                  ? PageType.GTE_CAR_SEARCH
                  : carSearchPageType
              }
            />
          )}
        </SectionContent>
      </MobileContainer>
    </Section>
  );
};

export default SimilarCars;
