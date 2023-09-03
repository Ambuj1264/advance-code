import React, { useContext } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import VPCardBanner from "../VPCardBanner";
import VPProductCard from "../VPProductCard";
import { VPActiveModalTypes } from "../contexts/VPModalStateContext";
import { getVPModalProductId } from "../utils/vacationPackageUtils";
import { VPTourStateContext } from "../contexts/VPTourStateContext";
import { VPStayStateContext } from "../contexts/VPStayStateContext";

import { constructSelectedTourProductSpecs } from "./utils/vpToursUtils";
import VPTourProductCardFooter from "./VPToursProductCardFooter";
import VPToursInfoModalContent from "./VPToursInfoModalContent";
import VPTourEditWrapper from "./VPTourEditWrapper";

import { SellOutLabel } from "components/ui/ProductLabels/ProductLabels";
import SelectedOptionIcon from "components/icons/checks-circle.svg";
import { useGTETourBookingWidgetContext } from "components/features/GTETourProductPage/GTETourBookingWidget/GTETourBookingWidgetStateContext";
import TourIcon from "components/icons/traveler.svg";
import { getTotalTravelers } from "components/features/GTETourProductPage/GTETourBookingWidget/utils/gteTourBookingWidgetUtils";
import { useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";

const StyledVPProductCard = styled(VPProductCard)<{ totalTours: number }>(
  ({ totalTours }) => css`
    &:hover {
      cursor: ${totalTours > 3 ? "grab" : "default"};
    }
  `
);

const VPDayTourCard = ({
  dayNumber,
  tourDate,
  tour,
  onSelectCard,
  totalTours,
}: {
  dayNumber: number;
  tourDate: string;
  tour: SharedTypes.Product;
  onSelectCard: (productId: string) => void;
  totalTours: number;
}) => {
  const { t } = useTranslation(Namespaces.vacationPackageNs);
  const { numberOfTravelers } = useGTETourBookingWidgetContext();
  const totalSelectedTravelers = getTotalTravelers(numberOfTravelers);
  const { selectedToursProductIds } = useContext(VPTourStateContext);
  const { occupancies } = useContext(VPStayStateContext);
  const productName = tour.headline ?? "";
  const strProductId = tour.id as string;
  const selectedProduct = selectedToursProductIds?.find(
    item => item.productId === strProductId && item.day === dayNumber
  );
  const isProductSelected = Boolean(selectedProduct);
  const isProductSubmitted = selectedProduct ? selectedProduct.optionCode !== "" : false;
  const tourSpecs = selectedProduct?.startTime
    ? constructSelectedTourProductSpecs(tour.specs, selectedProduct!, t)
    : tour.specs;
  return (
    <StyledVPProductCard
      key={`${tour.id}${dayNumber}}`}
      headline={productName}
      image={tour.image}
      productId={strProductId}
      modalProductId={getVPModalProductId(dayNumber, tour.id)}
      productSpecs={tourSpecs}
      averageRating={tour.averageRating}
      reviewsCount={tour.reviewsCount}
      includeReviews
      isCardSelected={isProductSubmitted}
      editModalContent={null}
      totalTours={totalTours}
      infoModalContent={
        <VPToursInfoModalContent
          productId={strProductId}
          queryCondition={{
            tourId: strProductId,
          }}
        />
      }
      includedFooterTextContent=""
      customFooter={
        <VPTourProductCardFooter
          isSelected={isProductSelected}
          price={tour.price}
          onSelectCard={onSelectCard}
          productId={strProductId}
          day={dayNumber}
          checkboxValue={totalSelectedTravelers > 0 ? totalSelectedTravelers : ""}
          isSubmitted={isProductSubmitted}
        />
      }
      imageBottomRightContent={
        isProductSelected && (
          <VPTourEditWrapper
            productId={strProductId}
            editModalId={VPActiveModalTypes.EditTour}
            editModalTitle={{
              Icon: TourIcon,
              title: productName,
            }}
            isFormEditModal
            dayNumber={dayNumber}
            tourDate={tourDate}
            isProductSubmitted={isProductSubmitted}
            occupancies={occupancies}
          />
        )
      }
      price={tour.price}
      infoModalTitle={{
        Icon: TourIcon,
        title: productName,
      }}
      infoModalId={VPActiveModalTypes.InfoTour}
      imageLeftBottomContent={
        selectedProduct?.optionName ? (
          <VPCardBanner
            bannerContent={selectedProduct!.optionName}
            Icon={SelectedOptionIcon}
            isSelected={isProductSubmitted}
          />
        ) : (
          tour.isLikelyToSellOut && <SellOutLabel isStatic />
        )
      }
    />
  );
};

export default VPDayTourCard;
