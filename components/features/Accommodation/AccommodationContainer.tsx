import React, { useMemo } from "react";
import { useQuery } from "@apollo/react-hooks";

import { constructGTIStaticRooms } from "../StayProductPage/utils/stayUtils";

import AccommodationQuery from "./queries/AccommodationQuery.graphql";
import AccommodationContent from "./AccommodationContent";
import { constructAccommodation, constructAccommodationSections } from "./utils/accommodationUtils";
import GetAccommodationNearByPoints from "./queries/AccommodationNearbyQuery.graphql";

import StayBookingWidgetStateContextProviderContainer from "components/features/StayProductPage/StayBookingWidget/StayBookingWidgetStateContextProviderContainer";
import BreadcrumbsContainer from "components/ui/Breadcrumbs/BreadcrumbsContainer";
import { DesktopContainer, MobileContainer } from "components/ui/Grid/Container";
import CustomNextDynamic from "lib/CustomNextDynamic";
import ProductStructuredData from "components/features/SEO/ProductStructuredData";
import DefaultHeadTags from "lib/DefaultHeadTags";
import SEO from "components/features/SEO/SEO";
import PageContentContainer from "components/ui/PageContentContainer";
import BookingWidgetLoadingContainer from "components/ui/BookingWidget/BookingWidgetLoadingContainer";
import AdminGearLoader from "components/features/AdminGear/AdminGearLoader";
import { useSettings } from "contexts/SettingsContext";
import { OpenGraphType, PageType, SupportedLanguages } from "types/enums";
import { getAccommodationAdminLinks } from "components/features/AdminGear/utils";
import ProductPageLoadingContainer from "components/ui/ProductPageLoading/ProductPageLoadingContainer";
import useActiveLocale from "hooks/useActiveLocale";
import { constructHrefLangs } from "components/features/SEO/utils/SEOUtils";
import ErrorComponent from "components/ui/Error/ErrorComponent";
import LazyHydrateWrapper from "components/ui/LazyHydrateWrapper";
import { useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";
import ProductHeader from "components/ui/ProductHeader";
import useAccommodationSearchQueryParams from "components/features/AccommodationSearchPage/utils/useAccommodationSearchQueryParams";
import { getOccupanciesFromGuests } from "components/ui/RoomAndGuestPicker/utils/roomAndGuestUtils";
import usePageMetadata from "hooks/usePageMetadata";
import { asPathWithoutQueryParams } from "utils/routerUtils";
import { getCnSubdomainUrl } from "utils/apiUtils";

const AccomodationBookingWidgetChunkContainer = CustomNextDynamic(
  () => import("./AccommodationBookingWidget/AccommodationBookingWidgetChunkContainer"),
  {
    ssr: false,
    loading: () => <BookingWidgetLoadingContainer />,
  }
);

const AccommodationContainer = ({ title, slug }: { title: string; slug: string }) => {
  const [decodedValue] = useAccommodationSearchQueryParams();
  const { rooms: roomCount, adults, children } = decodedValue;
  const occupancies = getOccupanciesFromGuests(roomCount || 1, adults || 2, children || []);

  const pageMeta = usePageMetadata({});

  const activeLocale = useActiveLocale();
  const { t } = useTranslation(Namespaces.accommodationNs);
  const { adminUrl, marketplaceUrl, host } = useSettings();
  const { error, data, loading } = useQuery<AccommodationTypes.QueryAccommodationData>(
    AccommodationQuery,
    {
      variables: { slug, locale: activeLocale },
    }
  );

  const accommodationData = data?.accommodation;

  const { data: nearbyData } = useQuery<{
    getNearbyPoints: SharedTypes.MapPoint[];
  }>(GetAccommodationNearByPoints, {
    variables: {
      latitude: accommodationData?.latitude,
      longitude: accommodationData?.longitude,
    },
    skip: !accommodationData,
  });
  const adminLinks = useMemo(() => {
    if (accommodationData) {
      return getAccommodationAdminLinks(activeLocale, adminUrl, accommodationData);
    }
    return [];
  }, [activeLocale, adminUrl, accommodationData]);

  if (loading) {
    return <ProductPageLoadingContainer title={title} />;
  }

  if (error || !data || !data.accommodation) {
    return (
      <ErrorComponent
        error={error}
        isRequired
        LoadingComponent={ProductPageLoadingContainer}
        componentName="AccommodationContainer"
      />
    );
  }

  const accommodation = constructAccommodation(data.accommodation, t, nearbyData?.getNearbyPoints);
  const {
    cover,
    category: accommodationCategory,
    name,
    url,
    localePrice,
    props,
    specs,
    reviewTotalCount,
    reviewTotalScore,
    showReviews,
    minDays,
    rooms,
  } = accommodation;
  const accommodationSections = constructAccommodationSections(accommodation);
  const pageUrl = `${marketplaceUrl}${url}`;
  const { translations, establishment, metadata } = data.accommodation;
  const staticRooms = constructGTIStaticRooms(t, rooms);
  const canonicalUrlInEnLocale = pageMeta?.pageMetadata.hreflangs.find(
    lang => lang.locale === SupportedLanguages.English
  )?.uri;
  const hrefLangs = constructHrefLangs(translations, host, activeLocale);

  return (
    <>
      <DefaultHeadTags title={metadata.title} />
      <SEO
        title={metadata.title}
        description={metadata.description}
        isIndexed={data.accommodation.isIndexed}
        hreflangs={hrefLangs}
        images={cover.images}
        openGraphType={OpenGraphType.PRODUCT}
        alternateCanonicalUrl={canonicalUrlInEnLocale}
        alternateCanonicalUrlForCnLocale={canonicalUrlInEnLocale}
        alternateOpenGraphUrlForActiveLocale={getCnSubdomainUrl(
          asPathWithoutQueryParams(url),
          marketplaceUrl,
          activeLocale
        )}
      />
      <LazyHydrateWrapper ssrOnly>
        <ProductStructuredData
          name={name}
          description={metadata.description}
          images={cover.images}
          path={pageUrl}
          establishmentName={establishment.name}
          localePrice={localePrice.price}
          localeCurrency={localePrice.currency}
        />
      </LazyHydrateWrapper>
      <DesktopContainer>
        <MobileContainer>
          <LazyHydrateWrapper ssrOnly>
            <BreadcrumbsContainer slug={slug} type={"ACCOMMODATION" as PageType} />
          </LazyHydrateWrapper>
        </MobileContainer>
        <ProductHeader title={cover.name} />
      </DesktopContainer>
      <PageContentContainer>
        <StayBookingWidgetStateContextProviderContainer
          fromPrice={accommodation.basePrice}
          slug={slug}
          minDays={minDays}
          accommodationCategory={accommodationCategory}
          rooms={rooms}
          occupancies={occupancies}
        >
          <AccommodationContent
            cover={cover}
            url={url}
            slug={slug}
            category={accommodationCategory}
            accommodationSections={accommodationSections}
            specs={specs}
            props={props}
            reviewTotalCount={reviewTotalCount}
            reviewTotalScore={reviewTotalScore}
            showReviews={showReviews}
            staticRooms={staticRooms}
          />
          <AccomodationBookingWidgetChunkContainer
            basePrice={accommodation.basePrice}
            id={accommodation.id}
            title={name}
            categoryId={data.accommodation.category.id}
          />
        </StayBookingWidgetStateContextProviderContainer>
      </PageContentContainer>
      <AdminGearLoader links={adminLinks} />
    </>
  );
};

export default AccommodationContainer;
