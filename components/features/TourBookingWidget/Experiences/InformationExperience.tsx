import React, { useState, useContext } from "react";
import styled from "@emotion/styled";
import rgba from "polished/lib/color/rgba";
import { css } from "@emotion/core";

import bookingWidgetCallbackContext from "../contexts/BookingWidgetCallbackContext";

import InformationExperienceModal from "./InformationExperienceModal";
import useTravelersAnswers from "./hooks/useTravelersAnswers";

import BookingWidgetExperiencesHiddenInput from "components/ui/BookingWidget/BookingWidgetHiddenInput";
import { useTranslation, Trans } from "i18n";
import { BookingWidgetFormError } from "types/enums";
import EditIcon from "components/icons/edit.svg";
import { gutters, greyColor, borderRadiusSmall } from "styles/variables";
import { mqMin, singleLineTruncation } from "styles/base";
import { typographyBody2 } from "styles/typography";
import { Namespaces } from "shared/namespaces";
import InputWrapper from "components/ui/InputWrapper";

type Props = {
  experience: ExperiencesTypes.InformationExperience;
  numberOfTravelers: number;
};

const ButtonContainer = styled.div`
  width: 100%;
`;

const StyledEditIcon = styled(EditIcon)(
  css`
    position: absolute;
    right: 15px;
    width: 12px;
    height: 12px;
    fill: ${greyColor};
  `
);

const Button = styled.button(
  css`
    position: relative;
    display: flex;
    align-items: center;
    margin-top: ${gutters.small / 2}px;
    border: 1px solid ${rgba(greyColor, 0.5)};
    border-radius: ${borderRadiusSmall};
    width: 100%;
    height: 45px;
    color: ${greyColor};
  `
);

const ButtonText = styled.span([
  singleLineTruncation,
  typographyBody2,
  css`
    width: 100%;
  `,
]);

const SubContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex;
  justify-content: space-between;
  margin: 0 ${gutters.small}px;
  & + & {
    margin-top: ${gutters.large}px;
  }
`;

const Container = styled.div`
  margin: ${gutters.small}px -${gutters.small}px 0 -${gutters.small}px;
  /* stylelint-disable selector-max-type */
  ${mqMin.large} {
    margin-top: ${gutters.large}px;
  }
  & + &,
  div + & {
    padding: ${gutters.large / 2}px 0;
    ${mqMin.large} {
      padding: 0;
    }
  }
`;

const InformationExperience = ({ numberOfTravelers, experience }: Props) => {
  const { updateEmptyAnswerError } = useContext(bookingWidgetCallbackContext);
  const { t } = useTranslation(Namespaces.tourBookingWidgetNs);
  const [currentTraveler, setCurrentTraveler] = useState<number | undefined>(undefined);
  const isCalculatePricePerPerson = experience.calculatePricePerPerson;
  const [travelersAnswers, onTravelerAnswerChange, HiddenInput, hasUnansweredQuestionsPerTraveler] =
    useTravelersAnswers({
      numberOfTravelers: isCalculatePricePerPerson ? numberOfTravelers : 1,
      questions: experience.questions,
      experienceId: experience.id,
      isExperienceRequired: experience.required,
    });

  const onClose = () => {
    if (currentTraveler === undefined) return;
    updateEmptyAnswerError(
      hasUnansweredQuestionsPerTraveler[currentTraveler]
        ? BookingWidgetFormError.EMPTY_ANSWER
        : undefined
    );
    setCurrentTraveler(undefined);
  };

  return (
    <>
      {numberOfTravelers > 0 && (
        <BookingWidgetExperiencesHiddenInput
          name={`tour_options[${experience.id}]`}
          value={`${experience.id}-${numberOfTravelers.toString()}`}
        />
      )}
      {numberOfTravelers > 0 && <HiddenInput />}
      <Container>
        {travelersAnswers.map((_, index) => {
          const travelerNumber = index + 1;
          return (
            <SubContainer key={`travelerInformation${experience.id}_${index.toString()}`}>
              <InputWrapper
                id={experience.id}
                label={
                  isCalculatePricePerPerson
                    ? `${experience.name} - ${t("Traveler {travelerNumber}", {
                        travelerNumber,
                      })}`
                    : experience.name
                }
                hasError={false}
                required={experience.required}
              >
                <ButtonContainer>
                  <Button
                    onClick={() => setCurrentTraveler(index)}
                    id={`experience${experience.id}`}
                    type="button"
                    color="primary"
                  >
                    <ButtonText>
                      <Trans ns={Namespaces.tourBookingWidgetNs}>Select details</Trans>
                    </ButtonText>
                    <StyledEditIcon />
                  </Button>
                </ButtonContainer>
              </InputWrapper>
            </SubContainer>
          );
        })}
      </Container>
      {currentTraveler !== undefined && (
        <InformationExperienceModal
          onClose={onClose}
          experience={experience}
          travelerIndex={currentTraveler}
          onTravelerAnswerChange={onTravelerAnswerChange}
          answers={travelersAnswers[currentTraveler]}
          hasUnansweredQuestions={hasUnansweredQuestionsPerTraveler[currentTraveler]}
        />
      )}
    </>
  );
};

export default InformationExperience;
