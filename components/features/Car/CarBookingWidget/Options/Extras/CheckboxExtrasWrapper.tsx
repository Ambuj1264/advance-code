import React from "react";

import { getSelectedExtraValue, getSelectedExtraQuestionAnswers } from "../utils/optionsUtils";
import CheckboxOption from "../CheckboxOption";

import BookingWidgetOptionContainer from "components/ui/BookingWidget/BookingWidgetOptionContainer";

const CheckboxExtrasWrapper = ({
  onSetSelectedExtra,
  selectedExtras,
  checkboxExtras,
  shouldFormatPrice,
  onSetSelectedExtraQuestionAnswers,
}: {
  onSetSelectedExtra: CarBookingWidgetTypes.OnSetSelectedExtra;
  selectedExtras: CarBookingWidgetTypes.SelectedExtra[];
  checkboxExtras: OptionsTypes.Option[];
  shouldFormatPrice?: boolean;
  onSetSelectedExtraQuestionAnswers: CarBookingWidgetTypes.OnSetSelectedExtraQuestionAnswers;
}) => {
  return (
    <>
      {checkboxExtras.map(extra => (
        <BookingWidgetOptionContainer key={extra.id}>
          <CheckboxOption
            selectedValue={Boolean(getSelectedExtraValue(selectedExtras, extra.id))}
            option={extra}
            onChange={(value: boolean) =>
              onSetSelectedExtra({
                id: extra.id,
                count: Number(value),
                questionAnswers: value
                  ? extra.questions.map(question => ({
                      key: question.key,
                      answer: question.questionType === "NUMBER" ? "45" : "",
                      identifier: "1",
                    }))
                  : [],
              })
            }
            name={`extras[${extra.id}]`}
            description={extra.description}
            value={1}
            disabled={false}
            shouldFormatPrice={shouldFormatPrice}
            selectedExtraQuestionAnswers={getSelectedExtraQuestionAnswers(selectedExtras, extra.id)}
            onSetSelectedExtraQuestionAnswers={onSetSelectedExtraQuestionAnswers}
          />
        </BookingWidgetOptionContainer>
      ))}
    </>
  );
};

export default CheckboxExtrasWrapper;
