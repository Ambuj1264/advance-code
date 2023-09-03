import React, { useContext } from "react";

import bookingWidgetCallbackContext from "../contexts/BookingWidgetCallbackContext";

import useTravelersAnswers from "./hooks/useTravelersAnswers";
import ExperienceQuestions from "./ExperienceQuestions";

type Props = {
  questions: ExperiencesTypes.TourOptionQuestion[];
  count: number;
  experienceId: string;
};

const ExperienceQuestionsContainer = ({ count, questions, experienceId }: Props) => {
  const { updateEmptyAnswerError } = useContext(bookingWidgetCallbackContext);
  const [travelersAnswers, onTravelerAnswerChange, HiddenInput] = useTravelersAnswers({
    numberOfTravelers: count,
    questions,
    experienceId,
    isExperienceRequired: questions[0].required,
  });

  const onChange = (newAnswer: ExperiencesTypes.TravelerAnswer, travelerIndex: number) => {
    if (newAnswer.answer) {
      updateEmptyAnswerError(undefined);
    }
    onTravelerAnswerChange(newAnswer, travelerIndex);
  };

  return (
    <>
      <HiddenInput />
      {count > 0 &&
        travelersAnswers.map((answer, travelerIndex) => {
          return (
            <ExperienceQuestions
              key={`experienceQuestions_${travelerIndex.toString()}`}
              questions={questions}
              answers={answer}
              travelerIndex={travelerIndex}
              onTravelerAnswerChange={onChange}
              formSubmitted={false}
            />
          );
        })}
    </>
  );
};

export default ExperienceQuestionsContainer;
