import React from "react";

import CheckboxOption from "../CheckboxOption";

import BookingWidgetOptionContainer from "components/ui/BookingWidget/BookingWidgetOptionContainer";
import BookingWidgetHiddenInput from "components/ui/BookingWidget/BookingWidgetHiddenInput";

const IncludedExtrasWrapper = ({ includedOptions }: { includedOptions: OptionsTypes.Option[] }) => {
  return (
    <>
      {includedOptions.map(extra => (
        <BookingWidgetOptionContainer key={extra.id}>
          <BookingWidgetHiddenInput name={`extras[${extra.id}]`} value="1" />
          <CheckboxOption
            selectedValue
            option={extra}
            name="extras-included[]"
            description={extra.description}
            disabled
          />
        </BookingWidgetOptionContainer>
      ))}
    </>
  );
};

export default IncludedExtrasWrapper;
