import React from "react";

import CheckboxOption from "../CheckboxOption";

import BookingWidgetOptionContainer from "components/ui/BookingWidget/BookingWidgetOptionContainer";

const IncludedInsurancesWrapper = ({
  includedOptions,
}: {
  includedOptions: OptionsTypes.Option[];
}) => {
  return (
    <>
      {includedOptions.map(insurance => (
        <BookingWidgetOptionContainer key={insurance.id}>
          <input type="hidden" name="insurances[]" value={insurance.code} />
          <CheckboxOption
            selectedValue
            option={insurance}
            name="insurance-included[]"
            description={insurance.description}
            disabled
          />
        </BookingWidgetOptionContainer>
      ))}
    </>
  );
};

export default IncludedInsurancesWrapper;
