import React from "react";

import {
  getSelectedExtraValue,
  getSelectedExtraQuestionAnswers,
  setSelectedExtraAnswers,
} from "../utils/optionsUtils";
import MultipleOption from "../MultipleOption";

import BookingWidgetOptionContainer from "components/ui/BookingWidget/BookingWidgetOptionContainer";

const ExtraWrapper = ({
  onSetSelectedExtra,
  selectedExtras,
  multipleExtras,
  shouldFormatPrice,
  onSetSelectedExtraQuestionAnswers,
}: {
  onSetSelectedExtra: CarBookingWidgetTypes.OnSetSelectedExtra;
  selectedExtras: CarBookingWidgetTypes.SelectedExtra[];
  multipleExtras: OptionsTypes.Option[];
  shouldFormatPrice?: boolean;
  onSetSelectedExtraQuestionAnswers: CarBookingWidgetTypes.OnSetSelectedExtraQuestionAnswers;
}) => {
  return (
    <>
      {multipleExtras.map(extra => {
        const selectedValue = getSelectedExtraValue(selectedExtras, extra.id);
        const selectedQuestionAnswers = getSelectedExtraQuestionAnswers(selectedExtras, extra.id);
        return (
          <BookingWidgetOptionContainer key={extra.id}>
            <MultipleOption
              selectedValue={selectedValue}
              option={extra}
              onChange={(value: number) => {
                return onSetSelectedExtra({
                  id: extra.id,
                  count: value,
                  questionAnswers:
                    value > 0
                      ? setSelectedExtraAnswers(value, extra.questions, selectedQuestionAnswers)
                      : [],
                });
              }}
              name={`extras[${extra.id}]`}
              description={extra.description}
              shouldFormatPrice={shouldFormatPrice}
              selectedExtraQuestionAnswers={getSelectedExtraQuestionAnswers(
                selectedExtras,
                extra.id
              )}
              onSetSelectedExtraQuestionAnswers={onSetSelectedExtraQuestionAnswers}
            />
          </BookingWidgetOptionContainer>
        );
      })}
    </>
  );
};

export default ExtraWrapper;
