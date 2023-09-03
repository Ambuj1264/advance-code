import React, { memo, useCallback, useState } from "react";

import Input from "components/ui/Inputs/Input";
import InputWrapper from "components/ui/InputWrapper";
import DriverAge from "components/ui/CarSearchWidget/DriverInformation/DriverAge";
import { separatorColorLight } from "styles/variables";
import { Namespaces } from "shared/namespaces";
import { useTranslation } from "i18n";

const DropdownAgeQuestion = memo(
  ({
    id,
    index,
    selectedExtraId,
    question,
    answer,
    setQuestionAnswers,
  }: {
    id: string;
    index: number;
    answer?: string;
    selectedExtraId: string;
    question: CarTypes.QueryExtraQuestion;
    setQuestionAnswers?: CarBookingWidgetTypes.OnSetSelectedExtraQuestionAnswers;
  }) => {
    const { t } = useTranslation(Namespaces.carnectNs);

    return (
      <InputWrapper id={question.key} label={t(question.key)}>
        <DriverAge
          includeIcon={false}
          id={id}
          driverAge={Number(answer || 45)}
          setDriverAge={driverAge =>
            setQuestionAnswers
              ? setQuestionAnswers(selectedExtraId, {
                  key: question.key,
                  answer: driverAge,
                  identifier: index.toString(),
                })
              : {}
          }
          height={45}
          borderColor={separatorColorLight}
        />
      </InputWrapper>
    );
  }
);

const Question = ({
  id,
  index,
  selectedExtraId,
  question,
  selectedAnswers,
  setQuestionAnswers,
}: {
  id: string;
  index: number;
  selectedExtraId: string;
  question: CarTypes.QueryExtraQuestion;
  selectedAnswers?: CarBookingWidgetTypes.SelectedExtraQuestionAnswer[];
  setQuestionAnswers?: CarBookingWidgetTypes.OnSetSelectedExtraQuestionAnswers;
}) => {
  const { t } = useTranslation(Namespaces.carnectNs);
  const { t: commonT } = useTranslation(Namespaces.commonBookingWidgetNs);
  const selectedQuestion = selectedAnswers?.find(
    (item: CarBookingWidgetTypes.SelectedExtraQuestionAnswer) =>
      item.key === question.key && item.identifier === String(index)
  );
  const defaultValue = selectedQuestion && selectedQuestion?.answer ? selectedQuestion.answer : "";
  const [selectedUserAnswers, setSelectedUserAnswers] =
    useState<CarBookingWidgetTypes.SelectedExtraQuestionAnswer>();

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const tempSelectedAnswers = {
        key: question.key,
        answer: event.target.value,
        identifier: index.toString(),
      };
      setSelectedUserAnswers(tempSelectedAnswers);
      if (setQuestionAnswers) {
        setQuestionAnswers(selectedExtraId, tempSelectedAnswers);
      }
    },
    [index, question.key]
  );

  const hasError = selectedUserAnswers?.answer === "";
  if (question.questionType === "TEXT") {
    return (
      <InputWrapper id={question.key} label={t(question.key)} required hasError={hasError}>
        <Input
          id={id}
          name={id}
          autoFocus
          placeholder={commonT("Write {value}", {
            value: t(question.key).toLowerCase(),
          })}
          defaultValue={defaultValue}
          onChange={handleInputChange}
          lighterBorder
          useDebounce
          debounceWait={300}
          error={hasError}
        />
      </InputWrapper>
    );
  }
  if (question.questionType === "NUMBER") {
    return (
      <DropdownAgeQuestion
        id={id}
        index={index}
        selectedExtraId={selectedExtraId}
        question={question}
        answer={selectedQuestion?.answer}
        setQuestionAnswers={setQuestionAnswers}
      />
    );
  }
  return null;
};

export default memo(Question);
