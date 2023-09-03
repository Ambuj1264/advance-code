import React from "react";
import { withTheme } from "emotion-theming";

import ExperienceQuestions from "./ExperienceQuestions";

import Modal, {
  ModalContentWrapper,
  ModalHeader,
  ModalFooterContainer,
  CloseButton,
  ModalHeading,
  ModalBodyContainer,
} from "components/ui/Modal/Modal";
import { Trans } from "i18n";
import { Namespaces } from "shared/namespaces";
import { ButtonSize } from "types/enums";
import Button from "components/ui/Inputs/Button";
import useToggle from "hooks/useToggle";
import { ModalHistoryProvider } from "contexts/ModalHistoryContext";

type Props = {
  experience: ExperiencesTypes.InformationExperience;
  onClose: () => void;
  theme: Theme;
  answers: ExperiencesTypes.TravelerAnswer[];
  travelerIndex: number;
  onTravelerAnswerChange: (
    travelerAnswers: ExperiencesTypes.TravelerAnswer,
    travelerIndex: number
  ) => void;
  hasUnansweredQuestions: boolean;
};

const InformationExperienceModal = ({
  experience: { name, questions, calculatePricePerPerson },
  answers,
  travelerIndex,
  onClose,
  theme,
  hasUnansweredQuestions,
  onTravelerAnswerChange,
}: Props) => {
  const [formSubmitted, toggleFormSubmit] = useToggle(false);
  const travelerNumber = travelerIndex + 1;
  if (answers.length === 0) return null;

  const onSubmit = () => {
    if (hasUnansweredQuestions) {
      toggleFormSubmit();
    } else {
      onClose();
    }
  };

  return (
    <ModalHistoryProvider>
      <Modal id="informationExperienceModal" onClose={onClose}>
        <ModalHeader rightButton={<CloseButton onClick={onClose} />} />
        <ModalContentWrapper>
          <form>
            <ModalBodyContainer onClick={e => e.stopPropagation()}>
              <ModalHeading>
                {calculatePricePerPerson ? `${name} - ` : name}
                <Trans
                  ns={Namespaces.tourBookingWidgetNs}
                  i18nKey={calculatePricePerPerson ? "Traveler {travelerNumber}" : ""}
                  defaults={calculatePricePerPerson ? "Traveler {travelerNumber}" : ""}
                  values={{ travelerNumber }}
                />
              </ModalHeading>

              <ExperienceQuestions
                key={`experienceQuestions_${travelerIndex.toString()}`}
                questions={questions}
                answers={answers}
                travelerIndex={travelerIndex}
                onTravelerAnswerChange={onTravelerAnswerChange}
                formSubmitted={formSubmitted}
              />
            </ModalBodyContainer>
          </form>
        </ModalContentWrapper>
        <ModalFooterContainer>
          <Button
            id={`applyExperienceInformation_${name}`}
            disabled={false}
            color="primary"
            buttonSize={ButtonSize.Small}
            theme={theme}
            onClick={onSubmit}
          >
            <Trans ns={Namespaces.commonBookingWidgetNs}>Continue</Trans>
          </Button>
        </ModalFooterContainer>
      </Modal>
    </ModalHistoryProvider>
  );
};

export default withTheme(InformationExperienceModal);
