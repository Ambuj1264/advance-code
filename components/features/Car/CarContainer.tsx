import React, { useMemo } from "react";
import { useQuery } from "@apollo/react-hooks";
import { useQueryParams } from "use-query-params";
import { addDays } from "date-fns";

import CarProductUrlQuery from "../CarSearchPage/queries/CarProductUrlQuery.graphql";

import CarSearchCategories from "./queries/CarSearchCategories.graphql";
import {
  constructCar,
  constructOffer,
  getCarOfferDate,
  getCarProductUrl,
  getCarSearchUrl,
} from "./utils/carUtils";
import CarOfferQuery from "./queries/CarOfferQuery.graphql";
import CarContent from "./CarContent";
import CarExpiredContainer from "./CarExpiredContainer";
import CarBreadcrumbs from "./CarBreadcrumbs";
import CarQueryParamsScheme from "./queryParams/carQueryParamsScheme";

import { DesktopContainer, MobileContainer } from "components/ui/Grid/Container";
import { cacheOnClient30M } from "utils/apiUtils";
import { useCurrencyWithDefault } from "hooks/useCurrency";
import CustomNextDynamic from "lib/CustomNextDynamic";
import { mapCarProviderIdToCarProvider, constructHeadline } from "utils/sharedCarUtils";
import PageContentContainer from "components/ui/PageContentContainer";
import AdminGearLoader from "components/features/AdminGear/AdminGearLoader";
import { CarProviderId, Marketplace, CarProvider } from "types/enums";
import { getCarAdminLinks } from "components/features/AdminGear/utils";
import { useSettings } from "contexts/SettingsContext";
import BookingWidgetLoadingContainer from "components/ui/BookingWidget/BookingWidgetLoadingContainer";
import { useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";
import ErrorComponent from "components/ui/Error/ErrorComponent";
import useActiveLocale from "hooks/useActiveLocale";
import ProductHeader from "components/ui/ProductHeader";
import ProductPageLoadingContainer from "components/ui/ProductPageLoading/ProductPageLoadingContainer";
import DefaultHeadTags from "lib/DefaultHeadTags";

const CarBookingWidgetChunkContainer = CustomNextDynamic(
  () => import("./CarBookingWidget/CarBookingWidgetChunkContainer"),
  {
    ssr: false,
    loading: () => <BookingWidgetLoadingContainer />,
  }
);

const CarContainer = ({
  id,
  editItem,
  carName,
}: {
  id: string;
  editItem?: number;
  carName: string;
}) => {
  const [queryParams] = useQueryParams(CarQueryParamsScheme);

  const {
    provider: queryProvider = "",
    to: queryTo = "",
    from: queryFrom = "",
    f: queryFromTimestamp = "",
    t: queryToTimestamp = "",
    category: queryCategory = "",
    driverAge: queryDriverAge,
    driverCountryCode: queryDriverCountryCode = "",
    secondOfferId: querySecondOfferId = "",
    pickup_id: queryPickupId = "",
    dropoff_id: queryDropoffId = "",
    pickupLocationName: queryPickupLocationName = "",
    dropoffLocationName: queryDropoffLocationName = "",
    editCarOfferCartId,
  } = queryParams;

  // Default to monolith for the old car search, this can be removed once all marketplaces use new search
  const providerId = queryProvider ? Number(queryProvider) : CarProviderId.MONOLITH;

  const activeLocale = useActiveLocale();
  const { t } = useTranslation(Namespaces.commonCarNs);
  // Used for non carnect included etc
  const { t: carT } = useTranslation(Namespaces.carNs);
  const { t: carnectT } = useTranslation(Namespaces.carnectNs);
  const provider = mapCarProviderIdToCarProvider(providerId);
  const { currencyCode, convertCurrency } = useCurrencyWithDefault();

  const { adminUrl, marketplace } = useSettings();
  const { data: productUrlData } = useQuery<{
    carProductUrl: string;
  }>(CarProductUrlQuery);
  const carProductUrl = getCarProductUrl(marketplace, activeLocale, productUrlData?.carProductUrl);
  const {
    data: offerData,
    error: offerError,
    loading: offerLoading,
  } = useQuery<CarTypes.QueryCarOfferData>(CarOfferQuery, {
    variables: {
      input: {
        offerReference: id.toString(),
        ...(querySecondOfferId
          ? {
              secondOfferReference: querySecondOfferId.toString(),
            }
          : {}),
        provider,
        ...(queryFrom ? { from: queryFrom } : null),
        ...(queryTo ? { to: queryTo } : null),
        pickupLocationId: queryPickupId,
        returnLocationId: queryDropoffId,
        skipTranslate: true,
      },
    },
    context: { headers: cacheOnClient30M },
  });
  const isCarnect = provider === CarProvider.CARNECT;
  const adminLinks = useMemo(() => {
    return offerData?.carOffer?.offer
      ? getCarAdminLinks(
          activeLocale,
          adminUrl,
          id,
          Number(offerData.carOffer.offer.establishment.id),
          isCarnect
        )
      : [];
  }, [activeLocale, adminUrl, id, isCarnect, offerData]);

  const { data: categoryData } = useQuery<{
    searchPageUrl: string;
    searchPageUrlGTI: string;
    carGetSearchCategories: {
      searchCategories: CarTypes.SearchCategory[];
    };
  }>(CarSearchCategories, {
    variables: {
      input: {
        category: queryCategory,
      },
    },
  });
  const carSearchBaseUrl =
    marketplace === Marketplace.GUIDE_TO_ICELAND
      ? categoryData?.searchPageUrlGTI
      : categoryData?.searchPageUrl;

  const carSearchPageUrl = getCarSearchUrl(marketplace, activeLocale, carSearchBaseUrl);

  const searchCategory = categoryData?.carGetSearchCategories?.searchCategories[0];

  const isGTE = marketplace === Marketplace.GUIDE_TO_EUROPE;

  const { clientDate: fromDate, adjustedISODate: fromDateISO } = getCarOfferDate({
    queryDate: queryFrom,
    queryTimestamp: queryFromTimestamp,
    fallbackISODate: offerData?.carOffer.pickupTime,
  });

  const { clientDate: toDate, adjustedISODate: toDateISO } = getCarOfferDate({
    queryDate: queryTo,
    queryTimestamp: queryToTimestamp,
    fallbackISODate: offerData?.carOffer.returnTime,
  });

  // this fallback is likely never happen, as we always supposed to have dates in URL
  // if we don't have dates and the car URL is static one - the carOffer would return preselected dates
  // if we don't have dates and the URL fragment is temporary one - this fallback would be triggered
  // otherwise, we will always display something for next week+7 days.
  const fallbackSimilarCarsDate = new Date(new Date().setUTCHours(10, 0, 0, 0));
  const similarCarsFrom = fromDateISO ?? addDays(fallbackSimilarCarsDate, 7).toISOString();
  const similarCarsTo =
    toDateISO ??
    (addDays(fallbackSimilarCarsDate, 14).toISOString() as SharedTypes.iso8601DateTime);

  const similarCarsProps: CarTypes.SimilarCarsProps = {
    id,
    provider,
    from: similarCarsFrom as string,
    to: similarCarsTo as string,
    pickupId: queryPickupId,
    dropoffId: queryDropoffId,
    driverAge: queryDriverAge,
    driverCountry: queryDriverCountryCode,
    category: queryCategory,
    carName,
    carProductUrl,
    pickupLocationName: queryPickupLocationName,
    dropoffLocationName: queryDropoffLocationName,
  };

  if (offerLoading) return <ProductPageLoadingContainer />;
  if (!offerData || !offerData.carOffer) {
    return <ErrorComponent error={offerError} isRequired componentName="CarContainer" />;
  }

  if (offerError || !offerData.carOffer.offer) {
    return (
      <CarExpiredContainer
        similarCarsProps={similarCarsProps}
        searchCategory={isGTE ? undefined : searchCategory}
        searchPageUrl={carSearchPageUrl}
        isCarnect={isCarnect}
      />
    );
  }
  const { cartLink, searchPageUrl, carOffer } = constructOffer(
    carnectT,
    carT,
    convertCurrency,
    currencyCode,
    carSearchPageUrl,
    offerData
  );

  const {
    includedItems,
    availableExtrasItems,
    availableInsurancesItems,
    pickupId,
    dropoffId,
    deposit,
  } = carOffer;
  const car = constructCar(
    marketplace === Marketplace.GUIDE_TO_ICELAND,
    t,
    carnectT,
    carT,
    convertCurrency,
    currencyCode,
    offerData
  );
  const name = constructHeadline(t, car.cover.name, activeLocale);
  const { title } = offerData?.carOffer ?? { title: name };
  return (
    <>
      <DefaultHeadTags title={title} />
      <DesktopContainer>
        <MobileContainer>
          <CarBreadcrumbs
            id={id}
            carName={car.cover.name}
            isCarnect={isCarnect}
            searchCategory={searchCategory}
            onProductPage
          />
        </MobileContainer>
        <ProductHeader title={name} />
      </DesktopContainer>
      <PageContentContainer>
        <CarContent
          car={car}
          includedItems={includedItems}
          availableExtrasItems={availableExtrasItems}
          availableInsurancesItems={availableInsurancesItems}
          similarCarsProps={similarCarsProps}
          deposit={deposit}
          isCarnect={isCarnect}
          activeLocale={activeLocale}
          searchCategory={isGTE ? undefined : searchCategory}
          searchPageUrl={searchPageUrl}
          useAlternateStaticImageOnly={isGTE}
        />
        <CarBookingWidgetChunkContainer
          provider={provider}
          cartLink={cartLink}
          searchPageUrl={searchPageUrl}
          offerId={offerData?.carOffer.offer.idContext ?? ""}
          from={fromDate!}
          to={toDate!}
          pickupId={pickupId}
          queryPickupId={queryPickupId}
          dropoffId={dropoffId}
          queryDropoffId={queryDropoffId}
          carOffer={carOffer}
          discount={car.discountPercent}
          editItem={editItem}
          driverAge={queryDriverAge}
          driverCountryCode={queryDriverCountryCode}
          title={title}
          queryPickupLocationName={queryPickupLocationName}
          queryDropoffLocationName={queryDropoffLocationName}
          offerDropoffLocationName={car.locationDetails.dropoff.address}
          offerPickupLocationName={car.locationDetails.pickup.address}
          editCarOfferCartId={editCarOfferCartId}
        />
        <AdminGearLoader links={isGTE ? undefined : adminLinks} hideCommonLinks={isCarnect} />
      </PageContentContainer>
    </>
  );
};

export default CarContainer;
