import React, { ComponentProps } from "react";

import VPAggregatedContexts from "./contexts/VPAggregatedContexts";
import VPLeftContent from "./VPLeftContent";
import VPContexts from "./contexts/VPContexts";

import BookingWidgetLoadingContainer from "components/ui/BookingWidget/BookingWidgetLoadingContainer";
import CustomNextDynamic from "lib/CustomNextDynamic";
import { PageType } from "types/enums";

const VacationPackageBookingWidgetLazy = CustomNextDynamic(
  () => import("components/features/VacationPackageProductPage/VPBookingWidget/VPBookingWidget"),
  {
    loading: () => <BookingWidgetLoadingContainer />,
    ssr: false,
  }
);

const VPLeftContentContextWrapper = ({
  images,
  reviewScore,
  reviewCount,
  description,
  included,
  vacationPackageAttractions,
  vacationPackageDestinations,
  mapData,
  productSpecs,
  productProps,
  vacationPackageDays,
  destinationCountryId,
  destinationCountryName,
  cartLink,
  title,
  destinationName,
  destinationId,
  tripId,
  id,
  isPreview,
  isDeleted,
  subType,
  fromPrice,
  vpCountryCode,
  cheapestMonth,
  vacationLength,
  vpDestinationsInfo,
  translateOptions,
}: {
  images: ImageWithSizes[];
  reviewScore: number;
  reviewCount: number;
  description: string;
  included: VacationPackageTypes.IncludedItems[];
  vacationPackageAttractions: TravelStopTypes.TravelStops[];
  vacationPackageDestinations: TravelStopTypes.TravelStops[];
  mapData?: SharedTypes.Map;
  productSpecs: VacationPackageTypes.Quickfact[];
  productProps: VacationPackageTypes.ValueProp[];
  vacationPackageDays: VacationPackageTypes.VacationPackageDay[];
  destinationCountryId?: string;
  destinationCountryName?: string;
  cartLink?: string;
  title?: string;
  subType?: VacationPackageTypes.VacationPackageResult["subType"];
  fromPrice?: number;
  vpCountryCode: string;
  cheapestMonth?: string;
  vacationLength: number;
  vpDestinationsInfo: VacationPackageTypes.VPDestinationInfo[];
  translateOptions: VacationPackageTypes.TranslateOptions;
} & ComponentProps<typeof VPAggregatedContexts>) => {
  return (
    <VPContexts
      vacationPackageDays={vacationPackageDays}
      destinationId={destinationId}
      subType={subType}
      fromPrice={fromPrice}
      tripId={tripId}
      vpCountryCode={vpCountryCode}
      cheapestMonth={cheapestMonth}
      vacationLength={vacationLength}
    >
      <VPAggregatedContexts
        destinationName={destinationName}
        destinationId={destinationId}
        tripId={tripId}
        id={id}
        isPreview={isPreview}
        isDeleted={isDeleted}
      >
        <VPLeftContent
          tripId={tripId}
          images={images}
          reviewScore={reviewScore}
          reviewCount={reviewCount}
          description={description}
          included={included}
          vacationPackageAttractions={vacationPackageAttractions}
          vacationPackageDestinations={vacationPackageDestinations}
          mapData={mapData}
          productSpecs={productSpecs}
          productProps={productProps}
          vacationPackageDays={vacationPackageDays}
          destinationCountryId={destinationCountryId}
          destinationCountryName={destinationCountryName}
          vpDestinationsInfo={vpDestinationsInfo}
          translateOptions={translateOptions}
        />
        <VacationPackageBookingWidgetLazy
          title={title}
          destinationName={destinationName}
          destinationId={destinationId}
          cartLink={cartLink || PageType.CART}
          vacationPackageDays={vacationPackageDays}
        />
      </VPAggregatedContexts>
    </VPContexts>
  );
};

export default VPLeftContentContextWrapper;
