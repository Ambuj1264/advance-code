import React, { ChangeEvent, Context, useCallback, useMemo } from "react";
import Button from "@travelshift/ui/components/Inputs/Button";
import { withTheme } from "emotion-theming";

import {
  useSetNumberOfGuestsByTypeInSearchContext,
  useUpdateChildrenAgesInSearchContext,
} from "../FrontSearchWidget/frontHooks";
import MobileStepLocationAndTravellers from "../MobileSteps/MobileStepLocationAndTravellers";

import { StepsEnum } from "./advancedFilterHelpers";

import MobileStepDates from "components/ui/MobileSteps/MobileStepDates";
import {
  constructQueryFromSelectedDates,
  constructSelectedDatesFromQuery,
} from "components/ui/DatePicker/utils/datePickerUtils";
import { Namespaces } from "shared/namespaces";
import { useTranslation } from "i18n";
import { ButtonSize } from "types/enums";
import Modal, {
  BackButton,
  CloseButton,
  ModalBodyContainer,
  ModalContentWrapper,
  ModalFooterContainer,
  ModalHeader,
} from "components/ui/Modal/Modal";
import { getCallToActionModalButtonText } from "utils/globalUtils";
import { clearDatesInLocalStorage, setDatesInLocalStorage } from "utils/localStorageUtils";
import useMobileWidgetBackButton from "hooks/useMobileWidgetBackButton";

const AdvancedFilterStepsModal = ({
  context,
  namespace,
  onModalClose,
  onPreviousClick,
  onApplyClick,
  currentStep,
  setStepsState,
  theme,
  onLocationInputChange,
  dateFrom,
  dateTo,
  startingLocationItems,
  selectedLocationName,
  placeholder,
  setContextState,
  isFullStepsModal,
  numberOfGuests,
}: {
  context: Context<any>;
  namespace: Namespaces;
  onModalClose: () => void;
  onPreviousClick?: () => void;
  onApplyClick?: () => void;
  currentStep: StepsEnum;
  setStepsState: (p: SearchPageTypes.StepsModalState) => void;
  theme: Theme;
  numberOfGuests: SharedTypes.NumberOfGuests;
  onLocationInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  dateFrom?: string;
  dateTo?: string;
  startingLocationItems?: SharedTypes.AutocompleteItem[];
  placeholder?: string;
  selectedLocationName?: string;
  setContextState: (state: Partial<any>) => void;
  isFullStepsModal: boolean;
} & SearchPageTypes.StepsModalState) => {
  const { t } = useTranslation();
  const { t: tourSearchT } = useTranslation(Namespaces.tourSearchNs);
  const updateChildrenAges = useUpdateChildrenAgesInSearchContext();
  const setNumberOfGuestsByTypeInSearchContext = useSetNumberOfGuestsByTypeInSearchContext(context);

  useMobileWidgetBackButton({ currentStep, onModalClose, onPreviousClick });

  const onLocationItemClick = useCallback(
    (selectedValue?: SharedTypes.AutocompleteItem) => {
      setStepsState({
        startingLocationId: selectedValue?.id,
        startingLocationName: selectedValue?.name,
      });
      setContextState({
        selectedLocationId: selectedValue?.id,
        selectedLocationName: selectedValue?.name,
      });
    },
    [setContextState, setStepsState]
  );

  const setRangeDates = useCallback(
    (dates: SharedTypes.SelectedDates) => {
      setDatesInLocalStorage(dates);
      const queryDates = constructQueryFromSelectedDates(dates);
      setStepsState(queryDates);
      setContextState({
        filterDateFrom: queryDates.dateFrom,
        filterDateTo: queryDates.dateTo,
      });
    },
    [setContextState, setStepsState]
  );

  const setNumberOfGuests = useCallback(
    (type: SharedTypes.TravelerType, number: number) => {
      setNumberOfGuestsByTypeInSearchContext(type, number);
    },
    [setNumberOfGuestsByTypeInSearchContext]
  );

  const onDatesClear = useCallback(() => {
    clearDatesInLocalStorage();
    setContextState({
      filterDateFrom: "",
      filterDateTo: "",
    });
    setStepsState({
      dateFrom: undefined,
      dateTo: undefined,
    });
  }, [setContextState, setStepsState]);

  const selectedDates =
    dateFrom || dateTo ? constructSelectedDatesFromQuery({ dateFrom, dateTo }) : undefined;

  const PrevStepComponent = useMemo(
    // eslint-disable-next-line react/no-unstable-nested-components
    () => () => currentStep === StepsEnum.Details ? null : <BackButton onClick={onPreviousClick} />,
    [currentStep, onPreviousClick]
  );

  const isSearchResultCallToAction = isFullStepsModal && currentStep === StepsEnum.Dates;

  return (
    <Modal id="advancedFilterModal" onClose={onModalClose}>
      <ModalHeader
        leftButton={<PrevStepComponent />}
        rightButton={<CloseButton onClick={onModalClose} />}
      />
      <ModalContentWrapper>
        <ModalBodyContainer>
          {currentStep === StepsEnum.Details && (
            <MobileStepLocationAndTravellers
              startingLocationItems={startingLocationItems}
              onInputChange={onLocationInputChange}
              onItemClick={onLocationItemClick}
              locationPlaceholder={placeholder || tourSearchT("Starting location")}
              locationDefaultValue={selectedLocationName}
              locationLabel={tourSearchT("Starting location")}
              namespace={namespace}
              onSetNumberOfGuests={setNumberOfGuests}
              updateChildrenAges={updateChildrenAges}
              numberOfGuests={numberOfGuests}
            />
          )}
          {currentStep === StepsEnum.Dates && (
            <MobileStepDates
              selectedDates={{
                from: selectedDates?.from,
                to: selectedDates?.to,
              }}
              onDateSelection={setRangeDates}
              fromPlaceholder={t("Starting date")}
              toPlaceholder={t("Final date")}
              fromLabel={t("From")}
              toLabel={t("To")}
              onClear={onDatesClear}
            />
          )}
        </ModalBodyContainer>
      </ModalContentWrapper>
      <ModalFooterContainer>
        <Button onClick={onApplyClick} theme={theme} buttonSize={ButtonSize.Small} color="action">
          {getCallToActionModalButtonText({
            isMultipleStepsModal: isFullStepsModal,
            isLastStep: isSearchResultCallToAction,
            t,
          })}
        </Button>
      </ModalFooterContainer>
    </Modal>
  );
};

export default withTheme(AdvancedFilterStepsModal);
