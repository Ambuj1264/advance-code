import React, { Fragment } from "react";

import ToggleExperience from "./ToggleExperience";
import { getExperienceItemOption, getSelectedExperience } from "./experiencesUtils";

type Props = {
  onSetSelectedExperience: TourBookingWidgetTypes.OnSetSelectedExperience;
  experiences: ExperiencesTypes.ToggleExperience[];
  selectedExperiences: TourBookingWidgetTypes.SelectedExperiences;
  totalNumberOfTravelers: number;
  editItem?: TourBookingWidgetTypes.EditItem;
};

const ToggleExperiences = ({
  onSetSelectedExperience,
  experiences,
  editItem,
  selectedExperiences,
  totalNumberOfTravelers,
}: Props) => {
  return (
    <>
      {experiences.map(experience => {
        const selectedExperience = getSelectedExperience(selectedExperiences, experience.id) as
          | TourBookingWidgetTypes.SelectedTravelerExperience
          | undefined;

        return (
          <Fragment key={experience.id}>
            <ToggleExperience
              isDefaultToggled={Boolean(selectedExperience?.count)}
              experience={experience}
              onSetSelectedExperience={onSetSelectedExperience}
              editItemOption={getExperienceItemOption(experience.id, editItem)}
              totalNumberOfTravelers={totalNumberOfTravelers}
            />
          </Fragment>
        );
      })}
    </>
  );
};

export default ToggleExperiences;
