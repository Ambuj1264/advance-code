import React from "react";

import OptionsSectionHeader from "../OptionsSectionHeader";
import { sortOptions } from "../utils/optionsUtils";

import IncludedInsurancesWrapper from "./IncludedInsurancesWrapper";
import CheckboxInsurancesWrapper from "./CheckboxInsurancesWrapper";

import MobileSectionHeading from "components/ui/BookingWidget/MobileSectionHeading";
import MediaQuery from "components/ui/MediaQuery";
import { DisplayType } from "types/enums";

const InsurancesContainer = ({
  title,
  selectedInsurances,
  onSetSelectedInsurance,
  options,
  shouldFormatPrice,
}: {
  title?: string;
  selectedInsurances: CarBookingWidgetTypes.SelectedInsurance[];
  onSetSelectedInsurance: CarBookingWidgetTypes.OnSetSelectedInsurance;
  options: OptionsTypes.Option[];
  shouldFormatPrice: boolean;
}) => {
  const [includedOptions, checkboxOptions] = sortOptions(options);
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
      <IncludedInsurancesWrapper includedOptions={includedOptions} />
      <CheckboxInsurancesWrapper
        onSetSelectedInsurance={onSetSelectedInsurance}
        selectedInsurances={selectedInsurances}
        checkboxInsurances={checkboxOptions}
        shouldFormatPrice={shouldFormatPrice}
      />
    </div>
  );
};

export default InsurancesContainer;
