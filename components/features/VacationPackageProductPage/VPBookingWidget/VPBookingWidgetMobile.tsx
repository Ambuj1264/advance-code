import React, { useRef, useCallback, ComponentProps, useState, useEffect, useContext } from "react";
import { useTheme } from "emotion-theming";
import styled from "@emotion/styled";

import { VPModalState, VPModalCallbackContext } from "../contexts/VPModalStateContext";
import VPSearchBookingSteps from "../VPSearchBookingSteps";
import { ButtonStyled } from "../VPProductContentSearchMobileSteps";

import VPMobileFooter from "./VPMobileFooter";
import VPBookingWidgetMobileContent from "./VPBookingWidgetMobileContent";

import BookingWidgetMobile from "components/ui/BookingWidget/BookingWidgetMobile";
import { ModalFooterContainer } from "components/ui/Modal/Modal";
import { FooterLeftColumn } from "components/ui/FrontSearchWidget/FrontStepModal";
import { ButtonSize } from "types/enums";
import { useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";
import LoadingSpinner from "components/ui/Loading/LoadingSpinner";

const OuterContentWrapper = styled.div`
  margin: 0;
  padding: 0;
`;

const VPBookingWidgetMobileContentLazy = (
  props: ComponentProps<typeof VPBookingWidgetMobileContent>
) => {
  const [bookingWidgetContentRendered, setBookingWidgetContentRendered] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setBookingWidgetContentRendered(true));
    return () => setBookingWidgetContentRendered(false);
  }, []);

  if (!bookingWidgetContentRendered) {
    return <LoadingSpinner />;
  }

  return <VPBookingWidgetMobileContent {...props} />;
};

const VPBookingWidgetMobile = ({
  onAddToCart,
  destinationName,
  destinationId,
  vacationPackageDays,
  isVPPriceAvailable,
  isAddToCartLoading,
  isMobileSearchOpen,
  bookingWidgetView,
  isBookingStepsOpen,
  isSadPathWithoutParams = false,
}: {
  onAddToCart: () => void;
  destinationName?: string;
  destinationId?: string;
  vacationPackageDays: VacationPackageTypes.VacationPackageDay[];
  isVPPriceAvailable: boolean;
  isAddToCartLoading: boolean;
  isSadPathWithoutParams?: boolean;
} & Pick<VPModalState, "isMobileSearchOpen" | "bookingWidgetView" | "isBookingStepsOpen">) => {
  const theme: Theme = useTheme();
  const topOfModalRef = useRef(null);
  const { t } = useTranslation(Namespaces.vacationPackageNs);
  const { onCloseVPMobileSearch, onToggleBookingSearchIsClosed } =
    useContext(VPModalCallbackContext);
  const closeSearchStepCallback = useCallback(() => {
    onToggleBookingSearchIsClosed(topOfModalRef);
  }, [onToggleBookingSearchIsClosed]);

  return isMobileSearchOpen ? (
    <BookingWidgetMobile
      onModalClose={isBookingStepsOpen ? closeSearchStepCallback : onCloseVPMobileSearch}
      skipReset={isBookingStepsOpen}
      onPreviousClick={isBookingStepsOpen ? closeSearchStepCallback : undefined}
      currentStep={bookingWidgetView}
      footer={
        isBookingStepsOpen ? (
          <ModalFooterContainer>
            <FooterLeftColumn />
            <ButtonStyled
              onClick={closeSearchStepCallback}
              theme={theme}
              buttonSize={ButtonSize.Small}
              fullWidth
            >
              {t("Apply")}
            </ButtonStyled>
          </ModalFooterContainer>
        ) : (
          <VPMobileFooter
            onAddToCart={onAddToCart}
            isVPPriceAvailable={isVPPriceAvailable}
            isAddToCartLoading={isAddToCartLoading}
          />
        )
      }
    >
      <OuterContentWrapper ref={topOfModalRef}>
        {isBookingStepsOpen || isSadPathWithoutParams ? (
          <VPSearchBookingSteps isSadPathWithoutParams={isSadPathWithoutParams} />
        ) : (
          <VPBookingWidgetMobileContentLazy
            destination={destinationName}
            destinationId={destinationId}
            vacationPackageDays={vacationPackageDays}
          />
        )}
      </OuterContentWrapper>
    </BookingWidgetMobile>
  ) : (
    <VPMobileFooter
      onAddToCart={onAddToCart}
      isVPPriceAvailable={isVPPriceAvailable}
      isAddToCartLoading={isAddToCartLoading}
    />
  );
};

export default VPBookingWidgetMobile;
