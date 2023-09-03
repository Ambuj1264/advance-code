import React from "react";
import styled from "@emotion/styled";

import { getTotalNumberOfTravelers } from "../Travelers/utils/travelersUtils";

import ExperiencesSectionHeader from "./ExperiencesSectionHeader";
import ExperiencesHeader from "./ExperiencesHeader";
import ExperiencesLoading from "./ExperiencesLoading";
import MultiSelectionExperiences from "./MultiSelectionExperiences";
import { shouldShowExtrasHeader } from "./experiencesUtils";
import TravelersExperiences from "./TravelersExperiences";
import ToggleExperiences from "./ToggleExperiences";
import InformationExperiences from "./InformationExperiences";

import { gutters } from "styles/variables";
import { mqMax } from "styles/base";
import MediaQuery from "components/ui/MediaQuery";
import { DisplayType } from "types/enums";
import { useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";

const Wrapper = styled.div`
  ${mqMax.large} {
    margin-bottom: ${gutters.small * 5}px;
  }
`;

const ExperiencesContainer = ({
  selectedExperiences,
  experiences,
  onSetSelectedExperience,
  numberOfTravelers,
  editItem,
  isLoadingOptions,
}: {
  selectedExperiences: TourBookingWidgetTypes.SelectedExperiences;
  experiences: ExperiencesTypes.Experience[][];
  onSetSelectedExperience: TourBookingWidgetTypes.OnSetSelectedExperience;
  numberOfTravelers: SharedTypes.NumberOfTravelers;
  editItem?: TourBookingWidgetTypes.EditItem;
  isLoadingOptions?: boolean;
}) => {
  const { t } = useTranslation(Namespaces.tourBookingWidgetNs);
  if (isLoadingOptions) return <ExperiencesLoading />;
  const [
    multiSelectionExperiences,
    travelersExperiences,
    toggleExperiences,
    informationExperiences,
  ] = experiences;
  const emptyExperiences =
    multiSelectionExperiences.length === 0 &&
    travelersExperiences.length === 0 &&
    toggleExperiences.length === 0 &&
    informationExperiences.length === 0;
  if (emptyExperiences && !isLoadingOptions) return null;
  const showExtrasHeader = shouldShowExtrasHeader({
    containsMultiSelectionExperience: multiSelectionExperiences.length > 0,
    containsTravelersExperience: travelersExperiences.length > 0,
    containsToggleExperiences: toggleExperiences.length > 0,
  });
  return (
    <Wrapper>
      <MediaQuery fromDisplay={DisplayType.Large}>
        <ExperiencesSectionHeader />
      </MediaQuery>
      <MediaQuery toDisplay={DisplayType.Large}>
        {multiSelectionExperiences.length === 0 && (
          <ExperiencesHeader title={t("Personalize your experience")} perPerson={false} />
        )}
      </MediaQuery>
      <MultiSelectionExperiences
        selectedExperiences={selectedExperiences}
        onSetSelectedExperience={onSetSelectedExperience}
        numberOfTravelers={numberOfTravelers}
        experiences={multiSelectionExperiences as ExperiencesTypes.MultiSelectionExperience[]}
      />
      {showExtrasHeader && (
        <MediaQuery toDisplay={DisplayType.Large}>
          <ExperiencesHeader title={t("Extras")} perPerson={false} />
        </MediaQuery>
      )}
      <TravelersExperiences
        selectedExperiences={selectedExperiences}
        onSetSelectedExperience={onSetSelectedExperience}
        numberOfTravelers={numberOfTravelers}
        experiences={travelersExperiences as ExperiencesTypes.TravelerExperience[]}
      />
      <ToggleExperiences
        selectedExperiences={selectedExperiences}
        onSetSelectedExperience={onSetSelectedExperience}
        experiences={toggleExperiences as ExperiencesTypes.ToggleExperience[]}
        editItem={editItem}
        totalNumberOfTravelers={getTotalNumberOfTravelers(numberOfTravelers)}
      />
      <InformationExperiences
        experiences={informationExperiences as ExperiencesTypes.InformationExperience[]}
        numberOfTravelers={numberOfTravelers}
      />
    </Wrapper>
  );
};

export default ExperiencesContainer;
