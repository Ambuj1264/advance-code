import React, { ElementType, ReactNode, SyntheticEvent, useCallback, useMemo } from "react";
import styled from "@emotion/styled";
import Button from "@travelshift/ui/components/Inputs/Button";
import { useTheme } from "emotion-theming";
import { css } from "@emotion/core";

import { useGlobalContext } from "contexts/GlobalContext";
import { useOnDatesClear } from "components/ui/FrontSearchWidget/frontHooks";
import Tooltip from "components/ui/Tooltip/Tooltip";
import { gutters, whiteColor } from "styles/variables";
import { Trans, useTranslation } from "i18n";
import {
  FrontStepKeys,
  useFrontSearchContext,
} from "components/ui/FrontSearchWidget/FrontSearchStateContext";
import { getSelectedDatesFromString } from "components/ui/FrontSearchWidget/utils/frontUtils";
import Modal, {
  BackButton,
  CloseButton,
  ModalBodyContainer,
  ModalContentWrapper,
  ModalFooterContainer,
  ModalHeader,
} from "components/ui/Modal/Modal";
import MobileSectionHeading from "components/ui/BookingWidget/MobileSectionHeading";
import ClearButton from "components/ui/DatePicker/ClearButton";
import { Namespaces } from "shared/namespaces";
import { ButtonSize } from "types/enums";
import { typographySubtitle2 } from "styles/typography";
import { getCallToActionModalButtonText } from "utils/globalUtils";
import useMobileWidgetBackButton from "hooks/useMobileWidgetBackButton";

export const FooterLeftColumn = styled.div`
  flex-grow: 1;
`;

const ModalTitleWrapper = styled.div`
  ${typographySubtitle2};
`;

const iconStyles = css`
  display: inline-block;
  margin-right: ${gutters.small}px;
  height: 18px;
  vertical-align: text-top;
  fill: ${whiteColor};
`;

const FrontStepModal = <EnumType extends number>({
  onModalClose,
  onSearchClick,
  children,
  stepKey,
  datesStep,
  labels,
  Icon,
  title,
  hideTitle,
  tooltipErrorMessage,
  translationNamespace,
  selectedDatesOverride,
  steps,
}: {
  onModalClose: () => void;
  onSearchClick: (e: SyntheticEvent) => void;
  children: ReactNode[];
  stepKey: FrontStepKeys;
  datesStep: EnumType;
  labels?: { [key in EnumType]: string };
  Icon: ElementType;
  title: string;
  hideTitle?: boolean;
  tooltipErrorMessage?: string;
  translationNamespace: Namespaces;
  selectedDatesOverride?: SharedTypes.SelectedDates;
  steps: EnumType[];
}) => {
  const theme: Theme = useTheme();
  const { t } = useTranslation(Namespaces.commonNs);
  const { setContextState, dateFrom, dateTo, [stepKey]: currentStep } = useFrontSearchContext();

  const selectedDates =
    selectedDatesOverride ??
    getSelectedDatesFromString({
      dateFrom,
      dateTo,
    });

  const onDatesClear = useOnDatesClear();
  const setCurrentStep = useCallback(
    (step: EnumType) => {
      setContextState({ [stepKey]: step });
    },
    [setContextState, stepKey]
  );
  const isFirstStep = currentStep === steps[0];
  const isLastStep = currentStep === steps[steps.length - 1];
  const currentStepIndex = steps.indexOf(currentStep as EnumType);
  const onPreviousClick = useCallback(() => {
    if (!isFirstStep) setCurrentStep(steps[currentStepIndex - 1] as EnumType);
  }, [isFirstStep, setCurrentStep, steps, currentStepIndex]);

  useMobileWidgetBackButton({ currentStep, onModalClose, onPreviousClick });

  const { isMobileSearchWidgetBtnClicked } = useGlobalContext();

  const onApplyClick = useCallback(
    (e: SyntheticEvent) => {
      if (!isLastStep) return setCurrentStep(steps[currentStepIndex + 1] as EnumType);
      if (tooltipErrorMessage) return e.preventDefault();
      isMobileSearchWidgetBtnClicked.current = true;
      return onSearchClick(e);
    },
    [
      steps,
      currentStepIndex,
      isLastStep,
      isMobileSearchWidgetBtnClicked,
      onSearchClick,
      setCurrentStep,
    ]
  );

  const PrevStepComponent = useMemo(
    // eslint-disable-next-line react/no-unstable-nested-components
    () => () => isFirstStep ? null : <BackButton onClick={onPreviousClick} />,
    [isFirstStep, onPreviousClick]
  );

  const isDatesClearShown = currentStep === datesStep && (selectedDates?.from || selectedDates?.to);

  const button = (
    <Button
      onClick={onApplyClick}
      theme={theme}
      color="action"
      buttonSize={ButtonSize.Small}
      loading={isMobileSearchWidgetBtnClicked.current}
    >
      {getCallToActionModalButtonText({
        isMultipleStepsModal: true,
        isLastStep,
        t,
      })}
    </Button>
  );
  return (
    <Modal id="searchWidgetModal" onClose={onModalClose}>
      <ModalHeader
        leftButton={<PrevStepComponent />}
        rightButton={<CloseButton onClick={onModalClose} />}
        title={
          <ModalTitleWrapper>
            <Icon css={iconStyles} />
            <Trans ns={Namespaces.countryNs}>{title}</Trans>
          </ModalTitleWrapper>
        }
      />
      {!hideTitle && labels && (
        <MobileSectionHeading>
          {isDatesClearShown && (
            <ClearButton onClick={onDatesClear}>
              <Trans ns={Namespaces.commonNs}>Clear</Trans>
            </ClearButton>
          )}
          <Trans ns={translationNamespace}>{labels[currentStep as EnumType]}</Trans>
        </MobileSectionHeading>
      )}
      <ModalContentWrapper>
        <ModalBodyContainer>{children}</ModalBodyContainer>
      </ModalContentWrapper>
      <ModalFooterContainer>
        {tooltipErrorMessage && isLastStep ? (
          <Tooltip title={tooltipErrorMessage} fullWidth testid="searchWidgetModalTooltip">
            {button}
          </Tooltip>
        ) : (
          button
        )}
      </ModalFooterContainer>
    </Modal>
  );
};

export default FrontStepModal;
