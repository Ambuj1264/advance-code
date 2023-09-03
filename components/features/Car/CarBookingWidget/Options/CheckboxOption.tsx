import React, { useState, useEffect, useRef } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import CarInsuranceModal from "../../CarInsurance/CarInsuranceModal";

import Question from "./Question";

import { getExtraPriceInfo } from "components/features/Car/CarBookingWidget/Options/utils/optionsUtils";
import { scrollRefIntoView } from "utils/globalUtils";
import InputHeader from "components/ui/Inputs/InputHeader";
import BookingWidgetHiddenInput from "components/ui/BookingWidget/BookingWidgetHiddenInput";
import Checkbox from "components/ui/Inputs/Checkbox";
import { Namespaces } from "shared/namespaces";
import { useTranslation } from "i18n";
import { gutters } from "styles/variables";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const CheckboxWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: flex-end;
`;

const ViewDetails = styled.div(
  ({ theme }) => css`
    margin-left: ${gutters.large / 4}px;
    cursor: pointer;
    color: ${theme.colors.primary};
    text-decoration: underline;
  `
);

const QuestionsWrapper = styled.div`
  margin: ${gutters.small}px 0;
`;

const CheckboxOption = ({
  selectedValue,
  option,
  onChange,
  name,
  description,
  value,
  disabled = false,
  shouldFormatPrice,
  selectedExtraQuestionAnswers,
  onSetSelectedExtraQuestionAnswers,
}: {
  selectedValue: boolean;
  option: OptionsTypes.Option;
  onChange?: (
    value: boolean,
    questionAnswers?: CarBookingWidgetTypes.SelectedExtraQuestionAnswer[]
  ) => void;
  name: string;
  description: string;
  value?: string | number;
  disabled?: boolean;
  shouldFormatPrice?: boolean;
  selectedExtraQuestionAnswers?: CarBookingWidgetTypes.SelectedExtraQuestionAnswer[];
  onSetSelectedExtraQuestionAnswers?: CarBookingWidgetTypes.OnSetSelectedExtraQuestionAnswers;
}) => {
  const { t } = useTranslation(Namespaces.commonCarNs);
  const { payOnLocation, pricePerDay } = option;
  const extraPriceInfo = getExtraPriceInfo({ payOnLocation, pricePerDay, t });
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const questionsRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (selectedValue && questionsRef && option.questions.length > 0) {
      scrollRefIntoView(questionsRef, "end");
      const firstQuestion = document.getElementById(`${option.id}question0`);
      if (firstQuestion) {
        firstQuestion.focus();
      }
    }
  }, [option.id, option.questions.length, selectedValue, questionsRef]);
  return (
    <>
      {isModalOpen && option.insuranceInfo && (
        <CarInsuranceModal insuranceInfo={option.insuranceInfo} setIsModalOpen={setIsModalOpen} />
      )}
      <Wrapper>
        {value && selectedValue && (
          <BookingWidgetHiddenInput name={name} value={value.toString()} />
        )}
        <InputHeader
          price={option.price}
          title={option.name}
          description={description}
          extraPriceInfo={extraPriceInfo}
          extraPriceInfoDescription={
            option.payOnLocation
              ? t("Book now and pay during pick-up at the car rental office")
              : undefined
          }
          extraInfo={
            option.insuranceInfo && (
              <ViewDetails onClick={() => setIsModalOpen(true)}>{t("View details")}</ViewDetails>
            )
          }
          shouldFormatPrice={shouldFormatPrice}
        />
        <CheckboxWrapper>
          <Checkbox
            id={`${option.id}`}
            checked={selectedValue}
            onChange={onChange}
            name={option.name}
            value={value}
            disabled={disabled}
          />
        </CheckboxWrapper>
      </Wrapper>
      {selectedValue && option.questions && (
        <QuestionsWrapper ref={questionsRef}>
          {option.questions.map((question, index) => (
            <Question
              key={`${option.id}question${String(index)}`}
              index={1}
              id={`${option.id}question${String(index)}`}
              question={question}
              selectedExtraId={option.id}
              selectedAnswers={selectedExtraQuestionAnswers}
              setQuestionAnswers={onSetSelectedExtraQuestionAnswers}
            />
          ))}
        </QuestionsWrapper>
      )}
    </>
  );
};

export default CheckboxOption;
