import React from "react";

import MultiSelectionExperience from "./MultiSelectionExperience";
import { getGroupExperiencePrices, getSelectedExperience } from "./experiencesUtils";

import { useCurrencyWithDefault } from "hooks/useCurrency";

const MultiSelectionExperiences = ({
  selectedExperiences,
  onSetSelectedExperience,
  numberOfTravelers,
  experiences,
}: {
  selectedExperiences: TourBookingWidgetTypes.SelectedExperiences;
  onSetSelectedExperience: TourBookingWidgetTypes.OnSetSelectedExperience;
  numberOfTravelers: SharedTypes.NumberOfTravelers;
  experiences: ExperiencesTypes.MultiSelectionExperience[];
}) => {
  const { currencyCode, convertCurrency } = useCurrencyWithDefault();
  return (
    <>
      {experiences.map((experience: ExperiencesTypes.MultiSelectionExperience) => {
        const selectedExperience = getSelectedExperience(selectedExperiences, experience.id);
        return (
          <MultiSelectionExperience
            experience={experience}
            currency={currencyCode}
            selectedExperience={
              selectedExperience as TourBookingWidgetTypes.SelectedGroupExperience
            }
            onSetSelectedExperience={(answerId: string) =>
              onSetSelectedExperience({
                experienceId: experience.id,
                answerId,
                prices: getGroupExperiencePrices(experiences, experience.id, answerId),
                vpPrice: experience.answers.find(answer => answer.id === answerId)?.vpPrice || {
                  selectedOptionDiff: 0,
                },
                calculatePricePerPerson: experience.calculatePricePerPerson,
              })
            }
            key={experience.id}
            convertCurrency={convertCurrency}
            numberOfTravelers={numberOfTravelers}
          />
        );
      })}
    </>
  );
};

export default MultiSelectionExperiences;
