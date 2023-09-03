import React, { useEffect, useCallback, useContext } from "react";
import { css } from "@emotion/core";
import styled from "@emotion/styled";
import rgba from "polished/lib/color/rgba";

import bookingWidgetStateContext from "../contexts/BookingWidgetStateContext";

import ExperienceQuestionContainer from "./ExperienceQuestionsContainer";
import InformationExperience from "./InformationExperience";

import BookingWidgetExperiencesHiddenInput from "components/ui/BookingWidget/BookingWidgetHiddenInput";
import IncrementPicker from "components/ui/Inputs/IncrementPicker";
import { gutters } from "styles/variables";
import { mqMin, skeletonPulse } from "styles/base";

type Props = {
  selectedValue: number;
  experience: ExperiencesTypes.TravelerExperience;
  max: number;
  min: number;
  onSetSelectedExperience: TourBookingWidgetTypes.OnSetSelectedExperience;
};

const SubContainer = styled.div`
  align-items: center;
  margin-top: ${gutters.large}px;
  padding: 0 ${gutters.small}px;
  ${mqMin.large} {
    margin-top: ${gutters.large / 2}px;
    padding: 0 ${gutters.large}px;
  }
`;

const Container = styled.div(
  ({ theme }) =>
    css`
      margin: ${gutters.large}px -${gutters.small}px;
      border-top: 8px solid ${rgba(theme.colors.primary, 0.05)};
      ${mqMin.large} {
        margin: ${gutters.large / 2}px -${gutters.large}px;
      }
    `
);

const TravelerExperienceSkeleton = styled.div([
  skeletonPulse,
  css`
    display: block;
    height: 48px;
  `,
]);

const TravelerExperience = ({
  experience,
  max,
  min,
  onSetSelectedExperience,
  selectedValue,
}: Props) => {
  const onChange = useCallback(
    (value: number) => {
      onSetSelectedExperience({
        experienceId: experience.id,
        count: value,
        price: experience.price,
        discountValue: experience.discountValue,
        calculatePricePerPerson: experience.calculatePricePerPerson,
      });
    },
    [experience.calculatePricePerPerson, experience.id, experience.price, onSetSelectedExperience]
  );
  useEffect(() => {
    if (experience.required) {
      onChange(selectedValue);
    }
  }, [onChange, selectedValue, max, experience.required]);
  const { isGTIVpDefaultOptionsLoading } = useContext(bookingWidgetStateContext);

  if (isGTIVpDefaultOptionsLoading) {
    return (
      <Container>
        <SubContainer>
          <TravelerExperienceSkeleton />
        </SubContainer>
      </Container>
    );
  }

  return (
    <Container>
      {selectedValue > 0 && (
        <BookingWidgetExperiencesHiddenInput
          name={`tour_options[${experience.id}]`}
          value={`${experience.id}-${selectedValue.toString()}`}
        />
      )}
      <SubContainer>
        <IncrementPicker
          id={experience.name}
          canDecrement={selectedValue > min}
          canIncrement={selectedValue < max}
          count={selectedValue}
          price={experience.price}
          title={experience.name}
          onChange={onChange}
        />
        {experience.questions.length === 1 && (
          <ExperienceQuestionContainer
            count={selectedValue}
            questions={experience.questions}
            experienceId={experience.id}
          />
        )}
        {experience.questions.length > 1 && (
          <InformationExperience experience={experience} numberOfTravelers={selectedValue} />
        )}
      </SubContainer>
    </Container>
  );
};

export default TravelerExperience;
