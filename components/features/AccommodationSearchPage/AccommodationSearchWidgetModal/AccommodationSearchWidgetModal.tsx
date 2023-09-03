import React, { useContext, SyntheticEvent } from "react";

import {
  AccommodationSearchPageStateContext,
  AccommodationSearchPageCallbackContext,
} from "../AccommodationSearchPageStateContext";

import { StepsEnum } from "./enums";
import AccommodationSearchWidgetDateStep from "./AccommodationSearchWidgetDateStep";
import AccommodationSearchWidgetButton from "./AccommodationSearchWidgetButton";

import MobileStepLocationAndGuests from "components/ui/MobileSteps/MobileStepLocationAndGuests";
import useMobileWidgetBackButton from "hooks/useMobileWidgetBackButton";
import { Namespaces } from "shared/namespaces";
import Modal, {
  ModalHeader,
  BackButton,
  CloseButton,
  ModalBodyContainer,
  ModalContentWrapper,
  ModalFooterContainer,
} from "components/ui/Modal/Modal";
import { useTranslation } from "i18n";
import { ActiveLocationAutocomplete } from "components/ui/FrontSearchWidget/utils/FrontEnums";

const AccommodationSearchWidgetModal = ({
  currentStep,
  isLastStep,
  onPreviousClick,
  onModalClose,
  onModalContinue,
}: {
  currentStep: StepsEnum;
  onPreviousClick: () => void;
  onModalClose: () => void;
  onModalContinue: (e: SyntheticEvent) => void;
  isLastStep: boolean;
}) => {
  // eslint-disable-next-line react/no-unstable-nested-components
  const PrevStepComponent = () => (isLastStep ? <BackButton onClick={onPreviousClick} /> : null);
  const {
    location,
    locationItems,
    numberOfGuests,
    numberOfRooms,
    selectedDates,
    activeLocationAutocomplete,
    useNewGuestPicker,
    occupancies,
  } = useContext(AccommodationSearchPageStateContext);
  const {
    onLocationInputChange,
    onLocationItemSelect,
    onSetNumberOfGuests,
    onSetNumberOfRooms,
    onUpdateChildrenAges,
    onSetOccupancies,
  } = useContext(AccommodationSearchPageCallbackContext);
  useMobileWidgetBackButton({ currentStep, onModalClose, onPreviousClick });

  const { t: commonSearchT } = useTranslation(Namespaces.commonSearchNs);
  const { t } = useTranslation(Namespaces.accommodationNs);
  const isFormValid = selectedDates.from && selectedDates.to && location.id;

  return (
    <Modal id="accommodationSearchWidgetModal" onClose={onModalClose}>
      <ModalHeader
        leftButton={<PrevStepComponent />}
        rightButton={<CloseButton onClick={onModalClose} />}
      />

      <ModalContentWrapper>
        <ModalBodyContainer>
          {currentStep === StepsEnum.Details && (
            <MobileStepLocationAndGuests
              onInputChange={onLocationInputChange}
              onItemClick={onLocationItemSelect}
              startingLocationItems={locationItems}
              locationPlaceholder={location.name || t("Select destination")}
              locationLabel={t("Select destination")}
              numberOfGuests={numberOfGuests}
              onSetNumberOfGuests={onSetNumberOfGuests}
              numberOfRooms={numberOfRooms}
              onSetNumberOfRooms={onSetNumberOfRooms}
              onUpdateChildrenAges={onUpdateChildrenAges}
              forceLocationFocus={
                activeLocationAutocomplete === ActiveLocationAutocomplete.Destination
              }
              onSetOccupancies={onSetOccupancies}
              occupancies={occupancies}
              useNewGuestPicker={useNewGuestPicker}
            />
          )}
          {currentStep === StepsEnum.Dates && <AccommodationSearchWidgetDateStep />}
        </ModalBodyContainer>
      </ModalContentWrapper>
      <ModalFooterContainer>
        <AccommodationSearchWidgetButton
          isLastStep={isLastStep}
          onModalContinue={onModalContinue}
          tooltipErrorMessage={
            !isFormValid && isLastStep
              ? commonSearchT("Please fill in your search information")
              : undefined
          }
        />
      </ModalFooterContainer>
    </Modal>
  );
};

export default AccommodationSearchWidgetModal;
