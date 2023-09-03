import React, { Fragment } from "react";

import { getTotalNumberOfTravelers } from "../Travelers/utils/travelersUtils";

import InformationExperience from "./InformationExperience";

type Props = {
  experiences: ExperiencesTypes.InformationExperience[];
  numberOfTravelers: SharedTypes.NumberOfTravelers;
};

const InformationExperiences = ({ experiences, numberOfTravelers }: Props) => {
  return (
    <>
      {experiences.map(experience => {
        return (
          <Fragment key={experience.id}>
            <InformationExperience
              experience={experience}
              numberOfTravelers={getTotalNumberOfTravelers(numberOfTravelers)}
            />
          </Fragment>
        );
      })}
    </>
  );
};

export default InformationExperiences;
