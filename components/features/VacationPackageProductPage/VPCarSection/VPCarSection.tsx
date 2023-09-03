import React, { memo, useContext } from "react";
import { ApolloError } from "apollo-client";

import VPProductCard from "../VPProductCard";
import VPCardBanner from "../VPCardBanner";
import { VPActiveModalTypes } from "../contexts/VPModalStateContext";
import { VPActionCallbackContext } from "../contexts/VPActionStateContext";

import VPCarSectionSkeleton from "./VPCarSectionSkeleton";
import VPCarEditModalContent from "./VPCarEditModalContent";
import VPCarInfoModalContent from "./VPCarInfoModalContent";
import { isFallbackCarOffer } from "./vpCarSectionUtils";

import ProductCardRow, { StyledSimilarProductsColumn } from "components/ui/ProductCardRow";
import { Namespaces } from "shared/namespaces";
import { useTranslation } from "i18n";
import CarBookingWidgetStateContext from "components/features/Car/CarBookingWidget/contexts/CarBookingWidgetStateContext";
import CarBookingWidgetCallbackContext from "components/features/Car/CarBookingWidget/contexts/CarBookingWidgetCallbackContext";

const VPCarSection = ({
  vacationLength,
  carOfferData,
  carOfferLoading,
  carOfferError,
  vpCarsByPopularity,
  carOffersLoading,
  carOffersError,
  constructOnSelectCarOffer,
  selectedCarId,
  vacationIncludesFlight,
  selectedFlight,
  selectedCarOffer,
}: {
  vacationLength: number;
  carOfferData?: CarTypes.QueryCarOfferData;
  carOfferLoading: boolean;
  carOffersLoading: boolean;
  carOfferError?: ApolloError;
  carOffersError?: ApolloError;
  vpCarsByPopularity: VacationPackageTypes.VPCarSearch[];
  constructOnSelectCarOffer: (productId: string) => void;
  selectedCarId?: string;
  vacationIncludesFlight: boolean;
  selectedFlight?: VacationPackageTypes.VacationFlightItinerary;
  selectedCarOffer?: CarTypes.CarOffer | undefined;
}) => {
  const { t: vacationPackageT } = useTranslation(Namespaces.vacationPackageNs);
  const { setSelectedExtra, setSelectedInsurance, setSelectedExtraQuestionAnswers } = useContext(
    CarBookingWidgetCallbackContext
  );
  const { onCarEditModalClose } = useContext(VPActionCallbackContext);
  const { selectedExtras, extras, selectedInsurances, insurances, extrasWithoutAnswers } =
    useContext(CarBookingWidgetStateContext);

  const editFormError = extrasWithoutAnswers?.length
    ? "Please fill in the required fields"
    : undefined;

  if (carOffersError) {
    return null;
  }

  const includedText = vacationPackageT("{numberOfDays} days rental included", {
    numberOfDays: vacationLength,
  });
  const isFallbackOffers = vpCarsByPopularity.some(vpCar => isFallbackCarOffer(vpCar.id));
  if (
    !vpCarsByPopularity?.length ||
    carOffersLoading ||
    isFallbackOffers ||
    (vacationIncludesFlight && !selectedFlight)
  ) {
    return (
      <VPCarSectionSkeleton
        fallbackOffers={isFallbackOffers ? vpCarsByPopularity : undefined}
        selectedCarId={selectedCarId}
        constructOnSelectCarOffer={constructOnSelectCarOffer}
        includedFooterTextContent={includedText}
        carOffersLoading={carOffersLoading}
      />
    );
  }

  return (
    <ProductCardRow>
      {vpCarsByPopularity.map((car: VacationPackageTypes.VPCarSearch) => {
        const { id, vpPrice, headline, image, carSpecs, Icon, subtype, provider, fallBackImg } =
          car;
        const isSelected = String(id) === selectedCarId;
        const isFallbackOffer = isFallbackCarOffer(id);
        return (
          <StyledSimilarProductsColumn key={id} productsCount={vpCarsByPopularity.length}>
            <VPProductCard
              key={id}
              price={vpPrice}
              productId={String(id)}
              modalProductId={String(id)}
              headline={headline}
              image={image}
              fallBackImg={fallBackImg}
              productSpecs={carSpecs}
              isCardSelected={isSelected}
              onSelectCard={constructOnSelectCarOffer}
              useDefaultImageHeight
              imageLeftBottomContent={
                <VPCardBanner
                  isSelected={isSelected}
                  Icon={Icon}
                  bannerContent={vacationPackageT(subtype)}
                />
              }
              includedFooterTextContent={includedText}
              editModalTitle={{ Icon, title: headline }}
              infoModalTitle={{ Icon, title: headline }}
              radioButtonValue={id}
              isFormEditModal
              infoModalContent={
                !isFallbackOffer ? (
                  <VPCarInfoModalContent
                    carProvider={provider}
                    isLoading={carOfferLoading}
                    isError={carOfferError}
                    carOfferData={carOfferData}
                    carId={isSelected ? undefined : String(id)}
                  />
                ) : null
              }
              editModalContent={
                !isFallbackOffer ? (
                  <VPCarEditModalContent
                    isLoading={carOfferLoading}
                    isError={carOfferError}
                    selectedCarOffer={selectedCarOffer}
                    onSetSelectedExtra={setSelectedExtra}
                    onSetSelectedExtraQuestionAnswers={setSelectedExtraQuestionAnswers}
                    onSetSelectedInsurance={setSelectedInsurance}
                    extras={extras}
                    insurances={insurances}
                    selectedExtras={selectedExtras ?? []}
                    selectedInsurances={selectedInsurances ?? []}
                  />
                ) : null
              }
              editModalId={VPActiveModalTypes.EditCar}
              infoModalId={VPActiveModalTypes.InfoCar}
              includeReviews={false}
              formError={editFormError}
              onEditModalClose={onCarEditModalClose}
            />
          </StyledSimilarProductsColumn>
        );
      })}
    </ProductCardRow>
  );
};

export default memo(VPCarSection);
