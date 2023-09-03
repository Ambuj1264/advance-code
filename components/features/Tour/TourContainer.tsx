import React, { useMemo } from "react";
import { useQuery } from "@apollo/react-hooks";

import useGTIVPrices from "../TourBookingWidget/hooks/useGTIVPrices";
import { getTotalNumberOfGTIVpTravelers } from "../TourBookingWidget/Travelers/utils/travelersUtils";
import useTourSearchQueryParams from "../SearchPage/useTourSearchQueryParams";

import tourQuery from "./queries/TourQuery.graphql";
import { constructTour, constructTourSections } from "./utils/tourUtils";
import TourContent from "./TourContent";

import BreadcrumbsContainer from "components/ui/Breadcrumbs/BreadcrumbsContainer";
import CustomNextDynamic from "lib/CustomNextDynamic";
import ProductStructuredData from "components/features/SEO/ProductStructuredData";
import ProductPageLoadingContainer from "components/ui/ProductPageLoading/ProductPageLoadingContainer";
import DefaultHeadTags from "lib/DefaultHeadTags";
import SEO from "components/features/SEO/SEO";
import PageContentContainer from "components/ui/PageContentContainer";
import ReviewsQuery from "components/features/Reviews/queries/ReviewsQuery.graphql";
import { useSettings } from "contexts/SettingsContext";
import BookingWidgetLoadingContainer from "components/ui/BookingWidget/BookingWidgetLoadingContainer";
import useActiveLocale from "hooks/useActiveLocale";
import { makeAbsoluteLink } from "utils/routerUtils";
import { constructBookingWidgetTourData } from "components/features/TourBookingWidget/utils/tourBookingWidgetUtils";
import AdminGearLoader from "components/features/AdminGear/AdminGearLoader";
import { OpenGraphType, PageType } from "types/enums";
import { getTourAdminLinks } from "components/features/AdminGear/utils";
import { constructHrefLangs } from "components/features/SEO/utils/SEOUtils";
import ErrorComponent from "components/ui/Error/ErrorComponent";
import Container from "components/ui/Search/SearchGrid";
import LazyHydrateWrapper from "components/ui/LazyHydrateWrapper";
import ProductHeader from "components/ui/ProductHeader";
import { ToursStateProvider } from "components/contexts/Tours/ToursBookingWidgetSharedContext";
import usePageMetadata from "hooks/usePageMetadata";

const TourBookingWidgetChunkContainer = CustomNextDynamic(
  () => import("components/features/TourBookingWidget/TourBookingWidgetChunkContainer"),
  {
    loading: () => <BookingWidgetLoadingContainer />,
  }
);

