import React, { useContext } from "react";
import { useMediaQuery } from "react-responsive";

import bookingWidgetStateContext from "../contexts/BookingWidgetStateContext";

import ExperienceRow from "./ExperienceRow";
import ExperiencesHeader from "./ExperiencesHeader";
import ExperienceDropdown from "./ExperienceDropdown";
import {
  checkIfShouldShowExperiencePriceSkeleton,
  getExperiencePriceInformation,
} from "./experiencesUtils";

import BookingWidgetExperiencesHiddenInput from "components/ui/BookingWidget/BookingWidgetHiddenInput";
import { useTranslation } from "i18n";
import { breakpointsMax } from "styles/variables";

const Experience = ({
  experience,
  convertCurrency,
  selectedExperience,
  onSetSelectedExperience,
  currency,
  numberOfTravelers,
}: {
  experience: ExperiencesTypes.MultiSelectionExperience;
  currency: string;
  numberOfTravelers: SharedTypes.NumberOfTravelers;
  convertCurrency: (value: number) => number;
  selectedExperience: TourBookingWidgetTypes.SelectedGroupExperience;
  onSetSelectedExperience: (answerId: string) => void;
}) => {
  const { t } = useTranslation();
  const isMobile = useMediaQuery({ maxWidth: breakpointsMax.large });
  const {
    isLivePricing,
    isGTIVpLivePriceLoading,
    isGTIVpDefaultOptionsLoading,
    isSelectedNonDefaultOption,
  } = useContext(bookingWidgetStateContext);

  return (
    <>
      {selectedExperience && (
        <BookingWidgetExperiencesHiddenInput
          name={`tour_options[${experience.id}]`}
          value={selectedExperience.answerId.toString()}
        />
      )}
      {!isMobile ? (
        <ExperienceDropdown
          onSetSelectedExperience={onSetSelectedExperience}
          experience={experience}
          selectedExperience={selectedExperience}
          currency={currency}
          convertCurrency={convertCurrency}
          numberOfTravelers={numberOfTravelers}
          isLivePricing={isLivePricing}
          isGTIVpDefaultOptionsLoading={isGTIVpDefaultOptionsLoading}
          isGTIVpLivePriceLoading={isGTIVpLivePriceLoading}
          isSelectedNonDefaultOption={isSelectedNonDefaultOption}
        />
      ) : (
        <>
          <ExperiencesHeader
            title={experience.name}
            perPerson={experience.calculatePricePerPerson}
          />
          {experience.answers.map(({ id, name, prices, vpPrice, included }) => {
            const isOptionSelected = selectedExperience && id === selectedExperience.answerId;
            const isIncluded = isLivePricing ? isOptionSelected : included;
            const priceInformation = getExperiencePriceInformation({
              prices,
              vpSelectedOptionDiff: vpPrice.selectedOptionDiff,
              isIncluded,
              isLivePricing,
              numberOfTravelers,
              currency,
              convertCurrency,
              tFunction: t,
            });
            const shouldShowPriceSkeleton = checkIfShouldShowExperiencePriceSkeleton({
              isIncluded,
              isGTIVpLivePriceLoading,
              isGTIVpDefaultOptionsLoading,
              isSelectedNonDefaultOption,
            });

            return (
              <ExperienceRow
                value={id}
                checked={isOptionSelected}
                name={name}
                groupName={experience.name}
                priceInformation={priceInformation}
                onChange={() => onSetSelectedExperience(id)}
                shouldShowPriceSkeleton={shouldShowPriceSkeleton}
                key={id}
              />
            );
          })}
        </>
      )}
    </>
  );
};

export default Experience;
