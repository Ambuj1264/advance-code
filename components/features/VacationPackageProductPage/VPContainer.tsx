import React from "react";
import { ApolloError } from "apollo-client";
import { useRouter } from "next/router";

import {
  getFlightCodeFromId,
  getVacationPackageProductBreadcrumbsQueryCondition,
} from "../VacationPackages/utils/vacationPackagesUtils";

import VPLeftContentContextWrapper from "./VPLeftContentContextWrapper";
import { getAdminGearInfoText, getAdminLinks } from "./utils/vacationPackageUtils";

import useActiveLocale from "hooks/useActiveLocale";
import AdminGearLoader from "components/features/AdminGear/AdminGearLoader";
import { getNoLineBreakDescription, getTruncationCutWithoutAnchor } from "utils/helperUtils";
import { useCurrencyWithDefault } from "hooks/useCurrency";
import { useSettings } from "contexts/SettingsContext";
import ProductHeader from "components/ui/ProductHeader";
import Container from "components/ui/Grid/Container";
import ProductStructuredData from "components/features/SEO/ProductStructuredData";
import SEO from "components/features/SEO/SEO";
import LazyHydrateWrapper from "components/ui/LazyHydrateWrapper";
import DefaultHeadTags from "lib/DefaultHeadTags";
import { GraphCMSPageType, OpenGraphType } from "types/enums";
import { makeAbsoluteLink } from "utils/routerUtils";
import ProductPageLoadingContainer from "components/ui/ProductPageLoading/ProductPageLoadingContainer";
import ErrorComponent from "components/ui/Error/ErrorComponent";
import PageContentContainer from "components/ui/PageContentContainer";
import LandingPageBreadcrumbs from "components/ui/LandingPages/LandingPageBreadcrumbs";
import { getCountry } from "components/ui/LandingPages/utils/landingPageUtils";

const VPContainer = ({
  title,
  vpContentResult,
  vpContentQueryLoading,
  vpContentQueryError,
  hreflangs,
  cartLink,
  isPreview,
}: {
  title?: string;
  vpContentResult?: VacationPackageTypes.VacationPackageResult;
  vpContentQueryLoading: boolean;
  vpContentQueryError?: ApolloError;
  hreflangs: Hreflang[];
  cartLink?: string;
  isPreview: boolean;
}) => {
  const activeLocale = useActiveLocale();
  const { asPath } = useRouter();
  const startPlaceCountry =
    getCountry(vpContentResult?.startPlace?.countries) ?? vpContentResult?.startPlace?.country;

  const { marketplaceUrl } = useSettings();
  const { currencyCode } = useCurrencyWithDefault();

  if (vpContentQueryLoading) {
    return <ProductPageLoadingContainer title={title} />;
  }
  if (vpContentQueryError || !vpContentResult) {
    return (
      <ErrorComponent
        error={vpContentQueryError || new Error("Vacation package does not exist")}
        isRequired={Boolean(vpContentQueryError)}
        LoadingComponent={ProductPageLoadingContainer}
        componentName="VPContainer"
      />
    );
  }
  // TODO: remove once backend handles this.
  const noLineBreakDescription = getNoLineBreakDescription(vpContentResult.description);

  // TODO ask backend to provide metaDescription
  const seoDescription = getTruncationCutWithoutAnchor({
    content: noLineBreakDescription,
    truncationLength: 180,
  }).visibleDescription;

  const destinationName = vpContentResult.startsIn;
  const destinationId = getFlightCodeFromId(vpContentResult.startPlace?.flightId || "");
  const isIndexed = vpContentResult.subType !== "SkiTrip";
  return (
    <>
      <DefaultHeadTags title={vpContentResult.title} />
      <SEO
        title={vpContentResult.title}
        description={seoDescription}
        isIndexed={isIndexed}
        hreflangs={hreflangs}
        images={vpContentResult.images}
        openGraphType={OpenGraphType.PRODUCT}
        alternateCanonicalUrl={
          vpContentResult.metadataUri
            ? makeAbsoluteLink(vpContentResult.metadataUri, marketplaceUrl)
            : undefined
        }
        placeInfo={vpContentResult.startPlace}
        funnelType={GraphCMSPageType.VpProductPage}
      />
      <LazyHydrateWrapper ssrOnly>
        <ProductStructuredData
          name={vpContentResult.title}
          description={seoDescription}
          images={vpContentResult.images}
          reviewTotalCount={vpContentResult.reviewCount}
          reviewTotalScore={vpContentResult.reviewScore}
          path={vpContentResult.metadataUri}
          establishmentName=""
          localePrice={vpContentResult.fromPrice}
          localeCurrency={currencyCode}
        />
        <Container>
          <LandingPageBreadcrumbs
            queryCondition={getVacationPackageProductBreadcrumbsQueryCondition(asPath)}
            customLastBreadcrumb={vpContentResult.title}
            onProductPage
          />
          <ProductHeader title={vpContentResult.title} />
        </Container>
      </LazyHydrateWrapper>

      <PageContentContainer>
        <VPLeftContentContextWrapper
          images={vpContentResult.images}
          reviewScore={vpContentResult.reviewScore}
          reviewCount={vpContentResult.reviewCount}
          description={vpContentResult.description}
          included={vpContentResult.includedList}
          vacationPackageAttractions={vpContentResult.vacationPackageAttractions}
          vacationPackageDestinations={vpContentResult.vacationPackageDestinations}
          mapData={vpContentResult?.mapData}
          productSpecs={vpContentResult.productSpecs}
          productProps={vpContentResult.productProps}
          vacationPackageDays={vpContentResult.vacationPackageDays}
          destinationCountryId={startPlaceCountry?.alpha2Code}
          destinationCountryName={startPlaceCountry?.name?.value}
          destinationName={destinationName}
          destinationId={destinationId}
          tripId={vpContentResult.tripId}
          id={vpContentResult.id}
          title={vpContentResult.title}
          isPreview={isPreview}
          isDeleted={vpContentResult.isDeleted}
          cartLink={cartLink}
          subType={vpContentResult?.subType}
          fromPrice={vpContentResult?.fromPrice}
          vpCountryCode={startPlaceCountry?.id ?? ""}
          cheapestMonth={vpContentResult?.cheapestMonth}
          vacationLength={vpContentResult?.days || 0}
          vpDestinationsInfo={vpContentResult.vpDestinationsInfo}
          translateOptions={{
            startsIn: vpContentResult?.startsIn,
            endsIn: vpContentResult?.endsIn,
            startTime: undefined,
            endTime: undefined,
            days: Number(vpContentResult?.days ?? 0),
            nights: vpContentResult?.nights,
            Available: vpContentResult?.available,
          }}
        />
      </PageContentContainer>
      <AdminGearLoader
        links={getAdminLinks(
          vpContentResult.id,
          vpContentResult.tripId,
          activeLocale,
          vpContentResult.tripDatabaseId
        )}
        hideCommonLinks
        infoText={getAdminGearInfoText(vpContentResult)}
      />
    </>
  );
};

export default VPContainer;