const TourContainer = ({
  title,
  slug,
  adults,
  childrenAges,
  isPreview,
  currentRequestAuth,
  forceLivePricing,
  cartItem,
}: {
  title: string;
  slug: string;
  adults: number;
  childrenAges: number[];
  isPreview?: boolean;
  currentRequestAuth?: string;
  forceLivePricing: boolean;
  cartItem: number;
}) => {
  const activeLocale = useActiveLocale();
  const { error, data, loading } = useQuery<QueryTourData>(tourQuery, {
    variables: {
      slug,
      locale: activeLocale,
      preview: isPreview,
      // TODO: remove when GTI live pricing will be released
      forceLivePricing,
    },
  });
  const { error: reviewsError, data: reviewsData } = useQuery<QueryReviewData>(ReviewsQuery, {
    variables: {
      page: 1,
      localeFilter: activeLocale,
      slug,
      type: "tour",
      scoreFilter: null,
    },
  });
  const { GTIVpPricesData } = useGTIVPrices({
    slug,
    travelers: getTotalNumberOfGTIVpTravelers({
      adults,
      childrenAges,
    }),
    skip: false,
    childrenAges,
    isLivePricing: forceLivePricing,
  });

  const tourMetadata = usePageMetadata({});
  const tourHreflangs = tourMetadata?.pageMetadata?.hreflangs || [];

  const { adminUrl, marketplaceUrl, host, marketplace } = useSettings();
  const adminLinks = useMemo(() => {
    if (data?.tour) {
      const { tour } = data;

      return getTourAdminLinks(activeLocale, adminUrl, marketplaceUrl, tour);
    }
    return [];
  }, [activeLocale, adminUrl, data, marketplaceUrl]);

  const tour = constructTour(marketplace, data?.tour);

  const {
    url,
    name,
    establishment,
    tourType,
    isLivePricing,
    images = [],
    reviewTotalScore,
    reviewTotalCount,
    isFreePickup,
    transport,
    metadata,
    lowestPriceGroupSize,
    localePrice,
    props,
    isIndexed,
  } = tour ?? {};

  const [{ dateFrom: queryDateFrom, dateTo, startingLocationId, startingLocationName }] =
    useTourSearchQueryParams();

  const tourSections = constructTourSections(tour);
  const bookingWidgetTourData = constructBookingWidgetTourData({
    tour: data?.tour,
    livePriceBasePrice: GTIVpPricesData?.price?.value,
    isLivePricing,
  });
  const reviews =
    reviewsData?.reviews?.reviews && !reviewsError ? reviewsData?.reviews?.reviews : [];
  const isTourDataReady = data && tour && tourSections && bookingWidgetTourData;
  if (loading) return <ProductPageLoadingContainer title={title} />;

  if (error && !loading && !data) {
    return (
      <ErrorComponent
        error={error}
        isRequired
        LoadingComponent={ProductPageLoadingContainer}
        componentName="TourContainer"
      />
    );
  }
  return (
    <ToursStateProvider
      similarToursDateFrom={queryDateFrom}
      similarToursDateTo={dateTo}
      childrenAges={childrenAges}
      adults={adults}
      startingLocationId={startingLocationId}
      startingLocationName={startingLocationName}
    >
      {metadata && (
        <>
          <DefaultHeadTags title={metadata.title} />
          <SEO
            title={metadata.title}
            description={metadata.description}
            isIndexed={!!isIndexed}
            hreflangs={constructHrefLangs(tourHreflangs, host, activeLocale)}
            images={images}
            openGraphType={OpenGraphType.PRODUCT}
            alternateCanonicalUrl={makeAbsoluteLink(metadata.canonicalUrl, marketplaceUrl)}
          />
        </>
      )}
      <LazyHydrateWrapper ssrOnly>
        {isTourDataReady && (
          <ProductStructuredData
            name={name!}
            description={metadata.description}
            images={images!}
            reviewTotalCount={reviewTotalCount}
            reviewTotalScore={reviewTotalScore}
            reviews={reviews}
            path={url!}
            establishmentName={establishment?.name ?? ""}
            localePrice={localePrice?.price ?? 0}
            localeCurrency={localePrice?.currency ?? ""}
          />
        )}
      </LazyHydrateWrapper>
      <Container>
        <LazyHydrateWrapper ssrOnly>
          <BreadcrumbsContainer slug={slug} type={PageType.TOUR} isLoading={loading} />
        </LazyHydrateWrapper>
        <ProductHeader title={tour?.name ?? ""} />
      </Container>
      <PageContentContainer>
        {isTourDataReady && (
          <>
            <TourContent
              url={tour?.url}
              images={tour?.images}
              reviewTotalCount={tour?.reviewTotalCount}
              reviewTotalScore={tour?.reviewTotalScore}
              tourSections={tourSections!}
              valuePropositions={props!}
              slug={slug}
              activeLocale={activeLocale}
            />
            <TourBookingWidgetChunkContainer
              id={data?.tour?.id}
              tourType={tourType!}
              isLivePricing={isLivePricing!}
              basePrice={bookingWidgetTourData?.basePrice}
              lengthOfTour={bookingWidgetTourData?.lengthOfTour}
              slug={slug}
              isFreePickup={isFreePickup!}
              transport={transport!}
              bookUrl={data?.bookUrl}
              lowestPriceGroupSize={lowestPriceGroupSize!}
              title={tour?.name}
              currentRequestAuth={currentRequestAuth}
              cartItem={cartItem}
            />
          </>
        )}
      </PageContentContainer>
      <AdminGearLoader links={adminLinks} />
    </ToursStateProvider>
  );
};

export default TourContainer;
