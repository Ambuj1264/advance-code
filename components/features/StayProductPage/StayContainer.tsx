import React from "react";
import { useQuery } from "@apollo/react-hooks";

import useAccommodationSearchQueryParams, {
  decodeOccupanciesArray,
} from "../AccommodationSearchPage/utils/useAccommodationSearchQueryParams";

import StayBookingWidgetStateContextProviderContainer from "./StayBookingWidget/StayBookingWidgetStateContextProviderContainer";
import StayContentContainer from "./StayContentContainer";
import { getLandingPageUriQueryCondition, getAdminLinks } from "./utils/stayUtils";
import StayQuery from "./queries/StayQuery.graphql";
import useStayAdminFunctionalItems from "./useStayAdminFunctionalItems";

import ProductBreadcrumbs from "components/ui/Breadcrumbs/ProductBreadcrumbs";
import AdminGearLoader from "components/features/AdminGear/AdminGearLoader";
import BookingWidgetLoadingContainer from "components/ui/BookingWidget/BookingWidgetLoadingContainer";
import CustomNextDynamic from "lib/CustomNextDynamic";
import { MobileContainer, DesktopContainer } from "components/ui/Grid/Container";
import ErrorComponent from "components/ui/Error/ErrorComponent";
import BookingWidgetErrorBoundary from "components/ui/BookingWidget/BookingWidgetErrorBoundary";
import LandingPageUriQuery from "components/ui/LandingPages/queries/LandingPageUriQuery.graphql";
import ProductPageLoadingContainer from "components/ui/ProductPageLoading/ProductPageLoadingContainer";
import useActiveLocale from "hooks/useActiveLocale";
import PageContentContainer from "components/ui/PageContentContainer";
import { GraphCMSPageType, StaySearchType } from "types/enums";
import ProductHeader from "components/ui/ProductHeader";
import useGetIpCountryCode from "hooks/useGetIpCountryCode";

const StayBookingWidgetChunkContainer = CustomNextDynamic(
  () => import("./StayBookingWidget/StayBookingWidgetChunkContainer"),
  {
    ssr: false,
    loading: () => <BookingWidgetLoadingContainer />,
  }
);

const StayContainer = ({
  queryCondition,
}: {
  queryCondition: LandingPageTypes.LandingPageQueryCondition;
}) => {
  const locale = useActiveLocale();
  const { ipCountryCode } = useGetIpCountryCode();
  const { data, loading, error } = useQuery<{
    staysProductPages: StayTypes.QueryStayData[];
  }>(StayQuery, {
    variables: {
      where: queryCondition,
      locale,
      isDisabled: false,
    },
  });
  const { data: landingPageUriData } = useQuery<{
    landingPageUrls: {
      pageType: GraphCMSPageType;
      metadataUri: string;
    }[];
  }>(LandingPageUriQuery, {
    variables: {
      locale,
      where: getLandingPageUriQueryCondition(),
    },
  });
  const searchUrl = landingPageUriData?.landingPageUrls.find(
    landingPage => landingPage.pageType === GraphCMSPageType.Stays
  )?.metadataUri;
  const functionalItems = useStayAdminFunctionalItems({
    productId: data?.staysProductPages[0]?.productId,
  });
  const [{ occupancies: encodedOccupancies }] = useAccommodationSearchQueryParams();

  if (loading) return <ProductPageLoadingContainer />;
  if (!data || !data.staysProductPages[0] || error)
    return <ErrorComponent error={error} isRequired componentName="StayContainer" />;

  const productPage = data.staysProductPages[0];
  const placeType = productPage.cityOsmId ? StaySearchType.CITY : StaySearchType.COUNTRY;
  const placeId = productPage.cityOsmId || productPage.countryOsmId;

  const staySEOContainerData = {
    isIndexed: productPage.isIndexed,
    fromPrice: productPage.fromPrice,
    metadataUri: productPage.metadataUri,
    place: productPage.place,
    locale,
  };

  return (
    <>
      <DesktopContainer>
        <MobileContainer>
          <ProductBreadcrumbs breadcrumbs={productPage.breadcrumbs} />
        </MobileContainer>
        <ProductHeader title={productPage.title} />
      </DesktopContainer>
      <PageContentContainer>
        <StayBookingWidgetStateContextProviderContainer
          fromPrice={productPage.fromPrice}
          placeName={productPage.place?.name?.value}
          placeId={placeId}
          placeType={placeType}
          occupancies={decodeOccupanciesArray(encodedOccupancies)}
        >
          <StayContentContainer
            attractionsConditions={{
              latitude: productPage.location.latitude,
              longitude: productPage.location.longitude,
            }}
            searchUrl={searchUrl}
            queryCondition={queryCondition}
            productId={productPage.productId}
            productTitle={productPage.title}
            staySEOContainerData={staySEOContainerData}
            ipCountryCode={ipCountryCode}
          />
          <BookingWidgetErrorBoundary>
            <StayBookingWidgetChunkContainer
              productId={productPage.productId}
              productPageUri={productPage.metadataUri}
              productTitle={productPage.title}
              fromPrice={productPage.fromPrice}
              ipCountryCode={ipCountryCode}
            />
          </BookingWidgetErrorBoundary>
        </StayBookingWidgetStateContextProviderContainer>
      </PageContentContainer>
      <AdminGearLoader
        links={getAdminLinks(productPage.id || "", productPage.productId)}
        hideCommonLinks
        infoText={[`Product id: ${productPage.productId}`]}
        functionalItems={functionalItems}
      />
    </>
  );
};

export default StayContainer;
