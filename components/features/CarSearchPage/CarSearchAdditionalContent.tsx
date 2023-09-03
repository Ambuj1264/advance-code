import React from "react";

import CarSearchCategories from "./CarSearchCategories";
import TopCarRentals from "./TopCarRentals/TopCarRentals";
import CarSearchReviewsContainer from "./CarSearchReviewsContainer";
import CarSearchLinkedCategories from "./CarSearchLinkedCategories";
import TopCars from "./TopCars";

import LazyHydrateWrapper from "components/ui/LazyHydrateWrapper";

const CarSearchAdditionalContent = ({
  slug,
  topCars,
  topCarsMetadata,
}: {
  slug: string;
  topCars: CarSearchTypes.QueryTopCar[];
  topCarsMetadata?: SharedTypes.QuerySearchMetadata;
}) => {
  const isCarCategory = slug !== "";
  const supportsTouch = typeof window !== "undefined" && "ontouchstart" in window;
  const lazyHydrateTrigger = ["touchstart", !supportsTouch ? "mousemove" : undefined].filter(
    Boolean
  ) as string[];

  return (
    <>
      {isCarCategory && topCarsMetadata && <TopCars cars={topCars} metadata={topCarsMetadata} />}
      {!isCarCategory && (
        <LazyHydrateWrapper ssrOnly>
          <CarSearchCategories />
        </LazyHydrateWrapper>
      )}
      <LazyHydrateWrapper on={lazyHydrateTrigger} key="reviews">
        <CarSearchReviewsContainer slug={slug} />
      </LazyHydrateWrapper>
      {!isCarCategory && (
        <LazyHydrateWrapper ssrOnly>
          <CarSearchLinkedCategories />
        </LazyHydrateWrapper>
      )}
      <LazyHydrateWrapper on={lazyHydrateTrigger} key="topRentals">
        <TopCarRentals />
      </LazyHydrateWrapper>
    </>
  );
};

export default CarSearchAdditionalContent;
