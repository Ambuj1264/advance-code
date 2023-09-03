import React, { useState, useCallback, useEffect, useContext, useMemo } from "react";
import { range } from "fp-ts/lib/Array";

import { constructQuestionArray } from "../experiencesUtils";
import bookingWidgetStateContext from "../../contexts/BookingWidgetStateContext";
import bookingWidgetCallbackContext from "../../contexts/BookingWidgetCallbackContext";
import bookingWidgetConstantContext from "../../contexts/BookingWidgetConstantContext";

import BookingWidgetExperiencesHiddenInput from "components/ui/BookingWidget/BookingWidgetHiddenInput";
import { BookingWidgetFormError } from "types/enums";

type Props = {
  questions: ExperiencesTypes.TourOptionQuestion[];
  numberOfTravelers: number;
  experienceId: string;
  isExperienceRequired?: boolean;
};

const useTravelersAnswers = ({
  numberOfTravelers,
  questions,
  experienceId,
  isExperienceRequired = false,
}: Props) => {
  const { formErrors } = useContext(bookingWidgetStateContext);
  const { updateEmptyAnswerError } = useContext(bookingWidgetCallbackContext);
  const { editItem } = useContext(bookingWidgetConstantContext);
  const [travelersAnswers, setTravelersAnswers] = useState<ExperiencesTypes.TravelerAnswer[][]>([]);
  useEffect(() => {
    const numberOfAnswersToAdd = numberOfTravelers - travelersAnswers.length;
    if (numberOfAnswersToAdd > 0) {
      const newtravelersAnswers = range(0, numberOfAnswersToAdd - 1).map(travelerNumber =>
        constructQuestionArray(
          questions,
          travelersAnswers.length + travelerNumber,
          experienceId,
          isExperienceRequired,
          editItem
        )
      );

      setTravelersAnswers([...travelersAnswers, ...newtravelersAnswers]);
    } else {
      setTravelersAnswers(
        travelersAnswers.slice(0, travelersAnswers.length + numberOfAnswersToAdd)
      );
    }
    // Disabling the rule because it would enforce travelerAnswers to be in the dependency array
    // Since this useEffect is updating the state we would end up in an endless loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [numberOfTravelers, questions]);

  const onTravelerAnswerChange = useCallback(
    (newAnswer: ExperiencesTypes.TravelerAnswer, travelerIndex: number) => {
      const newtravelersAnswers = travelersAnswers.map((oldTravelerAnswer, index) =>
        index === travelerIndex
          ? oldTravelerAnswer.map(oldAnswer =>
              oldAnswer.externalId === newAnswer.externalId ? newAnswer : oldAnswer
            )
          : oldTravelerAnswer
      );
      setTravelersAnswers(newtravelersAnswers);
    },
    [travelersAnswers]
  );

  const hasUnansweredQuestionsPerTraveler = useMemo(
    () =>
      travelersAnswers.map(travelerAnswers =>
        travelerAnswers.some(
          answer => answer.required && answer.answer === "" && isExperienceRequired
        )
      ),
    [isExperienceRequired, travelersAnswers]
  );

  const hasUnansweredQuestions = useMemo(
    () => hasUnansweredQuestionsPerTraveler.some(hasUnanswered => hasUnanswered),
    [hasUnansweredQuestionsPerTraveler]
  );

  useEffect(() => {
    if (!formErrors.includes(BookingWidgetFormError.EMPTY_ANSWER) && hasUnansweredQuestions) {
      updateEmptyAnswerError(BookingWidgetFormError.EMPTY_ANSWER);
    }
  }, [formErrors, hasUnansweredQuestions, updateEmptyAnswerError]);

  const HiddenInput = () => (
    <BookingWidgetExperiencesHiddenInput
      name={`tour_options_answers[${experienceId}]`}
      value={`${JSON.stringify(travelersAnswers).replace(/externalId/g, "external_id")}`}
    />
  );

  return [
    travelersAnswers,
    onTravelerAnswerChange,
    HiddenInput,
    hasUnansweredQuestionsPerTraveler,
  ] as const;
};

export default useTravelersAnswers;
