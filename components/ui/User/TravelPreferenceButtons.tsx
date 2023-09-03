import React from "react";
import styled from "@emotion/styled";

import FilterButton from "../Filters/FilterButton";

import { userPreferences } from "components/features/User/types/userTypes";
import { useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";

const TravelStyleContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const TravelPreferenceButtons = ({
  sectionId,
  travelPreferences,
  onClick,
}: {
  sectionId: string;
  travelPreferences: userPreferences[];
  onClick: (id: string) => void;
}) => {
  const { t } = useTranslation(Namespaces.userProfileNs);
  return (
    <TravelStyleContainer id={sectionId}>
      {travelPreferences.map(filter => (
        <FilterButton
          key={filter.id}
          onClick={onClick}
          id={filter.id}
          defaultChecked={filter.checked}
          disabled={filter.disabled}
        >
          {t(filter.name)}
        </FilterButton>
      ))}
    </TravelStyleContainer>
  );
};

export default TravelPreferenceButtons;
