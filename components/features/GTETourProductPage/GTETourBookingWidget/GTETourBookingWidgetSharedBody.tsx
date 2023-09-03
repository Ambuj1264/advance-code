import React from "react";
import styled from "@emotion/styled";

import GTETravelersContainer from "./GTETravelersContainer";
import GTETourOptionContainer from "./GTETourOptionContainer";
import GTETourOptionTimeContainer from "./GTETourOptionTimeContainer";
import GTETourOptionLanguagesContainer from "./GTETourOptionLanguagesContainer";
import { useGTETourBookingWidgetContext } from "./GTETourBookingWidgetStateContext";
import GTETourBookingQuestions from "./GTETourBookingQuestions";
import GTETourTravelerQuestionsContainer from "./GTETourTravelerQuestionsContainer";
import NoTourAvailability from "./NoTourAvailability";

import { Namespaces } from "shared/namespaces";
import { useTranslation } from "i18n";
import { useIsMobile } from "hooks/useMediaQueryCustom";
import { gutters } from "styles/variables";
import MobileSectionHeading from "components/ui/BookingWidget/MobileSectionHeading";
import { MaybeRow } from "components/ui/Grid/Row";
import SectionHeader from "components/features/TourBookingWidget/BookingWidgetSectionHeader";
import { mqMin } from "styles/base";

const StyledMobileSectionHeading = styled(MobileSectionHeading)`
  margin-bottom: ${gutters.small}px;
`;

const TravelerMobileSectionHeading = styled(MobileSectionHeading)`
  margin-bottom: ${gutters.small}px;
`;

const StyledGTETravelersContainer = styled(GTETravelersContainer)`
  margin-bottom: ${gutters.large}px;
  ${mqMin.large} {
    margin-bottom: 0;
  }

  ${SectionHeader} {
    display: none;
  }
`;

const GTETourBookingWidgetSharedBody = ({
  productId,
  hideContent,
  travelerErrorMessage,
  activeDropdown,
  onTravelersOpenStateChangeHandler,
  onOptionsOpenStateChangeHandler,
  onTimesOpenStateChangeHandler,
  onGuidedLanguagesOpenStateChangeHandler,
  onArrivalDropdownOpenStateChangeHandler,
  onDepartureDropdownOpenStateChangeHandler,
  columns = { small: 1 },
  isInModal = false,
}: {
  productId: string;
  hideContent: boolean;
  travelerErrorMessage?: string;
  activeDropdown?: GTETourBookingWidgetTypes.activeDropdownType;
  onTravelersOpenStateChangeHandler?: (isOpen: boolean) => void;
  onOptionsOpenStateChangeHandler?: (isOpen: boolean) => void;
  onTimesOpenStateChangeHandler?: (isOpen: boolean) => void;
  onGuidedLanguagesOpenStateChangeHandler?: (isOpen: boolean) => void;
  onArrivalDropdownOpenStateChangeHandler?: (isOpen: boolean) => void;
  onDepartureDropdownOpenStateChangeHandler?: (isOpen: boolean) => void;
  columns?: SharedTypes.Columns;
  isInModal?: boolean;
}) => {
  const { isError } = useGTETourBookingWidgetContext();
  const isMobile = useIsMobile();
  const { t } = useTranslation(Namespaces.tourNs);
  return (
    <>
      <MaybeRow showRow={isInModal}>
        {isMobile && (
          <TravelerMobileSectionHeading>{t("Select travelers")}</TravelerMobileSectionHeading>
        )}
        <StyledGTETravelersContainer
          activeDropdown={activeDropdown}
          onOpenStateChange={onTravelersOpenStateChangeHandler}
          travelerErrorMessage={travelerErrorMessage}
          columns={columns}
          isInModal={isInModal}
          viewType={isMobile ? "list" : "dropdown"}
        />
        {isError && <NoTourAvailability isInModal={isInModal} />}
        {!hideContent && !isError && (
          <>
            {isMobile && (
              <StyledMobileSectionHeading>{t("Tour details")}</StyledMobileSectionHeading>
            )}
            <GTETourOptionContainer
              activeDropdown={activeDropdown}
              onOpenStateChange={onOptionsOpenStateChangeHandler}
              columns={columns}
              isInModal={isInModal}
            />
            <GTETourOptionTimeContainer
              activeDropdown={activeDropdown}
              onOpenStateChange={onTimesOpenStateChangeHandler}
              columns={columns}
              isInModal={isInModal}
            />
            <GTETourOptionLanguagesContainer
              activeDropdown={activeDropdown}
              onOpenStateChange={onGuidedLanguagesOpenStateChangeHandler}
              columns={columns}
              isInModal={isInModal}
            />
            <GTETourBookingQuestions
              activeDropdown={activeDropdown}
              productCode={productId}
              onArrivalDropdownOpenStateChangeHandler={onArrivalDropdownOpenStateChangeHandler}
              onDepartureDropdownOpenStateChangeHandler={onDepartureDropdownOpenStateChangeHandler}
              columns={columns}
              isInModal={isInModal}
            />
          </>
        )}
      </MaybeRow>
      {!hideContent && !isError && (
        <GTETourTravelerQuestionsContainer
          activeDropdown={activeDropdown}
          productCode={productId}
          columns={columns}
          isInModal={isInModal}
        />
      )}
    </>
  );
};

export default GTETourBookingWidgetSharedBody;
