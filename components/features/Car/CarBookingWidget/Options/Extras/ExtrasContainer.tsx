import React from "react";

import OptionsSectionHeader from "../OptionsSectionHeader";
import { sortOptions } from "../utils/optionsUtils";

import IncludedExtrasWrapper from "./IncludedExtrasWrapper";
import MultipleExtrasWrapper from "./MultipleExtrasWrapper";
import CheckboxExtrasWrapper from "./CheckboxExtrasWrapper";

import MobileSectionHeading from "components/ui/BookingWidget/MobileSectionHeading";
import MediaQuery from "components/ui/MediaQuery";
import { DisplayType } from "types/enums";

const ExtrasContainer = ({
  title,
  selectedExtras,
  onSetSelectedExtra,
  options,
  onSetSelectedExtraQuestionAnswers,
  shouldFormatPrice,
}: {
  title?: string;
  selectedExtras: CarBookingWidgetTypes.SelectedExtra[];
  onSetSelectedExtra: CarBookingWidgetTypes.OnSetSelectedExtra;
  options: OptionsTypes.Option[];
  onSetSelectedExtraQuestionAnswers: CarBookingWidgetTypes.OnSetSelectedExtraQuestionAnswers;
  shouldFormatPrice: boolean;
}) => {
  const [includedOptions, checkboxOptions, multipleOptions] = sortOptions(options);

  if (options.length === 0) return null;

  return (
    <div>
      {title && title.length && (
        <>
          <MediaQuery fromDisplay={DisplayType.Large}>
            <OptionsSectionHeader title={title} />
          </MediaQuery>
          <MediaQuery toDisplay={DisplayType.Large}>
            <MobileSectionHeading>{title}</MobileSectionHeading>
          </MediaQuery>
        </>
      )}
      <IncludedExtrasWrapper includedOptions={includedOptions} />
      <CheckboxExtrasWrapper
        onSetSelectedExtra={onSetSelectedExtra}
        selectedExtras={selectedExtras}
        checkboxExtras={checkboxOptions}
        shouldFormatPrice={shouldFormatPrice}
        onSetSelectedExtraQuestionAnswers={onSetSelectedExtraQuestionAnswers}
      />
      <MultipleExtrasWrapper
        onSetSelectedExtra={onSetSelectedExtra}
        selectedExtras={selectedExtras}
        multipleExtras={multipleOptions}
        shouldFormatPrice={shouldFormatPrice}
        onSetSelectedExtraQuestionAnswers={onSetSelectedExtraQuestionAnswers}
      />
    </div>
  );
};

export default ExtrasContainer;
