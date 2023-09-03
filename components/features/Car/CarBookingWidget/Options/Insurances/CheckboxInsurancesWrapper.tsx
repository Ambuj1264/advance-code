import React from "react";

import { getSelectedCheckboxInsuranceValue } from "../utils/optionsUtils";
import CheckboxOption from "../CheckboxOption";

import BookingWidgetOptionContainer from "components/ui/BookingWidget/BookingWidgetOptionContainer";

const CheckboxInsurancesWrapper = ({
  onSetSelectedInsurance,
  selectedInsurances,
  checkboxInsurances,
  shouldFormatPrice,
}: {
  onSetSelectedInsurance: CarBookingWidgetTypes.OnSetSelectedInsurance;
  selectedInsurances: CarBookingWidgetTypes.SelectedInsurance[];
  checkboxInsurances: OptionsTypes.Option[];
  shouldFormatPrice?: boolean;
}) => {
  return (
    <>
      {checkboxInsurances.map(insurance => (
        <BookingWidgetOptionContainer key={insurance.id}>
          <CheckboxOption
            selectedValue={getSelectedCheckboxInsuranceValue(selectedInsurances, insurance.id)}
            option={insurance}
            onChange={(value: boolean) =>
              onSetSelectedInsurance({
                id: insurance.id,
                selected: value,
              })
            }
            name="insurances[]"
            description={insurance.description}
            value={insurance.code}
            disabled={false}
            shouldFormatPrice={shouldFormatPrice}
          />
        </BookingWidgetOptionContainer>
      ))}
    </>
  );
};

export default CheckboxInsurancesWrapper;
