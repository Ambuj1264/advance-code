import React from "react";
import { useQuery } from "@apollo/react-hooks";

import useTourSearchQueryParams from "../SearchPage/useTourSearchQueryParams";

import TourContentQuery from "./queries/TourContentQuery.graphql";
import { getAdminLinks, getTourBreadcrumbs } from "./utils/gteTourUtils";
import GTETourContentContainer from "./GTETourContentContainer";
import GTETourBookingWidgetStateContextProviderContainer from "./GTETourBookingWidget/GTETourBookingWidgetStateContextProviderContainer";

import ProductBreadcrumbs from "components/ui/Breadcrumbs/ProductBreadcrumbs";
import useActiveLocale from "hooks/useActiveLocale";
import ProductContentLoading from "components/ui/ProductPageLoading/ProductContentLoading";
import BookingWidgetLoadingContainer from "components/ui/BookingWidget/BookingWidgetLoadingContainer";
import CustomNextDynamic from "lib/CustomNextDynamic";
import AdminGearLoader from "components/features/AdminGear/AdminGearLoader";
import PageContentContainer, { Content } from "components/ui/PageContentContainer";
import { MobileContainer, DesktopContainer } from "components/ui/Grid/Container";
import ProductHeader from "components/ui/ProductHeader";
import ProductPageLoadingContainer from "components/ui/ProductPageLoading/ProductPageLoadingContainer";
import ErrorComponent from "components/ui/Error/ErrorComponent";
import { capitalize } from "utils/globalUtils";

const GTETourBookingWidgetChunkContainer = CustomNextDynamic(
  () => import("./GTETourBookingWidget/GTETourBookingWidgetChunkContainer"),
  {
    ssr: false,
    loading: () => <BookingWidgetLoadingContainer />,
  }
);

const GTETourContainer = ({
  queryCondition,
}: {
  queryCondition: LandingPageTypes.LandingPageQueryCondition;
}) => {
  const locale = useActiveLocale();
  const { data, loading, error } = useQuery<GTETourTypes.QueryTour>(TourContentQuery, {
    variables: {
      where: queryCondition,
      locale,
      isDisabled: false,
    },
  });
  const [{ dateFrom }] = useTourSearchQueryParams();
  if (loading) return <ProductPageLoadingContainer />;
  if (!data || !data.tourProductPages[0] || error)
    return <ErrorComponent error={error} isRequired componentName="GTETourContainer" />;
  const {
    tourContentId,
    tourId,
    fromPrice,
    metadataUri,
    numberOfDays,
    isIndexed,
    title,
    startPlace,
    breadcrumbs,
  } = data.tourProductPages[0];
  const constructedBreadcrumbs = getTourBreadcrumbs(breadcrumbs, title, metadataUri);

  const tourSEOContainerData = {
    queryCondition,
    isIndexed,
    fromPrice,
    metadataUri,
    startPlace,
    locale,
  };
  return (
    <>
      <DesktopContainer>
        <MobileContainer>
          <ProductBreadcrumbs breadcrumbs={constructedBreadcrumbs} />
        </MobileContainer>
        <ProductHeader title={capitalize(title)} />
      </DesktopContainer>
      <PageContentContainer>
        <GTETourBookingWidgetStateContextProviderContainer
          dateFrom={dateFrom}
          numberOfDays={numberOfDays || 1}
          tourId={startPlace?.tourId}
          tourName={startPlace?.name?.value}
        >
          {loading ? (
            <Content>
              <ProductContentLoading />
            </Content>
          ) : (
            <GTETourContentContainer
              tourData={data.tourProductPages}
              productId={tourId}
              tourSEOContainerData={tourSEOContainerData}
              locale={locale}
            />
          )}
          <GTETourBookingWidgetChunkContainer
            productUrl={metadataUri}
            productId={tourId}
            numberOfDays={numberOfDays || 1}
            fromPrice={fromPrice}
            productTitle={title}
          />
        </GTETourBookingWidgetStateContextProviderContainer>
      </PageContentContainer>
      <AdminGearLoader
        hideCommonLinks
        links={getAdminLinks(tourContentId)}
        infoText={[`Product id: ${tourId}`]}
      />
    </>
  );
};

export default GTETourContainer;
