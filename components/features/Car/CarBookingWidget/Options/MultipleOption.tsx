import React, { useEffect, useRef } from "react";
import styled from "@emotion/styled";
import { range } from "fp-ts/lib/Array";
import { css } from "@emotion/core";

import Question from "./Question";

import { scrollRefIntoView } from "utils/globalUtils";
import InputHeader from "components/ui/Inputs/InputHeader";
import IncrementPickerInput from "components/ui/Inputs/IncrementPickerInput";
import BookingWidgetHiddenInput from "components/ui/BookingWidget/BookingWidgetHiddenInput";
import { Namespaces } from "shared/namespaces";
import { useTranslation } from "i18n";
import { separatorColor, borderRadius, greyColor, gutters } from "styles/variables";
import { typographyBody2 } from "styles/typography";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const QuestionWrapper = styled.div<{ multipleSelected: boolean }>(
  ({ multipleSelected }) =>
    css`
      position: relative;
      margin-top: ${gutters.small}px;
      border: ${multipleSelected ? `1px solid ${separatorColor}` : "none"};
      border-radius: ${borderRadius};
      padding: ${gutters.small}px;
    `
);

const Title = styled.div([
  typographyBody2,
  css`
    position: absolute;
    top: -${gutters.large / 2}px;
    left: ${gutters.large / 2}px;
    background-color: white;
    color: ${greyColor};
  `,
]);

const MultipleOption = ({
  selectedValue,
  onChange,
  option,
  name,
  description,
  shouldFormatPrice,
  selectedExtraQuestionAnswers,
  onSetSelectedExtraQuestionAnswers,
}: {
  selectedValue: number;
  onChange: (value: number) => void;
  option: OptionsTypes.Option;
  name: string;
  description: string;
  shouldFormatPrice?: boolean;
  selectedExtraQuestionAnswers?: CarBookingWidgetTypes.SelectedExtraQuestionAnswer[];
  onSetSelectedExtraQuestionAnswers?: CarBookingWidgetTypes.OnSetSelectedExtraQuestionAnswers;
}) => {
  const { t } = useTranslation(Namespaces.commonCarNs);
  const extraInfo = option.pricePerDay ? t("Per day") : undefined;
  const questionsRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (selectedValue > 0 && questionsRef && option.questions.length > 0) {
      scrollRefIntoView(questionsRef, "end");
      const firstQuestion = document.getElementById(`${option.id}${selectedValue}question0`);
      if (firstQuestion) {
        firstQuestion.focus();
      }
    }
  }, [option.id, option.questions.length, selectedValue, questionsRef]);
  return (
    <>
      <Wrapper>
        {selectedValue > 0 && (
          <BookingWidgetHiddenInput name={name} value={selectedValue.toString()} />
        )}
        <InputHeader
          price={option.price}
          title={option.name}
          description={description}
          extraPriceInfo={option.payOnLocation ? t("Paid on location") : extraInfo}
          extraPriceInfoDescription={
            option.payOnLocation
              ? t("Book now and pay during pick-up at the car rental office")
              : undefined
          }
          shouldFormatPrice={shouldFormatPrice}
        />
        <IncrementPickerInput
          id={option.id}
          canIncrement={option.max === 0 || selectedValue < option.max}
          canDecrement={selectedValue > 0}
          count={selectedValue}
          onChange={onChange}
        />
      </Wrapper>
      {selectedValue > 0 &&
        option.questions.length > 0 &&
        range(1, selectedValue).map(index => (
          <QuestionWrapper
            key={`${option.id}${String(index)}questions`}
            ref={questionsRef}
            multipleSelected={selectedValue > 1}
          >
            {selectedValue > 1 && <Title>{`${option.name} ${index}`}</Title>}
            {option.questions.map((question, i) => (
              <Question
                key={`${option.id}${String(index)}question${String(i)}`}
                id={`${option.id}${String(index)}question${String(i)}`}
                index={index}
                selectedExtraId={option.id}
                question={question}
                selectedAnswers={selectedExtraQuestionAnswers}
                setQuestionAnswers={onSetSelectedExtraQuestionAnswers}
              />
            )) ?? null}
          </QuestionWrapper>
        ))}
    </>
  );
};

export default MultipleOption;
