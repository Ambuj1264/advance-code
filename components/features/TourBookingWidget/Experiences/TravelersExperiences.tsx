import React, { Fragment } from "react";

import { getTotalNumberOfTravelers } from "../Travelers/utils/travelersUtils";

import { getSelectedExperience, preSelectedTravelExperienceValue } from "./experiencesUtils";
import TravelerExperience from "./TravelerExperience";

type Props = {
  selectedExperiences: TourBookingWidgetTypes.SelectedExperiences;
  onSetSelectedExperience: TourBookingWidgetTypes.OnSetSelectedExperience;
  numberOfTravelers: SharedTypes.NumberOfTravelers;
  experiences: ExperiencesTypes.TravelerExperience[];
};

const TravelersExperiences = ({
  onSetSelectedExperience,
  numberOfTravelers,
  experiences,
  selectedExperiences,
}: Props) => {
  return (
    <>
      {experiences.map(experience => {
        const selectedExperience = getSelectedExperience(selectedExperiences, experience.id) as
          | TourBookingWidgetTypes.SelectedTravelerExperience
          | undefined;
        const totalNumberOfTravelers =
          experience.hasExternalLimit && experience.externalMaxLimit
            ? experience.externalMaxLimit
            : getTotalNumberOfTravelers(numberOfTravelers);
        const preSelectedValue = preSelectedTravelExperienceValue(
          selectedExperience as unknown as ExperiencesTypes.SelectedExperience
        );
        return (
          <Fragment key={experience.id}>
            <TravelerExperience
              selectedValue={
                experience.required
                  ? totalNumberOfTravelers
                  : selectedExperience?.count ?? preSelectedValue
              }
              experience={experience as ExperiencesTypes.TravelerExperience}
              max={totalNumberOfTravelers}
              min={experience.required ? totalNumberOfTravelers : 0}
              onSetSelectedExperience={onSetSelectedExperience}
            />
          </Fragment>
        );
      })}
    </>
  );
};

export default TravelersExperiences;
