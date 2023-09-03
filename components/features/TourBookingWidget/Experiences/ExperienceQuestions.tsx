import React from "react";
import { css } from "@emotion/core";
import styled from "@emotion/styled";

import ExperienceQuestion from "./ExperienceQuestion";

import { gutters } from "styles/variables";
import { typographyBody2 } from "styles/typography";

type Props = {
  questions: ExperiencesTypes.TourOptionQuestion[];
  formSubmitted: boolean;
  onTravelerAnswerChange: (
    travelerAnswers: ExperiencesTypes.TravelerAnswer,
    travelerIndex: number
  ) => void;
  answers: ExperiencesTypes.TravelerAnswer[];
  travelerIndex: number;
};

const SectionWrapper = styled.div([
  typographyBody2,
  css`
    display: flex;
    flex-direction: column;
    align-items: baseline;
    justify-content: space-between;
    margin-top: ${gutters.large / 2}px;
    min-height: 100px;
  `,
]);

const ExperienceQuestions = ({
  questions,
  onTravelerAnswerChange,
  answers,
  formSubmitted,
  travelerIndex,
}: Props) => {
  return (
    <>
      {questions.map((question, index) => (
        <SectionWrapper key={`experienceInput${index.toString()}`}>
          <ExperienceQuestion
            key={question.id}
            id={question.id.toString()}
            placeholder={question.question}
            answers={question.answers}
            selectedOption={answers[index].answer}
            required={question.required}
            formSubmitted={formSubmitted}
            onChange={(newAnswer: string) =>
              onTravelerAnswerChange(
                {
                  question: question.question,
                  answer: newAnswer,
                  externalId: question.externalId,
                  required: question.required,
                },
                travelerIndex
              )
            }
          />
        </SectionWrapper>
      ))}
    </>
  );
};

export default ExperienceQuestions;
